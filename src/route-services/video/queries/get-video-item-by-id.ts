import { Request, Response } from 'express';

import { DatabaseProcessor } from '../../../database-processor';

const databaseProcessor = new DatabaseProcessor();

const getVideoItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const videoItem = await databaseProcessor.getVideoItemDataById(id);

  console.log('>>> getVideoItemById:', videoItem);
  
  res.send(videoItem);
};

export { getVideoItemById };
