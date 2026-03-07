import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Booking } from "@/models";
import { MongoQuery } from "@/lib/types";

// GET /api/bookings - Get all bookings
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const tourId = searchParams.get("tourId");

    const query: MongoQuery = {};

    if (status) query.status = status;
    if (tourId) query.tourId = tourId;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate("tourId", "title price duration")
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const booking = new Booking(body);
    await booking.save();

    // Populate the tour details
    await booking.populate("tourId", "title price duration");

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message: "Booking created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
