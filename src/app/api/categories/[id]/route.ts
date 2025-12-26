import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category, Tour, Blog, ICategory } from "@/models";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const { name, slug, description } = body;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Prevent renaming "Uncategorized" category
    if (
      category.name === UNCATEGORIZED_CATEGORY_NAME &&
      name &&
      name !== UNCATEGORIZED_CATEGORY_NAME
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot rename the '${UNCATEGORIZED_CATEGORY_NAME}' category`,
        },
        { status: 400 }
      );
    }

    // Prevent creating/renaming to "Uncategorized"
    if (
      name === UNCATEGORIZED_CATEGORY_NAME &&
      category.name !== UNCATEGORIZED_CATEGORY_NAME
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot create or rename a category to '${UNCATEGORIZED_CATEGORY_NAME}'`,
        },
        { status: 400 }
      );
    }

    // Check if another category with same name or slug exists
    if (name || slug) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        $or: name ? [{ name }, { slug: slug || category.slug }] : [{ slug }],
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
    }

    // Update category
    const updateData: Partial<ICategory> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // If category name changed, update all tours and blogs using this category
    if (name && name !== category.name) {
      await Tour.updateMany(
        { category: category.name },
        { $set: { category: name } }
      );
      await Blog.updateMany(
        { category: category.name },
        { $set: { category: name } }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Prevent deletion of "Uncategorized" category
    if (category.name === UNCATEGORIZED_CATEGORY_NAME) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete the '${UNCATEGORIZED_CATEGORY_NAME}' category`,
        },
        { status: 400 }
      );
    }

    // Update all tours and blogs using this category to "Uncategorized"
    await Tour.updateMany(
      { category: category.name },
      { $set: { category: UNCATEGORIZED_CATEGORY_NAME } }
    );
    await Blog.updateMany(
      { category: category.name },
      { $set: { category: UNCATEGORIZED_CATEGORY_NAME } }
    );

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Category deleted successfully. Related tours and blogs have been set to '${UNCATEGORIZED_CATEGORY_NAME}'.`,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
