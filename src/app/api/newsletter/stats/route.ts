import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Newsletter } from "@/models";

// GET /api/newsletter/stats - Get newsletter statistics
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    // Get total count
    const total = await Newsletter.countDocuments();

    // Get active count
    const active = await Newsletter.countDocuments({ status: "Active" });

    // Get unsubscribed count
    const unsubscribed = await Newsletter.countDocuments({
      status: "Unsubscribed",
    });

    // Get recent subscriptions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSubscriptions = await Newsletter.countDocuments({
      subscribedAt: { $gte: sevenDaysAgo },
    });

    // Get monthly trends (last 12 months)
    const monthlyTrends = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await Newsletter.countDocuments({
        subscribedAt: {
          $gte: monthStart,
          $lte: monthEnd,
        },
      });

      monthlyTrends.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        count,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        total,
        active,
        unsubscribed,
        recentSubscriptions,
        monthlyTrends,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch newsletter stats" },
      { status: 500 }
    );
  }
}
