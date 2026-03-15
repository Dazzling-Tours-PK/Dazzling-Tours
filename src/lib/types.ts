export interface MongoQuery {
  [key: string]:
    | string
    | boolean
    | number
    | { $regex: string; $options: string }
    | { $in: (string | number)[] }
    | { $ne: unknown }
    | Array<{ [key: string]: { $regex: string; $options: string } }>
    | undefined
    | Record<string, unknown>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Global Error Interface
export interface ErrorResponse {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
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
