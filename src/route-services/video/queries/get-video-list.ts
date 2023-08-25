import { Request, Response } from 'express';

import { DatabaseProcessor } from '../../../database-processor';

const databaseProcessor = new DatabaseProcessor();

const getVideoList = async (_: Request, res: Response) => {
  const videoList = await databaseProcessor.getVideoList();

  res.send({ data: videoList, totalLength: videoList.length });
};

export { getVideoList };
