import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';
import config from './config';
import swaggerConfig from './config/swagger.config';
import { AppExceptionsFilter } from './filters/app.exceptions.filter';
import { ResponseInterceptor } from './filters/app.response.interceptor';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule);
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

  await app.startAllMicroservices();
  await app.listen(config.appPort);
}

main().catch((err: any) => {
  throw Error(err);
});
