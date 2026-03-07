import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import { MongoQuery } from "@/lib/types";
import { cleanTourData } from "@/lib/utils/dataCleaning";
import { deleteMultipleImages } from "@/lib/services/cloudinaryService";
import { extractPublicId } from "@/lib/utils/imageUtils";

// GET /api/tours - Get all tours
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const difficulty = searchParams.get("difficulty");

    const query: MongoQuery = {};

    // Apply status filter: if provided and not "all", use it; otherwise show all tours
    if (status && status !== "all") {
      query.status = status;
    }

    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (featured === "false") query.featured = false;

    // Handle location filter (can be comma-separated for multiple locations)
    if (location) {
      const locationArray = location.split(",").map((loc) => loc.trim());
      if (locationArray.length === 1) {
        query.location = locationArray[0];
      } else {
        (query as Record<string, unknown>).location = { $in: locationArray };
      }
    }

    // Handle difficulty filter (can be comma-separated for multiple difficulties)
    if (difficulty) {
      const difficultyArray = difficulty.split(",").map((diff) => diff.trim());
      if (difficultyArray.length === 1) {
        query.difficulty = difficultyArray[0];
      } else {
        (query as Record<string, unknown>).difficulty = {
          $in: difficultyArray,
        };
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const tours = await Tour.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter out data URLs from images - only return Cloudinary URLs
    const cleanedTours = tours.map((tour: Record<string, unknown>) => {
      if (tour.images && Array.isArray(tour.images)) {
        tour.images = tour.images.filter(
          (url: string) =>
            typeof url === "string" &&
            !url.startsWith("data:") &&
            (url.startsWith("http://") || url.startsWith("https://")),
        );
      }
      if (tour.seo && typeof tour.seo === "object" && tour.seo !== null) {
        const seo = tour.seo as Record<string, unknown>;
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
      return tour;
    });

    const total = await Tour.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: cleanedTours,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}

// POST /api/tours - Create a new tour
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "shortDescription",
      "price",
      "duration",
      "location",
      "category",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate price is positive
    if (body.price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be greater than 0" },
        { status: 400 },
      );
    }

    // Validate rating is between 0 and 5
    if (body.rating && (body.rating < 0 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 0 and 5" },
        { status: 400 },
      );
    }

    // ImageUpload component already uploads to Cloudinary and returns only Cloudinary URLs
    // Filter out any non-HTTP/HTTPS URLs as a safeguard (shouldn't happen, but just in case)
    if (body.images && Array.isArray(body.images)) {
      body.images = body.images.filter(
        (url: string) =>
          typeof url === "string" &&
          !url.startsWith("data:") &&
          (url.startsWith("http://") || url.startsWith("https://")),
      );
    }

    // Filter SEO ogImage if present
    if (body.seo?.ogImage && typeof body.seo.ogImage === "string") {
      if (
        body.seo.ogImage.startsWith("data:") ||
        (!body.seo.ogImage.startsWith("http://") &&
          !body.seo.ogImage.startsWith("https://"))
      ) {
        body.seo.ogImage = "";
      }
    }

    // Clean the data using utility function
    const cleanedData = cleanTourData(body);

    // Always ensure SEO object exists (with provided data or defaults)
    cleanedData.seo = {
      metaTitle: body.seo?.metaTitle || "",
      metaDescription: body.seo?.metaDescription || "",
      slug: body.seo?.slug || "",
      focusKeyword: body.seo?.focusKeyword || "",
      ogImage: body.seo?.ogImage || "",
    };

    const tour = new Tour(cleanedData);

    // Ensure SEO is set if not already present
    if (!tour.seo) {
      tour.seo = {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      };
    }

    await tour.save();

    // Fetch fresh from database to ensure we get the saved data
    const savedTour = await Tour.findById(tour._id);

    // Convert Mongoose document to plain object to ensure all fields are included
    const tourData = savedTour?.toObject
      ? savedTour.toObject({ flattenMaps: true })
      : savedTour || tour.toObject?.() || tour;

    // Ensure SEO is always in the response, even if empty
    if (!tourData.seo) {
      tourData.seo = {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      };
    }

    return NextResponse.json(
      {
        success: true,
        data: tourData,
        message: "Tour created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create tour" },
      { status: 500 },
    );
  }
}

// PUT /api/tours - Update multiple tours (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, tourIds, data } = body;

    if (!action || !tourIds || !Array.isArray(tourIds)) {
      return NextResponse.json(
        { success: false, error: "Action and tourIds are required" },
        { status: 400 },
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        result = await Tour.updateMany(
          { _id: { $in: tourIds } },
          { status: data.status },
        );
        break;
      case "updateFeatured":
        result = await Tour.updateMany(
          { _id: { $in: tourIds } },
          { featured: data.featured },
        );
        break;
      case "delete": {
        // Fetch tours to get their image URLs before deletion
        const toursToDelete = await Tour.find({ _id: { $in: tourIds } });
        const allImages: string[] = [];

        toursToDelete.forEach((tour) => {
          if (tour.images && Array.isArray(tour.images)) {
            allImages.push(...tour.images);
          }
          if (tour.seo?.ogImage) {
            allImages.push(tour.seo.ogImage);
          }
        });

        const publicIds = Array.from(new Set(allImages))
          .map((url: string) => extractPublicId(url))
          .filter((id: string | null): id is string => id !== null);

        if (publicIds.length > 0) {
          await deleteMultipleImages(publicIds).catch((err) =>
            console.error(
              "Failed to delete bulk tour images from Cloudinary:",
              err,
            ),
          );
        }

        result = await Tour.deleteMany({ _id: { $in: tourIds } });
        break;
      }
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Tours ${action} completed successfully`,
    });
  } catch (error) {
    console.error("Error updating tours:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tours" },
      { status: 500 },
    );
  }
}
