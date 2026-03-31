import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Comment, IComment } from "@/models";

// GET /api/comments/blog/[blogId] - Get all comments for a specific blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "Approved"; // Default to approved comments for public view
    const includeReplies = searchParams.get("includeReplies") === "true";

    const query: Record<string, unknown> = {
      blogId: resolvedParams.blogId,
      status,
    };

    // If not including replies, only get top-level comments
    if (!includeReplies) {
      query.parentId = { $exists: false };
    }

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 });

    // If including replies, organize them hierarchically
    if (includeReplies) {
      const organizedComments = organizeCommentsHierarchically(comments);
      return NextResponse.json({
        success: true,
        data: organizedComments,
        total: comments.length,
      });
    }

    return NextResponse.json({
      success: true,
      data: comments,
      total: comments.length,
    });
  } catch (error) {
    console.error("Error fetching blog comments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog comments" },
      { status: 500 },
    );
  }
}

// Helper function to organize comments hierarchically
interface CommentWithReplies {
  _id: string;
  name: string;
  email: string;
  content: string;
  status: string;
  parentId?: string;
  replies: CommentWithReplies[];
  createdAt: Date;
  updatedAt: Date;
}

function organizeCommentsHierarchically(
  comments: IComment[],
): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  // First pass: create a map of all comments
  comments.forEach((comment) => {
    const commentObj: CommentWithReplies = {
      _id: String(comment._id),
      name: comment.name,
      email: comment.email,
      content: comment.content,
      status: comment.status,
      parentId: comment.parentId ? String(comment.parentId) : undefined,
      replies: [],
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
    commentMap.set(String(comment._id), commentObj);
  });

  // Second pass: organize into hierarchy
  comments.forEach((comment) => {
    const commentObj = commentMap.get(String(comment._id));
    if (!commentObj) return;

    if (comment.parentId) {
      // This is a reply
      const parent = commentMap.get(String(comment.parentId));
      if (parent) {
        parent.replies.push(commentObj);
      }
    } else {
      // This is a root comment
      rootComments.push(commentObj);
    }
  });

  return rootComments;
}
