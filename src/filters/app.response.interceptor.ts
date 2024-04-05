import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const getResSwaggerFilter = (result: SchemaObject): SchemaObject => ({
  type: 'object',
  properties: { ok: { type: 'boolean' }, result },
});

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((result) => ({ ok: true, result })));
  }
}
