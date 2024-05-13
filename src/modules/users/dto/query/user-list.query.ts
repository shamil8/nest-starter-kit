import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQuery } from '../../../../dto/query/pagination.query';

export class UserListQuery extends PaginationQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;
}
