import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@app/logger/logger.module';

import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    // repositories
    UserRepository,

    // services
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
