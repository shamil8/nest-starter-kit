import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AppValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype) {
      console.error('AppValidationPipe: Can not find metatype', metadata);

      return;
    }

    const errors = await validate(plainToClass(metadata.metatype, value));

    if (errors.length) {
      const messages = errors.map((err) => {
        if (!err.constraints) {
          console.error('AppValidationPipe: Can not find constraints', err);
          return err;
        }

        return `${err.property}: ${Object.values(err.constraints).join(', ')}`;
      });

      throw new HttpException(messages.join(', '), HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
