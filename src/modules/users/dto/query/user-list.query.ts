import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationParamsQuery } from '../../../../dto/query/pagination-params.query';

export class UserListQuery extends PaginationParamsQuery {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;
}
