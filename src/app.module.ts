import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database/database.module';
import { LoggerModule } from '@app/logger/logger.module';
import { RabbitModule } from '@app/rabbit/rabbit.module';

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

    /** Application modules */
    SystemModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
