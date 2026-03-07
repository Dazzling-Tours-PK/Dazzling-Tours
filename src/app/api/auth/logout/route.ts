import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Since we're using stateless JWT tokens, logout is handled on the client side
    // by removing the token from storage. This endpoint can be used for any
    // server-side cleanup if needed in the future.

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
