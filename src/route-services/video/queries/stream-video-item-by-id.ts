import { Request, Response } from 'express';

import { BadRequestError } from '../../../errors';
import { VideoProcessor } from '../../../video-processor';
import { DatabaseProcessor } from '../../../database-processor';

const videoProcessor = new VideoProcessor();
const databaseProcessor = new DatabaseProcessor();

const streamVideoItemById = async (req: Request, res: Response) => {
  try {
    const range = req.headers.range;

    if (!range) {
      throw new BadRequestError('Requires Range header');
    }

    const id = req.params.id;
    const chunkStart = Number(range.replace(/\D/g, ""));

    console.log('>>> streamVideoItemById > range:', range);
    console.log('>>> streamVideoItemById > id:', id);

    const videoItemData = await databaseProcessor.getVideoItemDataById(id);
    if (!videoItemData) {
      throw new BadRequestError(`Check input data: ${id}`);
    }

    const headers = videoProcessor.mapHeaders(videoItemData, chunkStart);
    console.log('>>> streamVideoItemById > headers:', headers);
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    const videoStream = await videoProcessor.createVideoItemStream(videoItemData, chunkStart);
    // Stream the video chunk to the client
    videoStream.pipe(res);
  } catch (error) {
    res.status(400).send(error);
  }
};

export { streamVideoItemById };
