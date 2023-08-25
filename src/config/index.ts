import dotenv from 'dotenv';

import _c_ from './constants.json';
import { EEnv, TConfig } from './config.types';
import { ConnectOptions } from 'mongoose';

dotenv.config();

const environment = (process.env.NODE_ENV as EEnv) || EEnv.DEVELOPMENT;
const clientPort = process.env.CLIENT_PORT || _c_.development.port;
const serverPort = process.env.SERVER_PORT || _c_.development.port;

const dbUserName = process.env.DB_USER_NAME || _c_.development.dbUserName;
const dbPassword = process.env.DB_PASSWORD || _c_.development.dbPassword;
const dbUriOptions: ConnectOptions = { retryWrites: true, w: 'majority' };
const dbUri = (dbUserName && dbPassword)
  ? `mongodb+srv://${dbUserName}:${dbPassword}@cluster0.65dpnam.mongodb.net`
  : _c_.development.dbUri;

const clientBaseUrl = {
  [`${EEnv.DEVELOPMENT}`]: `http://localhost:${clientPort}`,
  [`${EEnv.PRODUCTION}`]: `http://localhost:${clientPort}`,
};

const serverBaseUrl = {
  [`${EEnv.DEVELOPMENT}`]: `http://localhost:${serverPort}`,
  [`${EEnv.PRODUCTION}`]: `http://localhost:${serverPort}`,
};

const config: TConfig = {
  environment,
  port: {
    client: clientPort,
    server: serverPort,
  },
  baseUrl: {
    client: clientBaseUrl[environment],
    server: serverBaseUrl[environment],
  },
  db: {
    uri: dbUri,
    uriOptions: dbUriOptions,
  }
};

export { config }
