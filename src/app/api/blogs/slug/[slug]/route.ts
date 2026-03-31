import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";

// GET /api/blogs/slug/[slug] - Get blog by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    await connectDB();

    const blog = await Blog.findOne({ "seo.slug": slug }).lean();

    if (!blog) {
      // If no SEO slug is found, try searching by _id (fallback)
      const blogById = await Blog.findById(slug).lean();
      if (!blogById) {
        return NextResponse.json(
          { success: false, error: "Blog not found" },
          { status: 404 },
        );
      }

      // Ensure all blogs have a category
      if (!blogById.category || blogById.category.trim() === "") {
        blogById.category = UNCATEGORIZED_CATEGORY_NAME;
      }

      return NextResponse.json({ success: true, data: blogById });
    }

    // Ensure all blogs have a category
    if (!blog.category || blog.category.trim() === "") {
      blog.category = UNCATEGORIZED_CATEGORY_NAME;
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}
