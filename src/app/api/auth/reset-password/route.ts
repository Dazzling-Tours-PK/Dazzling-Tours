import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, OTP } from "@/models";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, otp, newPassword } = resetPasswordSchema.parse(body);

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      type: "password_reset",
      isUsed: false,
      expiresAt: { $gt: new Date() },
      attempts: { $lt: 3 },
    });

    if (!otpRecord) {
      // Increment attempts for existing OTP
      const existingOTP = await OTP.findOne({
        email: email.toLowerCase(),
        otp,
        type: "password_reset",
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

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated" },
        { status: 401 },
      );
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    // Mark OTP as used
    await otpRecord.markAsUsed();

    // Delete all password reset OTPs for this email
    await OTP.deleteMany({
      email: user.email,
      type: "password_reset",
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

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
