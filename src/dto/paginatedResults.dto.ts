import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResults<T> {
  @ApiProperty()
  items: T[];
  @ApiProperty()
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}
