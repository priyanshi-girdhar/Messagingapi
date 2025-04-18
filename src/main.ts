
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from './logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  await app.listen(3000);
}
bootstrap();
