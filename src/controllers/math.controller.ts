import { Request, Response } from 'express';
import { operateNumbers } from '../utils/calculator';
import logger from '../logger/logger';

export const performMathOperation = (req: Request, res: Response) => {
  const logMethod: string = 'math.controller:performMathOperation::';
  const { numOne, numTwo, operation } = req.body;

  if (
    !numOne ||
    !numTwo ||
    !operation ||
    typeof numOne !== 'number' ||
    typeof numTwo !== 'number'
  ) {
    logger.error(`${logMethod} invalid inputs`);
    res.status(400).send({ message: 'Invalid inputs' });
    return;
  }

  try {
    const result = operateNumbers(numOne, numTwo, operation);
    logger.info(`${logMethod} result gotten`);
    res.send({ result });
  } catch (error) {
    console.error(error);
    logger.error(`${logMethod} invalid operation`);
    res.status(400).send({ message: 'Invalid operation' });
  }
};
