import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '@app/logger/services/logger.service';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { UserService } from '../../users/services/user.service';
import { AuthConfig } from '../config/auth.config';
import { AuthCommand } from '../dto/command/auth.command';
import { JwtResponseResource } from '../dto/resource/jwt-response.resource';
import { JwtValidatePayloadInterface } from '../interfaces/jwt-validate-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authConfig: AuthConfig,
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private createTokens(
    payload: JwtValidatePayloadInterface,
  ): JwtResponseResource {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.access.secret,
      expiresIn: this.authConfig.jwt.access.lifetime,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.refresh.secret,
      expiresIn: this.authConfig.jwt.refresh.lifetime,
    });

    return new JwtResponseResource(accessToken, refreshToken);
  }

  async login(command: AuthCommand): Promise<JwtResponseResource> {
    const user = await this.userService.findByEmail(command.email, {
      select: ['id', 'password'],
    });

    if (!user || !user.passwordCompare(command.password)) {
      throw new AppHttpException(
        ExceptionMessage.WRONG_PASSWORD,
        HttpStatus.FORBIDDEN,
        ExceptionLocalCode.WRONG_PASSWORD,
      );
    }

    return this.createTokens({ id: user.id });
  }
}
