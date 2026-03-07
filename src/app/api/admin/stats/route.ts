import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Tour, Blog, Contact, Testimonial } from "@/models";
import { BlogStatus } from "@/lib/enums/blog";

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    await connectDB();

    // Get all counts in parallel
    const [
      totalTours,
      publishedTours,
      featuredTours,
      totalBlogs,
      publishedBlogs,
      featuredBlogs,
      totalContacts,
      newContacts,
      totalTestimonials,
      publishedTestimonials,
    ] = await Promise.all([
      // Tours
      Tour.countDocuments(),
      Tour.countDocuments({ status: "Published" }),
      Tour.countDocuments({ featured: true }),
      // Blogs
      Blog.countDocuments(),
      Blog.countDocuments({ status: BlogStatus.PUBLISHED }),
      Blog.countDocuments({ featured: true }),
      // Contacts
      Contact.countDocuments(),
      Contact.countDocuments({ status: "New" }),

      // Testimonials
      Testimonial.countDocuments(),
      Testimonial.countDocuments({ status: "Published" }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tours: {
          total: totalTours,
          published: publishedTours,
          featured: featuredTours,
        },
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
          featured: featuredBlogs,
        },
        contacts: {
          total: totalContacts,
          new: newContacts,
        },

        testimonials: {
          total: totalTestimonials,
          published: publishedTestimonials,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
