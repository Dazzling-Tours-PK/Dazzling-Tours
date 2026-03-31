import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";
import { DashboardStatsResponse } from "@/lib/types/dashboard";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

// Hook to get dashboard statistics
export const useGetDashboardStats = () => {
  return useQuery<DashboardStatsResponse>({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response =
        await api.get<DashboardStatsResponse>("/admin/stats");
      return response.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};
