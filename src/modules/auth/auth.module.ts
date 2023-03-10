import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '@app/logger/logger.module';

import { UserModule } from '../users/user.module';
import { AuthConfig } from './config/auth.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [ConfigModule, LoggerModule, JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    //config
    AuthConfig,

    // strategies
    JwtAccessStrategy,

    // services
    AuthService,
  ],
})
export class AuthModule {}
