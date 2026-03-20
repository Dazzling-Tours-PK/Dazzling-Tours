import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";

// GET /api/tours/slug/[slug] - Get a single tour by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    
    // Use aggregation to calculate dynamic rating from active testimonials
    const tours = await Tour.aggregate([
      {
        $match: {
          "seo.slug": resolvedParams.slug,
          status: "Active",
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
                status: "Active",
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

    return NextResponse.json({
      success: true,
      data: tourData,
    });
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour" },
      { status: 500 },
    );
  }
}
