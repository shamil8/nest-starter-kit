import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class StoreUserCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(128)
  password!: string;

  @ApiProperty({ example: 'Shamil', description: 'User name' })
  @MaxLength(128)
  firstName?: string;

  @ApiProperty({ example: 'Qurbonov', description: 'User lastname' })
  @MaxLength(128)
  lastName?: string;
}
