import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TourDetails from "../../../Components/TourDetails/TourDetails";
import { TourStatus } from "@/lib/enums";

// Fetch tour data on the server
async function getTourBySlug(slug: string) {
  try {
    console.log("🔍 Fetching tour with slug:", slug);
    await connectDB();

    const tour = await Tour.findOne({
      "seo.slug": slug,
      status: TourStatus.ACTIVE,
    });

    console.log("📦 Tour found:", tour ? "Yes" : "No");

    if (!tour) {
      console.log("❌ Tour not found for slug:", slug);
      return null;
    }

    // Log raw tour document to see what we have
    console.log("📋 Raw tour document type:", tour.constructor.name);
    console.log("📋 Raw tour has images:", "images" in tour);
    const tourRecord = tour as unknown as Record<string, unknown>;
    console.log("📋 Raw tour images value:", tourRecord.images);
    console.log("📋 Raw tour images type:", typeof tourRecord.images);
    console.log(
      "📋 Raw tour images is array:",
      Array.isArray(tourRecord.images)
    );

    // Try to get images directly from the document using Mongoose methods
    if (
      tour &&
      typeof (tour as { get?: (key: string) => unknown }).get === "function"
    ) {
      const mongooseTour = tour as { get: (key: string) => unknown };
      const imagesFromGet = mongooseTour.get("images");
      console.log("📋 Images from .get():", imagesFromGet);
    }

    // Also try accessing via dot notation
    const imagesDirect = (tour as { images?: unknown }).images;
    console.log("📋 Images direct access (tour.images):", imagesDirect);

    // Log all available keys in the tour document
    const allKeys = Object.keys(tourRecord);
    console.log("📋 All keys in tour document:", allKeys);
    console.log("📋 Does 'images' key exist?", allKeys.includes("images"));

    // Convert Mongoose document to plain object to ensure all fields are included
    // This is the same approach used in the API routes
    const tourData = tour.toObject
      ? tour.toObject({ flattenMaps: true })
      : (tour as unknown as Record<string, unknown>);

    console.log("🔄 After toObject - tourData keys:", Object.keys(tourData));
    console.log("🔄 After toObject - images:", tourData.images);
    console.log("🔄 After toObject - images type:", typeof tourData.images);
    console.log(
      "🔄 After toObject - is array:",
      Array.isArray(tourData.images)
    );

    // Ensure description is always a string (not undefined or null)
    if (!tourData.description) {
      tourData.description = "";
    }

    // Ensure images array exists and is valid
    if (!tourData.images || !Array.isArray(tourData.images)) {
      console.log("⚠️ Images array missing or invalid, setting to empty array");
      tourData.images = [];
    } else {
      console.log("✅ Images array found with length:", tourData.images.length);
    }

    // Filter out any invalid image URLs
    const originalLength = tourData.images.length;
    tourData.images = tourData.images.filter(
      (img: string) => img && typeof img === "string" && img.trim().length > 0
    );
    console.log(
      "🔍 Filtered images:",
      originalLength,
      "->",
      tourData.images.length
    );

    // Serialize to plain JSON to ensure all special types (ObjectId, Date, Buffer) are converted
    // This is necessary when passing data from Server Components to Client Components
    const serialized = JSON.parse(JSON.stringify(tourData));

    console.log("📦 After serialization - keys:", Object.keys(serialized));
    console.log("📦 After serialization - images:", serialized.images);
    console.log(
      "📦 After serialization - images length:",
      serialized.images?.length
    );

    // Ensure description is always a string after serialization
    if (!serialized.description) {
      serialized.description = "";
    }

    // Ensure images array exists after serialization
    if (!serialized.images || !Array.isArray(serialized.images)) {
      console.log(
        "⚠️ Images missing after serialization, setting to empty array"
      );
      serialized.images = [];
    } else {
      // Ensure all image items are strings and filter out invalid ones
      serialized.images = (serialized.images as unknown[]).filter(
        (img): img is string => typeof img === "string" && img.trim().length > 0
      );
    }

    console.log("✅ Final tour data - images:", serialized.images);
    console.log(
      "✅ Final tour data - images length:",
      serialized.images.length
    );
    console.log("✅ Final tour data - first image:", serialized.images[0]);

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
    keywords: tour.seo?.focusKeyword || tour.location || "",
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
      <BreadCrumb
        bgImg={tour.images?.[0] || "/assets/img/breadcrumb/breadcrumb.jpg"}
        Title={tour.title}
      />
      <TourDetails tour={tour} />
    </div>
  );
};

export default TourDetailsPage;
