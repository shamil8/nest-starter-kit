import { Injectable } from '@nestjs/common';
import { LoggerService } from '@app/logger/services/logger.service';
import { ProducerService } from '@app/rabbit/services/producer.service';

import { QueueNotification } from '../../../enums/queue-notification';
import { UserCoreResource } from '../../users/dto/resource/user-core.resource';
import { AddFcmTokenCommand } from '../dto/command/add-fcm-token.command';
import { CountryResource } from '../dto/resource/country.resource';
import { CountryEntity } from '../entities/country.entity';
import { SendFcmTokenInterface } from '../interfaces/send-fcm-token.interface';
import { CountryRepository } from '../repositories/country.repository';
import { FcmTokenRepository } from '../repositories/fcm-token.repository';

@Injectable()
export class SystemService {
  constructor(
    private readonly logger: LoggerService,
    private readonly countryRepository: CountryRepository,
    private readonly fcmTokenRepository: FcmTokenRepository,
    private readonly producerService: ProducerService,
  ) {}

  async getCountries(): Promise<CountryEntity[]> {
    const countries = await this.countryRepository.getAllCountries();

    return countries.map((country) => new CountryResource(country));
  }

  async addFcmToken(
    user: UserCoreResource,
    command: AddFcmTokenCommand,
  ): Promise<boolean> {
    const fcmToken = await this.fcmTokenRepository.findByDeviceId(
      user.id,
      command.deviceId,
    );

    if (!fcmToken) {
      await this.fcmTokenRepository.createFcmToken(user.id, command);
    } else if (fcmToken.token != command.token) {
      await this.fcmTokenRepository.updateFcmToken(fcmToken.id, command.token);
    }

    /** Push to notice-service for subscribe to all topics */
    if (!fcmToken || fcmToken.token != command.token) {
      await this.producerService.addMessage<SendFcmTokenInterface>(
        QueueNotification.sendFcmToken,
        {
          userId: user.id,
          token: command.token,
          topics: [...command.topics, user.langCode],
        },
      );
    }

    return true;
  }
}
