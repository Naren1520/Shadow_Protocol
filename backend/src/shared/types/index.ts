export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SP'          // Superintendent of Police
  | 'DSP'         // Deputy SP
  | 'INSPECTOR'
  | 'SUB_INSPECTOR'
  | 'ASI'         // Assistant Sub Inspector
  | 'HEAD_CONSTABLE'
  | 'CONSTABLE';

export const ROLES: Record<UserRole, UserRole> = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SP: 'SP',
  DSP: 'DSP',
  INSPECTOR: 'INSPECTOR',
  SUB_INSPECTOR: 'SUB_INSPECTOR',
  ASI: 'ASI',
  HEAD_CONSTABLE: 'HEAD_CONSTABLE',
  CONSTABLE: 'CONSTABLE',
};
