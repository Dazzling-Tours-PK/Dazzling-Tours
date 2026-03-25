import * as cloudinary from "./cloudinaryService";
import { ImageProvider } from "../enums/imageProvider";

// Use environment variable to determine active provider, default to Cloudinary
const ACTIVE_PROVIDER =
  (process.env.NEXT_PUBLIC_IMAGE_PROVIDER as ImageProvider) ||
  ImageProvider.CLOUDINARY;

/**
 * Unified image service to manage uploads and deletions across multiple providers.
 * You can switch providers globally just by changing the environment variable.
 */
export const imageService = {
  /**
   * Status check for the active provider
   */
  getProvider: () => ACTIVE_PROVIDER,

  /**
   * Upload an image to the enabled provider
   */
  async upload(
    file: string | Buffer,
    options: cloudinary.UploadOptions = {},
  ): Promise<cloudinary.UploadResult> {
    switch (ACTIVE_PROVIDER) {
      case ImageProvider.IMAGEKIT:
        // Future implementation for ImageKit
        throw new Error(
          "ImageKit service is not yet enabled in the application.",
        );

      case ImageProvider.CLOUDINARY:
      default:
        return cloudinary.uploadImage(file, options);
    }
  },

  /**
   * Delete an image by its URL or public ID
   */
  async delete(urlOrId: string): Promise<void> {
    if (!urlOrId) return;

    switch (ACTIVE_PROVIDER) {
      case ImageProvider.IMAGEKIT:
        // Future implementation for ImageKit
        throw new Error(
          "ImageKit service is not yet enabled in the application.",
        );

      case ImageProvider.CLOUDINARY:
      default:
        // If it's a URL, extract the public_id
        const publicId = urlOrId.includes("http")
          ? cloudinary.extractPublicIdFromUrl(urlOrId)
          : urlOrId;

        if (publicId) {
          return cloudinary.deleteImage(publicId);
        }
        return;
    }
  },

  /**
   * Helper to extract a unique ID from a provider's URL
   */
  extractId(url: string | null): string | null {
    if (!url) return null;

    switch (ACTIVE_PROVIDER) {
      case ImageProvider.IMAGEKIT:
        // Future implementation for ImageKit
        return null;

      case ImageProvider.CLOUDINARY:
      default:
        return cloudinary.extractPublicIdFromUrl(url);
    }
  },
};
