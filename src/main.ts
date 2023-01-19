import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

import config from './config';
import swaggerConfig from './config/swagger.config';
import { AppModule } from './app.module';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // const adapter = app.get(HttpAdapterHost);
  // const exceptionFilter = new AppExceptionsFilter(adapter);
  //
  // app.useGlobalFilters(exceptionFilter);
  // app.enableShutdownHooks();
  //
  // const responseInterceptor = new ResponseInterceptor();
  // app.useGlobalInterceptors(responseInterceptor);

  app.setGlobalPrefix(config.routePrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /** Settings Swagger */
  swaggerConfig(app);

  app.enableCors(config.cors);
  app.use(helmet());

  await app.startAllMicroservices();
  await app.listen(config.appPort);
}

main();
