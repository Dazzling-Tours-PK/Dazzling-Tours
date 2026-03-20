import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TourDetails from "../../../Components/TourDetails/TourDetails";
import { TourStatus, TestimonialStatus } from "@/lib/enums";

// Fetch tour data on the server
async function getTourBySlug(slug: string) {
  try {
    await connectDB();

    const tours = await Tour.aggregate([
      {
        $match: {
          "seo.slug": slug,
          status: TourStatus.ACTIVE,
        },
      },
      {
        $lookup: {
          from: "testimonials",
          let: { tourId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$tourId", "$$tourId"] },
                status: TestimonialStatus.ACTIVE,
              },
            },
          ],
          as: "activeTestimonials",
        },
      },
      {
        $addFields: {
          reviews: { $size: "$activeTestimonials" },
          rating: {
            $cond: {
              if: { $gt: [{ $size: "$activeTestimonials" }, 0] },
              then: { $min: [{ $avg: "$activeTestimonials.rating" }, 5] },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          activeTestimonials: 0,
        },
      },
    ]);

    const tour = tours[0];

    if (!tour) {
      return null;
    }

    // Serialize to plain JSON for Server Components
    const serialized = JSON.parse(JSON.stringify(tour));

    // Ensure description and images are valid
    if (!serialized.description) serialized.description = "";
    if (!serialized.images || !Array.isArray(serialized.images)) {
      serialized.images = [];
    } else {
      serialized.images = (serialized.images as unknown[]).filter(
        (img): img is string =>
          typeof img === "string" && img.trim().length > 0,
      );
    }

    return serialized;
  } catch (error) {
    console.error("❌ Error fetching tour by slug:", error);
    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
    }
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const tour = await getTourBySlug(resolvedParams.slug);

  if (!tour) {
    return {
      title: "Tour Not Found | Dazzling Tours",
      description: "The tour you're looking for doesn't exist.",
    };
  }

  const metaTitle = tour.seo?.metaTitle || tour.title;
  const metaDescription =
    tour.seo?.metaDescription ||
    tour.shortDescription ||
    tour.description?.substring(0, 160) ||
    "";
  const ogImage = tour.seo?.ogImage || tour.images?.[0] || "";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: tour.seo?.focusKeyword,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage, alt: tour.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `/tours/${tour.seo?.slug || tour._id}`,
    },
  };
}

const TourDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const resolvedParams = await params;
  const tour = await getTourBySlug(resolvedParams.slug);

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <BreadCrumb bgImg={tour.images?.[0]} Title={tour.title} />
      <TourDetails tour={tour} />
    </div>
  );
};

export default TourDetailsPage;
