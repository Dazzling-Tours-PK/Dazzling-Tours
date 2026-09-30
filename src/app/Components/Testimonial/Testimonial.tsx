"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useGetTestimonials } from "@/lib/hooks";
import { TestimonialStatus } from "@/lib/enums/testimonial";
import { Star, StarHalf, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Section, Container } from "@/app/Components/Common";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Testimonial = () => {
  const { data: testimonialsData, isLoading: loading } = useGetTestimonials({
    status: TestimonialStatus.ACTIVE,
    featured: true,
    limit: 6,
  });

  const testimonials = testimonialsData?.data || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      if (starValue <= Math.floor(rating)) {
        return <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
      } else if (starValue === Math.ceil(rating) && rating % 1 !== 0) {
        return <StarHalf key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />;
      } else {
        return <Star key={i} className="w-5 h-5 text-gray-300" />;
      }
    });
  };

  if (loading) {
    return (
      <Section className="bg-gray-50 py-20">
        <Container>
          <div className="text-center animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </Container>
      </Section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonialImage =
    testimonials[currentSlide]?.image ||
    `${IMAGEKIT_URL_ENDPOINT}/assets/img/testimonial/default-avatar.png`;

  return (
    <Section className="bg-gray-50 py-24 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Side - Image */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#EF7C00]/20 to-transparent rounded-[2rem] transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-6"></div>
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image
                key={currentSlide}
                src={currentTestimonialImage}
                alt={testimonials[currentSlide]?.name || "Traveler"}
                fill
                className="object-cover transition-all duration-700 animate-in fade-in zoom-in-95"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:col-span-7">
            <div className="mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EF7C00]/10 text-[#EF7C00] font-bold text-sm tracking-widest uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#EF7C00]"></span>
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Stories From <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF7C00] to-yellow-500">Happy Travelers</span>
              </h2>
            </div>

            <div className="relative">
              <Quote className="absolute -top-6 -left-6 w-16 h-16 text-gray-200 -rotate-12 z-0" />
              <Carousel
                setApi={setApi}
                className="w-full relative z-10"
                plugins={[Autoplay({ delay: 5000 })]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial._id}>
                      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 mr-2">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex gap-1">
                            {renderStars(testimonial.rating)}
                          </div>
                          <span className="text-gray-500 font-medium">
                            {testimonial.rating.toFixed(1)} / 5.0
                          </span>
                        </div>

                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic mb-8 font-serif">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>

                        <div className="flex flex-col border-t border-gray-100 pt-6">
                          <h6 className="text-lg font-bold text-gray-900">{testimonial.name}</h6>
                          <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                            <p>{testimonial.location || "Traveler"}</p>
                            {testimonial.tourId && (
                              <span className="px-3 py-1 bg-gray-100 rounded-full font-medium text-[#EF7C00]">
                                {testimonial.tourId.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Custom Navigation */}
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => api?.scrollPrev()}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[#EF7C00] hover:text-white hover:border-[#EF7C00] shadow-sm transition-all active:scale-95"
                  aria-label="Previous Testimonial"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => api?.scrollNext()}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[#EF7C00] hover:text-white hover:border-[#EF7C00] shadow-sm transition-all active:scale-95"
                  aria-label="Next Testimonial"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex gap-1.5 ml-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-6 bg-[#EF7C00]" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Testimonial;
