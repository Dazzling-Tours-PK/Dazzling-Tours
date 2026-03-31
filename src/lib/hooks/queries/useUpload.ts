import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import { UploadResponse } from "@/lib/types/upload";

export const useUploadImages = () => {
  return useMutation<UploadResponse, Error, FormData>({
    mutationFn: async (formData) => {
      const response = await api.post<UploadResponse>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds for image upload
      });
      return response.data;
    },
  });
};

export const useDeleteImage = () => {
  return useMutation<
    { success: boolean; message: string },
    Error,
    { url?: string; publicId?: string }
  >({
    mutationFn: async ({ url, publicId }) => {
      const params = new URLSearchParams();
      if (url) params.append("url", url);
      if (publicId) params.append("publicId", publicId);

      const response = await api.delete<{ success: boolean; message: string }>(
        `/upload?${params.toString()}`,
      );
      return response.data;
    },
  });
};
