import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { UserRole } from "@/lib/enums/roles";
import { sendEmail } from "@/lib/services/emailService";
import { genericHtmlTemplate } from "@/lib/templates/emailTemplates";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Security Check: Use a secret from headers to prevent unauthorized seeding
    const authHeader = req.headers.get("x-seed-secret");

    if (authHeader !== process.env.SEED_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail) {
      return NextResponse.json(
        { success: false, message: "Admin email not configured (ADMIN_EMAIL)" },
        { status: 500 },
      );
    }

    // Generate random password if not provided
    // const isRandomPassword = !adminPassword;
    const finalAdminPassword =
      adminPassword || crypto.randomBytes(12).toString("hex");

    // 2. Find or create/update the admin user
    let adminUser = await User.findOne({ email: adminEmail });
    const isNew = !adminUser;

    if (!adminUser) {
      adminUser = new User({
        email: adminEmail,
        password: finalAdminPassword, // Will be hashed by pre-save hook
        firstName: "Super",
        lastName: "Admin",
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        isEmailVerified: true,
      });
    } else {
      // If user exists, update password and role to fix any previous incorrect setup (like plaintext password)
      adminUser.password = finalAdminPassword; // Will be hashed by pre-save hook
      adminUser.role = UserRole.SUPER_ADMIN;
      adminUser.isActive = true;
    }

    if (!adminUser) {
      throw new Error("Failed to initialize admin user object");
    }

    await adminUser.save();

    let emailSent = false;
    // Always send/resend credentials during seeding to ensure user has the latest working ones
    try {
      const html = genericHtmlTemplate(
        isNew ? "Admin Account Created" : "Admin Account Credentials Reset",
        `
        <p>Hello Super Admin,</p>
        <p>Your administrative account credentials for Dazzling Tours have been ${isNew ? "created" : "recently updated"}.</p>
        <p><strong>Credentials:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${adminEmail}</li>
          <li><strong>Password:</strong> ${finalAdminPassword}</li>
        </ul>
        <p>Please login and change your password immediately for security reasons.</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ""}/admin/login" class="button">Login Now</a>
        `,
        { companyName: "Dazzling Tours" },
      );

      await sendEmail({
        to: adminEmail,
        subject: isNew
          ? "Your Admin Account Credentials - Dazzling Tours"
          : "Your Admin Account Credentials Reset - Dazzling Tours",
        html: html,
      });
      emailSent = true;
    } catch (emailError) {
      console.error("Failed to send admin credentials email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? `Admin user created successfully. ${emailSent ? "Credentials sent to email." : "Failed to send email."}`
        : `Admin user updated successfully. ${emailSent ? "New credentials sent to email." : "Failed to send email."}`,
      data: {
        email: adminUser.email,
        role: adminUser.role,
        emailSent,
      },
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to manage admin user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
