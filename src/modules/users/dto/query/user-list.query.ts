import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UserListQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  text?: string;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @ApiProperty({
    example: 25,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  take: number = 15;
}
