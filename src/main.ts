import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import config from './config';
import swaggerConfig from './config/swagger.config';
import { AppExceptionsFilter } from './filters/app.exceptions.filter';
import { ResponseInterceptor } from './filters/app.response.interceptor';

let app: INestApplication | null = null;

async function main(): Promise<void> {
  app = await NestFactory.create(AppModule, { bufferLogs: true });
  const adapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AppExceptionsFilter(adapter));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(config.routePrefix);

  /** Settings Swagger */
  swaggerConfig(app);

  app.enableShutdownHooks();
  app.enableCors(config.cors);
  app.use(helmet());
  app.use(json({ limit: config.maxBodySize }));
  app.use(urlencoded({ extended: true, limit: config.maxBodySize }));

  await app.startAllMicroservices();
  await app.listen(config.appPort);
}

main().catch(async (err: any) => {
  console.error('MainNest:', err);

  if (app) {
    await app.close();
  }

  // Exit the process with a failure code
  process.exit(1);
});
