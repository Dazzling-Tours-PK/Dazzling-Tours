"use client";
import React, { useRef } from "react";
import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";
import { useGetTours } from "@/lib/hooks";
import { TourStatus } from "@/lib/enums";
import { formatCurrency } from "@/lib/utils/currencyConverter";

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
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderRef = useRef<Slider>(null);

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <section className="featured-tour-section section-padding section-bg">
        <div className="container">
          <div className="section-title">
            <span className="sub-title">Featured Tours</span>
            <h2>Handpicked Adventures Just For You</h2>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Loading featured tours...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="featured-tour-section section-padding section-bg">
        <div className="container">
          <div className="section-title">
            <span className="sub-title">Featured Tours</span>
            <h2>Handpicked Adventures Just For You</h2>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Unable to load featured tours. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (tours.length === 0) {
    return (
      <section className="featured-tour-section section-padding section-bg">
        <div className="container">
          <div className="section-title">
            <span className="sub-title">Featured Tours</span>
            <h2>Handpicked Adventures Just For You</h2>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>No featured tours available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-tour-section section-padding section-bg">
      <div className="container">
        <div className="row align-items-end mb-4">
          <div className="col-lg-8">
            <div className="section-title">
              <span className="sub-title wow fadeInUp">Featured Tours</span>
              <h2 className="wow fadeInUp wow" data-wow-delay=".5s">
                Handpicked Adventures <br />
                Just For You
              </h2>
            </div>
            <p className="wow fadeInUp wow" data-wow-delay=".7s">
              Discover our carefully curated selection of extraordinary
              journeys. <br />
              From breathtaking landscapes to cultural treasures, find your
              perfect escape.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link
              href="/tours"
              className="theme-btn wow fadeInUp wow"
              data-wow-delay=".7s"
            >
              View More <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
        <div className="swiper tour-slider" style={{ position: "relative" }}>
          <div className="array-button">
            <button onClick={previous} className="array-prev">
              <Image
                src="/assets/img/offer/chervon-right.png"
                alt="img"
                width={24}
                height={16}
              />
            </button>
            <button onClick={next} className="array-next">
              <Image
                src="/assets/img/icon/39.svg"
                alt="img"
                width={24}
                height={16}
              />
            </button>
          </div>
          <div className="swiper-wrapper cs_slider_gap_301">
            <Slider ref={sliderRef} {...settings}>
              {tours.map((tour) => (
                <div key={tour._id} className="swiper-slide">
                  <div className="feature-tour-items">
                    <div className="feature-tour-image">
                      <Image
                        src={tour.images[0] || "/assets/img/feature/01.jpg"}
                        alt={tour.title}
                        width={308}
                        height={249}
                      />
                      <ul className="location">
                        <li>
                          <i className="bi bi-geo-alt-fill"></i>
                          {tour.location || "Location"}
                        </li>
                      </ul>
                    </div>
                    <div className="feature-tour-content">
                      <h4>
                        <Link href={`/tours/${tour.seo?.slug || tour._id}`}>
                          {tour.title}
                        </Link>
                      </h4>
                      <h5>
                        {formatCurrency(tour.price)}
                        <span>/Per person</span>
                      </h5>
                      <Link
                        href={`/tours/${tour.seo?.slug || tour._id}`}
                        className="icon"
                      >
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTour;
