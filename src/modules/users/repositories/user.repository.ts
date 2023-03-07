import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '@app/crypto-utils/repositories/page';
import { LoggerService } from '@app/logger/services/logger.service';
import { FindOneOptions, ILike, Repository } from 'typeorm';

import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly logger: LoggerService,
  ) {}

  async list(query: UserListQuery): Promise<UserEntity[]> {
    const page = new Page(query.page, query.take);

    return await this.userRepository.find({
      where: {
        firstName: query.text && ILike(`%${query.text}%`),
      },
      take: page.limit || undefined,
      skip: page.offset,
    });
  }

  // TODO:: Improve findById and byEmail!!!
  async findUserById(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        this.logger.error('User not found', {
          stack: this.findUserById.name,
          params: { id },
        });

        throw new NotFoundException('User not found');
      }

      return user;
    } catch (err: any) {
      this.logger.error(err, {
        stack: this.findUserById.name,
        extra: err,
      });

      throw new Error(err);
    }
  }

  // TODO:: Improve findById and byEmail!!!
  async findByEmail(
    email: string,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        ...options,
        where: { email },
      });

      if (!user) {
        this.logger.error('User not found', {
          stack: this.findByEmail.name,
        });

        throw new NotFoundException('User not found');
      }

      return user;
    } catch (err: any) {
      this.logger.error(err, {
        stack: this.findByEmail.name,
        extra: err,
      });

      throw new Error(err);
    }
  }

  async storeUser(userCommand: StoreUserCommand): Promise<UserEntity> {
    return this.userRepository.save(userCommand);
  }
}
