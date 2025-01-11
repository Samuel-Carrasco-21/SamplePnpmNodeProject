import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  apiVersion: Number(process.env.ENV_VERSION) || 1,
  loggerLevel: process.env.LOGGER_LEVEL || 'info',
};
