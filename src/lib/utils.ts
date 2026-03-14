import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour, Contact } from "@/models";

// Utility function to validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to validate phone number
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Utility function to format currency
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Utility function to validate required fields
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[],
): string[] {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      missingFields.push(field);
    }
  });

  return missingFields;
}

// Utility function to sanitize input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

// Utility function to paginate results
export function paginateResults(page: number, limit: number, total: number) {
  const skip = (page - 1) * limit;
  const pages = Math.ceil(total / limit);

  return {
    page,
    limit,
    skip,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
}

// Utility function to handle API errors
export function handleApiError(
  error: unknown,
  message: string = "An error occurred",
) {
  console.error("API Error:", error);

  if (
    error &&
    typeof error === "object" &&
    "name" in error &&
    error.name === "ValidationError" &&
    "errors" in error
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation Error",
        details: Object.values(
          (error as { errors: Record<string, { message: string }> }).errors,
        ).map((err) => err.message),
      },
      { status: 400 },
    );
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: number }).code === 11000
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Duplicate entry",
        message: "This record already exists",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ success: false, error: message }, { status: 500 });
}

// Utility function to send email (placeholder - implement with your email service)
export async function sendEmail() {
  // Implement email sending logic here
  // You can use services like SendGrid, Nodemailer, etc.
}

// Database utility functions
export async function getTourStats() {
  try {
    await connectDB();

    const totalTours = await Tour.countDocuments();
    const activeTours = await Tour.countDocuments({ status: "Active" });
    const featuredTours = await Tour.countDocuments({ featured: true });

    return {
      totalTours,
      activeTours,
      featuredTours,
    };
  } catch (error) {
    console.error("Error getting tour stats:", error);
    return null;
  }
}

export async function getContactStats() {
  try {
    await connectDB();

    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: "New" });
    const repliedContacts = await Contact.countDocuments({ status: "Replied" });

    return {
      totalContacts,
      newContacts,
      repliedContacts,
    };
  } catch (error) {
    console.error("Error getting contact stats:", error);
    return null;
  }
}
