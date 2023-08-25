import path from 'path';
import mongoose, { Types } from 'mongoose';
import Ffmpeg from 'fluent-ffmpeg';

import { VideoProcessor } from "../video-processor";
import { IVideoItem, VideoItem } from "../models/VideoItem";
import { IScreenshot, Screenshot } from '../models/Screenshot';
import { IScreensaver, Screensaver } from '../models/Screensaver';
import { BadRequestError } from '../errors';

const videoProcessor = new VideoProcessor();

export class DatabaseProcessor {
  constructor() {}

  async getVideoList(): Promise<IVideoItem[]> {
    return await VideoItem.find();
  }

  async getScreenshots(): Promise<IScreenshot[]> {
    return await Screenshot.find();
  }

  async getScreenshotsByFilter(filter: Partial<IScreenshot>): Promise<IScreenshot[]> {
    return await Screenshot.find(filter);
  }

  async getVideoItemDataById(id: string) {
    return await VideoItem.findOne({ _id: id });
  }

  async getVideoItemData(videoItemParams: Partial<IVideoItem>): Promise<IVideoItem> {
    const videoItem = await VideoItem.findOne(videoItemParams);

    if (!videoItem) throw new Error('DB Error. Check filter data: ${JSON.stringify(videoItemParams)}');

    return videoItem;
  }

  async getScreenshotData(screenshotParams: Partial<IScreenshot>) {
    return await Screenshot.findOne(screenshotParams);
  }

  async getScreensaverData(screenshotParams: Partial<IScreenshot>) {
    return await Screenshot.findOne(screenshotParams);
  }

  async saveVideoItemData(itemData: Omit<IVideoItem, 'id'>): Promise<{ id: mongoose.Types.ObjectId }> {
    const foundInDatabase = await VideoItem.findOne({ name: itemData.name, index: itemData.index });

    if (!foundInDatabase) {
      const newItem = new VideoItem(itemData);
      await newItem.save();
      return { id: newItem.id };
    }

    return { id: foundInDatabase.id };
  }

  async updateVideoItemData(itemData: Omit<IVideoItem, 'id'>): Promise<IVideoItem> {
    const updatedVideoItemData = await VideoItem.findOneAndUpdate({ name: itemData.name }, itemData, {
      new: true,
      upsert: true,
    });

    return updatedVideoItemData;
  }

  async updateScreenshotData(screenshotData: IScreenshot): Promise<IScreenshot> {
    const updatedScreenshotData = await Screenshot.findOneAndUpdate({ name: screenshotData.name }, screenshotData, {
      new: true,
      upsert: true,
    });

    return updatedScreenshotData;
  }

  async deleteScreenshotData({ id }: { id: Types.ObjectId }): Promise<mongoose.mongo.DeleteResult> {
    return await Screenshot.deleteOne({ _id: id });
  }

  async saveScreenshotData(screenshotData: IScreenshot, videoItemName: string): Promise<IScreenshot> {
    const videoItem = await VideoItem.findOne({ name: videoItemName });

    if (!videoItem) throw new BadRequestError(`Check video name: ${videoItemName}`);

    const foundScreenshot = await Screenshot.findOne({ name: screenshotData.name });

    if (!foundScreenshot) {
      const newItem = new Screenshot(screenshotData);
      return await newItem.save();
    }

    return foundScreenshot;
  }

  async saveScreensaverData(screensaverData: IScreensaver, videoItemName: string): Promise<IScreensaver> {
    const videoItem = await VideoItem.findOne({ name: videoItemName });
    if (!videoItem) throw new BadRequestError(`Check video name: ${videoItemName}`);

    const foundScreensaver = await Screensaver.findOne({ videoItem: videoItem.id }).populate('videoItem');

    if (!foundScreensaver) {
      const newItem = new Screensaver(screensaverData);
      return await newItem.save();
    }

    return foundScreensaver;
  }

  mapVideoItemData(videoItemProbeData: Ffmpeg.FfprobeData, index: number): Omit<IVideoItem, 'id'> {
    console.log('>>> mapVideoItemData > videoItemProbeData.format.duration', videoItemProbeData.format.duration);

    return {
      index: index + 1,
      name: path.parse(videoItemProbeData.format.filename as string).name,
      size: videoItemProbeData.format.size ? videoItemProbeData.format.size : 0,
      sizeUnit: 'B',
      duration: videoItemProbeData.format.duration,
      durationUnit: 's',
      dotExtension: path.extname(videoItemProbeData.format.filename as string),
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eum, facilis, ea nisi at nobis placeat aliquam adipisci molestias fugit ullam expedita animi quis iste voluptas dicta totam! Neque, veritatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eum, facilis, ea nisi at nobis placeat aliquam adipisci molestias fugit ullam expedita animi quis iste voluptas dicta totam! Neque, veritatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam eum, facilis, ea nisi at nobis placeat aliquam adipisci molestias fugit ullam expedita animi quis iste voluptas dicta totam! Neque, veritatis.',
      resolution: videoItemProbeData.streams[0].height,
      screensaver: 'basic_screensaver.png',
    };
  }

  mapScreenshotData(screenshotProbeData: Ffmpeg.FfprobeData, videoItemId: Types.ObjectId): Omit<IScreenshot, 'id'> {
    return {
      name: path.parse(screenshotProbeData.format.filename as string).name,
      dotExtension: path.extname(screenshotProbeData.format.filename as string),
      resolution: screenshotProbeData.streams[0].height,
      videoItem: videoItemId,
    };
  }

  mapScreensaverData(): Omit<IScreensaver, 'id' | 'videoItem'> {
    return {
      size: 100,
      sizeUnit: 'B',
      dotExtension: '.png',
      resolution: 100
    };
  }
}
