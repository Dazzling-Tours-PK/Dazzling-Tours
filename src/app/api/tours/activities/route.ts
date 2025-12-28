import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";

// GET /api/tours/activities - Get all unique tour highlights/activities with counts
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
    const tours = await Tour.find(query).select("highlights").lean();

    // Extract unique highlights (case-insensitive, trimmed)
    const highlightSet = new Set<string>();
    tours.forEach((tour) => {
      if (tour.highlights && Array.isArray(tour.highlights)) {
        tour.highlights.forEach((highlight) => {
          if (highlight && typeof highlight === "string") {
            const trimmedHighlight = highlight.trim();
            if (trimmedHighlight) {
              highlightSet.add(trimmedHighlight);
            }
          }
        });
      }
    });

    // Convert to sorted array
    const highlights = Array.from(highlightSet).sort();

    // Count tours per highlight
    const highlightCounts: Record<string, number> = {};
    tours.forEach((tour) => {
      if (tour.highlights && Array.isArray(tour.highlights)) {
        tour.highlights.forEach((highlight) => {
          if (highlight && typeof highlight === "string") {
            const trimmedHighlight = highlight.trim();
            if (trimmedHighlight) {
              highlightCounts[trimmedHighlight] =
                (highlightCounts[trimmedHighlight] || 0) + 1;
            }
          }
        });
      }
    });

    // Return highlights with counts
    const highlightsWithCounts = highlights.map((highlight) => ({
      name: highlight,
      count: highlightCounts[highlight] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: highlightsWithCounts,
      total: highlights.length,
    });
  } catch (error) {
    console.error("Error fetching tour activities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour activities" },
      { status: 500 }
    );
  }
}
