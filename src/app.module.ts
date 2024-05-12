import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@app/database/database.module';
import { LoggerModule } from '@app/logger/logger.module';
import { RabbitModule } from '@app/rabbit/rabbit.module';

import { rateLimitOptions } from './constants/rate-limit';
import { AuthModule } from './modules/auth/auth.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    /** Logger module */
    LoggerModule,

    /** Database module */
    DatabaseModule,

    /** RabbitMQ module */
    RabbitModule,

    /** Throttler module (Rate limit module) */
    ThrottlerModule.forRoot([rateLimitOptions]),

    /** Application modules */
    SystemModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
