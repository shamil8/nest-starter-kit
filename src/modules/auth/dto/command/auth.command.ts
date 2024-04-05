import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCommand {
  @ApiProperty({
    required: true,
    example: 'example@test.com',
    description: 'The email of user',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
    example: 'PassWord',
    description: 'The password of user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password!: string;
}
