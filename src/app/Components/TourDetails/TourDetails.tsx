"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { Modal } from "react-bootstrap";
import { Tour, ItineraryItem } from "@/lib/types/tour";
import {
  useGetTestimonials,
  useCreateTestimonial,
  useCreateContactInquiry,
  useNotification,
  useForm,
} from "@/lib/hooks";
import { TestimonialStatus } from "@/lib/enums";
import { ContactGroupType } from "@/lib/types/enums";
import { Accordion } from "@/app/Components/Common";
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
  <div className="d-flex align-items-center gap-3 py-1">
    <div
      className="d-flex justify-content-center align-items-center flex-shrink-0"
      style={{
        width: "48px",
        height: "48px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #eef2f6",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <i
        className={`bi ${icon} text-primary`}
        style={{ fontSize: "1.25rem" }}
      ></i>
    </div>
    <div className="d-flex flex-column align-items-start" style={{ gap: "0" }}>
      <span
        className="text-muted"
        style={{ fontSize: "0.85rem", fontWeight: 500 }}
      >
        {label}
      </span>
      <h6
        className="fw-bold m-0"
        style={{ fontSize: "1rem", color: "#2c3e50" }}
      >
        {value}
      </h6>
    </div>
  </div>
);

const TourDetails = ({ tour }: TourDetailsProps) => {
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const slider1 = useRef<Slider | null>(null);
  const slider2 = useRef<Slider | null>(null);

  const [showLightbox, setShowLightbox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const { showSuccess, showError } = useNotification();
  const createContact = useCreateContactInquiry();
  const createTestimonial = useCreateTestimonial();

  // Review Form State
  const form = useForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      designation: "",
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

  // Dynamic Testimonials (TanStack Query)
  const { data: testimonialsData, isLoading: isLoadingTestimonials } =
    useGetTestimonials({
      tourId: tour._id,
      status: TestimonialStatus.ACTIVE,
    });
  const testimonials = testimonialsData?.data || [];

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  // Booking Form with useForm
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
          subject: `Tour Enquiry: ${tour.title}`,
          message: values.comment || "New tour enquiry from website",
          tourId: tour._id,
          startDate: values.travelDate,
          participants: Number(values.participants),
          groupType: values.groupType,
          numberOfDays: Number(values.numberOfDays),
          numberOfRooms: Number(values.numberOfRooms),
          departureCity: values.departureCity,
          placesToVisit: values.placesToVisit,
        },
        {
          onSuccess: () => {
            showSuccess("Your enquiry has been sent successfully!");
            bookingForm.reset();
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

  const mainSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: nav2 ?? undefined,
  };

  const thumbSettings = {
    slidesToShow: Math.min(tour.images?.length || 0, 5),
    slidesToScroll: 1,
    asNavFor: nav1 ?? undefined,
    dots: false,
    centerMode: false,
    focusOnSelect: true,
    infinite: (tour.images?.length || 0) > 5,
    arrows: false,
    swipeToSlide: true,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <>
      <section className="activities-details-section fix section-padding">
        <div className="container">
          <div className="activities-details-wrapper">
            <div className="row g-4 justify-content-center">
              <div className="col-12 col-lg-8">
                <div className="tour-gallery-container mb-5">
                  <div className="main-slider-wrap position-relative">
                    <Slider
                      {...mainSettings}
                      ref={(slider) => {
                        slider1.current = slider;
                      }}
                      className="main-slider"
                    >
                      {tour.images?.map((img, idx) => (
                        <div key={idx} className="main-slider-item">
                          <div
                            className="image-overlay-trigger"
                            onClick={() => handleOpenLightbox(idx)}
                          >
                            <i className="bi bi-arrows-fullscreen"></i>
                            <span>View Gallery</span>
                          </div>
                          <Image
                            src={img || "/assets/img/hero/hero1.webp"}
                            alt={`${tour.title} - ${idx + 1}`}
                            fill
                            priority={idx === 0}
                            className="rounded-4 shadow-sm"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>

                  {tour.images && tour.images.length > 1 && (
                    <div className="thumb-slider-wrap mt-3">
                      <Slider
                        {...thumbSettings}
                        ref={(slider) => {
                          slider2.current = slider;
                        }}
                        className="thumb-slider"
                      >
                        {tour.images.map((img, idx) => (
                          <div key={idx} className="thumb-slider-item">
                            <Image
                              src={img}
                              alt={`${tour.title} thumb - ${idx + 1}`}
                              fill
                              className="rounded-3 shadow-sm"
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </div>
                <div className="activities-details-content">
                  <h2 className="mb-3">{tour.title}</h2>
                  {tour.shortDescription && <p>{tour.shortDescription}</p>}
                  {tour.description && tour.description.trim() && (
                    <div
                      className="mt-3 tour-description"
                      dangerouslySetInnerHTML={{ __html: tour.description }}
                      suppressHydrationWarning
                    />
                  )}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <div className="activities-list-item">
                      <h3>Tour Highlights</h3>
                      <div className="activities-item">
                        <div className="row g-3">
                          {tour.highlights.map((highlight, index) => (
                            <div key={index} className="col-md-6 h-100">
                              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light-subtle h-100 border border-light shadow-sm">
                                <span
                                  className="flex-shrink-0 d-flex justify-content-center align-items-center"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    backgroundColor: "#eef8fb",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12.6916 5.22013L12.1877 4.5967C12.0188 4.38782 11.7004 4.38782 11.5315 4.5967L11.0275 5.22013C10.7366 5.5801 10.3473 5.84785 9.90712 5.99089C9.46691 6.13393 8.99465 6.14609 8.54766 6.02591L7.77347 5.81779C7.51411 5.74804 7.25644 5.93521 7.24261 6.20348L7.20136 7.00406C7.17753 7.46631 7.02002 7.91171 6.74795 8.28617C6.47588 8.66064 6.10096 8.94807 5.66869 9.11357L4.92005 9.40021C4.66922 9.49626 4.57083 9.79917 4.71727 10.0243L5.15447 10.6963C5.40689 11.0842 5.54126 11.5371 5.54126 12C5.54126 12.4629 5.40689 12.9158 5.15447 13.3037L4.71727 13.9757C4.57078 14.2008 4.66922 14.5037 4.92005 14.5998L5.66869 14.8864C6.10096 15.0519 6.47588 15.3393 6.74795 15.7138C7.02002 16.0883 7.17753 16.5337 7.20136 16.9959L7.24261 17.7965C7.25644 18.0648 7.51411 18.2519 7.77347 18.1822L8.54766 17.9741C8.99464 17.8539 9.46691 17.866 9.90712 18.0091C10.3473 18.1521 10.7365 18.4198 11.0275 18.7798L11.5315 19.4033C11.7004 19.6122 11.7004 19.6122 11.5315 19.4033L11.0275 18.7798C10.7365 18.4198 10.3473 18.1521 9.90712 18.0091C9.46691 17.866 8.99464 17.8539 8.54766 17.9741L7.77347 18.1822C7.51411 18.2519 7.25644 18.0648 7.24261 17.7965L7.20136 16.9959C7.17753 16.5337 7.02002 16.0883 6.74795 15.7138C6.47588 15.3393 6.10096 15.0519 5.66869 14.8864L4.92005 14.5998C4.66922 14.5037 4.57083 14.2008 4.71727 13.9757L5.15447 13.3037C5.40689 12.9158 5.54126 12.4629 5.54126 12C5.54126 11.5371 5.40689 11.0842 5.15447 10.6963L4.71727 10.0243C4.57083 9.79917 4.66922 9.49626 4.92005 9.40021L5.66869 9.11357C6.10096 8.94807 6.47588 8.66064 6.74795 8.28617C7.02002 7.91171 7.17753 7.46631 7.20136 7.00406L7.24261 6.20348C7.25644 5.93521 7.51411 5.74804 7.77347 5.81779L8.54766 6.02591C8.99464 6.13393 9.46691 6.14609 9.90712 5.99089C10.3473 5.84785 10.7365 5.5801 11.0275 5.22013ZM12.9532 3.9779C12.3904 3.28162 11.3288 3.28162 10.766 3.9779L10.262 4.60134C10.0908 4.81308 9.86188 4.97058 9.60293 5.05472C9.34397 5.13885 9.06616 5.146 8.80322 5.07529L8.02908 4.86717C7.16447 4.63467 6.30563 5.25866 6.25955 6.15281L6.2183 6.95338C6.20428 7.2253 6.11163 7.4873 5.95158 7.70757C5.79154 7.92784 5.57098 8.09692 5.3167 8.19426L4.56806 8.48095C3.73191 8.80106 3.40388 9.81065 3.89213 10.5611L4.32938 11.2331C4.47787 11.4613 4.55691 11.7277 4.55691 12C4.55691 12.2723 4.47787 12.5387 4.32938 12.7669L3.89217 13.4389C3.40388 14.1893 3.73191 15.1989 4.56806 15.519L5.3167 15.8057C5.57098 15.903 5.79153 16.0721 5.95157 16.2924C6.11162 16.5127 6.20427 16.7747 6.2183 17.0466L6.25955 17.8472C6.30563 18.7413 7.16447 19.3653 8.02908 19.1328L8.80322 18.9247C9.06616 18.854 9.34397 18.8611 9.60293 18.9453C9.86188 19.0294 10.0908 19.1869 10.262 19.3987L10.766 20.0221C11.3288 20.7184 12.3904 20.7184 12.9532 20.0221L13.4572 19.3987C13.6283 19.1869 13.8573 19.0294 14.1162 18.9453C14.3752 18.8611 14.653 18.854 14.916 18.9247L15.6901 19.1328C16.5547 19.3653 17.4135 18.7413 17.4596 17.8472L17.5009 17.0466C17.5149 16.7747 17.6076 16.5127 17.7676 16.2924C17.9276 16.0721 18.1482 15.903 18.4025 15.8057L19.1511 15.519C19.9873 15.1989 20.3153 14.1893 19.827 13.4389L19.3898 12.7669C19.2413 12.5387 19.1623 12.2723 19.1623 12C19.1623 11.7277 19.2413 11.4613 19.3898 11.2331L19.827 10.5611C20.3153 9.81065 19.9873 8.80106 19.1511 8.48095L18.4025 8.19426C18.1482 8.09692 17.9276 7.92784 17.7676 7.70757C17.6075 7.4873 17.5149 7.2253 17.5009 6.95338L17.4596 6.15281C17.4135 5.25866 16.5547 4.63467 15.6901 4.86717L14.916 5.07529C14.653 5.146 14.3752 5.13885 14.1162 5.05472C13.8573 4.97058 13.6283 4.81308 13.4572 4.60134L12.9532 3.9779Z"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M15.4446 9.45177C15.6353 9.64555 15.6327 9.95717 15.4388 10.1478L11.6863 13.8382C11.1163 14.3987 10.1975 14.383 9.64705 13.8033L8.31496 12.4004C8.12779 12.2033 8.13585 11.8918 8.33296 11.7045C8.53007 11.5174 8.8416 11.5254 9.02877 11.7226L10.3609 13.1255C10.5324 13.306 10.8186 13.3109 10.9961 13.1363L14.7486 9.44596C14.9424 9.25536 15.2541 9.25794 15.4446 9.45177Z"
                                      fill="#1CA8CB"
                                    />
                                  </svg>
                                </span>
                                <strong>{highlight}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row mt-4">
                    {tour.includes && tour.includes.length > 0 && (
                      <div className="col-md-6 mb-4">
                        <div className="activities-list-item">
                          <h3>What&apos;s Included</h3>
                          <ul className="activities-list w-100">
                            {tour.includes.map((incl, index) => (
                              <li
                                key={index}
                                className="d-flex align-items-center mb-2"
                              >
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                {incl}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {tour.excludes && tour.excludes.length > 0 && (
                      <div className="col-md-6 mb-4">
                        <div className="activities-list-item">
                          <h3>What&apos;s Excluded</h3>
                          <ul className="activities-list w-100">
                            {tour.excludes.map((excl, index) => (
                              <li
                                key={index}
                                className="d-flex align-items-center mb-2"
                              >
                                <i className="bi bi-x-circle-fill text-danger me-2"></i>
                                {excl}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="activities-box-wrap mb-4">
                    <div className="bg-light-subtle rounded-4 p-3 border border-light shadow-sm">
                      <div className="row g-4">
                        <div className="col-12 col-md-4">
                          <TourInfoBox
                            icon="bi-geo-alt"
                            label="Location"
                            value={tour.location || "N/A"}
                          />
                        </div>
                        {tour.duration && (
                          <div className="col-12 col-md-4">
                            <TourInfoBox
                              icon="bi-clock"
                              label="Duration"
                              value={tour.duration}
                            />
                          </div>
                        )}
                        {tour.difficulty && (
                          <div className="col-12 col-md-4">
                            <TourInfoBox
                              icon="bi-speedometer2"
                              label="Difficulty"
                              value={tour.difficulty}
                            />
                          </div>
                        )}
                        {typeof tour.groupSize === "number" && (
                          <div className="col-12 col-md-4">
                            <TourInfoBox
                              icon="bi-people"
                              label="Group Size"
                              value={`${tour.groupSize} People`}
                            />
                          </div>
                        )}
                        {typeof tour.price === "number" && (
                          <div className="col-12 col-md-4">
                            <TourInfoBox
                              icon="bi-tags"
                              label="Price"
                              value={`PKR ${tour.price} / ${tour.priceType}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {tour.itinerary && tour.itinerary.length > 0 && (
                    <div className="faq-items">
                      <h3 className="mb-4">Tour Plan</h3>
                      <Accordion
                        items={tour.itinerary.map((item: ItineraryItem) => ({
                          title: `Day ${item.day}: ${item.title}`,
                          content: item.description ? (
                            <div
                              className="accordion-content-text"
                              style={{
                                color: "#333",
                                fontSize: "16px",
                                lineHeight: "1.6",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                              suppressHydrationWarning
                            />
                          ) : (
                            <p className="text-muted">
                              No details provided for this day.
                            </p>
                          ),
                        }))}
                        defaultOpenIndex={0}
                      />
                    </div>
                  )}

                  {typeof tour.rating === "number" && tour.rating > 0 && (
                    <>
                      <h3>Customer Reviews</h3>
                      <div className="courses-reviews-box-items mb-4 d-flex justify-content-center">
                        <div className="courses-reviews-box justify-content-center">
                          <div className="reviews-box text-center">
                            <h2>
                              <span className="count">
                                {tour.rating.toFixed(1)}
                              </span>
                            </h2>
                            <div className="star">
                              {Array.from({ length: 5 }, (_, i) => (
                                <i
                                  key={i}
                                  className={`bi bi-star${
                                    i < Math.floor(tour.rating) ? "-fill" : ""
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <p>{tour.reviews || 0}+ Reviews</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="client-review-area">
                    <h3>Reviews ({testimonials.length})</h3>
                    {isLoadingTestimonials ? (
                      <div className="text-center p-4">Loading reviews...</div>
                    ) : testimonials.length > 0 ? (
                      <ul className="review-items">
                        {testimonials.map((testimonial, index) => (
                          <li key={testimonial._id || index}>
                            <div className="thumb">
                              <Image
                                src={
                                  testimonial.image ||
                                  "/assets/img/testimonial/default-avatar.png"
                                }
                                alt={testimonial.name}
                                width={110}
                                height={110}
                                className="rounded-circle"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/assets/img/testimonial/default-avatar.png";
                                }}
                              />
                            </div>
                            <div className="content border-0">
                              <div className="star">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <i
                                    key={i}
                                    className={`bi bi-star${i < (testimonial.rating || 5) ? "-fill" : ""}`}
                                  ></i>
                                ))}
                              </div>
                              <h5>{testimonial.name}</h5>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                {testimonial.designation && (
                                  <span className="badge bg-light text-dark border">
                                    {testimonial.designation}
                                  </span>
                                )}
                                {testimonial.location && (
                                  <span className="text-muted small">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {testimonial.location}
                                  </span>
                                )}
                                {testimonial.status ===
                                  TestimonialStatus.ACTIVE && (
                                  <span className="text-success small fw-bold">
                                    <i className="bi bi-patch-check-fill me-1"></i>
                                    Verified Traveler
                                  </span>
                                )}
                              </div>
                              <p>{testimonial.content}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted p-4">
                        No reviews yet for this tour.
                      </div>
                    )}
                  </div>
                  <div className="client-ratting-items">
                    <h3>Add Your Reviews</h3>
                    <form onSubmit={form.handleSubmit()} id="review-form">
                      <div className="row g-4">
                        <div className="col-12 mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <span>Your Rating:</span>
                            <div className="star" style={{ cursor: "pointer" }}>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <i
                                  key={s}
                                  className={`bi bi-star${s <= form.values.rating ? "-fill" : ""} text-warning`}
                                  onClick={() =>
                                    form.setFieldValue("rating", s)
                                  }
                                ></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="name"
                              value={form.values.name || ""}
                              onChange={(e) =>
                                form.setFieldValue("name", e.target.value)
                              }
                              placeholder="Your name"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="designation"
                              value={form.values.designation || ""}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "designation",
                                  e.target.value,
                                )
                              }
                              placeholder="Traveler Type (e.g., Family Trip)"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="tel"
                              name="phone"
                              value={form.values.phone || ""}
                              onChange={(e) =>
                                form.setFieldValue("phone", e.target.value)
                              }
                              placeholder="Your phone"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="email"
                              name="email"
                              value={form.values.email || ""}
                              onChange={(e) =>
                                form.setFieldValue("email", e.target.value)
                              }
                              placeholder="Your email"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-clt">
                            <textarea
                              name="message"
                              value={form.values.message || ""}
                              onChange={(e) =>
                                form.setFieldValue("message", e.target.value)
                              }
                              placeholder="Your comments..."
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="theme-btn text-center"
                            disabled={createTestimonial.isPending}
                          >
                            {createTestimonial.isPending
                              ? "Submitting..."
                              : "Submit Reviews"}{" "}
                            <i className="bi bi-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="main-bar">
                  <div className="main-sidebar">
                    <div className="single-sidebar-widget">
                      <div className="wid-title">
                        <h4>Make My Trip</h4>
                      </div>
                      <div className="destination-booking-form">
                        <form
                          onSubmit={bookingForm.handleSubmit()}
                          id="booking-form"
                        >
                          <div className="row g-3">
                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-person position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                <input
                                  type="text"
                                  name="name"
                                  className="ps-5"
                                  value={bookingForm.values.name || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Your Name"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-envelope position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                <input
                                  type="email"
                                  name="email"
                                  className="ps-5"
                                  value={bookingForm.values.email || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "email",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter Your Email"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-telephone position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                <input
                                  type="tel"
                                  name="phone"
                                  className="ps-5"
                                  value={bookingForm.values.phone || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "phone",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Phone Number"
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-calendar position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                <input
                                  type="date"
                                  name="travelDate"
                                  className="ps-5"
                                  value={bookingForm.values.travelDate || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "travelDate",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Travel Dates"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-geo-alt position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                <input
                                  type="text"
                                  name="placesToVisit"
                                  className="ps-5"
                                  value={bookingForm.values.placesToVisit || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "placesToVisit",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Places to Visit"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-building position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                                <input
                                  type="text"
                                  name="departureCity"
                                  className="ps-5"
                                  value={bookingForm.values.departureCity || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "departureCity",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Your Departure City"
                                />
                              </div>
                            </div>

                            {/* Persons Control */}
                            <div className="col-lg-12 mb-2">
                              <label className="text-muted small mb-1">
                                *Number of Persons
                              </label>
                              <div
                                className="d-flex align-items-center bg-light rounded overflow-hidden"
                                style={{ height: "50px" }}
                              >
                                <button
                                  type="button"
                                  className="btn p-0 border-0 px-3 h-100 border-end"
                                  style={{ color: "var(--theme)" }}
                                  onClick={() =>
                                    bookingForm.setFieldValue(
                                      "participants",
                                      Math.max(
                                        1,
                                        (Number(
                                          bookingForm.values.participants,
                                        ) || 0) - 1,
                                      ),
                                    )
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input
                                  type="number"
                                  className="form-control border-0 bg-transparent text-center shadow-none"
                                  value={bookingForm.values.participants || 0}
                                  readOnly
                                />
                                <button
                                  type="button"
                                  className="btn p-0 border-0 px-3 h-100 border-start"
                                  style={{ color: "var(--theme)" }}
                                  onClick={() =>
                                    bookingForm.setFieldValue(
                                      "participants",
                                      (Number(
                                        bookingForm.values.participants,
                                      ) || 0) + 1,
                                    )
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>

                            {/* Days Control */}
                            <div className="col-lg-12 mb-2">
                              <label className="text-muted small mb-1">
                                Number of Days
                              </label>
                              <div
                                className="d-flex align-items-center bg-light rounded overflow-hidden"
                                style={{ height: "50px" }}
                              >
                                <button
                                  type="button"
                                  className="btn p-0 border-0 px-3 h-100 border-end"
                                  style={{ color: "var(--theme)" }}
                                  onClick={() =>
                                    bookingForm.setFieldValue(
                                      "numberOfDays",
                                      Math.max(
                                        1,
                                        (Number(
                                          bookingForm.values.numberOfDays,
                                        ) || 0) - 1,
                                      ),
                                    )
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input
                                  type="number"
                                  className="form-control border-0 bg-transparent text-center shadow-none"
                                  value={bookingForm.values.numberOfDays || 0}
                                  readOnly
                                />
                                <button
                                  type="button"
                                  className="btn p-0 border-0 px-3 h-100 border-start"
                                  style={{ color: "var(--theme)" }}
                                  onClick={() =>
                                    bookingForm.setFieldValue(
                                      "numberOfDays",
                                      (Number(
                                        bookingForm.values.numberOfDays,
                                      ) || 0) + 1,
                                    )
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>

                            {/* Rooms Control */}
                            <div className="col-lg-12 mb-2">
                              <label className="text-muted small mb-1">
                                Number of Rooms
                              </label>
                              <div
                                className="d-flex align-items-center bg-light rounded overflow-hidden"
                                style={{ height: "50px" }}
                              >
                                <button
                                  type="button"
                                  className="btn p-0 border-0 px-3 h-100 border-end"
                                  style={{ color: "var(--theme)" }}
                                  onClick={() =>
                                    bookingForm.setFieldValue(
                                      "numberOfRooms",
                                      Math.max(
                                        1,
                                        (Number(
                                          bookingForm.values.numberOfRooms,
                                        ) || 0) - 1,
                                      ),
                                    )
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input
                                  type="number"
                                  className="form-control border-0 bg-transparent text-center shadow-none"
                                  value={bookingForm.values.numberOfRooms || 0}
                                  readOnly
                                />
                                <button
                                  type="button"
                                  className="btn p-0 border-0 px-3 h-100 border-start"
                                  style={{ color: "var(--theme)" }}
                                  onClick={() =>
                                    bookingForm.setFieldValue(
                                      "numberOfRooms",
                                      (Number(
                                        bookingForm.values.numberOfRooms,
                                      ) || 0) + 1,
                                    )
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="form-clt position-relative">
                                <i className="bi bi-chat-left-text position-absolute start-0 top-0 mt-3 ms-3 text-muted"></i>
                                <textarea
                                  name="comment"
                                  className="ps-5"
                                  value={bookingForm.values.comment || ""}
                                  onChange={(e) =>
                                    bookingForm.setFieldValue(
                                      "comment",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Special Requests (Optional)"
                                  style={{ minHeight: "100px" }}
                                ></textarea>
                              </div>
                            </div>

                            <div className="col-lg-12 mt-3">
                              <button
                                type="submit"
                                className="theme-btn text-center w-100 fw-bold border-0 text-white py-3 shadow-sm"
                                style={{
                                  borderRadius: "5px",
                                  fontSize: "18px",
                                }}
                                disabled={createContact.isPending}
                              >
                                {createContact.isPending
                                  ? "SENDING..."
                                  : "SEND ENQUIRY"}
                              </button>
                            </div>

                            <div className="col-lg-12 mt-3 ps-2">
                              <p className="small text-muted mb-1">
                                <i className="bi bi-check text-success"></i> We
                                assure the privacy of your contact data.
                              </p>
                              <p className="small text-muted">
                                <i className="bi bi-check text-success"></i>{" "}
                                This data will only be used by our team to
                                contact you and no other purposes.
                              </p>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div
                    className="booking-bg bg-cover"
                    style={{
                      backgroundImage:
                        "url('/assets/img/testimonial/testimonial-bg.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    suppressHydrationWarning
                  >
                    <h3 className="text-title">
                      Book Now And Enjoy Amazing Savings!
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Modal
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
        centered
        size="xl"
        className="tour-lightbox-modal"
        contentClassName="bg-transparent border-0"
      >
        <Modal.Header closeButton closeVariant="white" className="border-0 p-4">
          <Modal.Title className="text-white fs-4">{tour.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 text-center position-relative">
          <button
            className="lightbox-nav prev"
            onClick={() =>
              setPhotoIndex(
                (photoIndex + (tour.images?.length || 0) - 1) %
                  (tour.images?.length || 1),
              )
            }
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <div className="lightbox-image-container">
            <Image
              src={tour.images?.[photoIndex] || ""}
              alt={tour.title}
              width={1200}
              height={800}
              className="img-fluid rounded-2 shadow-lg"
              style={{ maxHeight: "80vh", objectFit: "contain" }}
            />
          </div>

          <button
            className="lightbox-nav next"
            onClick={() =>
              setPhotoIndex((photoIndex + 1) % (tour.images?.length || 1))
            }
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          <div className="text-white mt-3 fs-6">
            Image {photoIndex + 1} of {tour.images?.length}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TourDetails;
