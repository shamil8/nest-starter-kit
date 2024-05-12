import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

import { AppExceptionResource } from '../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../enums/exception-local-code';
import { ExceptionMessage, ExceptionMsgType } from '../enums/exception-message';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  private readonly _adapter: HttpAdapterHost;

  constructor(adapter: HttpAdapterHost) {
    this._adapter = adapter;
  }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this._adapter;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;
    let httpResponse: { message: ExceptionMsgType; [key: string]: any };

    if (exception instanceof ThrottlerException) {
      httpResponse = {
        message: ExceptionMessage.TOO_MANY_REQUESTS,
        localCode: ExceptionLocalCode.TOO_MANY_REQUESTS,
      };
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse();

      httpResponse =
        typeof response === 'string'
          ? { message: response as ExceptionMsgType }
          : { message: ExceptionMessage.INVALID_DATA, ...response };
    } else {
      httpResponse = {
        message: exception.message || exception.msg || String(exception),
      };
    }

    httpAdapter.reply(
      ctx.getResponse(),
      new AppExceptionResource({ statusCode: httpStatus, ...httpResponse }),
      httpStatus,
    );
  }
}
