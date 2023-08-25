import { Request, Response } from 'express';

import { DatabaseProcessor } from '../../../database-processor';

const databaseProcessor = new DatabaseProcessor();

const getScreenshots = async (req: Request, res: Response) => {
  const screenshots = await databaseProcessor.getScreenshots();

  res.send({ data: screenshots, totalLength: screenshots.length });
};

export { getScreenshots };
