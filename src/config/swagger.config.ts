import { HttpStatus, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as packageJson from '../../package.json';
import {
  AppExceptionResource,
  getAppException,
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
    for (const [method, methodValue] of Object.entries(pathValue)) {
      const parameters = methodValue.parameters;
      const statusBadReq = HttpStatus.BAD_REQUEST;

      if (
        ((parameters && parameters.length) || methodValue.requestBody) &&
        !methodValue.responses.hasOwnProperty(statusBadReq)
      ) {
        methodValue.responses[statusBadReq] = getAppException({
          description: ExceptionMessage.INVALID_DATA,
          statusCode: statusBadReq,
          message: ['year must be a number', 'email must be an email'],
        });
      }

      const statusUnAuth = HttpStatus.UNAUTHORIZED;

      if (
        methodValue.security &&
        methodValue.security.length &&
        !methodValue.responses.hasOwnProperty(statusUnAuth)
      ) {
        methodValue.responses[statusUnAuth] = getAppException({
          description: ExceptionMessage.AUTH_WRONG_TOKEN,
          statusCode: statusUnAuth,
          localCode: ExceptionLocalCode.AUTH_WRONG_TOKEN,
        });
      }

      /** Global error Rate limit (Too many requests) */
      methodValue.responses[HttpStatus.TOO_MANY_REQUESTS] = getAppException({
        description: ExceptionMessage.TOO_MANY_REQUESTS,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        localCode: ExceptionLocalCode.TOO_MANY_REQUESTS,
      });

      /** Add additional info for OK status (/srs/filters) */
      const statusOk = HttpStatus.OK;

      if (methodValue.responses.hasOwnProperty(statusOk)) {
        const resOk = methodValue.responses[statusOk];

        if (!resOk.content || !resOk.content['application/json']) {
          continue;
        }

        resOk.content['application/json'].schema = getResSwaggerFilter(
          resOk.content['application/json'].schema,
        );

        /** Change OK status to CREATED if POST method */
        if (method === 'post') {
          methodValue.responses[HttpStatus.CREATED] = resOk;

          delete methodValue.responses[statusOk];
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
