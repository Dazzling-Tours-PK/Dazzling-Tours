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
  difficulty?: string;
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
        `/api/tours?${searchParams.toString()}`,
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
        `/api/tours/${_id}`,
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
      const response = await api.delete<{ success: boolean }>(
        `/api/tours/${id}`,
      );
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
      const response = await api.put<{ success: boolean }>("/api/tours", {
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

// Hook to get unique tour locations
export interface TourLocation {
  name: string;
  count: number;
}

export interface TourLocationsResponse {
  success: boolean;
  data: TourLocation[];
  total: number;
}

export const useGetTourLocations = (status?: string) => {
  return useQuery<TourLocationsResponse>({
    queryKey: [...tourKeys.all, "locations", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourLocationsResponse>(
        `/api/tours/locations?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export interface TourDifficultyData {
  value: string;
  label: string;
  count: number;
}

export interface TourDifficultiesResponse {
  success: boolean;
  data: TourDifficultyData[];
  total: number;
}

export const useGetTourDifficulties = (status?: string) => {
  return useQuery<TourDifficultiesResponse>({
    queryKey: [...tourKeys.all, "difficulties", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourDifficultiesResponse>(
        `/api/tours/difficulties?${params.toString()}`,
      );
      return response.data;
    },
  });
};

export interface TourActivity {
  name: string;
  count: number;
}

export interface TourActivitiesResponse {
  success: boolean;
  data: TourActivity[];
  total: number;
}

export const useGetTourActivities = (status?: string) => {
  return useQuery<TourActivitiesResponse>({
    queryKey: [...tourKeys.all, "activities", status || "all"],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) {
        params.append("status", status);
      }

      const response = await api.get<TourActivitiesResponse>(
        `/api/tours/activities?${params.toString()}`,
      );
      return response.data;
    },
  });
};
