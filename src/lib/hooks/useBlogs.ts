import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateBlogData,
  UpdateBlogData,
  BlogsResponse,
  BlogResponse,
} from "@/lib/types/blog";

// Query Keys
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

// Hooks
export const useGetBlogs = (params?: {
  status?: string;
  featured?: boolean;
  category?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<BlogsResponse>({
    queryKey: blogKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<BlogsResponse>(
        `/api/blogs?${searchParams.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetBlog = (id: string) => {
  return useQuery<BlogResponse>({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<BlogResponse>(`/api/blogs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<BlogResponse, Error, CreateBlogData>({
    mutationFn: async (data) => {
      const response = await api.post<BlogResponse>("/api/blogs", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<BlogResponse, Error, UpdateBlogData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.patch<BlogResponse>(
        `/api/blogs/${_id}`,
        updateData,
      );
      return response.data;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: blogKeys.lists() });

      // Snapshot all previous queries
      const previousQueries: Array<{
        queryKey: readonly unknown[];
        data: BlogsResponse | undefined;
      }> = [];

      // Get all matching queries and snapshot them
      queryClient
        .getQueryCache()
        .findAll({ queryKey: blogKeys.lists() })
        .forEach((query) => {
          const data = queryClient.getQueryData<BlogsResponse>(query.queryKey);
          previousQueries.push({ queryKey: [...query.queryKey], data });

          // Optimistically update each matching query - only update the featured field
          if (data) {
            queryClient.setQueryData<BlogsResponse>(query.queryKey, {
              ...data,
              data: data.data.map((blog) =>
                blog._id === newData._id
                  ? { ...blog, featured: newData.featured ?? blog.featured }
                  : blog,
              ),
            });
          }
        });

      // Return context with the snapshotted values
      return { previousQueries };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, roll back all queries
      if (
        context &&
        typeof context === "object" &&
        context !== null &&
        "previousQueries" in context
      ) {
        const ctx = context as {
          previousQueries: Array<{
            queryKey: readonly unknown[];
            data: BlogsResponse | undefined;
          }>;
        };
        if (Array.isArray(ctx.previousQueries)) {
          ctx.previousQueries.forEach((item) => {
            if (item.data) {
              queryClient.setQueryData(item.queryKey, item.data);
            }
          });
        }
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/api/blogs/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};


