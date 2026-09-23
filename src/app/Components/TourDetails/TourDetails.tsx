"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React, { useState } from "react";
import { AppImage } from "@/app/Components/Common";
import { ImageVariant } from "@/lib/constants/imageDimensions";
import { Tour, ItineraryItem } from "@/lib/types/tour";
import {
  useGetTestimonials,
  useCreateTestimonial,
  useCreateContactInquiry,
  useNotification,
  useForm,
  useTourFavorites,
} from "@/lib/hooks";
import { TestimonialStatus } from "@/lib/enums";
import { ContactGroupType, getContactGroupTypes } from "@/lib/types/enums";
import { Accordion, ShareButtons } from "@/app/Components/Common";
import Icon from "@/app/Components/Common/Icon";
import { TextInput, Textarea, Select } from "@/app/Components/Form";
import { ErrorResponse } from "@/lib/types";

interface TourDetailsProps {
  tour: Tour;
}

const TourInfoBox = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-4 py-3">
    <div className="flex justify-center items-center shrink-0 w-14 h-14 bg-[#EF7C00]/10 rounded-2xl shadow-sm border border-[#EF7C00]/20">
      <Icon name={icon} className="text-[#EF7C00]" size={24} />
    </div>
    <div className="flex flex-col items-start gap-1">
      <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
      <h6 className="font-extrabold m-0 text-base md:text-lg text-gray-900 leading-none">
        {value}
      </h6>
    </div>
  </div>
);

const TourDetails = ({ tour }: TourDetailsProps) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const [showLightbox, setShowLightbox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const { showSuccess, showError } = useNotification();
  const createContact = useCreateContactInquiry();
  const createTestimonial = useCreateTestimonial();
  const { toggleFavorite, isFavorite } = useTourFavorites();


  // Review Form State
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      designation: "",
      location: "",
      rating: 5,
    },
    onSubmit: async (values) => {
      createTestimonial.mutate(
        {
          ...values,
          content: values.message,
          tourId: tour._id,
          status: TestimonialStatus.PENDING,
        },
        {
          onSuccess: () => {
            showSuccess("Review submitted! It will be visible after approval.");
            form.reset();
          },
          onError: (error: ErrorResponse) => {
            showError(
              "Failed to submit review: " +
              (error.response?.data?.error ||
                error.message ||
                "Unknown error"),
            );
          },
        },
      );
    },
  });

  // Dynamic Testimonials
  const { data: testimonialsData, isLoading: isLoadingTestimonials } =
    useGetTestimonials({
      tourId: tour._id,
      status: TestimonialStatus.ACTIVE,
    });
  const testimonials = testimonialsData?.data || [];

  // Booking Form
  const bookingForm = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      participants: 1,
      groupType: ContactGroupType.INDIVIDUAL,
      departureCity: "",
      placesToVisit: "",
      travelDate: "",
      numberOfDays: 1,
      numberOfRooms: 1,
      comment: "",
    },
    onSubmit: async (values) => {
      createContact.mutate(
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: tour.title,
          message: values.comment,
          tourId: tour._id,
          startDate: values.travelDate,
          participants: Number(values.participants),
          groupType: isCustomizing ? values.groupType : ContactGroupType.INDIVIDUAL,
          numberOfDays: Number(values.numberOfDays),
          numberOfRooms: isCustomizing ? Number(values.numberOfRooms) : 1,
          departureCity: isCustomizing ? values.departureCity : "",
          placesToVisit: isCustomizing ? values.placesToVisit : "",
        },
        {
          onSuccess: () => {
            showSuccess("Your enquiry has been sent successfully!");
            bookingForm.reset();
            setIsCustomizing(false);
          },
          onError: (error: ErrorResponse) => {
            showError(
              "Failed to send enquiry: " +
              (error.response?.data?.error ||
                error.message ||
                "Unknown error"),
            );
          },
        },
      );
    },
  });

  const handleOpenLightbox = (index: number) => {
    setPhotoIndex(index);
    setShowLightbox(true);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const title = tour.title;
    const text = `Check out this tour: ${tour.title}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Link copied to clipboard!");
    } catch {
      showError("Failed to copy link");
    }
  };

  return (
    <>
      {/* Top dark gradient overlay so the transparent navbar is crisp and visible at scrollY=0 */}
      <div className="absolute top-0 left-0 right-0 h-28 md:h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-20" />

      <section className="relative pt-24 md:pt-28 pb-16 lg:pb-24 bg-white min-h-screen">
        <div className="container max-w-6xl mx-auto px-4">

          {/* Bento Photo Gallery */}
          <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mb-6 bg-gray-100">
            {tour.images && tour.images.length >= 5 ? (
              // 5+ Photos: 1 Large Left (50%), 4 Small Right (2x2)
              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[340px] sm:h-[420px] lg:h-[480px]">
                {/* Main Large Photo */}
                <div
                  className="md:col-span-2 md:row-span-2 relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(0)}
                >
                  <AppImage
                    variant={ImageVariant.HERO}
                    src={tour.images[0]}
                    alt={tour.title}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Photo 1 */}
                <div
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(1)}
                >
                  <AppImage
                    variant={ImageVariant.CARD}
                    src={tour.images[1]}
                    alt={`${tour.title} 2`}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Photo 2 (Top Right) */}
                <div
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(2)}
                >
                  <AppImage
                    variant={ImageVariant.CARD}
                    src={tour.images[2]}
                    alt={`${tour.title} 3`}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Photo 3 */}
                <div
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(3)}
                >
                  <AppImage
                    variant={ImageVariant.CARD}
                    src={tour.images[3]}
                    alt={`${tour.title} 4`}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Photo 4 (Bottom Right with "Show all photos" button) */}
                <div
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(4)}
                >
                  <AppImage
                    variant={ImageVariant.CARD}
                    src={tour.images[4]}
                    alt={`${tour.title} 5`}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(0);
                    }}
                    className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 font-semibold text-xs md:text-sm px-4 py-2 rounded-xl shadow-md border border-gray-200/80 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
                  >
                    <Icon name="grid" size={16} />
                    Show all {tour.images.length} photos
                  </button>
                </div>
              </div>
            ) : tour.images && tour.images.length > 1 ? (
              // 2 to 4 Photos
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[340px] sm:h-[420px] lg:h-[480px]">
                <div
                  className="relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(0)}
                >
                  <AppImage
                    variant={ImageVariant.HERO}
                    src={tour.images[0]}
                    alt={tour.title}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenLightbox(1)}
                >
                  <AppImage
                    variant={ImageVariant.HERO}
                    src={tour.images[1]}
                    alt={`${tour.title} 2`}
                    imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(0);
                    }}
                    className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 font-semibold text-xs md:text-sm px-4 py-2 rounded-xl shadow-md border border-gray-200/80 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
                  >
                    <Icon name="grid" size={16} />
                    Show all {tour.images.length} photos
                  </button>
                </div>
              </div>
            ) : (
              // 1 Photo (Single Hero)
              <div
                className="relative h-[320px] sm:h-[400px] lg:h-[460px] w-full overflow-hidden cursor-pointer group"
                onClick={() => handleOpenLightbox(0)}
              >
                <AppImage
                  variant={ImageVariant.HERO}
                  src={tour.images?.[0] || `${IMAGEKIT_URL_ENDPOINT}/assets/img/hero/hero1.webp`}
                  alt={tour.title}
                  imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenLightbox(0);
                  }}
                  className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 font-semibold text-xs md:text-sm px-4 py-2 rounded-xl shadow-md border border-gray-200/80 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
                >
                  <Icon name="expand" size={16} />
                  View photo
                </button>
              </div>
            )}
          </div>

          {/* Title & Actions Section */}
          <div className="pb-6 border-b border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                {tour.category && tour.category.toLowerCase() !== "uncategorized" && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EF7C00]/10 text-[#EF7C00] border border-[#EF7C00]/20">
                      {tour.category}
                    </span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight m-0">
                  {tour.title}
                </h1>
              </div>

              {/* Price & Actions on Right */}
              <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
                {tour.price && (
                  <div className="text-left md:text-right">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block font-semibold">Starting from</span>
                    <span className="text-2xl font-extrabold text-[#EF7C00]">
                      PKR {tour.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/ {tour.priceType || "person"}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#EF7C00] px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#EF7C00]/30 transition-all cursor-pointer group shadow-sm active:scale-95"
                  >
                    <Icon name="share" size={16} className="text-gray-500 group-hover:text-[#EF7C00] transition-colors" />
                    <span>Share</span>
                  </button>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(tour._id)}
                    className={`inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer group shadow-sm active:scale-95 ${isFavorite(tour._id)
                        ? "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                        : "bg-white border border-gray-200 text-gray-700 hover:text-[#EF7C00] hover:bg-gray-50 hover:border-[#EF7C00]/30"
                      }`}
                  >
                    <Icon
                      name={isFavorite(tour._id) ? "heart-fill" : "heart"}
                      size={16}
                      className={
                        isFavorite(tour._id)
                          ? "text-rose-500 fill-current"
                          : "text-gray-500 group-hover:text-[#EF7C00] transition-colors"
                      }
                    />
                    <span>{isFavorite(tour._id) ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                {/* Key Facts Grid */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TourInfoBox icon="map-pin" label="Location" value={tour.location || "N/A"} />
                    {tour.duration && <TourInfoBox icon="clock" label="Duration" value={tour.duration} />}
                    {typeof tour.groupSize === "number" && <TourInfoBox icon="users" label="Group Size" value={`${tour.groupSize} People`} />}
                    {typeof tour.price === "number" && <TourInfoBox icon="tag" label="Price" value={`PKR ${tour.price.toLocaleString()} / ${tour.priceType}`} />}
                    {tour.rating > 0 && <TourInfoBox icon="star" label="Rating" value={`${tour.rating.toFixed(1)} (${tour.reviews} reviews)`} />}
                  </div>
                </div>

                {tour.description && tour.description.trim() && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h3>
                    <div
                      className="prose prose-lg max-w-none text-gray-600"
                      dangerouslySetInnerHTML={{ __html: tour.description }}
                      suppressHydrationWarning
                    />
                  </div>
                )}

                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Tour Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tour.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <span className="flex-shrink-0 flex justify-center items-center w-12 h-12 bg-[#EF7C00]/10 text-[#EF7C00] rounded-xl">
                            <Icon name="star-fill" size={20} />
                          </span>
                          <span className="font-semibold text-gray-800 pt-1 text-lg">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {tour.includes && tour.includes.length > 0 && (
                    <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-3xl p-6 sm:p-7 shadow-sm">
                      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-emerald-100/60">
                        <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          ✓
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 m-0">What&apos;s Included</h3>
                      </div>
                      <ul className="flex flex-col gap-3.5">
                        {tour.includes.map((incl, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 text-sm md:text-base leading-relaxed">
                            <span className="mt-1 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                              ✓
                            </span>
                            <span className="font-medium">{incl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tour.excludes && tour.excludes.length > 0 && (
                    <div className="bg-rose-50/40 border border-rose-100/80 rounded-3xl p-6 sm:p-7 shadow-sm">
                      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-rose-100/60">
                        <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          ✕
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 m-0">What&apos;s Excluded</h3>
                      </div>
                      <ul className="flex flex-col gap-3.5">
                        {tour.excludes.map((excl, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 text-sm md:text-base leading-relaxed">
                            <span className="mt-1 w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 text-xs font-bold">
                              ✕
                            </span>
                            <span className="font-medium">{excl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {tour.itinerary && tour.itinerary.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Tour Plan</h3>
                    <Accordion
                      items={tour.itinerary.map((item: ItineraryItem) => ({
                        title: `Day ${item.day}: ${item.title}`,
                        content: item.description ? (
                          <div
                            className="prose text-gray-600 max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                            suppressHydrationWarning
                          />
                        ) : (
                          <p className="text-gray-500">No details provided for this day.</p>
                        ),
                      }))}
                      defaultOpenIndex={0}
                    />
                  </div>
                )}

              </div>

              {/* Reviews Card (Separated) */}
              <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 m-0">Reviews ({testimonials.length})</h3>
                  {tour.rating > 0 && (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Icon name="star-fill" size={14} className="text-yellow-400" />
                      <span>{tour.rating.toFixed(1)}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500 font-normal">{testimonials.length} reviews</span>
                    </div>
                  )}
                </div>
                {isLoadingTestimonials ? (
                  <div className="text-center p-8 text-gray-500">Loading reviews...</div>
                ) : testimonials.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={testimonial._id || index} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex-shrink-0 w-16 md:w-20">
                          <AppImage
                            variant={ImageVariant.AVATAR}
                            src={testimonial.image || `${IMAGEKIT_URL_ENDPOINT}/assets/img/testimonial/default-avatar.png`}
                            alt={testimonial.name}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <h5 className="font-bold text-lg text-gray-900 m-0">{testimonial.name}</h5>
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Icon key={i} name={`star${i < (testimonial.rating || 5) ? "-fill" : ""}`} className="text-yellow-400" size={16} />
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {testimonial.designation && <span className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded-full text-gray-600">{testimonial.designation}</span>}
                            {testimonial.location && <span className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded-full text-gray-600 flex items-center gap-1"><Icon name="map-pin" size={12} />{testimonial.location}</span>}
                            {testimonial.status === TestimonialStatus.ACTIVE && <span className="px-3 py-1 bg-green-50 border border-green-200 text-xs font-bold rounded-full text-green-700 flex items-center gap-1"><Icon name="shield-check" size={12} />Verified</span>}
                          </div>
                          <p className="text-gray-700 italic leading-relaxed">&quot;{testimonial.content}&quot;</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 text-gray-500">
                    No reviews yet for this tour. Be the first to share your experience!
                  </div>
                )}

                <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
                  <form onSubmit={form.handleSubmit()} className="flex flex-col gap-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-700">Your Rating:</span>
                      <div className="flex gap-1 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Icon key={s} name={`star${s <= form.values.rating ? "-fill" : ""}`} className="text-yellow-400 hover:scale-110 transition-transform" size={24} onClick={() => form.setFieldValue("rating", s)} />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput label="Your Name" name="name" placeholder="John Doe" value={form.values.name} onChange={(val) => form.setFieldValue("name", val)} required />
                      <TextInput label="Your Email" name="email" type="email" placeholder="john@example.com" value={form.values.email} onChange={(val) => form.setFieldValue("email", val)} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextInput label="Traveler Type" name="designation" placeholder="Family Trip, Solo..." value={form.values.designation} onChange={(val) => form.setFieldValue("designation", val)} />
                      <TextInput label="Location" name="location" placeholder="City, Country" value={form.values.location} onChange={(val) => form.setFieldValue("location", val)} />
                    </div>
                    <Textarea label="Your Review" name="message" placeholder="Tell us about your experience..." rows={4} value={form.values.message} onChange={(val) => form.setFieldValue("message", val)} required />
                    <button type="submit" className="mt-2 w-full md:w-auto bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70" disabled={createTestimonial.isPending}>
                      {createTestimonial.isPending ? "Submitting..." : "Submit Review"} <Icon name="arrow-right" size={18} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col max-h-[calc(100vh-125px)]">
                <div className="bg-[#EF7C00] p-6 text-center shrink-0">
                  <h4 className="text-white font-bold text-2xl m-0 tracking-wide uppercase">Book This Tour</h4>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                  <form onSubmit={bookingForm.handleSubmit()} className="flex flex-col gap-4">
                    <div className="relative">
                      <Icon name="user" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all" value={bookingForm.values.name} onChange={(e) => bookingForm.setFieldValue("name", e.target.value)} placeholder="Full Name" required />
                    </div>
                    <div className="relative">
                      <Icon name="mail" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all" value={bookingForm.values.email} onChange={(e) => bookingForm.setFieldValue("email", e.target.value)} placeholder="Email Address" required />
                    </div>
                    <div className="relative">
                      <Icon name="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="tel" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all" value={bookingForm.values.phone} onChange={(e) => bookingForm.setFieldValue("phone", e.target.value)} placeholder="Phone Number" required />
                    </div>
                    <div className="relative">
                      <Icon name="calendar" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="date" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all text-gray-600" value={bookingForm.values.travelDate} onChange={(e) => bookingForm.setFieldValue("travelDate", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">Persons</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-12">
                          <button type="button" className="px-4 text-gray-500 hover:text-[#EF7C00]" onClick={() => bookingForm.setFieldValue("participants", Math.max(1, (Number(bookingForm.values.participants) || 0) - 1))}><Icon name="minus" size={16} /></button>
                          <input type="number" className="w-full bg-transparent text-center font-bold outline-none border-0" value={bookingForm.values.participants} readOnly />
                          <button type="button" className="px-4 text-gray-500 hover:text-[#EF7C00]" onClick={() => bookingForm.setFieldValue("participants", (Number(bookingForm.values.participants) || 0) + 1)}><Icon name="plus" size={16} /></button>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">Days</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-12">
                          <button type="button" className="px-4 text-gray-500 hover:text-[#EF7C00]" onClick={() => bookingForm.setFieldValue("numberOfDays", Math.max(1, (Number(bookingForm.values.numberOfDays) || 0) - 1))}><Icon name="minus" size={16} /></button>
                          <input type="number" className="w-full bg-transparent text-center font-bold outline-none border-0" value={bookingForm.values.numberOfDays} readOnly />
                          <button type="button" className="px-4 text-gray-500 hover:text-[#EF7C00]" onClick={() => bookingForm.setFieldValue("numberOfDays", (Number(bookingForm.values.numberOfDays) || 0) + 1)}><Icon name="plus" size={16} /></button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 select-none">
                      <input
                        type="checkbox"
                        id="isCustomizing"
                        className="h-4 w-4 rounded border-gray-300 text-[#EF7C00] focus:ring-[#EF7C00] accent-[#EF7C00] cursor-pointer"
                        checked={isCustomizing}
                        onChange={(e) => setIsCustomizing(e.target.checked)}
                      />
                      <label htmlFor="isCustomizing" className="text-gray-700 text-sm font-semibold cursor-pointer">
                        Customize this tour
                      </label>
                    </div>

                    {/* Expandable Customization Fields */}
                    <div className={`transition-all duration-300 overflow-hidden flex flex-col gap-4 p-1 -mx-1 ${isCustomizing ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0 pointer-events-none"}`}>
                      <div className="relative">
                        <Icon name="map-pin" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all" value={bookingForm.values.departureCity} onChange={(e) => bookingForm.setFieldValue("departureCity", e.target.value)} placeholder="Departure City" />
                      </div>

                      <div className="relative">
                        <Icon name="geo" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all" value={bookingForm.values.placesToVisit} onChange={(e) => bookingForm.setFieldValue("placesToVisit", e.target.value)} placeholder="Places to Visit (e.g. Naran, Hunza)" />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Select
                            label="Group Type"
                            placeholder="Select Group Type"
                            value={bookingForm.values.groupType}
                            onChange={(val) => bookingForm.setFieldValue("groupType", val as ContactGroupType)}
                            data={getContactGroupTypes()}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 block ml-1">Rooms Needed</label>
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-12">
                          <button type="button" className="px-4 text-gray-500 hover:text-[#EF7C00]" onClick={() => bookingForm.setFieldValue("numberOfRooms", Math.max(1, (Number(bookingForm.values.numberOfRooms) || 0) - 1))}><Icon name="minus" size={16} /></button>
                          <input type="number" className="w-full bg-transparent text-center font-bold outline-none border-0" value={bookingForm.values.numberOfRooms} readOnly />
                          <button type="button" className="px-4 text-gray-500 hover:text-[#EF7C00]" onClick={() => bookingForm.setFieldValue("numberOfRooms", (Number(bookingForm.values.numberOfRooms) || 0) + 1)}><Icon name="plus" size={16} /></button>
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-2">
                      <Icon name="message-square" className="absolute left-4 top-5 text-gray-400" size={20} />
                      <textarea className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all" value={bookingForm.values.comment} onChange={(e) => bookingForm.setFieldValue("comment", e.target.value)} placeholder="Special Requests" rows={3}></textarea>
                    </div>

                    <button type="submit" className="w-full bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg shadow-[#EF7C00]/30 flex items-center justify-center gap-2" disabled={createContact.isPending}>
                      {createContact.isPending ? "Sending..." : "Send Booking Enquiry"} <Icon name="arrow-right" size={18} />
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                      <Icon name="shield-lock" size={14} /> Your information is secure
                    </p>
                  </form>
                </div>
              </div>

              {/* Share Tour Widget */}
              <ShareButtons
                title={tour.title}
                heading="Share This Tour"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col backdrop-blur-sm">
          <div className="p-6 flex justify-between items-center w-full z-10">
            <h4 className="text-white font-bold m-0 text-xl md:text-2xl">{tour.title}</h4>
            <button onClick={() => setShowLightbox(false)} className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
              <Icon name="x" size={32} />
            </button>
          </div>
          <div className="relative grow flex items-center justify-center w-full h-full p-4 md:p-12">
            <button onClick={() => setPhotoIndex((photoIndex + (tour.images?.length || 0) - 1) % (tour.images?.length || 1))} className="absolute left-4 md:left-8 z-10 bg-white/10 hover:bg-white/30 text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all">
              <Icon name="chevron-left" size={32} />
            </button>

            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
              {tour.images?.[photoIndex] && (
                <AppImage variant={ImageVariant.HERO} src={tour.images[photoIndex]} alt={tour.title} imageClassName="object-contain" />
              )}
            </div>

            <button onClick={() => setPhotoIndex((photoIndex + 1) % (tour.images?.length || 1))} className="absolute right-4 md:right-8 z-10 bg-white/10 hover:bg-white/30 text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all">
              <Icon name="chevron-right" size={32} />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold tracking-widest text-sm">
              {photoIndex + 1} / {tour.images?.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TourDetails;
