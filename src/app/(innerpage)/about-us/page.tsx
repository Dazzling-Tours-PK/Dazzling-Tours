import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";
import About from "@/app/Components/About/About";
import Testimonial from "@/app/Components/Testimonial/Testimonial";
import Choose from "@/app/Components/Choose/Choose";

// SEO Metadata
export const metadata: Metadata = {
  title: "About Us | Dazzling Tours - Explore the nature",
  description: "Explore the nature",
  keywords: [
    "about us",
    "travel agency",
    "tour company",
    "travel experts",
    "personalized tours",
    "travel experiences",
    "Dazzling Tours",
  ],
  openGraph: {
    title: "About Us | Dazzling Tours - Explore the nature",
    description: "Explore the nature",
    type: "website",
    images: [
      {
        url: "/assets/img/about/about1.webp",
        alt: "Dazzling Tours - Explore the nature",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Dazzling Tours - Explore the nature",
    description: "Explore the nature",
    images: ["/assets/img/about/about1.webp"],
  },
  alternates: {
    canonical: "/about-us",
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

const AboutPage = () => {
  // Structured Data (JSON-LD) for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Dazzling Tours",
    description: "Explore the nature",
    url: baseUrl,
    logo: `${baseUrl}/assets/img/logo.png`,
    image: `${baseUrl}/assets/img/about/about1.webp`,
    sameAs: [
      // TODO: Add social media links if available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/aboutpage.png"
        Title="About Us"
      ></BreadCrumb>
      <About />
      <Choose />
      {/* <Counter1 /> */}
      <Testimonial />
    </>
  );
};

export default AboutPage;
