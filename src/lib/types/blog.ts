import { PaginatedResponse, SingleResponse } from "./common";
import { SEOFields } from "./seo";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: string;
  featured: boolean;
  publishedAt?: string;
  // SEO fields
  seo?: SEOFields;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  status?: string;
  featured?: boolean;
  // SEO fields
  seo?: SEOFields;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  _id: string;
}

export type BlogsResponse = PaginatedResponse<Blog>;

export type BlogResponse = SingleResponse<Blog>;

export interface BlogCategory {
  name: string;
  count: number;
}

export interface BlogCategoriesResponse {
  success: boolean;
  data: BlogCategory[];
  total: number;
}

export interface BlogTagsResponse {
  success: boolean;
  data: string[];
  total: number;
}
