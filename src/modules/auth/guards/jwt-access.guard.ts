import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest = <User>(err: any, user: User): User => {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  };
}
