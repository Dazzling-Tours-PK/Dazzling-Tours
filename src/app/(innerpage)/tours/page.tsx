import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Tour from "../../Components/Tour/Tour";

// SEO Metadata for Tours Page
export const metadata: Metadata = {
  title: "Tours - Discover Handpicked Adventures | Dazzling Tours",
  description:
    "Explore our curated collection of handpicked tours and travel packages. From breathtaking landscapes to cultural treasures, find your perfect adventure with Dazzling Tours.",
  keywords: [
    "tours",
    "travel packages",
    "tour packages",
    "adventure tours",
    "vacation tours",
    "travel destinations",
    "tour booking",
    "travel agency tours",
    "Dazzling Tours",
    "customized tours",
  ],
  openGraph: {
    title: "Tours - Discover Handpicked Adventures | Dazzling Tours",
    description:
      "Explore our curated collection of handpicked tours and travel packages. From breathtaking landscapes to cultural treasures, find your perfect adventure.",
    type: "website",
    images: [
      {
        url: "/assets/img/tours/tourspage.png",
        alt: "Dazzling Tours - Tours",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tours - Discover Handpicked Adventures | Dazzling Tours",
    description:
      "Explore our curated collection of handpicked tours and travel packages. Find your perfect adventure.",
    images: ["/assets/img/tours/tourspage.png"],
  },
  alternates: {
    canonical: "/tours",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const ToursPage = () => {
  // Structured Data (JSON-LD) for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tours - Dazzling Tours",
    description:
      "Explore our curated collection of handpicked tours and travel packages. From breathtaking landscapes to cultural treasures, find your perfect adventure.",
    url: `${baseUrl}/tours`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tours",
        item: `${baseUrl}/tours`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <BreadCrumb
        bgImg="/assets/img/tours/tourspage.png"
        Title="Tours"
      ></BreadCrumb>
      <Tour></Tour>
    </>
  );
};

export default ToursPage;
