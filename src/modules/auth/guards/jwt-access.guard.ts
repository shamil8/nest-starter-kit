import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest = <User>(err: any, user: User): User => {
    if (err || !user) {
      throw (
        err ||
        new AppHttpException(
          ExceptionMessage.AUTH_WRONG_TOKEN,
          HttpStatus.UNAUTHORIZED,
          ExceptionLocalCode.AUTH_WRONG_TOKEN,
        )
      );
    }

    return user;
  };
}
