import { HttpStatus, Injectable } from '@nestjs/common';
import { PageResType } from '@app/crypto-utils/decorators/page-response.decorator';
import { LoggerService } from '@app/logger/services/logger.service';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserResource } from '../dto/resource/user.resource';
import { UserCoreResource } from '../dto/resource/user-core.resource';
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

  async getUsers(query: UserListQuery): PageResType<UserResource> {
    const [users, count] = await this.userRepository.findUsers(query);

    return { rows: users.map((user) => new UserResource(user)), count };
  }

  async findCoreById(id: string): Promise<UserCoreResource> {
    const user = await this.userRepository.findByColumn(
      'id',
      id,
      UserCoreResource.select,
    );

    return new UserCoreResource(user);
  }

  async findUserById(id: string): Promise<UserResource> {
    const user = await this.userRepository.findByColumn(
      'id',
      id,
      UserResource.select,
    );

    return new UserResource(user);
  }

  async findByEmail(
    email: string,
    select?: (keyof UserEntity)[],
  ): Promise<UserEntity | null> {
    let user: UserEntity | null = null;

    try {
      user = await this.userRepository.findByColumn('email', email, select);
    } catch (err: any) {}

    return user;
  }

  async createUser(command: StoreUserCommand): Promise<UserResource> {
    const hasUser = await this.findByEmail(command.email, ['id', 'password']);

    if (hasUser) {
      throw new AppHttpException(
        ExceptionMessage.EMAIL_EXISTS,
        HttpStatus.CONFLICT,
        ExceptionLocalCode.EMAIL_EXISTS,
      );
    }

    const user = await this.userRepository.storeUser(command);

    return new UserResource(user);
  }
}
