import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React from "react";
import Link from "next/link";
import BreadCrumb from "./Components/Common/BreadCrumb";
import Icon from "./Components/Common/Icon";

export default function NotFound() {
  return (
    <div>
      <BreadCrumb
        bgImg={`${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero1.webp`}
        Title="Page Not Found"
      />
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-8">
            <span className="text-8xl md:text-9xl font-extrabold text-[#EF7C00]/20 tracking-widest block select-none">
              404
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-lg mx-auto">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
              >
                <Icon name="home" size={18} /> Back to Home
              </Link>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-8 py-3.5 rounded-full transition-all duration-300 active:scale-95"
              >
                Browse Tours <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
