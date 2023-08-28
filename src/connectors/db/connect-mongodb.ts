import mongoose from 'mongoose';

import { config } from '../../config';

const connectDB = async function() {
  await mongoose.connect(config.db.uri, config.db.uriOptions)
    .then(() => {
      console.info(`>>> Running on ENV = ${config.environment}`);
      console.info('>>> Connected to database');
    })
    .catch((error) => {
      console.error('>>> Unable to connect');
      console.error(error);
    });
}

export { connectDB };
