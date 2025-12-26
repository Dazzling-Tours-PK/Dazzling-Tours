// Newsletter Types
export interface Newsletter {
  _id: string;
  email: string;
  status: "Active" | "Unsubscribed";
  subscribedAt: string;
  unsubscribedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsletterData {
  email: string;
  status?: "Active" | "Unsubscribed";
}

export interface UpdateNewsletterData {
  _id: string;
  email?: string;
  status?: "Active" | "Unsubscribed";
}

export interface NewsletterResponse {
  success: boolean;
  data: Newsletter;
  message?: string;
}

import { Pagination } from "./common";

export interface NewslettersResponse {
  success: boolean;
  data: Newsletter[];
  pagination?: Pagination;
}

export interface NewsletterStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    unsubscribed: number;
    recentSubscriptions: number;
    monthlyTrends: Array<{ month: string; count: number }>;
  };
}
