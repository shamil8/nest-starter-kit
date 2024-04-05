import { HttpStatus } from '@nestjs/common';
import { HttpExceptionBodyMessage } from '@nestjs/common/interfaces/http/http-exception-body.interface';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ContentObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ExceptionLocalCode } from '../../enums/exception-local-code';
import { ExceptionMessage } from '../../enums/exception-message';

interface AppExceptionInterface {
  statusCode: HttpStatus;
  message: HttpExceptionBodyMessage;
  localCode?: ExceptionLocalCode;
}

export const getExceptionContent = (
  data: AppExceptionInterface,
): ContentObject => ({
  'application/json': {
    schema: { $ref: getSchemaPath(AppExceptionResource) },
    examples: {
      'app-exception-resource': {
        summary: `Error ${Object.keys(HttpStatus).find(
          (key) =>
            HttpStatus[key as keyof typeof HttpStatus] === data.statusCode,
        )} example`,
        value: new AppExceptionResource(data),
      },
    },
  },
});

export class AppExceptionResource {
  @ApiProperty({
    example: false,
    description: 'Request status',
  })
  ok!: false;

  @ApiProperty({
    example: HttpStatus.BAD_REQUEST,
    description: 'Request status code',
    enum: HttpStatus,
  })
  statusCode!: HttpStatus;

  @ApiProperty({
    example: '2024-04-02T03:00:05.521Z',
    description: 'Request date',
  })
  timestamp!: Date;

  @ApiProperty({
    description: 'Error message can be object or string',
    oneOf: [
      {
        type: 'string',
        enum: Object.values(ExceptionMessage),
        example: ExceptionMessage.USER_NOT_FOUND,
      },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['year must be a number'],
      },
    ],
  })
  message!: HttpExceptionBodyMessage | ExceptionMessage;

  @ApiProperty({
    example: ExceptionLocalCode.USER_NOT_FOUND,
    description: 'Localized error code',
    enum: ExceptionLocalCode,
    required: false,
  })
  localCode?: ExceptionLocalCode;

  constructor(body: AppExceptionInterface) {
    this.ok = false;
    this.statusCode = body.statusCode;
    this.timestamp = new Date();
    this.message = body.message;
    this.localCode = body.localCode;
  }
}
