import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, IUser } from "@/models";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded: { userId: string; email: string; role: string; iat?: number };
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback-secret",
      ) as { userId: string; email: string; role: string; iat?: number };
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    // Find user
    const user = await User.findById(decoded.userId);
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

    // Check if password was changed after token was issued
    if ((user as unknown as IUser).changedPasswordAfter(decoded.iat || 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Password was changed. Please login again.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
