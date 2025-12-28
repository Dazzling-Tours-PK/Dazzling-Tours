export enum TestimonialStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export const TESTIMONIAL_STATUS_OPTIONS = [
  { value: TestimonialStatus.ACTIVE, label: "Active" },
  { value: TestimonialStatus.INACTIVE, label: "Inactive" },
] as { value: TestimonialStatus; label: string }[];

