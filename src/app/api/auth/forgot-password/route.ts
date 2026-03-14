import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, OTP } from "@/models";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "super_admin",
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If the email exists, a password reset OTP has been sent",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Account is deactivated" },
        { status: 401 },
      );
    }

    // Generate OTP for password reset
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing password reset OTPs for this email
    await OTP.deleteMany({
      email: user.email,
      type: "password_reset",
    });

    // Save new OTP
    await OTP.create({
      email: user.email,
      otp: otpCode,
      type: "password_reset",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    // TODO: Send OTP via email

    // Import email service and template
    const { sendEmail } = await import("@/lib/services/emailService");
    const { genericHtmlTemplate } =
      await import("@/lib/templates/emailTemplates");

    try {
      const html = genericHtmlTemplate(
        "Password Reset Request",
        `
        <p>Hello ${user.firstName},</p>
        <p>You have requested to reset your password for Dazzling Tours.</p>
        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your Password Reset OTP is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #fd7d02; background: #fff5eb; padding: 20px; border-radius: 8px; display: inline-block;">
            ${otpCode}
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">This OTP will expire in 15 minutes.</p>
        </div>
        <p>If you did not request this, please ignore this email or contact support if you have concerns.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?email=${encodeURIComponent(user.email)}" class="button" style="background-color: #fd7d02;">Reset Password</a>
        `,
        { companyName: "Dazzling Tours" },
      );

      await sendEmail({
        to: user.email,
        subject: "Password Reset OTP - Dazzling Tours",
        html: html,
      });
    } catch (emailError) {
      console.error("Failed to send forgot password email:", emailError);
      // We don't return error here to avoid revealing user existence,
      // but the log will help us debug.
    }

    return NextResponse.json({
      success: true,
      message: "If the email exists, a password reset OTP has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

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
