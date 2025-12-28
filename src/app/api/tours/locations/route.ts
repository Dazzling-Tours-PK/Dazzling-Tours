import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";

// GET /api/tours/locations - Get all unique tour locations
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Get all tours with the query
    const tours = await Tour.find(query).select("location").lean();

    // Extract unique locations (case-insensitive, trimmed)
    const locationSet = new Set<string>();
    tours.forEach((tour) => {
      if (tour.location && typeof tour.location === "string") {
        const trimmedLocation = tour.location.trim();
        if (trimmedLocation) {
          locationSet.add(trimmedLocation);
        }
      }
    });

    // Convert to sorted array
    const locations = Array.from(locationSet).sort();

    // Count tours per location
    const locationCounts: Record<string, number> = {};
    tours.forEach((tour) => {
      if (tour.location && typeof tour.location === "string") {
        const trimmedLocation = tour.location.trim();
        if (trimmedLocation) {
          locationCounts[trimmedLocation] =
            (locationCounts[trimmedLocation] || 0) + 1;
        }
      }
    });

    // Return locations with counts
    const locationsWithCounts = locations.map((location) => ({
      name: location,
      count: locationCounts[location] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: locationsWithCounts,
      total: locations.length,
    });
  } catch (error) {
    console.error("Error fetching tour locations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour locations" },
      { status: 500 }
    );
  }
}
