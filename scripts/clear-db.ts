import connectDB from "../src/lib/mongodb";
import {
  Tour,
  Booking,
  CustomerUser,
  Contact,
  Blog,
  Testimonial,
  Comment,
  User,
  OTP,
  Category,
} from "../src/models";

async function clearDatabase() {
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();

    console.log("🗑️  Starting database cleanup...\n");

    // Clear all collections
    const collections = [
      { name: "Tour", model: Tour },
      { name: "Booking", model: Booking },
      { name: "CustomerUser", model: CustomerUser },
      { name: "Contact", model: Contact },
      { name: "Blog", model: Blog },
      { name: "Testimonial", model: Testimonial },
      { name: "Comment", model: Comment },
      { name: "User", model: User },
      { name: "OTP", model: OTP },
      { name: "Category", model: Category },
    ];

    for (const collection of collections) {
      try {
        const result = await collection.model.deleteMany({});
        console.log(
          `✅ Cleared ${collection.name}: ${result.deletedCount} documents`,
        );
      } catch (error) {
        console.error(`❌ Error clearing ${collection.name}:`, error);
      }
    }

    console.log("\n✨ Database cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    process.exit(1);
  }
}

clearDatabase();
