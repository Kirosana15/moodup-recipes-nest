import { PaginatedResults } from '../dto/paginatedResults.dto';

export function paginate<T>(page: number, limit: number, count: number, items: T[]): PaginatedResults<T> {
  const maxPage = Math.ceil(count / limit);
  return {
    items,
    pagination: {
      page: page,
      pageSize: items.length,
      totalItems: count,
      totalPages: maxPage,
      hasNext: page < maxPage,
      hasPrevious: page > 1,
    },
  };
}
