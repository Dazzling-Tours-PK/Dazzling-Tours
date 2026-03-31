import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateTourData,
  UpdateTourData,
  ToursResponse,
  TourResponse,
  TourLocationsResponse,
  TourDifficultiesResponse,
  TourActivitiesResponse,
  TourCategoriesResponse,
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
  difficulty?: string;
  highlights?: string;
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
        `/tours?${searchParams.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetTour = (id: string) => {
  return useQuery<TourResponse>({
    queryKey: tourKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TourResponse>(`/tours/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetTourBySlug = (slug: string) => {
  return useQuery<TourResponse>({
    queryKey: [...tourKeys.details(), "slug", slug],
    queryFn: async () => {
      const response = await api.get<TourResponse>(`/tours/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
};

export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation<TourResponse, Error, CreateTourData>({
    mutationFn: async (data) => {
      const response = await api.post<TourResponse>("/tours", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tourKeys.lists(),
        type: "all",
      });
    },
  });
};

export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation<TourResponse, Error, UpdateTourData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.patch<TourResponse>(
        `/tours/${_id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: tourKeys.lists(),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: tourKeys.detail(data.data._id),
        type: "all",
      });
    },
  });
};

export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(`/tours/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tourKeys.lists(),
        type: "all",
      });
    },
  });
};

export const useBulkUpdateTours = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { tourIds: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ tourIds, action, data }) => {
      const response = await api.put<{ success: boolean }>("/tours", {
        tourIds,
        action,
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tourKeys.lists(),
        type: "all",
      });
    },
  });
};

export const useGetTourLocations = (status?: string) => {
  return useQuery<TourLocationsResponse>({
    queryKey: [...tourKeys.all, "locations", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourLocationsResponse>(
        `/tours/locations?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetTourDifficulties = (status?: string) => {
  return useQuery<TourDifficultiesResponse>({
    queryKey: [...tourKeys.all, "difficulties", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourDifficultiesResponse>(
        `/tours/difficulties?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetTourActivities = (status?: string) => {
  return useQuery<TourActivitiesResponse>({
    queryKey: [...tourKeys.all, "activities", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourActivitiesResponse>(
        `/tours/activities?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetTourCategories = (status?: string) => {
  return useQuery<TourCategoriesResponse>({
    queryKey: [...tourKeys.all, "categories", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourCategoriesResponse>(
        `/tours/categories?${params.toString()}`,
      );
      return response.data;
    },
  });
};
