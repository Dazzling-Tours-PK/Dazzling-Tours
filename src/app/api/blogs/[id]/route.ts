import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";
import { deleteImage } from "@/lib/services/cloudinaryService";
import { extractPublicId } from "@/lib/utils/imageUtils";
import { BlogStatus } from "@/lib/enums/blog";

// GET /api/blogs/[id] - Get a single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const blog = await Blog.findById(resolvedParams.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

// PATCH /api/blogs/[id] - Update a blog
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const body = await request.json();
    const resolvedParams = await params;

    // Set publishedAt if status is changed to Published and no publishedAt is provided
    if (body.status === BlogStatus.PUBLISHED && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    // Remove _id from body if present (shouldn't be updated)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, seo, featured, ...otherData } = body;

    // Build update object with $set operator (similar to tours)
    const updateQuery: Record<string, unknown> = {};

    // Explicitly handle featured field (boolean can be false, so check for !== undefined)
    if (featured !== undefined) {
      updateQuery.featured = featured;
    }

    // Add all other fields to update
    Object.keys(otherData).forEach((key) => {
      if (key !== "seo" && otherData[key] !== undefined) {
        updateQuery[key] = otherData[key];
      }
    });

    // Handle SEO - set the entire object
    if (seo !== undefined) {
      updateQuery.seo = {
        metaTitle: seo.metaTitle || "",
        metaDescription: seo.metaDescription || "",
        slug: seo.slug || "",
        focusKeyword: seo.focusKeyword || "",
        ogImage: seo.ogImage || "",
      };
    }

    // Handle image deletion if featuredImage was changed
    const existingBlog = await Blog.findById(resolvedParams.id);
    if (
      existingBlog &&
      body.featuredImage !== undefined &&
      existingBlog.featuredImage !== body.featuredImage
    ) {
      const publicId = extractPublicId(existingBlog.featuredImage);
      if (publicId) {
        await deleteImage(publicId).catch((err) =>
          console.error(
            "Failed to delete old featured image from Cloudinary:",
            err,
          ),
        );
      }
    }

    // Use findByIdAndUpdate with $set operator (similar to tours)
    const blog = await Blog.findByIdAndUpdate(
      resolvedParams.id,
      { $set: updateQuery },
      {
        new: true,
        runValidators: true,
        upsert: false,
        setDefaultsOnInsert: true,
      },
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    // Ensure SEO is set if not already present
    if (!blog.seo) {
      blog.seo = {
        metaTitle: "",
        metaDescription: "",
        slug: "",
        focusKeyword: "",
        ogImage: "",
      };
      await blog.save();
    }

    // Convert Mongoose document to plain object to ensure all fields are included
    const blogData = blog.toObject
      ? blog.toObject({ flattenMaps: true })
      : blog;

    return NextResponse.json({
      success: true,
      data: blogData,
      message: "Blog updated successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

// DELETE /api/blogs/[id] - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const blog = await Blog.findById(resolvedParams.id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 },
      );
    }

    // Delete featured image from Cloudinary
    if (blog.featuredImage) {
      const publicId = extractPublicId(blog.featuredImage);
      if (publicId) {
        await deleteImage(publicId).catch((err) =>
          console.error(
            "Failed to delete blog featured image from Cloudinary:",
            err,
          ),
        );
      }
    }

    // Delete OG image if it's different
    if (blog.seo?.ogImage && blog.seo.ogImage !== blog.featuredImage) {
      const publicId = extractPublicId(blog.seo.ogImage);
      if (publicId) {
        await deleteImage(publicId).catch((err) =>
          console.error("Failed to delete blog OG image from Cloudinary:", err),
        );
      }
    }

    await Blog.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
