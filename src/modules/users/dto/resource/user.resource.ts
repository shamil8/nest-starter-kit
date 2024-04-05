import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../../entities/user.entity';

export class UserResource {
  @ApiProperty({
    required: true,
    example: 'EKFKV2WCDJK8',
    description: 'User ID',
  })
  id!: string;

  @ApiProperty({
    required: true,
    example: 'example@test.com',
    description: 'The email of user',
  })
  email!: string;

  @ApiProperty({ required: false, example: 'Shamil', description: 'User name' })
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Qurbonov',
    description: 'User last name',
  })
  lastName?: string;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.email = entity.email;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
  }
}
