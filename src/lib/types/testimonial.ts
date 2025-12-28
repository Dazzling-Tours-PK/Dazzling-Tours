import { PaginatedResponse, SingleResponse } from "./common";
import { TestimonialStatus } from "@/lib/enums/testimonial";

export interface Testimonial {
  _id: string;
  name: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  tourId?: {
    _id: string;
    title: string;
  };
  status: TestimonialStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  name: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  tourId?: string;
  status?: TestimonialStatus;
  featured?: boolean;
}

export interface UpdateTestimonialData extends Partial<CreateTestimonialData> {
  _id: string;
}

export type TestimonialsResponse = PaginatedResponse<Testimonial>;

export type TestimonialResponse = SingleResponse<Testimonial>;
