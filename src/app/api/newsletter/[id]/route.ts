import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Newsletter } from "@/models";

// GET /api/newsletter/[id] - Get a single newsletter subscriber
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const subscriber = await Newsletter.findById(resolvedParams.id);

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscriber,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriber" },
      { status: 500 }
    );
  }
}

// PUT /api/newsletter/[id] - Update a newsletter subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
          { status: 400 }
        );
      }
    }

    // Handle status changes
    const updateData: {
      email?: string;
      status?: string;
      unsubscribedAt?: Date | null;
      subscribedAt?: Date;
    } = { ...body };

    if (body.status === "Unsubscribed" && !body.unsubscribedAt) {
      updateData.unsubscribedAt = new Date();
    } else if (body.status === "Active") {
      updateData.subscribedAt = new Date();
      updateData.unsubscribedAt = null;
    }

    const subscriber = await Newsletter.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscriber,
      message: "Newsletter subscription updated successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to update newsletter subscription" },
      { status: 500 }
    );
  }
}

// DELETE /api/newsletter/[id] - Delete a newsletter subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const subscriber = await Newsletter.findByIdAndDelete(resolvedParams.id);

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Newsletter subscription deleted successfully",
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete newsletter subscription" },
      { status: 500 }
    );
  }
}
