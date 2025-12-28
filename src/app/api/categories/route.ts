import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category } from "@/models";
import { MongoQuery } from "@/lib/types";
import {
  UNCATEGORIZED_CATEGORY_NAME,
  UNCATEGORIZED_CATEGORY_SLUG,
} from "@/lib/constants/categories";

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Ensure "Uncategorized" category exists
    const uncategorizedExists = await Category.findOne({
      name: UNCATEGORIZED_CATEGORY_NAME,
    });
    if (!uncategorizedExists) {
      await Category.create({
        name: UNCATEGORIZED_CATEGORY_NAME,
        slug: UNCATEGORIZED_CATEGORY_SLUG,
        description:
          "Default category for tours and blogs without a specific category",
      });
    }

    const { searchParams } = new URL(request.url);

    // Validate and parse page parameter
    const pageParam = searchParams.get("page");
    const page = Math.max(1, parseInt(pageParam || "1") || 1);

    // Validate and parse limit parameter
    const limitParam = searchParams.get("limit");
    let limit = parseInt(limitParam || "10") || 10;
    // Ensure limit is between 1 and 100
    limit = Math.max(1, Math.min(100, limit));

    const search = searchParams.get("search")?.trim();

    const query: MongoQuery = {};

    if (search && search.length > 0) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = Math.max(0, (page - 1) * limit);

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(query);

    // Calculate pages, ensuring we don't divide by zero
    const pages = limit > 0 ? Math.ceil(total / limit) : 0;

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Prevent creating a category with name "Uncategorized"
    if (name === UNCATEGORIZED_CATEGORY_NAME) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot create a category with the name '${UNCATEGORIZED_CATEGORY_NAME}'`,
        },
        { status: 400 }
      );
    }

    // Check if category with same name or slug already exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Category with this name or slug already exists",
        },
        { status: 400 }
      );
    }

    const category = new Category({
      name,
      slug,
      description: description || "",
    });

    await category.save();

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
