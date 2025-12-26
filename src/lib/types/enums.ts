// Campaign Template Types
export enum CampaignTemplateType {
  NEWSLETTER = "newsletter",
  PROMOTION = "promotion",
  CUSTOM = "custom",
}

// Campaign Status Types
export enum CampaignStatus {
  DRAFT = "Draft",
  SCHEDULED = "Scheduled",
  SENDING = "Sending",
  SENT = "Sent",
  FAILED = "Failed",
}

// Campaign Recipient Types
export enum CampaignRecipientType {
  ALL = "all",
  ACTIVE = "active",
  CUSTOM = "custom",
}

// Contact Status Types
export enum ContactStatus {
  NEW = "New",
  READ = "Read",
  REPLIED = "Replied",
  CLOSED = "Closed",
}

// Helper functions to get enum values as arrays
export const getCampaignTemplateTypes = (): Array<{
  value: CampaignTemplateType;
  label: string;
}> => {
  return [
    { value: CampaignTemplateType.NEWSLETTER, label: "Newsletter" },
    { value: CampaignTemplateType.PROMOTION, label: "Promotion" },
    { value: CampaignTemplateType.CUSTOM, label: "Custom" },
  ];
};

export const getCampaignStatuses = (): Array<{
  value: CampaignStatus;
  label: string;
}> => {
  return [
    { value: CampaignStatus.DRAFT, label: "Draft" },
    { value: CampaignStatus.SCHEDULED, label: "Scheduled" },
    { value: CampaignStatus.SENDING, label: "Sending" },
    { value: CampaignStatus.SENT, label: "Sent" },
    { value: CampaignStatus.FAILED, label: "Failed" },
  ];
};

export const getCampaignRecipientTypes = (): Array<{
  value: CampaignRecipientType;
  label: string;
}> => {
  return [
    { value: CampaignRecipientType.ALL, label: "All Subscribers" },
    { value: CampaignRecipientType.ACTIVE, label: "Active Subscribers Only" },
    { value: CampaignRecipientType.CUSTOM, label: "Custom Email List" },
  ];
};

export const getContactStatuses = (): Array<{
  value: ContactStatus;
  label: string;
}> => {
  return [
    { value: ContactStatus.NEW, label: "New" },
    { value: ContactStatus.READ, label: "Read" },
    { value: ContactStatus.REPLIED, label: "Replied" },
    { value: ContactStatus.CLOSED, label: "Closed" },
  ];
};
