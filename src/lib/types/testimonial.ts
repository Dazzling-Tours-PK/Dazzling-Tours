import { PaginatedResponse, SingleResponse } from "./common";
import {
  TestimonialStatus,
  TestimonialSource,
} from "@/lib/enums/testimonial";

export interface Testimonial {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  content: string;
  rating: number;
  image?: string;
  designation?: string;
  location?: string;
  tourId?: {
    _id: string;
    title: string;
  };
  status: TestimonialStatus;
  source: TestimonialSource;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  name: string;
  email?: string;
  phone?: string;
  content: string;
  rating: number;
  image?: string;
  designation?: string;
  location?: string;
  tourId?: string;
  status?: TestimonialStatus;
  source?: TestimonialSource;
  featured?: boolean;
}

export interface UpdateTestimonialData extends Partial<CreateTestimonialData> {
  _id: string;
}

export type TestimonialsResponse = PaginatedResponse<Testimonial>;

export type TestimonialResponse = SingleResponse<Testimonial>;
