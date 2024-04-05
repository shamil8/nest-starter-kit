import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

import { AuthCommand } from '../../../auth/dto/command/auth.command';

export class StoreUserCommand extends AuthCommand {
  @ApiProperty({ required: false, example: 'Shamil', description: 'User name' })
  @IsString()
  @MaxLength(128)
  @MinLength(2)
  firstName?: string;

  @ApiProperty({
    required: false,
    example: 'Qurbonov',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  lastName?: string;
}
