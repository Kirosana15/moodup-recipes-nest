import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

import { paginationConfig } from '../config/configs/pagination';

export class PaginatedQueryDto {
  @ApiProperty({ description: 'page number' })
  @IsNumber()
  @Type(() => Number)
  page: number = paginationConfig().defaultPage;

  @ApiProperty({ description: 'this many results per page' })
  @IsNumber()
  @Type(() => Number)
  limit: number = paginationConfig().defaultLimit;
}
