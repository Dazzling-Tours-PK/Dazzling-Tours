import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Comment } from "@/models";

// GET /api/comments/stats - Get comment statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");

    const matchQuery = blogId ? { blogId } : {};

    const stats = await Comment.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get total comments
    const totalComments = await Comment.countDocuments(matchQuery);

    // Get recent comments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentComments = await Comment.countDocuments({
      ...matchQuery,
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get comments by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Comment.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format the results
    const statusStats = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };

    stats.forEach((stat) => {
      statusStats[stat._id as keyof typeof statusStats] = stat.count;
    });

    return NextResponse.json({
      success: true,
      data: {
        total: totalComments,
        recent: recentComments,
        byStatus: statusStats,
        monthly: monthlyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching comment statistics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comment statistics" },
      { status: 500 },
    );
  }
}
