import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/lib/types";

export interface SeedData {
  email: string;
  role: string;
  emailSent: boolean;
}

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

      const response = await axios.post<ApiResponse<SeedData>>(
        "/api/auth/seed",
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
