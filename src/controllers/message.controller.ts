import { Request, Response } from 'express';
import { sayHelloToUser, customMessage } from '../utils/messageJson';
import logger from '../logger/logger';

export const greetUser = (req: Request, res: Response) => {
  const logMethod: string = 'message.controller:greetUser::';
  const { username } = req.body;

  if (!username) {
    logger.error(`${logMethod} username is required`);
    res.status(400).send({ message: 'Username is required' });
    return;
  }

  const greeting = sayHelloToUser(username);
  logger.info(`${logMethod} greeting`);
  res.send(greeting);
};

export const createCustomMessage = (req: Request, res: Response) => {
  const logMethod: string = 'message.controller:createCustomMessage::';
  const { message } = req.body;

  if (!message) {
    logger.error(`${logMethod} message is required`);
    res.status(400).send({ message: 'Message is required' });
    return;
  }

  const response = customMessage(message);
  logger.info(`${logMethod} sending message`);
  res.send(response);
};
