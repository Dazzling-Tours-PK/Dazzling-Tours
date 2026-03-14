import { PaginatedResponse, SingleResponse } from "./common";
import { ContactStatus, ContactGroupType } from "./enums";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  tourId?: string;
  startDate?: string;
  endDate?: string;
  participants?: number;
  groupType?: ContactGroupType;
  numberOfDays?: number;
  numberOfRooms?: number;
  departureCity?: string;
  placesToVisit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: ContactStatus;
  tourId?: string;
  startDate?: string;
  endDate?: string;
  participants?: number;
  groupType?: ContactGroupType;
  numberOfDays?: number;
  numberOfRooms?: number;
  departureCity?: string;
  placesToVisit?: string;
}

export interface UpdateContactData extends Partial<CreateContactData> {
  _id: string;
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

export type ContactsResponse = PaginatedResponse<Contact>;

export type ContactResponse = SingleResponse<Contact>;
