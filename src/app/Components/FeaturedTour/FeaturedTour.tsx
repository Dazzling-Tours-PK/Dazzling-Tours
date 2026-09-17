"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Image as IKImage } from "@imagekit/next";
import { useGetTours } from "@/lib/hooks";
import { TourStatus } from "@/lib/enums";
import { formatCurrency } from "@/lib/utils/currencyConverter";
import { Section, Container } from "@/app/Components/Common";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const FeaturedTour = () => {
  const {
    data: toursData,
    isLoading: loading,
    error,
  } = useGetTours({
    status: TourStatus.ACTIVE,
    featured: true,
    limit: 8,
  });

  const tours = toursData?.data || [];
  const [api, setApi] = useState<CarouselApi>();

  const renderHeader = () => (
    <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
      <div className="w-full lg:w-2/3">
        <div className="mb-4">
          <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
            Featured Tours
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
            Handpicked Adventures <br className="hidden md:block" />
            Just For You
          </h2>
        </div>
        <p className="text-gray-600 text-base md:text-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both max-w-2xl">
          Discover our carefully curated selection of extraordinary journeys. From breathtaking landscapes to cultural treasures, find your perfect escape.
        </p>
      </div>
      <div className="w-full lg:w-1/3 flex flex-row items-center justify-start lg:justify-end gap-4 mt-4 lg:mt-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-500 fill-mode-both">
        <Link
          href="/tours"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#EF7C00] text-white rounded-full font-bold text-base hover:bg-[#d66e00] transition-all hover:scale-105 active:scale-95 shadow-md group"
        >
          View More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => api?.scrollPrev()}
            className="bg-white hover:bg-[var(--theme)] hover:text-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 transition-colors shadow-sm cursor-pointer"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="bg-white hover:bg-[var(--theme)] hover:text-white text-gray-700 w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 transition-colors shadow-sm cursor-pointer"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading || error || tours.length === 0) {
    return null;
  }

  return (
    <Section
      padding="lg"
      bg="muted"
      className="featured-tour-section fix bg-gray-50"
    >
      <Container>
        {renderHeader()}

        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {tours.map((tour) => (
                <CarouselItem
                  key={tour._id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border border-gray-100 relative group">
                    <div className="relative h-60 overflow-hidden">
                      <IKImage
                        src={tour.images[0]}
                        alt={tour.title}
                        width={308}
                        height={249}
                        transformation={[{ width: 600, height: 500 }]}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        {tour.location || "Location"}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        <Link
                          href={`/tours/${tour.seo?.slug}`}
                          className="hover:text-[var(--theme)] transition-colors"
                        >
                          {tour.title}
                        </Link>
                      </h4>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-lg font-bold text-[var(--theme)]">
                            {formatCurrency(tour.price)}
                          </span>
                          <span className="text-xs text-gray-400 block">
                            /{tour.priceType}
                          </span>
                        </div>
                        <Link
                          href={`/tours/${tour.seo?.slug || tour._id}`}
                          className="bg-gray-50 hover:bg-[var(--theme)] hover:text-white text-[var(--theme)] w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-gray-100"
                          aria-label="View Details"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Container>
    </Section>
  );
};

export default FeaturedTour;
