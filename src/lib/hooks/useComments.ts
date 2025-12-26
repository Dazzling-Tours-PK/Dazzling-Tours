import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/lib/types/common";

// Types
interface Comment {
  _id: string;
  blogId: string;
  name: string;
  email: string;
  website?: string;
  content: string;
  status: string;
  parentId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface CreateCommentData {
  blogId: string;
  name: string;
  email: string;
  website?: string;
  content: string;
  parentId?: string;
}

interface UpdateCommentData extends Partial<CreateCommentData> {
  _id: string;
  status?: string;
}

interface CommentsResponse {
  success: boolean;
  data: Comment[];
  pagination?: Pagination;
}

interface CommentResponse {
  success: boolean;
  data: Comment;
}

interface CommentStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: Record<string, number>;
    recentActivity: number;
    monthlyTrends: Array<{ month: string; count: number }>;
  };
}

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...commentKeys.lists(), filters] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  byBlog: (blogId: string) => [...commentKeys.all, "blog", blogId] as const,
  stats: () => [...commentKeys.all, "stats"] as const,
};

// Hooks
export const useGetComments = (params?: {
  status?: string;
  blogId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<CommentsResponse>({
    queryKey: commentKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/comments?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      return response.json();
    },
  });
};

export const useGetCommentsByBlog = (
  blogId: string,
  params?: {
    status?: string;
    includeReplies?: boolean;
  }
) => {
  return useQuery<CommentsResponse>({
    queryKey: [...commentKeys.byBlog(blogId), params || {}],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `/api/comments/blog/${blogId}?${searchParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blog comments");
      }
      return response.json();
    },
    enabled: !!blogId,
  });
};

export const useGetComment = (id: string) => {
  return useQuery<CommentResponse>({
    queryKey: commentKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/comments/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comment");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useGetCommentStats = (blogId?: string) => {
  return useQuery<CommentStatsResponse>({
    queryKey: [...commentKeys.stats(), blogId || "all"],
    queryFn: async () => {
      const url = blogId
        ? `/api/comments/stats?blogId=${blogId}`
        : "/api/comments/stats";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch comment stats");
      }
      return response.json();
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, CreateCommentData>({
    mutationFn: async (data) => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: commentKeys.byBlog(data.data.blogId),
      });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, UpdateCommentData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await fetch(`/api/comments/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(data.data._id),
      });
      queryClient.invalidateQueries({
        queryKey: commentKeys.byBlog(data.data.blogId),
      });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
    },
  });
};

export const useBulkUpdateComments = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await fetch("/api/comments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, action, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update comments");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
    },
  });
};
