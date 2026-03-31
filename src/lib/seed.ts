import connectDB from "@/lib/mongodb";
import { Category } from "@/models";
import {
  UNCATEGORIZED_CATEGORY_NAME,
  UNCATEGORIZED_CATEGORY_SLUG,
} from "@/lib/constants/categories";

// Function to seed the database
export async function seedDatabase() {
  try {
    await connectDB();

    // Seed "Uncategorized" category if it doesn't exist
    const uncategorizedExists = await Category.findOne({
      name: UNCATEGORIZED_CATEGORY_NAME,
    });
    if (!uncategorizedExists) {
      await Category.create({
        name: UNCATEGORIZED_CATEGORY_NAME,
        slug: UNCATEGORIZED_CATEGORY_SLUG,
        description:
          "Default category for tours and blogs without a specific category",
      });

    }

    return {};
  } catch (error) {
    throw error;
  }
}

// Function to check if database is empty
export async function isDatabaseEmpty() {
  try {
    await connectDB();
    // Add your database empty check logic here if needed
    return true;
  } catch {
    return false;
  }
}
