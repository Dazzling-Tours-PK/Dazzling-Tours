// Common pagination interface for all API responses
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Generic paginated response wrapper
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

// Generic single item response wrapper
export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

// Common API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// MongoDB Query Types
export interface MongoQuery {
  [key: string]:
    | string
    | boolean
    | number
    | { $regex: string; $options: string }
    | { $in: (string | number)[] }
    | { $ne: unknown }
    | { $or: Array<{ [key: string]: { $regex: string; $options: string } }> }
    | Array<{ [key: string]: { $regex: string; $options: string } }>
    | undefined
    | Record<string, unknown>;
}

// Query Parameters Types
export interface QueryParams {
  page?: string;
  limit?: string;
  category?: string;
  status?: string;
  search?: string;
  featured?: string;
  tourId?: string;
}
