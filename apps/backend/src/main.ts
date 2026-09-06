import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import type { AppConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));

  const { http } = app.get(ConfigService).getOrThrow<AppConfig>('app');

  app.setGlobalPrefix(http.globalPrefix);
  app.enableCors({ origin: http.corsOrigins, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  app.enableShutdownHooks();

  await app.listen(http.port, http.host);
  new Logger('Bootstrap').log(
    `API listening on http://${http.host}:${http.port}/${http.globalPrefix}`,
  );
}

void bootstrap();
