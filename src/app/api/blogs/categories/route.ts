import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";
import { BlogStatus } from "@/lib/enums/blog";

// GET /api/blogs/categories - Get all unique blog categories with counts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || BlogStatus.PUBLISHED;

    const query: Record<string, unknown> = {};

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Get all blogs with the query
    const blogs = await Blog.find(query).select("category").lean();

    // Count blogs per category
    const categoryCounts: Record<string, number> = {};
    blogs.forEach((blog) => {
      if (blog.category && typeof blog.category === "string") {
        const trimmedCategory = blog.category.trim();
        if (trimmedCategory) {
          categoryCounts[trimmedCategory] =
            (categoryCounts[trimmedCategory] || 0) + 1;
        }
      }
    });

    // Convert to sorted array of objects
    const categoriesWithCounts = Object.keys(categoryCounts)
      .sort()
      .map((category) => ({
        name: category,
        count: categoryCounts[category] || 0,
      }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
      total: categoriesWithCounts.length,
    });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog categories" },
      { status: 500 },
    );
  }
}
