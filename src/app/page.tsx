import React from "react";
import type { Metadata } from "next";
import FeaturedTour from "@/app/Components/FeaturedTour/FeaturedTour";
import HeroBanner2 from "@/app/Components/HeroBanner/HeroBanner";
import About from "./Components/About/About";
import Choose from "./Components/Choose/Choose";
import Testimonial from "./Components/Testimonial/Testimonial";
import Cta from "./Components/Cta/Cta";
import Blog3 from "./Components/Blogs/Blog3";

// SEO Metadata for Homepage
export const metadata: Metadata = {
  title: "Dazzling Tours - Explore the nature",
  description: "Explore the nature",
  keywords: [
    "travel agency",
    "tour packages",
    "travel tours",
    "adventure tours",
    "vacation packages",
    "travel experiences",
    "tour company",
    "Dazzling Tours",
    "travel destinations",
    "customized tours",
  ],
  openGraph: {
    title: "Dazzling Tours - Explore the nature",
    description: "Explore the nature",
    type: "website",
    images: [
      {
        url: "/assets/img/hero/hero2.webp",
        alt: "Dazzling Tours - Explore the nature",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dazzling Tours - Explore the nature",
    description: "Explore the nature",
    images: ["/assets/img/hero/hero2.webp"],
  },
  alternates: {
    canonical: "/",
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

const HomePage = () => {
  // Structured Data (JSON-LD) for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dazzling Tours",
    description: "Explore the nature",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/tours?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Dazzling Tours",
    description: "Explore the nature",
    url: baseUrl,
    logo: `${baseUrl}/assets/img/dazzling-logo/Dazzling Tours Png.png`,
    image: `${baseUrl}/assets/img/hero/hero2.webp`,
    sameAs: [
      // TODO: Add social media links if available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
    areaServed: {
      "@type": "Place",
      name: "Pakistan",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <HeroBanner2 />
      <About />
      <FeaturedTour />
      <Choose />
      <Testimonial />
      <Cta />
      <Blog3 />
    </>
  );
};

export default HomePage;
