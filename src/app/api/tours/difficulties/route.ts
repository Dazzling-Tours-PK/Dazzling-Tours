import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import { TourDifficulty } from "@/lib/enums/tour";

// GET /api/tours/difficulties - Get all unique tour difficulties with counts
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
    const tours = await Tour.find(query).select("difficulty").lean();

    // Count tours per difficulty
    const difficultyCounts: Record<string, number> = {};
    tours.forEach((tour) => {
      if (tour.difficulty && typeof tour.difficulty === "string") {
        const trimmedDifficulty = tour.difficulty.trim();
        if (trimmedDifficulty) {
          difficultyCounts[trimmedDifficulty] =
            (difficultyCounts[trimmedDifficulty] || 0) + 1;
        }
      }
    });

    // Return difficulties with counts (using enum order)
    const difficultiesWithCounts = Object.values(TourDifficulty).map(
      (difficulty) => ({
        value: difficulty,
        label: difficulty,
        count: difficultyCounts[difficulty] || 0,
      }),
    );

    return NextResponse.json({
      success: true,
      data: difficultiesWithCounts,
      total: difficultiesWithCounts.length,
    });
  } catch (error) {
    console.error("Error fetching tour difficulties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour difficulties" },
      { status: 500 },
    );
  }
}
