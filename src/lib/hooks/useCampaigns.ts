import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import {
  CreateCampaignData,
  UpdateCampaignData,
  CampaignResponse,
  CampaignsResponse,
} from "@/lib/types/campaign";

// Query Keys
export const campaignKeys = {
  all: ["campaigns"] as const,
  lists: () => [...campaignKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, "detail"] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
};

// Hooks
export const useGetCampaigns = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<CampaignsResponse>({
    queryKey: campaignKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get<CampaignsResponse>(
        `/api/campaigns?${searchParams.toString()}`
      );
      return response.data;
    },
  });
};

export const useGetCampaign = (id: string) => {
  return useQuery<CampaignResponse>({
    queryKey: campaignKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CampaignResponse>(`/api/campaigns/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<CampaignResponse, Error, CreateCampaignData>({
    mutationFn: async (data) => {
      const response = await api.post<CampaignResponse>("/api/campaigns", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<CampaignResponse, Error, UpdateCampaignData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await api.put<CampaignResponse>(
        `/api/campaigns/${_id}`,
        updateData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: campaignKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<{ success: boolean }>(
        `/api/campaigns/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
    },
  });
};

export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation<
    {
      success: boolean;
      message: string;
      data: { totalRecipients: number; campaignId: string };
    },
    Error,
    string
  >({
    mutationFn: async (id) => {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: { totalRecipients: number; campaignId: string };
      }>(`/api/campaigns/${id}/send`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: campaignKeys.detail(data.data.campaignId),
      });
    },
  });
};
