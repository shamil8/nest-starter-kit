import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@app/logger/logger.module';
import { RabbitModule } from '@app/rabbit/rabbit.module';

import { SystemController } from './controllers/system.controller';
import { CountryEntity } from './entities/country.entity';
import { FcmTokenEntity } from './entities/fcm-token.entity';
import { CountryRepository } from './repositories/country.repository';
import { FcmTokenRepository } from './repositories/fcm-token.repository';
import { SystemService } from './services/system.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity, FcmTokenEntity]),
    LoggerModule,
    RabbitModule,
  ],
  controllers: [SystemController],
  providers: [
    // repositories
    CountryRepository,
    FcmTokenRepository,

    // services
    SystemService,
  ],
  exports: [CountryRepository, SystemService],
})
export class SystemModule {}
