import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '@app/logger/services/logger.service';

import { AuthCommand } from '../dto/command/auth.command';
import { AuthConfig } from '../config/auth.config';
import { AuthServiceError } from '../enums/auth-service-error';
import { JwtResponseInterface } from '../interfaces/jwt-response.interface';
import { JwtValidatePayloadInterface } from '../interfaces/jwt-validate-payload.interface';
import { UserService } from '../../users/services/user.service';
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
  ): JwtResponseInterface {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.access.secret,
      expiresIn: this.authConfig.jwt.access.lifetime,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.authConfig.jwt.refresh.secret,
      expiresIn: this.authConfig.jwt.refresh.lifetime,
    });

    return { accessToken, refreshToken };
  }

  async login(data: AuthCommand): Promise<JwtResponseInterface> {
    const user = await this.userService.findByEmail(data.email, {
      select: ['id', 'password'],
    });

    if (!user || !user.passwordCompare(data.password)) {
      this.logger.error(AuthServiceError.WRONG_PASSWORD);

      throw new HttpException(
        AuthServiceError.WRONG_PASSWORD,
        HttpStatus.FORBIDDEN,
      );
    }

    return this.createTokens({ id: user.id });
  }
}
