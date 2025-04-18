// src/logger/winston.logger.ts
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonLoggerOptions: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('MessagingAPI', {
          prettyPrint: true,
        }),
      ),
    }),

    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),

    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
};
