import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Comment } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/comments - Get all comments
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const blogId = searchParams.get("blogId");
    const search = searchParams.get("search");

    const query: MongoQuery = {};

    if (status) query.status = status;
    if (blogId) query.blogId = blogId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find(query)
      .populate("blogId", "title")
      .populate("parentId", "name content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["blogId", "name", "email", "content"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const commentData = {
      ...body,
      ipAddress: ip,
      userAgent: userAgent,
    };

    const comment = new Comment(commentData);
    await comment.save();

    // Populate the comment with blog and parent data
    await comment.populate([
      { path: "blogId", select: "title" },
      { path: "parentId", select: "name content" },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: comment,
        message: "Comment submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit comment" },
      { status: 500 },
    );
  }
}

// PUT /api/comments - Update multiple comments (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, commentIds, data } = body;

    if (!action || !commentIds || !Array.isArray(commentIds)) {
      return NextResponse.json(
        { success: false, error: "Action and commentIds are required" },
        { status: 400 },
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        result = await Comment.updateMany(
          { _id: { $in: commentIds } },
          { status: data.status },
        );
        break;
      case "approve":
        result = await Comment.updateMany(
          { _id: { $in: commentIds } },
          { status: "Approved" },
        );
        break;
      case "reject":
        result = await Comment.updateMany(
          { _id: { $in: commentIds } },
          { status: "Rejected" },
        );
        break;
      case "delete":
        result = await Comment.deleteMany({ _id: { $in: commentIds } });
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Comments ${action} completed successfully`,
    });
  } catch (error) {
    console.error("Error updating comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comments" },
      { status: 500 },
    );
  }
}
