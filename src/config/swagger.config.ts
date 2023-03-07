import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import config from './index';

export default (app: INestApplication): void => {
  const documentBuildr = new DocumentBuilder()
    .setTitle(config.appName)
    .setDescription('The NestJS template API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`${config.appUrl}${config.routePrefix}`)
    .build();

  const document = SwaggerModule.createDocument(app, documentBuildr, {
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup(
    `${config.routePrefix}${config.swaggerPrefix}`,
    app,
    document,
  );
};
