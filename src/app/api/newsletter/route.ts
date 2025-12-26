import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Newsletter } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/newsletter - Get all newsletter subscribers
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: MongoQuery = {};
    if (status) query.status = status;

    // Add search functionality
    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.status === "Active") {
        return NextResponse.json(
          { success: false, error: "Email already subscribed" },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        existingSubscriber.status = "Active";
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = undefined;
        await existingSubscriber.save();

        return NextResponse.json({
          success: true,
          data: existingSubscriber,
          message: "Email reactivated successfully",
        });
      }
    }

    const subscriber = new Newsletter({ email });
    await subscriber.save();

    return NextResponse.json(
      {
        success: true,
        data: subscriber,
        message: "Successfully subscribed to newsletter",
      },
      { status: 201 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}

// PUT /api/newsletter - Update multiple newsletter subscriptions (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, ids, data } = body;

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: "Action and ids are required" },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        const updateData: {
          status: string;
          unsubscribedAt?: Date;
          subscribedAt?: Date;
        } = { status: data.status };
        if (data.status === "Unsubscribed") {
          updateData.unsubscribedAt = new Date();
        } else if (data.status === "Active") {
          updateData.subscribedAt = new Date();
          updateData.unsubscribedAt = undefined;
        }
        result = await Newsletter.updateMany({ _id: { $in: ids } }, updateData);
        break;
      case "delete":
        result = await Newsletter.deleteMany({ _id: { $in: ids } });
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
      message: `Newsletter subscriptions ${action} completed successfully`,
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to update newsletter subscriptions" },
      { status: 500 }
    );
  }
}
