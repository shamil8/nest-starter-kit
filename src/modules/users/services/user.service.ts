import { Injectable } from '@nestjs/common';
import { LoggerService } from '@app/logger/services/logger.service';
import { FindOneOptions } from 'typeorm';

import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserDto } from '../dto/resource/user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.info('Hello winston!', { sender: 'Shamil' });
  }

  async getUsers(query: UserListQuery): Promise<UserDto[]> {
    const users = await this.userRepository.list(query);

    return users.map((user) => new UserDto(user));
  }

  async findUserById(id: string): Promise<UserDto> {
    return this.userRepository.findUserById(id);
  }

  async findByEmail(
    email: string,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    return this.userRepository.findByEmail(email, options);
  }

  async createUser(command: StoreUserCommand): Promise<UserDto> {
    const user = await this.userRepository.storeUser(command);

    return new UserDto(user);
  }
}
