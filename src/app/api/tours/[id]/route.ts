import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import mongoose from "mongoose";
import { imageService } from "@/lib/services/imageService";
import { TestimonialStatus } from "@/lib/enums";

// GET /api/tours/[id] - Get a single tour
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;

    // Use aggregation to calculate dynamic rating from active testimonials
    const tours = await Tour.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(resolvedParams.id),
        },
      },
      {
        $lookup: {
          from: "testimonials",
          let: { tourId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$tourId", "$$tourId"] },
                status: TestimonialStatus.ACTIVE,
              },
            },
          ],
          as: "activeTestimonials",
        },
      },
      {
        $addFields: {
          reviews: { $size: "$activeTestimonials" },
          rating: {
            $cond: {
              if: { $gt: [{ $size: "$activeTestimonials" }, 0] },
              then: { $min: [{ $avg: "$activeTestimonials.rating" }, 5] },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          activeTestimonials: 0,
        },
      },
    ]);

    const tourData = tours[0];

    if (!tourData) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    // Filter out data URLs from images - only return Cloudinary URLs
    if (tourData.images && Array.isArray(tourData.images)) {
      tourData.images = tourData.images.filter(
        (url: string) =>
          typeof url === "string" &&
          !url.startsWith("data:") &&
          (url.startsWith("http://") || url.startsWith("https://")),
      );
    }
    if (
      tourData.seo &&
      typeof tourData.seo === "object" &&
      tourData.seo !== null
    ) {
      const seo = tourData.seo as Record<string, unknown>;
      if (seo.ogImage && typeof seo.ogImage === "string") {
        if (
          seo.ogImage.startsWith("data:") ||
          (!seo.ogImage.startsWith("http://") &&
            !seo.ogImage.startsWith("https://"))
        ) {
          seo.ogImage = "";
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: tourData,
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour" },
      { status: 500 },
    );
  }
}

// PATCH /api/tours/[id] - Update a tour
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const body = await request.json();
    const resolvedParams = await params;

    // Validate price if provided
    if (body.price && body.price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be greater than 0" },
        { status: 400 },
      );
    }

    // Validate rating if provided
    if (body.rating && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 0 and 5" },
        { status: 400 },
      );
    }

    // ImageUpload component already uploads to Cloudinary and returns only Cloudinary URLs
    // Filter out any non-HTTP/HTTPS URLs as a safeguard
    if (body.images && Array.isArray(body.images)) {
      body.images = body.images.filter(
        (url: string) =>
          typeof url === "string" &&
          !url.startsWith("data:") &&
          (url.startsWith("http://") || url.startsWith("https://")),
      );
    }

    // Remove _id from body if present (shouldn't be updated)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, seo, ...otherData } = body;

    // Build update object with $set operator
    const updateQuery: Record<string, unknown> = {};

    // Add all other fields to update
    Object.keys(otherData).forEach((key) => {
      if (key !== "seo" && otherData[key] !== undefined) {
        updateQuery[key] = otherData[key];
      }
    });

    // Handle SEO - set the entire object
    if (seo !== undefined) {
      // Filter out data URLs from SEO ogImage
      let ogImage = seo.ogImage || "";
      if (
        ogImage &&
        (ogImage.startsWith("data:") ||
          (!ogImage.startsWith("http://") && !ogImage.startsWith("https://")))
      ) {
        ogImage = "";
      }

      updateQuery.seo = {
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
        slug: seo.slug || "",
        focusKeyword: seo.focusKeyword || "",
        ogImage: ogImage,
      };
    }

    // Handle image deletions if images were changed
    const existingTour = await Tour.findById(resolvedParams.id);
    if (existingTour) {
      // 1. Array of images changed
      if (body.images && Array.isArray(body.images)) {
        const removedImages = existingTour.images.filter(
          (img: string) => !body.images.includes(img),
        );

        if (removedImages.length > 0) {
          await Promise.all(
            removedImages.map((img: string) =>
              imageService.delete(img).catch((err) =>
                console.error(
                  "Failed to delete removed tour image:",
                  err,
                ),
              ),
            ),
          );
        }
      }

      // 2. SEO OG Image changed
      if (
        seo?.ogImage !== undefined &&
        existingTour.seo?.ogImage &&
        existingTour.seo.ogImage !== seo.ogImage
      ) {
        // Only delete if it's not being deleted (part of removedImages above)
        const isAlreadyBeingDeleted =
          body.images &&
          Array.isArray(body.images) &&
          existingTour.images.includes(existingTour.seo.ogImage) &&
          !body.images.includes(existingTour.seo.ogImage);

        if (!isAlreadyBeingDeleted) {
          await imageService.delete(existingTour.seo.ogImage).catch((err) =>
            console.error(
              "Failed to delete old tour SEO OG image:",
              err,
            ),
          );
        }
      }
    }

    // Use findByIdAndUpdate with $set operator
    const tour = await Tour.findByIdAndUpdate(
      resolvedParams.id,
      { $set: updateQuery },
      {
        new: true,
        runValidators: true,
        upsert: false,
        setDefaultsOnInsert: true,
      },
    );

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    // Convert Mongoose document to plain object to ensure all fields are included
    const tourData = tour.toObject
      ? tour.toObject({ flattenMaps: true })
      : tour;

    return NextResponse.json({
      success: true,
      data: tourData,
      message: "Tour updated successfully",
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update tour",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/tours/[id] - Delete a tour
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const tour = await Tour.findById(resolvedParams.id);

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    const allImages = Array.from(
      new Set([...(tour.images || []), tour.seo?.ogImage]),
    ).filter((img): img is string => !!img);

    if (allImages.length > 0) {
      await Promise.all(
        allImages.map((img) =>
          imageService.delete(img).catch((err) =>
            console.error(
              "Failed to delete tour image during tour deletion:",
              err,
            ),
          ),
        ),
      );
    }

    await Tour.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete tour" },
      { status: 500 },
    );
  }
}
