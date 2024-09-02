import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserCoreResource } from '../../users/dto/resource/user-core.resource';
import { UserService } from '../../users/services/user.service';
import { AuthConfig } from '../config/auth.config';
import { JwtValidatePayloadInterface } from '../interfaces/jwt-validate-payload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.access.secret,
    });
  }

  async validate(
    payload: JwtValidatePayloadInterface,
  ): Promise<UserCoreResource> {
    return this.userService.findCoreById(payload.id);
  }
}
