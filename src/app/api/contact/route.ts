import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Contact } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/contact - Get all contact inquiries
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query: MongoQuery = {};
    if (status) query.status = status;

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

// POST /api/contact - Create a new contact inquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const contactData = {
      ...body,
    };

    // Validate required fields
    const requiredFields = ["name", "email"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    const contact = new Contact(contactData);
    await contact.save();

    return NextResponse.json(
      {
        success: true,
        data: contact,
        message: "Contact inquiry submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact inquiry" },
      { status: 500 },
    );
  }
}

// PUT /api/contact - Update multiple contact inquiries (bulk operations)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, ids, data } = body;

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: "Action and ids are required" },
        { status: 400 },
      );
    }

    let result;
    switch (action) {
      case "updateStatus":
        result = await Contact.updateMany(
          { _id: { $in: ids } },
          { status: data.status },
        );
        break;
      case "delete":
        result = await Contact.deleteMany({ _id: { $in: ids } });
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Contact inquiries ${action} completed successfully`,
    });
  } catch (error) {
    console.error("Error updating contact inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact inquiries" },
      { status: 500 },
    );
  }
}
