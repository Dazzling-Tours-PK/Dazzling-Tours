import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateNewsletterData,
  UpdateNewsletterData,
  NewsletterResponse,
  NewslettersResponse,
  NewsletterStatsResponse,
} from "@/lib/types/newsletter";

// Query Keys
export const newsletterKeys = {
  all: ["newsletter"] as const,
  lists: () => [...newsletterKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...newsletterKeys.lists(), filters] as const,
  details: () => [...newsletterKeys.all, "detail"] as const,
  detail: (id: string) => [...newsletterKeys.details(), id] as const,
  stats: () => [...newsletterKeys.all, "stats"] as const,
};

// Hooks
export const useGetNewsletters = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<NewslettersResponse>({
    queryKey: newsletterKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<NewslettersResponse>(
        `/api/newsletter?${searchParams.toString()}`
      );
      return response.data;
    },
  });
};

export const useGetNewsletter = (id: string) => {
  return useQuery<NewsletterResponse>({
    queryKey: newsletterKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<NewsletterResponse>(
        `/api/newsletter/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetNewsletterStats = () => {
  return useQuery<NewsletterStatsResponse>({
    queryKey: newsletterKeys.stats(),
    queryFn: async () => {
      const response = await api.get<NewsletterStatsResponse>(
        "/api/newsletter/stats"
      );
      return response.data;
    },
  });
};

export const useSubscribeNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<NewsletterResponse, Error, CreateNewsletterData>({
    mutationFn: async (data) => {
      const response = await api.post<NewsletterResponse>(
        "/api/newsletter",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useUpdateNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<NewsletterResponse, Error, UpdateNewsletterData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.put<NewsletterResponse>(
        `/api/newsletter/${_id}`,
        updateData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: newsletterKeys.detail(data.data._id),
      });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useDeleteNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/api/newsletter/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useBulkUpdateNewsletters = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await api.put<{ success: boolean }>("/api/newsletter", {
        ids,
        action,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};
