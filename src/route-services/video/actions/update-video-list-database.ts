import { Request, Response } from 'express';

import { VideoProcessor } from '../../../video-processor';
import { DatabaseProcessor } from '../../../database-processor';

const videoProcessor = new VideoProcessor();
const databaseProcessor = new DatabaseProcessor();

const updateVideoListDatabase = async (req: Request, res: Response) => {
  const videoItemNames = await videoProcessor.getVideoItemNames();

  await Promise.all(videoItemNames.map(async (videoItemName, index) => {
    const videoItemProbeData = await videoProcessor.getVideoItemProbeData(videoItemName);

    const videoItemData = databaseProcessor.mapVideoItemData(videoItemProbeData, index);

    console.log('>>> videoItemData:', videoItemData);

    return await databaseProcessor.updateVideoItemData(videoItemData);
  }));

  res.send({ success: true });
};

export { updateVideoListDatabase };
