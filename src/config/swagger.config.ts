import { HttpStatus, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as packageJson from '../../package.json';
import {
  AppExceptionResource,
  getExceptionContent,
} from '../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../enums/exception-local-code';
import { ExceptionMessage } from '../enums/exception-message';
import { getResSwaggerFilter } from '../filters/app.response.interceptor';
import config from './index';

const emailRegex = /<([^>]+)>/; // Regex to extract email from the author string
const authorString = packageJson.author;
const emailMatch = authorString.match(emailRegex);
const supportEmail = emailMatch ? emailMatch[1] : '';

export default (app: INestApplication): void => {
  const documentBuildr = new DocumentBuilder()
    .setTitle(config.appName)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .setTermsOfService(`${config.appUrl}/terms`)
    .setContact('API Support', config.appUrl, supportEmail)
    .setExternalDoc(
      'Get OpenAPI JSON',
      `${config.appUrl}${config.routePrefix}${config.swaggerPrefix}-json`,
    )
    .addBearerAuth()
    .addServer(`${config.appUrl}${config.routePrefix}`)
    .build();

  const document = SwaggerModule.createDocument(app, documentBuildr, {
    ignoreGlobalPrefix: true,
    extraModels: [AppExceptionResource],
  });

  for (const [, pathValue] of Object.entries(document.paths)) {
    for (const [, methodValue] of Object.entries(pathValue)) {
      const parameters = methodValue.parameters;

      if (
        ((parameters && parameters.length) || methodValue.requestBody) &&
        !methodValue.responses.hasOwnProperty(HttpStatus.BAD_REQUEST)
      ) {
        methodValue.responses[HttpStatus.BAD_REQUEST] = {
          description: ExceptionMessage.INVALID_DATA,
          content: getExceptionContent({
            statusCode: HttpStatus.BAD_REQUEST,
            message: ['year must be a number', 'email must be an email'],
          }),
        };
      }

      for (const code of [
        HttpStatus.NOT_FOUND,
        HttpStatus.CONFLICT,
        HttpStatus.FORBIDDEN,
      ]) {
        if (
          methodValue.responses.hasOwnProperty(code) &&
          !methodValue.responses[code].content
        ) {
          const [message, localCode] =
            methodValue.responses[code].description.split('__');

          methodValue.responses[code].description = message;
          methodValue.responses[code].content = getExceptionContent({
            statusCode: code,
            message,
            localCode: isNaN(localCode) ? undefined : Number(localCode),
          });
        }
      }

      if (
        methodValue.security &&
        methodValue.security.length &&
        !methodValue.responses.hasOwnProperty(HttpStatus.UNAUTHORIZED)
      ) {
        methodValue.responses[HttpStatus.UNAUTHORIZED] = {
          description: ExceptionMessage.AUTH_WRONG_TOKEN,
          content: getExceptionContent({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: ExceptionMessage.AUTH_WRONG_TOKEN,
            localCode: ExceptionLocalCode.AUTH_WRONG_TOKEN,
          }),
        };
      }

      /** Add additional info for CREATED AND OK statuses (/srs/filters)*/
      const isOk = methodValue.responses.hasOwnProperty(HttpStatus.OK);

      if (isOk || methodValue.responses.hasOwnProperty(HttpStatus.CREATED)) {
        const resOk =
          methodValue.responses[isOk ? HttpStatus.OK : HttpStatus.CREATED];

        if (resOk.content && resOk.content['application/json']) {
          resOk.content['application/json'].schema = getResSwaggerFilter(
            resOk.content['application/json'].schema,
          );
        }
      }
    }
  }

  SwaggerModule.setup(
    `${config.routePrefix}${config.swaggerPrefix}`,
    app,
    document,
  );
};
