import { Request, Response } from 'express';

import { DatabaseProcessor } from '../../../database-processor';
import { VideoProcessor } from '../../../video-processor';
import { Types } from 'mongoose';

const videoProcessor = new VideoProcessor();
const databaseProcessor = new DatabaseProcessor();

const deleteScreenshot = async (req: Request, res: Response) => {
  try {
    const { id, name: screenshotName, dotExtension } = req.body;

    const response = await videoProcessor.deleteScreenshot(screenshotName, dotExtension);

    if (response.success) {
      const { deletedCount } = await databaseProcessor.deleteScreenshotData({ id: new Types.ObjectId(id) });
  
      res.send({ success: true, data: { deletedCount }});
    } else {
      res.send(response);
    }
  } catch (error) {
    console.log('>>> deleteScreenshot > error:', error);
    res.send(error);
  }
};

export { deleteScreenshot };
