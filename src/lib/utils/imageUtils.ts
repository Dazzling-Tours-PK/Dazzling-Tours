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
  urls: (string | undefined | null)[],
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
/**
 * Extract Cloudinary public ID from a secure URL
 * Example: https://res.cloudinary.com/cloud-name/image/upload/v12345/folder/image_id.jpg
 * Returns: "folder/image_id"
 */
export function extractPublicId(url: string): string | null {
  if (!url || typeof url !== "string" || !isCloudinaryUrl(url)) return null;

  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud-name/image/upload/v12345/public_id.ext
    // We need to handle folders as well: .../upload/v12345/folder/subfolder/public_id.ext

    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) return null;

    // The public ID starts after the version (v12345) or immediately after 'upload' if no version
    let startIndex = uploadIndex + 1;
    if (
      parts[startIndex].startsWith("v") &&
      /^\d+$/.test(parts[startIndex].substring(1))
    ) {
      startIndex++;
    }

    const publicIdWithExt = parts.slice(startIndex).join("/");
    // Remove the file extension
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    if (lastDotIndex === -1) return publicIdWithExt;

    return publicIdWithExt.substring(0, lastDotIndex);
  } catch {
    return null;
  }
}
