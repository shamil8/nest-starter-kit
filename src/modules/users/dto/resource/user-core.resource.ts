import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role';
import { UserBaseResource } from './user-base.resource';

export class UserCoreResource extends UserBaseResource {
  static readonly select: (keyof UserEntity)[] = [
    ...UserBaseResource.select,
    'role',
  ];

  @ApiProperty({
    description: 'Language code for the news page',
    example: UserRole.USER,
    enum: UserRole,
    required: true,
  })
  role!: UserRole;

  constructor(entity: UserEntity) {
    super(entity);

    this.role = entity.role;
  }
}
