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
    let adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail) {
      return NextResponse.json(
        { success: false, message: "Admin email not configured (ADMIN_EMAIL)" },
        { status: 500 },
      );
    }

    // Generate random password if not provided
    const isRandomPassword = !adminPassword;
    if (isRandomPassword) {
      adminPassword = crypto.randomBytes(12).toString("hex");
    }

    // 2. Use findOneAndUpdate with upsert for a more atomic operation
    // This handles both cases: creation if not exists, or update if exists
    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $setOnInsert: {
          password: adminPassword, // Hashed by pre-save middleware if newly created
          firstName: "Super",
          lastName: "Admin",
          role: UserRole.SUPER_ADMIN,
          isActive: true,
          isEmailVerified: true,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    const isNew =
      adminUser.createdAt.getTime() === adminUser.updatedAt.getTime();

    let emailSent = false;
    if (isNew) {
      // Send email with credentials
      try {
        const html = genericHtmlTemplate(
          "Admin Account Created",
          `
          <p>Hello Super Admin,</p>
          <p>Your administrative account has been successfully created for Dazzling Tours.</p>
          <p><strong>Credentials:</strong></p>
          <ul>
            <li><strong>Email:</strong> ${adminEmail}</li>
            <li><strong>Password:</strong> ${adminPassword}</li>
          </ul>
          <p>Please login and change your password immediately for security reasons.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" class="button">Login Now</a>
          `,
          { companyName: "Dazzling Tours" },
        );

        await sendEmail({
          to: adminEmail,
          subject: "Your Admin Account Credentials - Dazzling Tours",
          html: html,
        });
        emailSent = true;
      } catch (emailError) {
        console.error("Failed to send admin credentials email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? `Admin user created successfully. ${emailSent ? "Credentials sent to email." : "Failed to send email."}`
        : "Admin user already exists.",
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
