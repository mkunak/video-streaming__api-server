import { ConnectOptions } from "mongoose";

export enum EEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export type TConfig = {
  environment: EEnv;
  port: { client: string, server: string };
  baseUrl: { client: string, server: string };
  db: {
    uri: string;
    uriOptions: ConnectOptions;
  },
};
