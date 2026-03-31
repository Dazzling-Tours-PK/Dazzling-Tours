import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateContactData,
  UpdateContactData,
  ContactsResponse,
  ContactResponse,
  ContactStatsResponse,
} from "@/lib/types/contact";

// Query Keys
export const contactKeys = {
  all: ["contact"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, "detail"] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
  stats: () => [...contactKeys.all, "stats"] as const,
};

// Hooks
export const useGetContactInquiries = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery<ContactsResponse>({
    queryKey: contactKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<ContactsResponse>(
        `/contact?${searchParams.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetContactInquiry = (id: string) => {
  return useQuery<ContactResponse>({
    queryKey: contactKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<ContactResponse>(`/contact/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useGetContactStats = () => {
  return useQuery<ContactStatsResponse>({
    queryKey: contactKeys.stats(),
    queryFn: async () => {
      const response =
        await api.get<ContactStatsResponse>("/contact/stats");
      return response.data;
    },
  });
};

export const useCreateContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactResponse, Error, CreateContactData>({
    mutationFn: async (data) => {
      const response = await api.post<ContactResponse>("/contact", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.stats(),
        type: "all",
      });
    },
  });
};

export const useUpdateContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactResponse, Error, UpdateContactData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.put<ContactResponse>(
        `/contact/${_id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(data.data._id),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.stats(),
        type: "all",
      });
    },
  });
};

export const useDeleteContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/contact/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.stats(),
        type: "all",
      });
    },
  });
};

export const useBulkUpdateContactInquiries = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await api.put<{ success: boolean }>("/contact", {
        ids,
        action,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contactKeys.lists(),
        type: "all",
      });
      queryClient.invalidateQueries({
        queryKey: contactKeys.stats(),
        type: "all",
      });
    },
  });
};
