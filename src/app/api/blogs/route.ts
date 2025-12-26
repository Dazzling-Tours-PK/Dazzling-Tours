import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";
import { MongoQuery } from "@/lib/types";
import { cleanBlogData } from "@/lib/utils/dataCleaning";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";

// GET /api/blogs - Get all blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const query: MongoQuery = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (featured !== null && featured !== undefined) {
      query.featured = featured === "true";
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    // Ensure all blogs have a category (set to "Uncategorized" if empty)
    const blogsWithCategory = blogs.map((blog) => {
      const blogObj = blog.toObject();
      if (!blogObj.category || blogObj.category.trim() === "") {
        blogObj.category = UNCATEGORIZED_CATEGORY_NAME;
      }
      return blogObj;
    });

    return NextResponse.json({
      success: true,
      data: blogsWithCategory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "excerpt",
      "content",
      "author",
      "category",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Set publishedAt if status is Published and no publishedAt is provided
    if (body.status === "Published" && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    // Clean the data using utility function
    const cleanedData = cleanBlogData(body);

    // Always ensure SEO object exists (with provided data or defaults)
    // Preserve all SEO fields including focusKeyword, even if empty
    cleanedData.seo = {
      metaTitle: body.seo?.metaTitle ?? "",
      metaDescription: body.seo?.metaDescription ?? "",
      slug: body.seo?.slug ?? "",
      focusKeyword: body.seo?.focusKeyword ?? "",
      ogImage: body.seo?.ogImage ?? "",
    };

    const blog = new Blog(cleanedData);

    // Ensure SEO is set if not already present
    if (!blog.seo) {
      blog.seo = {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      };
    }

    await blog.save();

    // Fetch fresh from database to ensure we get the saved data
    const savedBlog = await Blog.findById(blog._id);

    // Convert Mongoose document to plain object to ensure all fields are included
    const blogData = savedBlog?.toObject
      ? savedBlog.toObject()
      : savedBlog || blog.toObject();

    return NextResponse.json(
      {
        success: true,
        data: blogData,
        message: "Blog created successfully",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

// PUT /api/blogs - Update multiple blogs (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, blogIds, data } = body;

    if (!action || !blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json(
        { success: false, error: "Action and blogIds are required" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        const updateData: { status: string; publishedAt?: Date } = {
          status: data.status as string,
        };
        if (data.status === "Published") {
          updateData.publishedAt = new Date();
        }
        result = await Blog.updateMany({ _id: { $in: blogIds } }, updateData);
        break;
      case "updateCategory":
        result = await Blog.updateMany(
          { _id: { $in: blogIds } },
          { category: data.category }
        );
        break;
      case "delete":
        result = await Blog.deleteMany({ _id: { $in: blogIds } });
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Blogs ${action} completed successfully`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update blogs" },
      { status: 500 }
    );
  }
}
