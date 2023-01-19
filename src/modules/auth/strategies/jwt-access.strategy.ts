import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthConfig } from '../config/auth.config';
import { JwtValidatePayloadInterface } from '../interfaces/jwt-validate-payload.interface';
import { UserService } from '../../users/services/user.service';
import { UserDto } from '../../users/dto/resource/user.dto';

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

  async validate(payload: JwtValidatePayloadInterface): Promise<UserDto> {
    return this.userService.findUserById(payload.id);
  }
}
