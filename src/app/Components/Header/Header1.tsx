"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/app/Components/Common";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Header1() {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`w-full transition-all duration-300 z-40 ${isSticky
          ? "fixed top-0 left-0 right-0 bg-[#EF7C00] shadow-lg py-3 animate-in fade-in slide-in-from-top-4 duration-300"
          : "absolute top-0 left-0 right-0 bg-transparent py-5"
          }`}
      >
        <Container fluid>
          <div className="flex items-center justify-between px-4 lg:px-8">
            {/* Logo — the source file is 4546x3654 (aspect 1.244), so
                width/height carry that ratio rather than an invented one.
                With `w-auto` the browser derives the width from the real
                ratio, so a mismatched pair reserves the wrong space and
                shifts the layout as the logo loads. */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className={`inline-flex items-center justify-center transition-all duration-300 ${isSticky
                  ? "bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl shadow-sm hover:bg-white"
                  : "bg-transparent p-0"
                  }`}
              >
                <Image
                  src={
                    isSticky
                      ? `${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_White.png`
                      : `${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`
                  }
                  alt="Dazzling Tours"
                  width={50}
                  height={40}
                  className={`${isSticky ? "h-14" : "h-18"
                    } w-auto object-contain transition-all duration-300`}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <Nav setMobileToggle={setMobileToggle} isSticky={isSticky} />
            </div>

            {/* Request A Quote button (Desktop) */}
            <div className="hidden lg:block">
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 py-2.5 px-6 font-bold text-white rounded-full border transition-all hover:scale-[1.02] active:scale-95 ${isSticky
                  ? "border-white bg-white/10 hover:bg-white hover:text-[#EF7C00]"
                  : "border-white/30 bg-white/5 hover:bg-white hover:text-gray-900"
                  }`}
              >
                Request A Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setMobileToggle(!mobileToggle)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileToggle ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileToggle
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={() => setMobileToggle(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer content */}
        <div
          className={`absolute inset-y-0 right-0 w-80 max-w-full bg-white shadow-2xl p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-out ${mobileToggle ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Header of Mobile Menu */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <Link href="/" onClick={() => setMobileToggle(false)}>
              <Image
                src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`}
                alt="Dazzling Tours"
                width={40}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setMobileToggle(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links inside Drawer */}
          <div className="flex-grow overflow-y-auto">
            <Nav setMobileToggle={setMobileToggle} isMobile={true} />
          </div>
        </div>
      </div>
    </>
  );
}
