import * as imagekit from "./imageKitService";
import { ImageProvider } from "../enums/imageProvider";

// Use environment variable to determine active provider, default to ImageKit
const ACTIVE_PROVIDER =
  (process.env.NEXT_PUBLIC_IMAGE_PROVIDER as ImageProvider) ||
  ImageProvider.IMAGEKIT;

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
    options: imagekit.UploadOptions = {},
  ): Promise<imagekit.UploadResult> {
    return imagekit.uploadImage(file, options);
  },

  /**
   * Delete an image by its URL or public/file ID
   */
  async delete(urlOrId: string): Promise<void> {
    if (!urlOrId) return;

    if (urlOrId.includes("http")) {
      return imagekit.deleteImageByUrl(urlOrId);
    }
    return imagekit.deleteImage(urlOrId);
  },

  /**
   * Delete multiple images by their URLs or IDs
   */
  async deleteMultiple(urlsOrIds: string[]): Promise<void> {
    if (!urlsOrIds || urlsOrIds.length === 0) return;

    await Promise.all(urlsOrIds.map((item) => this.delete(item)));
  },
};
