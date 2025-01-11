import { EnvServer } from '../enums/enviorment';
import { config } from '../config/config';
import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Ensure the logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define the custom log format
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${level}:[${timestamp}] ${message}`;
});

const logger = winston.createLogger({
  level: config.loggerLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
    winston.format.simple() // Replace with `myFormat` if you want the custom format
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

// Add console transport for the development environment
if (config.nodeEnv === EnvServer.DEVELOP) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MMM/YYYY:HH:mm:ss ZZ' }),
        myFormat
      ),
    })
  );
}

// Placeholder for production-specific logic
if (config.nodeEnv === EnvServer.PRODUCTION) {
  // TODO: implement logic to save data on production modules
}

export default logger;
