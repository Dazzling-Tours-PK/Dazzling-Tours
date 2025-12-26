import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateCategoryData,
  UpdateCategoryData,
  CategoryResponse,
  CategoriesResponse,
} from "@/lib/types/category";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: { page?: number; limit?: number; search?: string }) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Hook to get all categories
export const useGetCategories = (filters?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<CategoriesResponse>({
    queryKey: categoryKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.search) params.append("search", filters.search);

      const response = await api.get<CategoriesResponse>(
        `/api/categories?${params.toString()}`
      );
      return response.data;
    },
  });
};

// Hook to get a single category
export const useGetCategory = (id: string) => {
  return useQuery<CategoryResponse>({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CategoryResponse>(`/api/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook to create a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const response = await api.post<CategoryResponse>(
        "/api/categories",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Hook to update a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const { _id, ...updateData } = data;
      const response = await api.put<CategoryResponse>(
        `/api/categories/${_id}`,
        updateData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(data.data._id),
      });
      // Also invalidate tours and blogs since category name might have changed
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

// Hook to delete a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Also invalidate tours and blogs since they might have been updated to "Uncategorized"
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};
