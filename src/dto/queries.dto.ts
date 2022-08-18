import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginatedQueryDto {
  @ApiProperty({ description: 'page number' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'this many results per page' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
