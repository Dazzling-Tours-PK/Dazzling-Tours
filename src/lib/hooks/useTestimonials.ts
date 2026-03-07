import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateTestimonialData,
  UpdateTestimonialData,
  TestimonialsResponse,
  TestimonialResponse,
} from "@/lib/types/testimonial";

// Query Keys
export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...testimonialKeys.lists(), filters] as const,
  details: () => [...testimonialKeys.all, "detail"] as const,
  detail: (id: string) => [...testimonialKeys.details(), id] as const,
};

// Hooks
export const useGetTestimonials = (params?: {
  status?: string;
  featured?: boolean;
  tourId?: string;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<TestimonialsResponse>({
    queryKey: testimonialKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<TestimonialsResponse>(
        `/api/testimonials?${searchParams.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetTestimonial = (id: string) => {
  return useQuery<TestimonialResponse>({
    queryKey: testimonialKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TestimonialResponse>(
        `/api/testimonials/${id}`,
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation<TestimonialResponse, Error, CreateTestimonialData>({
    mutationFn: async (data) => {
      const response = await api.post<TestimonialResponse>(
        "/api/testimonials",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation<TestimonialResponse, Error, UpdateTestimonialData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.put<TestimonialResponse>(
        `/api/testimonials/${_id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/api/testimonials/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
    },
  });
};

export const useBulkUpdateTestimonials = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await api.put<{ success: boolean }>(
        "/api/testimonials",
        { ids, action, ...data },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
    },
  });
};
