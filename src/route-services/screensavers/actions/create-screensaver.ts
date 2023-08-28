import { Request, Response } from 'express';

import { VideoProcessor } from '../../../video-processor';
import { DatabaseProcessor } from '../../../database-processor';
import { BadRequestError } from '../../../errors';

const videoProcessor = new VideoProcessor();
const databaseProcessor = new DatabaseProcessor();

const createScreensaver = async (req: Request, res: Response) => {
  try {
    const { name, dotExtension } = req.body;

    if (!await videoProcessor.hasVideoItem(name)) {
      throw new BadRequestError(`Check video item name: ${name}`);
    }

    if (!(await videoProcessor.hasScreensaverAsset(name))) {
      await videoProcessor.createScreensaverForVideoItem(`${name}${dotExtension}`);
    }

    const videoItemData = await databaseProcessor.getVideoItemData({ name });
    if (!videoItemData) {
      throw new BadRequestError(`Check video item name: ${name}`);
    }

    const screensaverDoc = await databaseProcessor.getScreensaverData({ videoItem: videoItemData.id });

    if (!screensaverDoc) {
      const data = { ...databaseProcessor.mapScreensaverData(), videoItem: videoItemData.id! };
      const { id } = await databaseProcessor.saveScreensaverData(data, name);

      res.send({ success: true, response: { data: { id, name }}});

      return;
    }

    res.send({ success: true, response: { data: screensaverDoc } });
  } catch (error) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).send({ success: false, error });
    }

    res.status(400).send({ success: false, error });
  }
};

export { createScreensaver };
