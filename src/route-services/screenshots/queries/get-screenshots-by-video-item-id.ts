import { Request, Response } from 'express';

import { DatabaseProcessor } from '../../../database-processor';
import { BadRequestError } from '../../../errors';
import { Types } from 'mongoose';

const databaseProcessor = new DatabaseProcessor();

const getScreenshotsByVideoItemId = async (req: Request, res: Response) => {
  try {
    const videoItemId = req.params.videoItemId;
  if (!videoItemId) throw new BadRequestError(`Check video item id param: ${videoItemId}`);

  const screenshots = await databaseProcessor.getScreenshotsByFilter({ videoItem: new Types.ObjectId(videoItemId) });

  res.send({ data: screenshots, totalLength: screenshots.length });
  } catch (error) {
    res.send(error);
  }
};

export { getScreenshotsByVideoItemId };
