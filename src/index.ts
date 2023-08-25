/** App */
import { app } from './app';

/** Config */
import { config } from './config';
import { connectDB } from './connectors/db/connect-mongodb';

const startApp = async () => {
  /** Connect DB here */
  await connectDB();

  const PORT = config.port.server;
  app.listen(PORT, () => {
    console.log(`>>> Server is up and running on PORT ${PORT} ...`);
    console.info('>>> Press Ctrl + C to stop server');
  });
};

startApp();
