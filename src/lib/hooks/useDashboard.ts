import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/privateAxios";

export interface DashboardStats {
  tours: {
    total: number;
    published: number;
    featured: number;
  };
  blogs: {
    total: number;
    published: number;
    featured: number;
  };
  contacts: {
    total: number;
    new: number;
  };
  campaigns: {
    total: number;
    sent: number;
  };
  newsletters: {
    total: number;
    active: number;
  };
  testimonials: {
    total: number;
    published: number;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

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
        await api.get<DashboardStatsResponse>("/api/admin/stats");
      return response.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};
