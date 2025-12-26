import {
  CampaignTemplateType,
  CampaignStatus,
  CampaignRecipientType,
} from "./enums";

// Campaign Types
export interface Campaign {
  _id: string;
  title: string;
  subject: string;
  content: string;
  templateType: CampaignTemplateType;
  status: CampaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  recipients: {
    type: CampaignRecipientType;
    emails?: string[];
  };
  stats: {
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    failed: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignData {
  title: string;
  subject: string;
  content: string;
  templateType?: CampaignTemplateType;
  scheduledAt?: string;
  recipients: {
    type: CampaignRecipientType;
    emails?: string[];
  };
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  _id: string;
  status?: CampaignStatus;
}

export interface CampaignResponse {
  success: boolean;
  data: Campaign;
  message?: string;
}

import { Pagination } from "./common";

export interface CampaignsResponse {
  success: boolean;
  data: Campaign[];
  pagination?: Pagination;
}
