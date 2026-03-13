import { NextRequest, NextResponse } from "next/server";
import {
  uploadMultipleImages,
  deleteImage,
  extractPublicIdFromUrl,
} from "@/lib/services/cloudinaryService";

/**
 * POST /api/upload - Upload single or multiple images to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = formData.get("folder") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 },
      );
    }

    // Convert files to base64 data URLs
    const filePromises = Array.from(files).map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      return `data:${mimeType};base64,${base64}`;
    });

    const base64Files = await Promise.all(filePromises);

    // Upload to Cloudinary
    const uploadOptions = {
      folder: folder || "dazzling-tours",
      overwrite: false,
    };

    const results = await uploadMultipleImages(base64Files, uploadOptions);

    return NextResponse.json({
      success: true,
      data: results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      })),
      count: results.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload images",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/upload - Delete an image from Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const publicId = searchParams.get("publicId");

    let targetPublicId = publicId;

    if (!targetPublicId && url) {
      targetPublicId = extractPublicIdFromUrl(url);
    }

    if (!targetPublicId) {
      return NextResponse.json(
        { success: false, error: "No publicId or url provided" },
        { status: 400 },
      );
    }

    await deleteImage(targetPublicId);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete image",
      },
      { status: 500 },
    );
  }
}
