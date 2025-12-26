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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    const query: MongoQuery = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
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
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
