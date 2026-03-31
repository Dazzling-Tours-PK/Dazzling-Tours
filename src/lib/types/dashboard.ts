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
