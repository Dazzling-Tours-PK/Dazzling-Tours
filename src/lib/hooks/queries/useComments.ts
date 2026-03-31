import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateCommentData,
  UpdateCommentData,
  CommentsResponse,
  CommentResponse,
} from "@/lib/types/comment";

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...commentKeys.lists(), filters] as const,
  byBlog: (blogId: string) => [...commentKeys.all, "blog", blogId] as const,
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

      const response = await api.get<CommentsResponse>(
        `/comments?${searchParams.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetCommentsByBlog = (
  blogId: string,
  params?: {
    status?: string;
    includeReplies?: boolean;
  },
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

      const response = await api.get<CommentsResponse>(
        `/comments/blog/${blogId}?${searchParams.toString()}`,
      );
      return response.data;
    },
    enabled: !!blogId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, CreateCommentData>({
    mutationFn: async (data) => {
      const response = await api.post<CommentResponse>("/comments", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: commentKeys.byBlog(data.data.blogId._id),
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentResponse, Error, UpdateCommentData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.put<CommentResponse>(
        `/comments/${_id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: commentKeys.byBlog(data.data.blogId._id),
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/comments/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
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
      const response = await api.put<{ success: boolean }>("/comments", {
        ids,
        action,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
};
