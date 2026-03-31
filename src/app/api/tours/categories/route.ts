import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";

// GET /api/tours/categories - Get all unique tour categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};

    // Filter by status if provided (e.g., Active)
    if (status && status !== "all") {
      query.status = status;
    }

    // Get all tours with the query and select category
    const tours = await Tour.find(query).select("category").lean();

    // Extract unique categories (case-insensitive, trimmed)
    const categorySet = new Set<string>();
    tours.forEach((tour) => {
      if (tour.category && typeof tour.category === "string") {
        const trimmedCategory = tour.category.trim();
        if (trimmedCategory) {
          categorySet.add(trimmedCategory);
        }
      }
    });

    // Convert to sorted array
    const categories = Array.from(categorySet).sort();

    // Count tours per category
    const categoryCounts: Record<string, number> = {};
    tours.forEach((tour) => {
      if (tour.category && typeof tour.category === "string") {
        const trimmedCategory = tour.category.trim();
        if (trimmedCategory) {
          categoryCounts[trimmedCategory] =
            (categoryCounts[trimmedCategory] || 0) + 1;
        }
      }
    });

    // Return categories with counts
    const categoriesWithCounts = categories.map((category) => ({
      name: category,
      count: categoryCounts[category] || 0,
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
      total: categories.length,
    });
  } catch (error) {
    console.error("Error fetching tour categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour categories" },
      { status: 500 },
    );
  }
}
