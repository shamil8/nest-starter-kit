import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtAuthInterface } from '../interfaces/jwt-auth.interface';

@Injectable()
export class AuthConfig {
  /** JWT auth secrets */
  public jwt: JwtAuthInterface;

  constructor(private readonly configService: ConfigService) {
    this.jwt = {
      access: {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        lifetime: this.configService.get<number | string>(
          'JWT_ACCESS_LIFETIME',
          '1h',
        ),
      },
      refresh: {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        lifetime: this.configService.get<number | string>(
          'JWT_REFRESH_LIFETIME',
          '1w',
        ),
      },
    };
  }
}
