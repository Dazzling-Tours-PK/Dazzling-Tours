import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import { Pagination } from "@/lib/types/common";

// Types
export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateContactData extends Partial<CreateContactData> {
  _id: string;
  status?: string;
}

export interface ContactResponse {
  success: boolean;
  data: ContactInquiry[];
  pagination?: Pagination;
}

export interface ContactInquiryResponse {
  success: boolean;
  data: ContactInquiry;
}

export interface ContactStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: Record<string, number>;
    recentActivity: number;
    monthlyTrends: Array<{ month: string; count: number }>;
  };
}

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
  return useQuery<ContactResponse>({
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

      const response = await api.get<ContactResponse>(
        `/api/contact?${searchParams.toString()}`,
      );
      return response.data;
    },
  });
};

export const useGetContactInquiry = (id: string) => {
  return useQuery<ContactInquiryResponse>({
    queryKey: contactKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<ContactInquiryResponse>(
        `/api/contact/${id}`,
      );
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
        await api.get<ContactStatsResponse>("/api/contact/stats");
      return response.data;
    },
  });
};

export const useCreateContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactInquiryResponse, Error, CreateContactData>({
    mutationFn: async (data) => {
      const response = await api.post<ContactInquiryResponse>(
        "/api/contact",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};

export const useUpdateContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactInquiryResponse, Error, UpdateContactData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.put<ContactInquiryResponse>(
        `/api/contact/${_id}`,
        updateData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(data.data._id),
      });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};

export const useDeleteContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/api/contact/${id}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
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
      const response = await api.put<{ success: boolean }>("/api/contact", {
        ids,
        action,
        ...data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};
