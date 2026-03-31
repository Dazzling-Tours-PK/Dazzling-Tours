import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";
import { BlogStatus } from "@/lib/enums/blog";

// GET /api/blogs/tags - Get all unique blog tags
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
    const blogs = await Blog.find(query).select("tags").lean();

    // Extract unique tags (case-insensitive, trimmed)
    const tagSet = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach(tag => {
            const trimmedTag = tag.trim();
            if (trimmedTag) {
                tagSet.add(trimmedTag);
            }
        });
      }
    });

    // Convert to sorted array
    const sortedTags = Array.from(tagSet).sort();

    return NextResponse.json({
      success: true,
      data: sortedTags,
      total: sortedTags.length,
    });
  } catch (error) {
    console.error("Error fetching blog tags:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog tags" },
      { status: 500 },
    );
  }
}
