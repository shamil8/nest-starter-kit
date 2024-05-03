import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@app/logger/services/logger.service';
import { Repository, UpdateResult } from 'typeorm';

import { AddFcmTokenCommand } from '../dto/command/add-fcm-token.command';
import { FcmTokenEntity } from '../entities/fcm-token.entity';

@Injectable()
export class FcmTokenRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(FcmTokenEntity)
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
  ) {}

  async findByDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<{ id: string; token: string } | null> {
    return this.fcmTokenRepository
      .createQueryBuilder('fcmToken')
      .select(['fcmToken.id', 'fcmToken.token'])
      .where('fcmToken.userId = :userId', { userId })
      .andWhere('fcmToken.deviceId = :deviceId', { deviceId })
      .getOne();
  }

  async createFcmToken(
    userId: string,
    command: AddFcmTokenCommand,
  ): Promise<FcmTokenEntity> {
    const fcmToken = this.fcmTokenRepository.create({ ...command, userId });

    return this.fcmTokenRepository.save(fcmToken);
  }

  async updateFcmToken(id: string, token: string): Promise<UpdateResult> {
    return this.fcmTokenRepository.update({ id }, { token });
  }
}
