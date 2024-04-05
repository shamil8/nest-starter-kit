import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionLocalCode } from '../enums/exception-local-code';
import { ExceptionMessage } from '../enums/exception-message';

export class AppHttpException extends HttpException {
  constructor(
    message: ExceptionMessage,
    statusCode: HttpStatus,
    localCode?: ExceptionLocalCode,
  ) {
    super({ message, localCode }, statusCode);
  }
}
