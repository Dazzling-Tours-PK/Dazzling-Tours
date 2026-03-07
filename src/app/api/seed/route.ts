import { NextResponse } from "next/server";
import { seedDatabase, isDatabaseEmpty } from "@/lib/seed";

// POST /api/seed - Seed the database with sample data
export async function POST() {
  try {
    // Check if database is already populated
    const isEmpty = await isDatabaseEmpty();

    if (!isEmpty) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database is not empty. Seeding skipped to prevent data duplication.",
        },
        { status: 400 },
      );
    }

    // Seed the database
    const result = await seedDatabase();

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 },
    );
  }
}

// GET /api/seed - Check if database is empty
export async function GET() {
  try {
    const isEmpty = await isDatabaseEmpty();

    return NextResponse.json({
      success: true,
      isEmpty,
      message: isEmpty
        ? "Database is empty and ready for seeding"
        : "Database contains data",
    });
  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check database status" },
      { status: 500 },
    );
  }
}
