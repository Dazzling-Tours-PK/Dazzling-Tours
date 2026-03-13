import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadResponse {
  success: boolean;
  data: UploadResult[];
  count: number;
}

export const useUploadImages = () => {
  return useMutation<UploadResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const response = await api.post<UploadResponse>("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};

export const useDeleteImage = () => {
  return useMutation<{ success: boolean; message: string }, Error, { url?: string; publicId?: string }>({
    mutationFn: async ({ url, publicId }) => {
      const params = new URLSearchParams();
      if (url) params.append("url", url);
      if (publicId) params.append("publicId", publicId);

      const response = await api.delete<{ success: boolean; message: string }>(
        `/api/upload?${params.toString()}`,
      );
      return response.data;
    },
  });
};
