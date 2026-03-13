import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface UploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: "image" | "video" | "raw" | "auto";
  transformation?: Array<Record<string, unknown>>;
}

export interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload an image to Cloudinary from a base64 data URL or file buffer
 */
export async function uploadImage(
  file: string | Buffer,
  options: UploadOptions = {},
): Promise<UploadResult> {
  try {
    if (!verifyCloudinaryConfig()) {
      throw new Error(
        "Cloudinary configuration is missing. Please set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
      );
    }

    const uploadOptions = {
      folder: options.folder || "dazzling-tours",
      public_id: options.public_id,
      overwrite: options.overwrite || false,
      resource_type: options.resource_type || "image",
      transformation: options.transformation || [
        { quality: "auto", fetch_format: "auto" },
      ],
    };

    let uploadResult: {
      public_id: string;
      secure_url: string;
      url: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    };

    if (typeof file === "string") {
      // Base64 data URL or URL
      uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      // Buffer - use upload_stream for better performance
      uploadResult = await new Promise<{
        public_id: string;
        secure_url: string;
        url: string;
        width: number;
        height: number;
        format: string;
        bytes: number;
      }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error("Upload failed: No result returned"));
          },
        );
        uploadStream.end(file);
      });
    }

    return {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      url: uploadResult.url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      `Failed to upload image to Cloudinary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleImages(
  files: (string | Buffer)[],
  options: UploadOptions = {},
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file, {
      ...options,
      public_id: options.public_id
        ? `${options.public_id}_${index}`
        : undefined,
    }),
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    if (!verifyCloudinaryConfig()) {
      throw new Error("Cloudinary configuration is missing.");
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(
      `Failed to delete image from Cloudinary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

/**
 * Delete multiple images from Cloudinary
 */
export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
  try {
    if (!verifyCloudinaryConfig()) {
      throw new Error("Cloudinary configuration is missing.");
    }

    await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error("Cloudinary delete multiple error:", error);
    throw new Error(
      `Failed to delete images from Cloudinary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
}

/**
 * Verify Cloudinary configuration
 */
export function verifyCloudinaryConfig(): boolean {
  return !!(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET)
  );
}

/**
 * Extract public_id from a Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Standard Cloudinary URL format: 
    // https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/v[version]/[public_id].[extension]
    // or with transformations:
    // https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/[transformations]/v[version]/[public_id].[extension]
    
    if (!url || !url.includes("cloudinary.com")) return null;

    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Find the version part (v followed by digits)
    let versionIndex = -1;
    for (let i = uploadIndex + 1; i < parts.length; i++) {
      if (parts[i].startsWith("v") && /^\d+$/.test(parts[i].substring(1))) {
        versionIndex = i;
        break;
      }
    }

    // If version index is found, the public ID starts after it
    // If not found, it might be right after 'upload' or transformations
    // But Cloudinary usually provides a version.
    const startIndex = versionIndex !== -1 ? versionIndex + 1 : uploadIndex + 1;
    
    // Join the remaining parts to get public_id with extension
    const publicIdWithExtension = parts.slice(startIndex).join("/");
    
    // Remove the file extension (last dot and everything after it)
    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error extracting publicId from URL:", error);
    return null;
  }
}
