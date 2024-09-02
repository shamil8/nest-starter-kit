import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  refresh!: string;
}
