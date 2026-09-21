import ImageKit from "imagekit";

let imagekitInstance: ImageKit | null = null;

function getImageKit() {
  if (!imagekitInstance) {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      // Return a dummy object during build time to avoid crashes if possible,
      // but the real fix is ensuring we don't call these during build.
      // If we are here, we are actually trying to use ImageKit.
      throw new Error("Missing ImageKit environment variables.");
    }

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekitInstance;
}

export interface UploadOptions {
  folder?: string;
  useUniqueFileName?: boolean;
  tags?: string[];
}

export interface UploadResult {
  url: string;
  secure_url: string;
  fileId: string;
  publicId?: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Upload an image to ImageKit
 */
export async function uploadImage(
  file: string | Buffer,
  options: UploadOptions = {},
): Promise<UploadResult> {
  try {
    const ik = getImageKit();
    const response = await ik.upload({
      file: file,
      fileName: `upload-${Date.now()}`,
      folder: options.folder || "/uploads",
      useUniqueFileName: options.useUniqueFileName ?? true,
      tags: options.tags,
    });

    return {
      ...response,
      secure_url: response.url,
      publicId: response.fileId,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to upload image to ImageKit";
    console.error("ImageKit upload error:", error);
    throw new Error(message);
  }
}

/**
 * Upload multiple images to ImageKit
 */
export async function uploadMultipleImages(
  files: (string | Buffer)[],
  options: UploadOptions = {},
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, options));

  return Promise.all(uploadPromises);
}

/**
 * Delete an image from ImageKit by fileId
 */
export async function deleteImage(fileId: string): Promise<void> {
  try {
    const ik = getImageKit();
    await ik.deleteFile(fileId);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete image from ImageKit";
    console.error("ImageKit delete error:", error);
    throw new Error(message);
  }
}

/**
 * Delete multiple images from ImageKit by fileIds
 */
export async function deleteMultipleImages(fileIds: string[]): Promise<void> {
  if (!fileIds || fileIds.length === 0) return;
  try {
    const ik = getImageKit();
    await ik.bulkDeleteFiles(fileIds);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete multiple images from ImageKit";
    console.error("ImageKit bulk delete error:", error);
    throw new Error(message);
  }
}

/**
 * Extract filename from ImageKit URL
 * Example: https://ik.imagekit.io/ojifgauic/dazzling-tours/upload-1789992044475_ThGjXdimr
 * returns upload-1789992044475_ThGjXdimr
 */
export function extractFileNameFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    return parts[parts.length - 1];
  } catch {
    const parts = url.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : null;
  }
}

/**
 * Find fileId by ImageKit URL or name
 */
export async function getFileIdFromUrl(url: string): Promise<string | null> {
  if (!url || !url.includes("ik.imagekit.io")) return null;

  try {
    const ik = getImageKit();
    const fileName = extractFileNameFromUrl(url);
    if (!fileName) return null;

    // Search ImageKit by filename
    const files = await ik.listFiles({
      name: fileName,
      limit: 5,
    });

    if (Array.isArray(files) && files.length > 0) {
      // Find the file whose name or url matches
      const matched = files.find(
        (f) => "fileId" in f && (f.name === fileName || (f.url && f.url.includes(fileName))),
      );
      if (matched && "fileId" in matched) {
        return matched.fileId;
      }
      if ("fileId" in files[0]) {
        return files[0].fileId;
      }
    }

    return null;
  } catch (error) {
    console.error("Error looking up file in ImageKit by url:", error);
    return null;
  }
}

/**
 * Delete an image from ImageKit by URL
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  const fileId = await getFileIdFromUrl(url);
  if (fileId) {
    await deleteImage(fileId);
  } else {
    console.warn(
      `Could not locate ImageKit fileId for URL: ${url}. Proceeding cleanly.`,
    );
  }
}
