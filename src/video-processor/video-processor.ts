import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

import { BadRequestError, VideoProcessorError } from '../errors';
import { IVideoItem } from '../models/VideoItem';
import { IScreenshot } from '../models/Screenshot';

// type TMetadata = { data: IVideoItem[], totalLength: number };

const fsp = fs.promises;

// TODO: make all methods with error handling
export class VideoProcessor {
  public NAME_SECTIONS_SEPARATOR = '_-_';
  public CHUNK_SIZE = 10 ** 6; // 1MB
  public videoItemNames = [];
  public videoListPath = `${process.cwd()}/src/assets/items`;
  public screensaversPath = `${process.cwd()}/src/assets/screensavers`;
  public screenshotsPath = `${process.cwd()}/src/assets/screenshots`;
  public metadataPath = `${process.cwd()}/src/assets/metadata.json`;

  constructor() {
    this.initialize();
  }

  initialize() {
    if (ffmpegStatic) {
      // Tell fluent-ffmpeg where it can find FFmpeg
      ffmpeg.setFfmpegPath(ffmpegStatic);
      ffmpeg.setFfprobePath(ffprobeStatic.path);
    } else {
      console.error('>>> ffmpegStatic is not a string');
      throw new VideoProcessorError('ffmpegStatic is not a string');
    }
  }

  async extractScreenshotFromVideoItem(videoItemData: IVideoItem, timemark: number): Promise<{ success: boolean; created: boolean, data: null | IScreenshot }> {
    const newTimemark = timemark >= videoItemData.duration! - 0.05 ? timemark - 0.05 : timemark;
    console.log('>>> extractScreenshotFromVideoItem > timemark:', timemark);
    console.log('>>> extractScreenshotFromVideoItem > new timemark:', newTimemark);
    const videoItemPath = `${this.videoListPath}/${videoItemData.name}${videoItemData.dotExtension}`;

    const firstName = 'screenshot';
    const secondName = videoItemData.name;
    const thirdName = newTimemark.toString().replace('.', '-');
    const newScreenshotName = `${firstName}${this.NAME_SECTIONS_SEPARATOR}${secondName}${this.NAME_SECTIONS_SEPARATOR}${thirdName}`;

    const foundScreenshot = (await this.getScreenshotNames()).find((screenshotName) => screenshotName === `${newScreenshotName}.png`);

    console.log('>>> extractScreenshotFromVideoItem > found screenshot:', foundScreenshot);

    if (foundScreenshot) {
      return { success: true, created: false, data: {
        videoItem: videoItemData.id!,
        name: newScreenshotName,
        dotExtension: '.png',
      }};
    }

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoItemPath)
        .screenshots({
          timemarks: [`${newTimemark}`],
          filename: `${newScreenshotName}.png`,
          folder: this.screenshotsPath,
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            console.log(`>>> Processing: ${Math.floor(progress.percent)}% done`);
          }
        })
        .on('end', () => {
          const data: IScreenshot = {
            videoItem: videoItemData.id!,
            dotExtension: '.png',
            name: newScreenshotName,
          };
          console.log('>>> screenshot was created:', data);
          resolve({ success: true, created: true, data });
        })
        .on('error', (error) => {
          console.error('>>> extractScreenshotFromVideoItem error:');
          console.error(error);
          reject({ success: false, created: false, data: null });
        });
    });
  }

  extractVideoItemNameFromScreenshotName(screenshotName: string): string {
    return screenshotName.split(this.NAME_SECTIONS_SEPARATOR)[1];
  }

  changeResolution(filePath: string, newResolution: number) {
    const parsedFilePath = path.parse(filePath);

    const saveToFilePath = parsedFilePath.dir + `${parsedFilePath.name}_${newResolution}px.${parsedFilePath.ext}`
    console.log('>>> saveToFilePath:', saveToFilePath);

    // Run FFmpeg
    ffmpeg()
      // Input file
      .input(filePath)
      // Scale the video to 720 pixels in height. The -2 means FFmpeg should figure out the
      // exact size of the other dimension. In other words, to make the video 720 pixels wide
      // and make FFmpeg calculate its height, use scale=720:-2 instead.
      .outputOptions('-vf', `scale=${newResolution}:-2`)
      // Output file
      .saveToFile(saveToFilePath)
      // Log the percentage of work completed
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${Math.floor(progress.percent)}% done`);
        }
      })
      // The callback that is run when FFmpeg is finished
      .on('end', () => {
        console.log('FFmpeg has finished.');
      })
      // The callback that is run when FFmpeg encountered an error
      .on('error', (error) => {
        console.error(error);
      });
  }

  async getVideoItemNames(): Promise<string[]> {
    return await fsp.readdir(this.videoListPath);
  }

  async getScreenshotNames(): Promise<string[]> {
    return await fsp.readdir(this.screenshotsPath);
  }

  async getScreensaverNames(): Promise<string[]> {
    return await fsp.readdir(this.screensaversPath);
  }

  async createVideoItemStream(videoItemData: IVideoItem, chunkStart: number): Promise<fs.ReadStream> {
    const videoPath = path.join(this.videoListPath, `${videoItemData.name}${videoItemData.dotExtension!}`);

    const chunkEnd = this.calculateChunkEnd(videoItemData, chunkStart);

    // create video read stream for this particular CHUNK
    return fs.createReadStream(videoPath, { start: chunkStart, end: chunkEnd });
  }

  mapHeaders(videoItemData: IVideoItem, chunkStart: number) {
    const chunkEnd = this.calculateChunkEnd(videoItemData, chunkStart);
    const videoSize = videoItemData.size as number;

    return {
      "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkEnd - chunkStart + 1,
      "Content-Type": "video/mp4",
    };
  }

  calculateChunkEnd(videoItemData: IVideoItem, chunkStart: number): number {
    const videoSize = videoItemData.size as number;

    return Math.min(chunkStart + this.CHUNK_SIZE, videoSize - 1);
  }

  async getVideoItemProbeData(videoItemName: string): Promise<ffmpeg.FfprobeData> {
    const videoItemPath = `${this.videoListPath}/${videoItemName}`;

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoItemPath, (err: any, data: ffmpeg.FfprobeData) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  }

  async getScreenshotProbeData(screenshotName: string): Promise<ffmpeg.FfprobeData> {
    const screenshotPath = `${this.screenshotsPath}/${screenshotName}`;

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(screenshotPath, (err: any, data: ffmpeg.FfprobeData) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async createScreensaverForVideoItem(videoItemName: string): Promise<{ success: boolean }> {
    const videoItemPath = `${this.videoListPath}/${videoItemName}`;

    const videoItemNameWithoutExtension = path.parse(videoItemName).name;
    const screensaverName = this.getScreensaverName(videoItemNameWithoutExtension);
    const screensaverPath = `${this.screensaversPath}/${screensaverName}.png`;

    return new Promise((resolve, reject) => {
      ffmpeg(videoItemPath)
        .screenshots({
          count: 1,
          folder: path.parse(screensaverPath).dir,
          filename: path.basename(screensaverPath),
          timemarks: ['0'],
        })
        .on('end', () => {
          console.log('>>> screensaver created');
          resolve({ success: true });
        })
        .on('error', (error) => {
          console.error('>>> screensaver was not created');
          console.error('>>> error message:', error.message);
          const err = new BadRequestError(`Screensaver was not created. Check video item name: ${videoItemName}`);
          reject({ success: false, error: err });
        });
    });
  }

  async deleteScreenshot(screenshotName: string, dotExtension: string): Promise<{ success: boolean, data: Record<string, unknown>}> {
    const pathToScreenshot = `${this.screenshotsPath}/${screenshotName}${dotExtension}`;

    return new Promise((resolved, rejected) => {
      fs.unlink(pathToScreenshot, (err) => {
        if (err) rejected({ success: false, data: { error: err }});

        console.log(`File ${screenshotName}${dotExtension} was deleted`);
        resolved({ success: true, data: { message: `File ${screenshotName}${dotExtension} was deleted`} });
      });
    });
  }

  async hasScreensaverAsset(videoItemName: string): Promise<boolean> {
    const name = this.getScreensaverName(videoItemName);
    const screensaverNames = await this.getScreensaverNames();

    return !!screensaverNames.find((screensaverName) => path.parse(screensaverName).name === name);
  }

  private getScreensaverName(videoItemNameWithoutExtension: string) {
    return `screensaver${this.NAME_SECTIONS_SEPARATOR}${videoItemNameWithoutExtension}`;
  }

  async hasVideoItem(name: string): Promise<boolean> {
    const videoItemNames = await this.getVideoItemNames();
    return !!videoItemNames.find((videoItemName) => path.parse(videoItemName).name === name);
  }

  // private async renameVideoItem(oldPath: string): Promise<string> {
  //   const pathToVideoList = path.dirname(oldPath);
  //   const videoItemOldName = path.basename(oldPath);
  //   const videoItemNewName = `${uuidv4()}${this.NAME_SECTIONS_SEPARATOR}${videoItemOldName}`
  //   await fsp.rename(oldPath, `${pathToVideoList}/${videoItemNewName}`);
  //   return videoItemNewName;
  // }
}
