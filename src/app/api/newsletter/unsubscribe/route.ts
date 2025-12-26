import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Newsletter } from "@/models";

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Verify token (simple base64 encoding of email)
    const expectedToken = Buffer.from(email).toString("base64");
    if (token && token !== expectedToken) {
      return NextResponse.json(
        { success: false, error: "Invalid unsubscribe token" },
        { status: 400 }
      );
    }

    // Find and update subscriber
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        status: "Unsubscribed",
        unsubscribedAt: new Date(),
      },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
      data: subscriber,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}

// GET /api/newsletter/unsubscribe - Unsubscribe via GET (for email links)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email) {
      return NextResponse.redirect(
        new URL("/unsubscribe?error=missing_email", request.url)
      );
    }

    // Verify token
    const expectedToken = Buffer.from(email).toString("base64");
    if (token && token !== expectedToken) {
      return NextResponse.redirect(
        new URL("/unsubscribe?error=invalid_token", request.url)
      );
    }

    // Find and update subscriber
    const subscriber = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        status: "Unsubscribed",
        unsubscribedAt: new Date(),
      },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.redirect(
        new URL("/unsubscribe?error=not_found", request.url)
      );
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL(
        "/unsubscribe?success=true&email=" + encodeURIComponent(email),
        request.url
      )
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return NextResponse.redirect(
      new URL("/unsubscribe?error=server_error", request.url)
    );
  }
}
