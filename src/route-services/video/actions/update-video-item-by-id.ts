import { Request, Response } from 'express';
import fs from 'fs';

import { VideoProcessor } from '../../../video-processor';

const updateVideoItemById = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const { resolution } = req.body;

  console.log('>>> editVideoItemById > id:', id);
  console.log('>>> editVideoItemById > resolution:', resolution);

  const root = process.cwd();
  const fileNames = fs.readdirSync(`${root}/src/assets/items`);
  const videoProcessor = new VideoProcessor();

  // fileNames.forEach((fileName) => {
  //   const filePath = `${root}/src/assets/items/${fileName}`;
  //   videoProcessor.changeResolution(filePath, resolution);
  // })

  // payload.data[id].name = rest.name;
  // payload.data[id].city = rest.city;
  // payload.data[id].text = rest.text;

  res.send({});
};

export { updateVideoItemById };
