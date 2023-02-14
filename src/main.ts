import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

import config from './config';
import swaggerConfig from './config/swagger.config';
import { AppModule } from './app.module';
import { AppExceptionsFilter } from './filters/app.exceptions.filter';
import { AppValidationPipe } from './filters/app.validation.pipe';
import { ResponseInterceptor } from './filters/app.response.interceptor';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const adapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AppExceptionsFilter(adapter));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({ transform: true }),
    new AppValidationPipe(),
  );
  app.setGlobalPrefix(config.routePrefix);

  /** Settings Swagger */
  swaggerConfig(app);

  app.enableShutdownHooks();
  app.enableCors(config.cors);
  app.use(helmet());

  await app.startAllMicroservices();
  await app.listen(config.appPort);
}

main();
