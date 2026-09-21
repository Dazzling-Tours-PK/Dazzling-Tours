import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/imageService";

/**
 * POST /api/upload - Upload single or multiple images to active provider (Cloudinary or ImageKit)
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

    // Convert files to Buffers
    const filePromises = Array.from(files).map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    });

    const fileBuffers = await Promise.all(filePromises);

    // Upload using unified service
    const uploadOptions = {
      folder: folder || "dazzling-tours",
    };

    const results = await Promise.all(
      fileBuffers.map((buffer) => imageService.upload(buffer, uploadOptions)),
    );

    return NextResponse.json({
      success: true,
      data: results.map((result) => ({
        url: result.url || result.secure_url,
        publicId: result.fileId || result.public_id, // Normalize to publicId for frontend
        fileId: result.fileId,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.size || result.bytes,
      })),
      count: results.length,
      provider: imageService.getProvider(),
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
 * DELETE /api/upload - Delete an image
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const id = searchParams.get("publicId") || searchParams.get("id") || searchParams.get("fileId");

    let target = id;

    if (!target && url) {
      target = url;
    }

    if (!target) {
      return NextResponse.json(
        { success: false, error: "No ID or url provided" },
        { status: 400 },
      );
    }

    await imageService.delete(target);

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
