export enum TourStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export const TOUR_STATUS_OPTIONS = [
  { value: TourStatus.ACTIVE, label: "Active" },
  { value: TourStatus.INACTIVE, label: "Inactive" },
] as { value: TourStatus; label: string }[];

export enum TourDifficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export const TOUR_DIFFICULTY_OPTIONS = [
  { value: TourDifficulty.EASY, label: "Easy" },
  { value: TourDifficulty.MEDIUM, label: "Medium" },
  { value: TourDifficulty.HARD, label: "Hard" },
] as { value: TourDifficulty; label: string }[];

export enum TourPriceType {
  PER_PERSON = "Per Person",
  COUPLE = "Couple (2 Persons)",
  GROUP = "Group",
  PACKAGE = "Package",
}

export const TOUR_PRICE_TYPE_OPTIONS = [
  { value: TourPriceType.PER_PERSON, label: "Per Person" },
  { value: TourPriceType.COUPLE, label: "Couple (2 Persons)" },
  { value: TourPriceType.GROUP, label: "Group" },
  { value: TourPriceType.PACKAGE, label: "Package" },
] as { value: TourPriceType; label: string }[];
