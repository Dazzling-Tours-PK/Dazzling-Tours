import { NextRequest, NextResponse } from "next/server";
import { User, IUser } from "@/models";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { UserRole } from "@/lib/enums/roles";

export interface AuthenticatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLogin?: Date;
}

export interface AuthContext {
  user: AuthenticatedUser;
  token: string;
}

/**
 * Middleware to authenticate user and verify JWT token
 * Returns user context if authentication is successful
 */
export async function authenticateUser(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
  token?: string;
  error?: string;
  statusCode?: number;
}> {
  try {
    // Get token from request
    const token = getTokenFromRequest(request);
    if (!token) {
      return {
        success: false,
        error: "Authorization token required",
        statusCode: 401,
      };
    }

    // Verify JWT token
    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        success: false,
        error: "Invalid or expired token",
        statusCode: 401,
      };
    }

    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: "User not found",
        statusCode: 404,
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is deactivated",
        statusCode: 401,
      };
    }

    // Check if password was changed after token was issued
    if ((user as unknown as IUser).changedPasswordAfter(decoded.iat || 0)) {
      return {
        success: false,
        error: "Password was changed. Please login again.",
        statusCode: 401,
      };
    }

    const typedUser = user as unknown as IUser;
    return {
      success: true,
      user: {
        _id: String(typedUser._id),
        email: typedUser.email,
        firstName: typedUser.firstName,
        lastName: typedUser.lastName,
        role: typedUser.role,
        isEmailVerified: typedUser.isEmailVerified,
        lastLogin: typedUser.lastLogin,
      },
      token,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "Authentication failed",
      statusCode: 500,
    };
  }
}

/**
 * Middleware to check if user has required role
 */
export function requireRole(requiredRole: UserRole) {
  return (user: AuthenticatedUser): boolean => {
    return user.role === requiredRole;
  };
}

/**
 * Higher-order function to protect routes with authentication
 * Usage: export const POST = withAuth(async (request, context) => { ... })
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: AuthContext,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await authenticateUser(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const context: AuthContext = {
      user: authResult.user!,
      token: authResult.token!,
    };

    return handler(request, context);
  };
}

/**
 * Higher-order function to protect routes with role-based authorization
 * Usage: export const POST = withRoleAuth(UserRole.SUPER_ADMIN, async (request, context) => { ... })
 */
export function withRoleAuth(
  requiredRole: UserRole,
  handler: (
    request: NextRequest,
    context: AuthContext,
  ) => Promise<NextResponse>,
) {
  return withAuth(async (request, context) => {
    if (!requireRole(requiredRole)(context.user)) {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied. Required role: ${requiredRole}`,
        },
        { status: 403 },
      );
    }

    return handler(request, context);
  });
}

/**
 * Utility function to create error responses
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400,
): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: statusCode },
  );
}

/**
 * Utility function to create success responses
 */
export function createSuccessResponse<T = unknown>(
  data: T,
  message?: string,
  statusCode: number = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: statusCode },
  );
}
