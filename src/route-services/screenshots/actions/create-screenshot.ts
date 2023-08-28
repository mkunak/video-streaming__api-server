import { Request, Response } from 'express';

import { DatabaseProcessor } from '../../../database-processor';
import { VideoProcessor } from '../../../video-processor';
import { BadRequestError } from '../../../errors';

const videoProcessor = new VideoProcessor();
const databaseProcessor = new DatabaseProcessor();

const createScreenshot = async (req: Request, res: Response) => {
  try {
    const { timemark, videoItem } = req.body;

    console.log('>>> createScreenshot:', { timemark, videoItem });
    const videoItemData = await databaseProcessor.getVideoItemDataById(videoItem);
    if (!videoItemData) {
      throw new BadRequestError(`Check video item id: ${videoItem}`);
    }

    const extractedScreenshot = await videoProcessor.extractScreenshotFromVideoItem(videoItemData, timemark);
    if (!extractedScreenshot.data) {
      res.send(extractedScreenshot);

      return;
    }

    const savedScreenshot = await databaseProcessor.saveScreenshotData(extractedScreenshot.data, videoItemData.name);

    res.send({ success: extractedScreenshot.success, created: extractedScreenshot.created, data: savedScreenshot });
  } catch (error) {
    console.log('>>> createScreenshot > error:', error);
    res.send(error);
  }
};

export { createScreenshot };
