import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../../entities/user.entity';

export class UserDto {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'User ID',
  })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ example: 'Shamil', description: 'User name' })
  firstName?: string;

  @ApiProperty({ example: 'Qurbonov', description: 'User lastname' })
  lastName?: string;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.email = entity.email;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
  }
}
