"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface BreadCrumbProps {
  Title: string;
  bgImg?: string;
  category?: string;
  categoryHref?: string;
  items?: BreadcrumbItemData[];
  minimal?: boolean;
}

const BreadCrumb = ({ Title, bgImg, category, categoryHref, items, minimal = false }: BreadCrumbProps) => {
  if (minimal) {
    return (
      <div className="w-full bg-white border-b border-gray-100 py-3.5 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList className="text-gray-500 text-xs md:text-sm font-medium flex-wrap">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={
                    <Link href="/" className="text-gray-500 hover:text-[#EF7C00] transition-colors flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                      </svg>
                      Home
                    </Link>
                  }
                />
              </BreadcrumbItem>

              {items && items.length > 0 ? (
                items.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <BreadcrumbSeparator className="text-gray-300" />
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink
                          render={
                            <Link href={item.href} className="text-gray-500 hover:text-[#EF7C00] transition-colors">
                              {item.label}
                            </Link>
                          }
                        />
                      ) : (
                        <BreadcrumbPage className="text-gray-800 font-semibold truncate max-w-[200px] md:max-w-md">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))
              ) : (
                <>
                  {category && (
                    <>
                      <BreadcrumbSeparator className="text-gray-300" />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          render={
                            <Link href={categoryHref || "/"} className="text-gray-500 hover:text-[#EF7C00] transition-colors">
                              {category}
                            </Link>
                          }
                        />
                      </BreadcrumbItem>
                    </>
                  )}
                  <BreadcrumbSeparator className="text-gray-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[#EF7C00] font-semibold truncate max-w-[220px] md:max-w-md">
                      {Title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative w-full min-h-[380px] md:min-h-[460px] py-16 md:py-20 flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: bgImg ? `url('${bgImg}')` : undefined,
      }}
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mt-12 md:mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 md:mb-8 drop-shadow-lg tracking-tight max-w-4xl mx-auto leading-tight">
            {Title}
          </h1>
          <Breadcrumb className="mt-4 md:mt-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-md">
            <BreadcrumbList className="text-white/90 sm:gap-3 text-sm md:text-base font-medium">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/" className="text-white hover:text-[#EF7C00] transition-colors flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" /></svg> Home</Link>}
                />
              </BreadcrumbItem>
              {items && items.length > 0 ? (
                items.map((item, idx) => (
                  <Fragment key={idx}>
                    <BreadcrumbSeparator className="text-white/60" />
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink
                          render={
                            <Link href={item.href} className="text-white hover:text-[#EF7C00] transition-colors">
                              {item.label}
                            </Link>
                          }
                        />
                      ) : (
                        <BreadcrumbPage className="text-[#EF7C00] font-bold truncate max-w-[200px] md:max-w-md">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))
              ) : (
                <>
                  {category && (
                    <>
                      <BreadcrumbSeparator className="text-white/60" />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          render={
                            <Link href={categoryHref || "/"} className="text-white hover:text-[#EF7C00] transition-colors">
                              {category}
                            </Link>
                          }
                        />
                      </BreadcrumbItem>
                    </>
                  )}
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[#EF7C00] font-bold truncate max-w-[220px] md:max-w-md">
                      {Title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
