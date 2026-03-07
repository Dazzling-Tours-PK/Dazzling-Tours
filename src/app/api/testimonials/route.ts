import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Testimonial } from "@/models";
import { MongoQuery } from "@/lib/types";
import {
  withRoleAuth,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/middleware/auth";
import { UserRole } from "@/lib/enums/roles";
import { cleanTestimonialData } from "@/lib/utils/dataCleaning";
import { deleteMultipleImages } from "@/lib/services/cloudinaryService";
import { extractPublicId } from "@/lib/utils/imageUtils";

// GET /api/testimonials - Get all testimonials
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const tourId = searchParams.get("tourId");
    const search = searchParams.get("search");

    const query: MongoQuery = {};

    if (status) query.status = status;
    if (featured === "true") query.featured = true;
    if (featured === "false") query.featured = false;
    if (tourId) query.tourId = tourId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find(query)
      .populate("tourId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Testimonial.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

// POST /api/testimonials - Create a new testimonial (Temporarily public for testing)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "content", "rating"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`${field} is required`, 400);
      }
    }

    // Validate rating is between 1 and 5
    if (body.rating < 1 || body.rating > 5) {
      return createErrorResponse("Rating must be between 1 and 5", 400);
    }

    // Clean the data using utility function
    const cleanedData = cleanTestimonialData(body);

    const testimonial = new Testimonial(cleanedData);
    await testimonial.save();

    return createSuccessResponse(
      testimonial,
      "Testimonial created successfully",
      201,
    );
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return createErrorResponse("Failed to create testimonial", 500);
  }
}

// PUT /api/testimonials - Update multiple testimonials (bulk operations) (Super Admin only)
export const PUT = withRoleAuth(UserRole.SUPER_ADMIN, async (request) => {
  try {
    await connectDB();

    const body = await request.json();
    const { action, testimonialIds, data } = body;

    if (!action || !testimonialIds || !Array.isArray(testimonialIds)) {
      return createErrorResponse("Action and testimonialIds are required", 400);
    }

    let result;
    switch (action) {
      case "updateStatus":
        result = await Testimonial.updateMany(
          { _id: { $in: testimonialIds } },
          { status: data.status },
        );
        break;
      case "updateFeatured":
        result = await Testimonial.updateMany(
          { _id: { $in: testimonialIds } },
          { featured: data.featured },
        );
        break;
      case "delete": {
        // Fetch testimonials to get their image URLs before deletion
        const testimonialsToDelete = await Testimonial.find({
          _id: { $in: testimonialIds },
        });
        const allImages: string[] = [];

        testimonialsToDelete.forEach((testimonial) => {
          if (testimonial.image) {
            allImages.push(testimonial.image);
          }
        });

        const publicIds = Array.from(new Set(allImages))
          .map((url: string) => extractPublicId(url))
          .filter((id: string | null): id is string => id !== null);

        if (publicIds.length > 0) {
          await deleteMultipleImages(publicIds).catch((err) =>
            console.error(
              "Failed to delete bulk testimonial images from Cloudinary:",
              err,
            ),
          );
        }

        result = await Testimonial.deleteMany({ _id: { $in: testimonialIds } });
        break;
      }
      default:
        return createErrorResponse("Invalid action", 400);
    }

    return createSuccessResponse(
      result,
      `Testimonials ${action} completed successfully`,
    );
  } catch (error) {
    console.error("Error updating testimonials:", error);
    return createErrorResponse("Failed to update testimonials", 500);
  }
});
