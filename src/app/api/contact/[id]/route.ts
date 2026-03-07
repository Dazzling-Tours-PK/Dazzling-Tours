import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Contact } from "@/models";

// GET /api/contact/[id] - Get a single contact query
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const contact = await Contact.findById(resolvedParams.id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact query not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact query:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact query" },
      { status: 500 },
    );
  }
}

// PUT /api/contact/[id] - Update a contact query
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const body = await request.json();
    const resolvedParams = await params;

    // Validate email format if email is being updated
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 },
        );
      }
    }

    const contact = await Contact.findByIdAndUpdate(
      resolvedParams.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true },
    );

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact query not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
      message: "Contact query updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact query:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact query" },
      { status: 500 },
    );
  }
}

// DELETE /api/contact/[id] - Delete a contact query
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const contact = await Contact.findByIdAndDelete(resolvedParams.id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact query not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact query deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact query:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact query" },
      { status: 500 },
    );
  }
}
