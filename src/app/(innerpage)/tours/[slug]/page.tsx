import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Tour } from "@/models";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TourDetails from "../../../Components/TourDetails/TourDetails";

// Fetch tour data on the server
async function getTourBySlug(slug: string) {
  try {
    await connectDB();
    const tour = await Tour.findOne({
      "seo.slug": slug,
      status: "Active",
    });

    if (!tour) {
      return null;
    }

    // Convert Mongoose document to plain object and serialize for client component
    const tourObj = tour.toObject ? tour.toObject({ flattenMaps: true }) : tour;

    // Ensure description is always a string (not undefined or null) before serialization
    if (!tourObj.description) {
      tourObj.description = "";
    }

    // Serialize to plain JSON to ensure all special types (ObjectId, Date, Buffer) are converted
    // This is necessary when passing data from Server Components to Client Components
    const serialized = JSON.parse(JSON.stringify(tourObj));

    // Ensure description is always a string after serialization
    if (!serialized.description) {
      serialized.description = "";
    }

    return serialized;
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
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
