import type { PaginationQuery, PaginatedResponse } from '@/shared/types';

export function buildPagination(query: PaginationQuery) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  const skip = (page - 1) * limit;
  const orderBy = query.sortBy
    ? { [query.sortBy]: query.sortOrder ?? 'asc' }
    : { caseMasterId: 'desc' as const };

  return { page, limit, skip, orderBy };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
