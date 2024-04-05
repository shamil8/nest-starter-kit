import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionBodyMessage } from '@nestjs/common/interfaces/http/http-exception-body.interface';
import { HttpAdapterHost } from '@nestjs/core';

import { AppExceptionResource } from '../dto/resource/app-exception.resource';
import { ExceptionMessage } from '../enums/exception-message';

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
    let httpResponse: { message: HttpExceptionBodyMessage; [key: string]: any };

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      httpResponse =
        typeof response === 'string'
          ? { message: response }
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
