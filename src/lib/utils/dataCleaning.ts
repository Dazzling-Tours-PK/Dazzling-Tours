/**
 * Utility function to clean data before saving to MongoDB
 * Removes empty strings and converts them to undefined, then removes undefined fields
 * to prevent MongoDB casting issues
 */
export function cleanDataForMongoDB<T extends Record<string, unknown>>(
  data: T,
  optionalFields: (keyof T)[] = []
): Partial<T> {
  const cleanedData = { ...data };

  // Convert empty strings to undefined for optional fields
  optionalFields.forEach((field) => {
    const fieldValue = cleanedData[field];
    if (
      fieldValue !== undefined &&
      typeof fieldValue === "string" &&
      fieldValue.trim() === ""
    ) {
      (cleanedData as Record<string, unknown>)[field as string] = undefined;
    }
  });

  // Remove undefined fields completely to avoid MongoDB casting issues
  Object.keys(cleanedData).forEach((key) => {
    if ((cleanedData as Record<string, unknown>)[key] === undefined) {
      delete (cleanedData as Record<string, unknown>)[key];
    }
  });

  return cleanedData as Partial<T>;
}

/**
 * Utility function specifically for testimonial data cleaning
 */
export function cleanTestimonialData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, ["tourId", "image", "location"]);
}

/**
 * Utility function specifically for tour data cleaning
 */
export function cleanTourData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, [
    "category",
    "location",
    "images",
    "highlights",
    "itinerary",
    "includes",
    "excludes",
    "shortDescription",
    "seo",
  ]);
}

/**
 * Utility function specifically for contact data cleaning
 */
export function cleanContactData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, ["phone", "subject", "message"]);
}

/**
 * Utility function specifically for blog data cleaning
 */
export function cleanBlogData(data: Record<string, unknown>) {
  // Don't include "seo" in optional fields - we want to preserve the SEO object structure
  // even if some fields are empty, as it's always expected to be present
  return cleanDataForMongoDB(data, [
    "category",
    "tags",
    "featuredImage",
    "excerpt",
  ]);
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  if (!title || title.trim() === "") return "";

  // Convert to lowercase and replace spaces/special chars
  let slug = title
    .toLowerCase()
    .trim()
    // Replace multiple spaces with single space
    .replace(/\s+/g, " ")
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace spaces with hyphens
    .replace(/\s+/g, "-")
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, "-")
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, "");

  // Limit length to 100 characters
  if (slug.length > 100) {
    slug = slug.substring(0, 100);
    // Remove trailing hyphen if exists
    slug = slug.replace(/-+$/, "");
  }

  return slug;
}

/**
 * Generate meta title from content data
 * Generic function that can be used for any content type (tours, blogs, products, etc.)
 *
 * @param title - The main title of the content
 * @param options - Optional configuration object
 * @param options.location - Location or context to append to the title
 * @param options.brandName - Brand name to append (default: "Dazzling Tours")
 * @param options.customTitle - Custom title to use instead of auto-generated
 * @param options.maxLength - Maximum length for the meta title (default: 60)
 * @returns Generated meta title optimized for SEO
 */

// Function overloads for backward compatibility
export function generateMetaTitle(
  title: string,
  location?: string,
  customTitle?: string
): string;
export function generateMetaTitle(
  title: string,
  options?: {
    location?: string;
    brandName?: string;
    customTitle?: string;
    maxLength?: number;
  }
): string;
export function generateMetaTitle(
  title: string,
  locationOrOptions?:
    | string
    | {
        location?: string;
        brandName?: string;
        customTitle?: string;
        maxLength?: number;
      },
  customTitle?: string
): string {
  // Support legacy signature: generateMetaTitle(title, location, customTitle)
  let location: string | undefined;
  let brandName: string | undefined;
  let finalCustomTitle: string | undefined;
  let maxLength = 60;

  if (locationOrOptions && typeof locationOrOptions === "object") {
    // New signature with options object
    location = locationOrOptions.location;
    brandName = locationOrOptions.brandName;
    finalCustomTitle = locationOrOptions.customTitle;
    maxLength = locationOrOptions.maxLength ?? 60;
  } else {
    // Legacy signature: generateMetaTitle(title, location?, customTitle?)
    location = locationOrOptions as string | undefined;
    finalCustomTitle = customTitle;
  }

  // Return custom title if provided
  if (finalCustomTitle && finalCustomTitle.trim() !== "")
    return finalCustomTitle;

  // Return empty if no title
  if (!title || typeof title !== "string" || title.trim() === "") return "";

  // Start with the trimmed title
  const trimmedTitle = title.trim();
  let metaTitle = trimmedTitle;

  // Add location if provided and not empty
  if (location && typeof location === "string" && location.trim() !== "") {
    metaTitle = `${metaTitle} | ${location.trim()}`;
  }

  // Add brand name if provided
  const finalBrandName = brandName || "Dazzling Tours";
  if (finalBrandName && finalBrandName.trim() !== "") {
    metaTitle = `${metaTitle} | ${finalBrandName.trim()}`;
  }

  // Limit to maxLength characters (optimal for SEO)
  if (metaTitle.length > maxLength) {
    const brandSuffix = finalBrandName ? ` | ${finalBrandName.trim()}` : "";
    const availableLength = maxLength - brandSuffix.length;

    if (location && typeof location === "string" && location.trim() !== "") {
      const locationPart = ` | ${location.trim()}`;
      const titleMaxLength = availableLength - locationPart.length;

      if (titleMaxLength > 0) {
        const truncatedTitle = trimmedTitle.substring(0, titleMaxLength);
        metaTitle = `${truncatedTitle}${locationPart}${brandSuffix}`;
      } else {
        // If even the title is too long, just use title + brand
        const titleMax = availableLength;
        metaTitle = `${trimmedTitle.substring(0, titleMax)}${brandSuffix}`;
      }
    } else {
      // No location, just truncate title
      const titleMax = availableLength;
      metaTitle = `${trimmedTitle.substring(0, titleMax)}${brandSuffix}`;
    }

    // Final safety check
    if (metaTitle.length > maxLength) {
      metaTitle = metaTitle.substring(0, maxLength - 3) + "...";
    }
  }

  return metaTitle;
}

/**
 * Generate meta description from content data
 * Generic function that can be used for any content type (tours, blogs, products, etc.)
 *
 * @param shortDescription - The main description text
 * @param options - Optional configuration object
 * @param options.location - Location or context to add
 * @param options.price - Price or cost value
 * @param options.duration - Duration or timeframe
 * @param options.customDescription - Custom description to use instead of auto-generated
 * @param options.maxLength - Maximum length for the meta description (default: 160)
 * @param options.locationPrefix - Custom prefix for location (default: "Located in")
 * @param options.durationPrefix - Custom prefix for duration (default: "Duration:")
 * @param options.pricePrefix - Custom prefix for price (default: "Starting from")
 * @param options.priceFormat - Function to format price (default: formats as currency)
 * @returns Generated meta description optimized for SEO
 */

// Function overloads for backward compatibility
export function generateMetaDescription(
  shortDescription: string,
  location?: string,
  price?: number,
  duration?: string,
  customDescription?: string
): string;
export function generateMetaDescription(
  shortDescription: string,
  options?: {
    location?: string;
    price?: number;
    duration?: string;
    customDescription?: string;
    maxLength?: number;
    locationPrefix?: string;
    durationPrefix?: string;
    pricePrefix?: string;
    priceFormat?: (price: number) => string;
  }
): string;
export function generateMetaDescription(
  shortDescription: string,
  locationOrOptions?:
    | string
    | {
        location?: string;
        price?: number;
        duration?: string;
        customDescription?: string;
        maxLength?: number;
        locationPrefix?: string;
        durationPrefix?: string;
        pricePrefix?: string;
        priceFormat?: (price: number) => string;
      },
  price?: number,
  duration?: string,
  customDescription?: string
): string {
  // Support legacy signature: generateMetaDescription(shortDescription, location, price, duration, customDescription)
  let location: string | undefined;
  let finalPrice: number | undefined;
  let finalDuration: string | undefined;
  let finalCustomDescription: string | undefined;
  let maxLength = 160;
  let locationPrefix = "Located in";
  let durationPrefix = "Duration:";
  let pricePrefix = "Starting from";
  let priceFormat: (price: number) => string = (p) => `$${p}`;

  if (locationOrOptions && typeof locationOrOptions === "object") {
    // New signature with options object
    location = locationOrOptions.location;
    finalPrice = locationOrOptions.price;
    finalDuration = locationOrOptions.duration;
    finalCustomDescription = locationOrOptions.customDescription;
    maxLength = locationOrOptions.maxLength ?? 160;
    locationPrefix = locationOrOptions.locationPrefix ?? locationPrefix;
    durationPrefix = locationOrOptions.durationPrefix ?? durationPrefix;
    pricePrefix = locationOrOptions.pricePrefix ?? pricePrefix;
    priceFormat = locationOrOptions.priceFormat ?? priceFormat;
  } else {
    // Legacy signature: generateMetaDescription(shortDescription, location?, price?, duration?, customDescription?)
    location = locationOrOptions as string | undefined;
    finalPrice = price;
    finalDuration = duration;
    finalCustomDescription = customDescription;
  }

  if (finalCustomDescription && finalCustomDescription.trim() !== "") {
    return finalCustomDescription;
  }

  if (
    !shortDescription ||
    typeof shortDescription !== "string" ||
    shortDescription.trim() === ""
  ) {
    return "";
  }

  let metaDesc = shortDescription.trim();

  // Add location if not already included
  if (location && typeof location === "string" && location.trim() !== "") {
    const locationLower = location.toLowerCase();
    if (!metaDesc.toLowerCase().includes(locationLower)) {
      metaDesc += ` ${locationPrefix} ${location.trim()}.`;
    }
  }

  // Add duration if available
  if (
    finalDuration &&
    typeof finalDuration === "string" &&
    finalDuration.trim() !== ""
  ) {
    metaDesc += ` ${durationPrefix} ${finalDuration.trim()}.`;
  }

  // Add price if available
  if (
    finalPrice !== undefined &&
    finalPrice !== null &&
    typeof finalPrice === "number" &&
    finalPrice > 0
  ) {
    const formattedPrice = priceFormat(finalPrice);
    metaDesc += ` ${pricePrefix} ${formattedPrice}.`;
  }

  // Limit to maxLength characters (optimal for SEO)
  if (metaDesc.length > maxLength) {
    metaDesc = metaDesc.substring(0, maxLength - 3) + "...";
  }

  return metaDesc;
}
