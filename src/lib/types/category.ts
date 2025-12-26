import { PaginatedResponse, Pagination, SingleResponse } from "./common";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  _id: string;
}

export interface CategoryResponse extends SingleResponse<Category> {
  success: boolean;
  data: Category;
}
export interface CategoriesResponse extends PaginatedResponse<Category> {
  success: boolean;
  data: Category[];
  pagination: Pagination;
}
