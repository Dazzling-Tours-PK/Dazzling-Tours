import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Comment } from "@/models";

// GET /api/comments/[id] - Get a single comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const comment = await Comment.findById(resolvedParams.id)
      .populate("blogId", "title")
      .populate("parentId", "name content");

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comment" },
      { status: 500 },
    );
  }
}

// PUT /api/comments/[id] - Update a comment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const body = await request.json();
    const resolvedParams = await params;

    // Validate email format if email is being updated
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 },
        );
      }
    }

    const comment = await Comment.findByIdAndUpdate(
      resolvedParams.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .populate("blogId", "title")
      .populate("parentId", "name content");

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: comment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comment" },
      { status: 500 },
    );
  }
}

// DELETE /api/comments/[id] - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;

    // First, delete all child comments (replies)
    await Comment.deleteMany({ parentId: resolvedParams.id });

    // Then delete the main comment
    const comment = await Comment.findByIdAndDelete(resolvedParams.id);

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment and its replies deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
