/**
 * Utility functions for image URL validation and filtering
 *
 * IMPORTANT: Only Cloudinary URLs (or other HTTP/HTTPS URLs) should be stored.
 * Data URLs (base64 encoded images) are NOT allowed and will be filtered out.
 */

/**
 * Check if a string is a data URL (base64 encoded image)
 * Data URLs start with "data:" and should NOT be stored in MongoDB
 */
export function isDataUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith("data:");
}

/**
 * Check if a URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("cloudinary.com") ||
      urlObj.hostname.includes("res.cloudinary.com")
    );
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid HTTP/HTTPS URL (not a data URL)
 * Accepts Cloudinary URLs and other valid HTTP/HTTPS URLs
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  // Reject data URLs - these should never be stored
  if (isDataUrl(url)) return false;

  // Check if it's a valid URL
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols (Cloudinary uses https)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Filter out data URLs from an array of image URLs
 * Only keeps valid HTTP/HTTPS URLs (Cloudinary URLs, etc.)
 */
export function filterValidImageUrls(
  urls: (string | undefined | null)[]
): string[] {
  if (!Array.isArray(urls)) return [];

  return urls
    .filter((url): url is string => {
      return typeof url === "string" && url.trim().length > 0;
    })
    .filter((url) => isValidImageUrl(url));
}

/**
 * Filter out data URLs from a single image URL
 * Returns the URL if valid, or empty string if not
 */
export function filterValidImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  if (!isValidImageUrl(url)) return "";
  return url.trim();
}
