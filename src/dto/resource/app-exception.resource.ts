import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ExceptionLocalCode } from '../../enums/exception-local-code';
import {
  ExceptionMessage,
  ExceptionMsgType,
} from '../../enums/exception-message';

interface BaseExceptionInterface {
  statusCode: HttpStatus;
  message?: ExceptionMsgType;
  localCode?: ExceptionLocalCode;
  args?: object;
}

interface ContextExceptionInterface extends BaseExceptionInterface {
  message: ExceptionMsgType;
}

interface AppExceptionInterface extends BaseExceptionInterface {
  description: ExceptionMessage;
}

export const ApiAppException = (
  data: AppExceptionInterface,
): MethodDecorator & ClassDecorator =>
  ApiResponse({ status: data.statusCode, ...getAppException(data) });

export const getAppException = (
  data: AppExceptionInterface,
): ResponseObject => ({
  description: data.description,
  content: {
    'application/json': {
      schema: { $ref: getSchemaPath(AppExceptionResource) },
      examples: {
        'app-exception-resource': {
          summary: `Error ${Object.keys(HttpStatus).find(
            (key) =>
              HttpStatus[key as keyof typeof HttpStatus] === data.statusCode,
          )} example`,
          value: new AppExceptionResource({
            ...data,
            message: data.message || data.description,
          }),
        },
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
    enum: Object.values(HttpStatus).filter((val) => typeof val === 'number'),
    type: Number,
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
  message!: ExceptionMsgType;

  @ApiProperty({
    example: ExceptionLocalCode.USER_NOT_FOUND,
    description: 'Localized error code',
    enum: Object.values(ExceptionLocalCode).filter(
      (val) => typeof val === 'number',
    ),
    required: false,
    type: Number,
  })
  localCode?: ExceptionLocalCode;

  @ApiProperty({
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    description: 'Optional request arguments',
    required: false,
    type: Object,
  })
  args?: object;

  constructor(body: ContextExceptionInterface) {
    this.ok = false;
    this.statusCode = body.statusCode;
    this.timestamp = new Date();
    this.message = body.message;
    this.localCode = body.localCode;
    this.args = body.args;
  }
}
