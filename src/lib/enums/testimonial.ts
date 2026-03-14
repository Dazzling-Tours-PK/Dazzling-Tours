export enum TestimonialStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
}

export enum TestimonialSource {
  PUBLIC = "Public",
  ADMIN = "Admin",
}

export const TESTIMONIAL_STATUS_OPTIONS = [
  { value: TestimonialStatus.ACTIVE, label: "Active" },
  { value: TestimonialStatus.INACTIVE, label: "Inactive" },
  { value: TestimonialStatus.PENDING, label: "Pending" },
] as { value: TestimonialStatus; label: string }[];

export const TESTIMONIAL_SOURCE_OPTIONS = [
  { value: TestimonialSource.PUBLIC, label: "Public" },
  { value: TestimonialSource.ADMIN, label: "Admin" },
] as { value: TestimonialSource; label: string }[];
