import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAndCountType } from '@app/crypto-utils/interfaces/find-and-count.type';
import { LoggerService } from '@app/logger/services/logger.service';
import { FindOneOptions, Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role';

@Injectable()
export class UserRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUsers(query: UserListQuery): FindAndCountType<UserEntity> {
    return this.userRepository
      .createQueryBuilder('users')
      .AndSearch(
        ['users.firstName', 'users.lastName', 'users.email'],
        query.text,
      )
      .orderBy('users.firstName', 'ASC')
      .skip(query.getSkip())
      .take(query.take)
      .getManyAndCount();
  }

  async findByColumn<TColumn extends keyof UserEntity>(
    column: TColumn,
    value: UserEntity[TColumn],
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      ...options,
      where: { [column]: value },
    });

    if (user) {
      return user;
    }

    this.logger.debug(ExceptionMessage.USER_NOT_FOUND, {
      stack: `${this.findByColumn.name} with column: ${column}`,
      params: { [column]: value },
    });

    throw new AppHttpException(
      ExceptionMessage.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ExceptionLocalCode.USER_NOT_FOUND,
    );
  }

  async storeUser(
    command: StoreUserCommand,
    role = UserRole.USER_ROLE,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...command,
      role,
    });

    return this.userRepository.save(user);
  }
}
