import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, OTP } from "@/models";
import jwt from "jsonwebtoken";
import { z } from "zod";

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  type: z.enum(["email_verification", "password_reset", "login_verification"]),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp, type } = verifyOTPSchema.parse(body);

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() },
      attempts: { $lt: 3 },
    });

    if (!otpRecord) {
      // Increment attempts for existing OTP
      const existingOTP = await OTP.findOne({
        email: email.toLowerCase(),
        otp,
        type,
        isUsed: false,
      });

      if (existingOTP) {
        await existingOTP.incrementAttempts();
      }

      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // Mark OTP as used
    await otpRecord.markAsUsed();

    // Handle different OTP types
    if (type === "login_verification") {
      // Find user
      const user = await User.findOne({
        email: email.toLowerCase(),
        role: "super_admin",
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 },
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" },
      );

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
        },
      });
    }

    // For other OTP types, just verify
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
