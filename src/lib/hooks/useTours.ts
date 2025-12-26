import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateTourData,
  UpdateTourData,
  ToursResponse,
  TourResponse,
} from "@/lib/types/tour";

// Query Keys
export const tourKeys = {
  all: ["tours"] as const,
  lists: () => [...tourKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...tourKeys.lists(), filters] as const,
  details: () => [...tourKeys.all, "detail"] as const,
  detail: (id: string) => [...tourKeys.details(), id] as const,
};

// Hooks
export const useGetTours = (params?: {
  status?: string;
  featured?: boolean;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery<ToursResponse>({
    queryKey: tourKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<ToursResponse>(
        `/api/tours?${searchParams.toString()}`
      );
      return response.data;
    },
  });
};

export const useGetTour = (id: string) => {
  return useQuery<TourResponse>({
    queryKey: tourKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TourResponse>(`/api/tours/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetTourBySlug = (slug: string) => {
  return useQuery<TourResponse>({
    queryKey: [...tourKeys.details(), "slug", slug],
    queryFn: async () => {
      const response = await api.get<TourResponse>(`/api/tours/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation<TourResponse, Error, CreateTourData>({
    mutationFn: async (data) => {
      const response = await api.post<TourResponse>("/api/tours", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
    },
  });
};

export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation<TourResponse, Error, UpdateTourData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.patch<TourResponse>(
        `/api/tours/${_id}`,
        updateData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tourKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/api/tours/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
    },
  });
};

export const useBulkUpdateTours = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await api.put<{ success: boolean }>("/api/tours", {
        ids,
        action,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
    },
  });
};
