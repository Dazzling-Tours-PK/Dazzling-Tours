import { PaginatedResponse, SingleResponse } from "./common";
import { TourPriceType, TourStatus } from "../enums/tour";
import { SEOFields } from "./seo";

export interface Tour {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  priceType: TourPriceType;
  duration: string;
  location: string;
  category: string;
  images: string[];
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  includes: string[];
  excludes: string[];
  difficulty: string;
  groupSize: number;
  rating: number;
  reviews: number;
  featured: boolean;
  status: TourStatus;
  // SEO fields
  seo?: SEOFields;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourData {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  priceType?: string;
  duration: string;
  location: string;
  category: string;
  images: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  includes?: string[];
  excludes?: string[];
  difficulty?: string;
  groupSize?: number;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  status?: TourStatus;
  // SEO fields
  seo?: SEOFields;
}

export interface UpdateTourData extends Partial<CreateTourData> {
  _id: string;
}

export type ToursResponse = PaginatedResponse<Tour>;

export type TourResponse = SingleResponse<Tour>;
