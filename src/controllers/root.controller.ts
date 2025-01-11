import { Request, Response } from 'express';
import logger from '../logger/logger';

export const rootEndpoint = (_req: Request, res: Response) => {
  const logMethod: string = 'root.controller:rootEndpoint::';
  logger.info(`${logMethod} sending message`);
  res.send({ message: 'Hello World! My api is working great!' });
};
