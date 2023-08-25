import { Request, Response } from 'express';

import { VideoProcessor } from '../../../video-processor';
import { DatabaseProcessor } from '../../../database-processor';

const videoProcessor = new VideoProcessor();
const databaseProcessor = new DatabaseProcessor();

const updateScreenshotsDatabase = async (req: Request, res: Response) => {
  const screenshotNames = await videoProcessor.getScreenshotNames();

  await Promise.all(screenshotNames.map(async (screenshotName) => {
    const screenshotProbeData = await videoProcessor.getScreenshotProbeData(screenshotName);

    const videoItemName = videoProcessor.extractVideoItemNameFromScreenshotName(screenshotName);
    const videoItem = await databaseProcessor.getVideoItemData({ name: videoItemName });

    const screenshotData = databaseProcessor.mapScreenshotData(screenshotProbeData, videoItem.id!);

    console.log('>>> screenshotData:', screenshotData);

    return await databaseProcessor.updateScreenshotData(screenshotData);
  }));

  res.send({ success: true });
};

export { updateScreenshotsDatabase };
