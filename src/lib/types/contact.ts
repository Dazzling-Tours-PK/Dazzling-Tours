import { PaginatedResponse, SingleResponse } from "./common";
import { ContactStatus } from "./enums";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
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
}

export interface UpdateContactData extends Partial<CreateContactData> {
  _id: string;
}

export type ContactsResponse = PaginatedResponse<Contact>;

export type ContactResponse = SingleResponse<Contact>;
