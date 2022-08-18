import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export class PaginatedQueryDto {
  @Optional()
  @ApiProperty({ description: 'page number' })
  @Type(() => Number)
  page = 1;

  @Optional()
  @ApiProperty({ description: 'this many results per page' })
  @Type(() => Number)
  limit = 20;
}
