import { ApiProperty } from '@nestjs/swagger';

import { LanguageCode } from '../../../system/enums/language-code';
import { UserEntity } from '../../entities/user.entity';

export class UserBaseResource {
  static readonly select: (keyof UserEntity)[] = ['id', 'email', 'langCode'];

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

  @ApiProperty({
    description: 'Language code for the news page',
    example: LanguageCode.EN,
    enum: LanguageCode,
    required: true,
  })
  langCode!: LanguageCode;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.email = entity.email;
    this.langCode = entity.langCode;
  }
}
