import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import { ApiResponse } from "@/lib/types";
import { SeedData } from "@/lib/types/admin";

export const useAdminSeed = () => {
  return useMutation({
    mutationFn: async () => {
      // Check if already seeded in this browser to avoid unnecessary calls
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("admin_seeded") === "true"
      ) {
        return {
          success: true,
          message: "Already seeded in this browser",
        } as ApiResponse<SeedData>;
      }

      const response = await api.post<ApiResponse<SeedData>>(
        "/auth/seed",
        {},
        {
          headers: {
            "x-seed-secret": process.env.NEXT_PUBLIC_SEED_SECRET || "",
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && typeof window !== "undefined") {
        localStorage.setItem("admin_seeded", "true");
      }
    },
    onError: (error) => {
      console.error("Automated admin seeding failed:", error);
    },
  });
};
