import { Pagination } from "./common";

export interface Comment {
  _id: string;
  blogId: { _id: string; title: string };
  name: string;
  email: string;
  content: string;
  status: string;
  parentId?: { _id: string; name: string; content?: string };
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreateCommentData {
  blogId: string;
  name: string;
  email: string;
  content: string;
  parentId?: string;
}

export interface UpdateCommentData extends Partial<CreateCommentData> {
  _id: string;
  status?: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
  pagination?: Pagination;
  total?: number;
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
}
