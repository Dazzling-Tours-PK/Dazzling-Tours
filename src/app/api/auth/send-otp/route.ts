import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, OTP } from "@/models";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, type } = await request.json();

    // Validate required fields
    if (!email || !type) {
      return NextResponse.json(
        { success: false, message: "Email and OTP type are required" },
        { status: 400 },
      );
    }

    // Validate OTP type
    const validTypes = [
      "email_verification",
      "password_reset",
      "login_verification",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP type" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Check if user is super admin
    if (user.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Super admin privileges required",
        },
        { status: 403 },
      );
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create OTP record
    const otp = new OTP({
      email: user.email,
      otp: otpCode,
      type: type as
        | "email_verification"
        | "password_reset"
        | "login_verification",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await otp.save();

    // TODO: Send OTP via email

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent to your email",
        data: {
          email: user.email,
          type,
          // Remove this in production
          otp: process.env.NODE_ENV === "development" ? otpCode : undefined,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
