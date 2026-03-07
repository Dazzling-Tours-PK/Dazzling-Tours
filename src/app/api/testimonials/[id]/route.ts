import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { deleteImage } from "@/lib/services/cloudinaryService";
import { extractPublicId } from "@/lib/utils/imageUtils";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";
import { cleanTestimonialData } from "@/lib/utils/dataCleaning";

// GET /api/testimonials/[id] - Get a single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const testimonial = await Testimonial.findById(resolvedParams.id).populate(
      "tourId",
      "title",
    );

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 },
    );
  }
}

// PUT /api/testimonials/[id] - Update a testimonial (Temporarily public for testing)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Extract params from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    const body = await request.json();

    // Validate rating if provided
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return createErrorResponse("Rating must be between 1 and 5", 400);
    }

    // Clean the data using utility function
    const cleanedData = cleanTestimonialData(body);

    // Handle image deletion if image was changed
    const existingTestimonial = await Testimonial.findById(id);
    if (
      existingTestimonial &&
      body.image !== undefined &&
      existingTestimonial.image !== body.image
    ) {
      const publicId = extractPublicId(existingTestimonial.image);
      if (publicId) {
        await deleteImage(publicId).catch((err) =>
          console.error(
            "Failed to delete old testimonial image from Cloudinary:",
            err,
          ),
        );
      }
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, cleanedData, {
      new: true,
      runValidators: true,
    }).populate("tourId", "title");

    if (!testimonial) {
      return createErrorResponse("Testimonial not found", 404);
    }

    return createSuccessResponse(
      testimonial,
      "Testimonial updated successfully",
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return createErrorResponse("Failed to update testimonial", 500);
  }
}

// DELETE /api/testimonials/[id] - Delete a testimonial (Temporarily public for testing)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Extract params from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return createErrorResponse("Testimonial not found", 404);
    }

    // Delete image from Cloudinary
    if (testimonial.image) {
      const publicId = extractPublicId(testimonial.image);
      if (publicId) {
        await deleteImage(publicId).catch((err) =>
          console.error(
            "Failed to delete testimonial image from Cloudinary:",
            err,
          ),
        );
      }
    }

    await Testimonial.findByIdAndDelete(id);

    return createSuccessResponse(null, "Testimonial deleted successfully");
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return createErrorResponse("Failed to delete testimonial", 500);
  }
}
