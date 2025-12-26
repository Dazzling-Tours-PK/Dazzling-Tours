import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";

// GET /api/tours/slug/[slug] - Get a single tour by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const tour = await Tour.findOne({
      "seo.slug": resolvedParams.slug,
      status: "Active",
    });

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    // Convert Mongoose document to plain object to ensure all fields are included
    const tourData = tour.toObject
      ? tour.toObject({ flattenMaps: true })
      : tour;

    return NextResponse.json({
      success: true,
      data: tourData,
    });
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}
