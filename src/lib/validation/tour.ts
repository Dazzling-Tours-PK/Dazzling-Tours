import { z } from "zod";
import { TourStatus } from "../enums/tour";

// Utility function to strip HTML tags and get plain text length
const stripHtmlTags = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Base tour validation schema
export const tourSchema = z.object({
  title: z
    .string()
    .min(1, "Tour title is required")
    .min(3, "Tour title must be at least 3 characters")
    .max(100, "Tour title must be less than 100 characters")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .refine(
      (val) => {
        const textContent = stripHtmlTags(val);
        return textContent.length >= 10;
      },
      { message: "Description must be at least 10 characters" },
    )
    .refine(
      (val) => {
        const textContent = stripHtmlTags(val);
        return textContent.length <= 2000;
      },
      { message: "Description must be less than 2000 characters" },
    ),

  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .min(10, "Short description must be at least 10 characters")
    .max(200, "Short description must be less than 200 characters")
    .trim(),

  price: z.number().min(0, "Price must be greater than or equal to 0"),

  priceType: z
    .enum(["Per Person", "Couple (2 Persons)", "Group", "Package"], {
      message:
        "Price type must be Per Person, Couple (2 Persons), Group, or Package",
    })
    .default("Per Person"),

  duration: z
    .string()
    .min(1, "Duration is required")
    .min(2, "Duration must be at least 2 characters")
    .max(50, "Duration must be less than 50 characters")
    .trim(),

  location: z
    .string()
    .min(1, "Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters")
    .trim(),

  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (val) => {
        const trimmed = val.trim();
        return trimmed.length >= 2;
      },
      { message: "Category must be at least 2 characters" },
    )
    .refine(
      (val) => {
        const trimmed = val.trim();
        return trimmed.length <= 50;
      },
      { message: "Category must be less than 50 characters" },
    )
    .transform((val) => val.trim()),

  images: z
    .array(
      z.string().refine(
        (val) => {
          // Reject data URLs - only accept HTTP/HTTPS URLs (Cloudinary URLs)
          if (val.startsWith("data:")) return false;
          return val.startsWith("http://") || val.startsWith("https://");
        },
        { message: "Only Cloudinary URLs (HTTP/HTTPS) are allowed" },
      ),
    )
    .optional()
    .default([]),

  highlights: z
    .array(z.string().min(1, "Highlight cannot be empty").trim())
    .max(10, "Maximum 10 highlights allowed")
    .optional()
    .default([]),

  itinerary: z
    .array(
      z.object({
        day: z
          .number()
          .min(1, "Day must be at least 1")
          .max(365, "Day must be less than 365"),
        title: z
          .string()
          .min(1, "Itinerary title is required")
          .refine(
            (val) => {
              const trimmed = val.trim();
              return trimmed.length >= 3;
            },
            { message: "Itinerary title must be at least 3 characters" },
          )
          .refine(
            (val) => {
              const trimmed = val.trim();
              return trimmed.length <= 100;
            },
            { message: "Itinerary title must be less than 100 characters" },
          )
          .transform((val) => val.trim()),
        description: z
          .string()
          .min(1, "Itinerary description is required")
          .refine(
            (val) => {
              const trimmed = val.trim();
              return trimmed.length >= 10;
            },
            { message: "Itinerary description must be at least 10 characters" },
          )
          .refine(
            (val) => {
              const trimmed = val.trim();
              return trimmed.length <= 500;
            },
            {
              message: "Itinerary description must be less than 500 characters",
            },
          )
          .transform((val) => val.trim()),
      }),
    )
    .max(30, "Maximum 30 itinerary days allowed")
    .optional()
    .default([]),

  includes: z
    .array(z.string().min(1, "Include item cannot be empty").trim())
    .max(15, "Maximum 15 include items allowed")
    .optional()
    .default([]),

  excludes: z
    .array(z.string().min(1, "Exclude item cannot be empty").trim())
    .optional()
    .default([]),

  difficulty: z
    .enum(["Easy", "Medium", "Hard"], {
      message: "Difficulty must be Easy, Medium, or Hard",
    })
    .default("Easy"),

  groupSize: z
    .number()
    .min(1, "Group size must be at least 1")
    .max(100, "Group size must be less than 100")
    .default(10),

  rating: z
    .number()
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5")
    .default(0),

  reviews: z.number().min(0, "Reviews count must be at least 0").default(0),

  featured: z.boolean().default(false),

  status: z
    .enum(
      [
        TourStatus.ACTIVE,
        TourStatus.INACTIVE,
        TourStatus.DRAFT,
        TourStatus.ARCHIVED,
      ],
      {
        message: "Status must be Active, Inactive, Draft, or Archived",
      },
    )
    .default(TourStatus.ACTIVE),

  // SEO fields (optional)
  seo: z
    .object({
      metaTitle: z
        .string()
        .max(60, "Meta title should be 60 characters or less")
        .trim()
        .optional(),
      metaDescription: z
        .string()
        .max(160, "Meta description should be 160 characters or less")
        .trim()
        .optional(),
      slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(100, "Slug must be less than 100 characters")
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug can only contain lowercase letters, numbers, and hyphens",
        )
        .trim()
        .optional(),
      focusKeyword: z
        .string()
        .max(50, "Focus keyword must be less than 50 characters")
        .trim()
        .optional(),
      ogImage: z
        .string()
        .refine(
          (val) => {
            if (!val || val.trim() === "") return true; // Allow empty for optional field
            try {
              new URL(val);
              return true;
            } catch {
              return false;
            }
          },
          { message: "Invalid OG image URL" },
        )
        .optional(),
    })
    .optional(),
});

// Schema for creating a new tour
export const createTourSchema = tourSchema;

// Schema for updating a tour (all fields optional except _id)
export const updateTourSchema = tourSchema.partial().extend({
  _id: z.string().min(1, "Tour ID is required"),
});

// Type inference from schemas
export type TourFormData = z.infer<typeof tourSchema>;
export type CreateTourFormData = z.infer<typeof createTourSchema>;
export type UpdateTourFormData = z.infer<typeof updateTourSchema>;

// Validation helper functions
export const validateTourData = (data: unknown) => {
  return tourSchema.safeParse(data);
};

export const validateCreateTourData = (data: unknown) => {
  return createTourSchema.safeParse(data);
};

export const validateUpdateTourData = (data: unknown) => {
  return updateTourSchema.safeParse(data);
};

// Field-specific validation functions
export const validateTitle = (title: string) => {
  return tourSchema.shape.title.safeParse(title);
};

export const validatePrice = (price: number) => {
  return tourSchema.shape.price.safeParse(price);
};

export const validateDescription = (description: string) => {
  return tourSchema.shape.description.safeParse(description);
};

export const validateShortDescription = (shortDescription: string) => {
  return tourSchema.shape.shortDescription.safeParse(shortDescription);
};

export const validateDuration = (duration: string) => {
  return tourSchema.shape.duration.safeParse(duration);
};

export const validateLocation = (location: string) => {
  return tourSchema.shape.location.safeParse(location);
};

export const validateCategory = (category: string) => {
  return tourSchema.shape.category.safeParse(category);
};

export const validateHighlights = (highlights: string[]) => {
  return tourSchema.shape.highlights.safeParse(highlights);
};

export const validateIncludes = (includes: string[]) => {
  return tourSchema.shape.includes.safeParse(includes);
};

export const validateExcludes = (excludes: string[]) => {
  return tourSchema.shape.excludes.safeParse(excludes);
};

export const validateItinerary = (
  itinerary: Array<{ day: number; title: string; description: string }>,
) => {
  return tourSchema.shape.itinerary.safeParse(itinerary);
};

export const validateGroupSize = (groupSize: number) => {
  return tourSchema.shape.groupSize.safeParse(groupSize);
};

export const validateRating = (rating: number) => {
  return tourSchema.shape.rating.safeParse(rating);
};
