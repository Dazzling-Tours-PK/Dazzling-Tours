"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useGetTours } from "@/lib/hooks";
import { TourStatus } from "@/lib/enums";
import { StarRating } from "@/app/Components/Form";
import { formatCurrency } from "@/lib/utils/currencyConverter";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";

const Tour = () => {
  const pageLimit = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: toursData,
    isLoading: loading,
    error,
  } = useGetTours({
    status: TourStatus.ACTIVE,
    search: searchTerm || undefined,
    page: currentPage,
    limit: pageLimit,
  });

  const tours = toursData?.data || [];
  const pagination = toursData?.pagination;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If there's an active search, clear it
    if (searchTerm) {
      handleClearSearch();
      return;
    }

    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return; // Prevent searching with empty string
    }

    // Update search term to trigger API call
    setSearchTerm(trimmedQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page when clearing search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of tours section when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="tour-section section-padding fix">
        <div className="container custom-container">
          <div className="section-title text-center mb-5">
            <span className="sub-title wow fadeInUp">Our Tours</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Discover Your Perfect Adventure
            </h2>
            <p className="wow fadeInUp" data-wow-delay=".5s">
              Explore our handpicked collection of extraordinary journeys. From
              breathtaking landscapes to cultural treasures, find the tour that
              speaks to your wanderlust.
            </p>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Loading tours...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tour-section section-padding fix">
        <div className="container custom-container">
          <div className="section-title text-center mb-5">
            <span className="sub-title wow fadeInUp">Our Tours</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Discover Your Perfect Adventure
            </h2>
            <p className="wow fadeInUp" data-wow-delay=".5s">
              Explore our handpicked collection of extraordinary journeys. From
              breathtaking landscapes to cultural treasures, find the tour that
              speaks to your wanderlust.
            </p>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Unable to load tours. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tour-section section-padding fix">
      <div className="container custom-container">
        <div className="row align-items-end mb-5">
          <div className="col-xl-8 col-lg-7">
            <div className="section-title">
              <span className="sub-title wow fadeInUp">Our Tours</span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                Discover Your Perfect Adventure
              </h2>
              <p className="wow fadeInUp" data-wow-delay=".5s">
                Explore our handpicked collection of extraordinary journeys.
                From breathtaking landscapes to cultural treasures, find the
                tour that speaks to your wanderlust.
              </p>
            </div>
          </div>
          <div className="col-xl-4 col-lg-5"></div>
        </div>
        <div className="tour-destination-wrapper">
          <div className="row g-4">
            <div className="col-xl-8">
              <div className="row g-4">
                {tours.map((tour) => (
                  <div
                    key={tour._id}
                    className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp wow"
                    data-wow-delay=".3s"
                  >
                    <div className="destination-card-items mt-0">
                      <div className="destination-image">
                        <Image
                          src={
                            tour.images?.[0] || "/assets/img/destination/01.jpg"
                          }
                          alt={tour.title}
                          width={287}
                          height={240}
                          priority
                        />
                        <div className="heart-icon">
                          <i className="bi bi-heart"></i>
                        </div>
                      </div>
                      <div className="destination-content">
                        <ul className="meta">
                          <li>
                            <i className="bi bi-geo-alt"></i>
                            {tour.location}
                          </li>
                          <li className="rating">
                            <div className="star">
                              <StarRating
                                rating={
                                  typeof tour.rating === "number"
                                    ? tour.rating
                                    : 0
                                }
                                readonly={true}
                                size="sm"
                                className="tour-rating-stars"
                              />
                            </div>
                            <p>
                              {(typeof tour.rating === "number"
                                ? tour.rating
                                : 0
                              ).toFixed(1)}
                            </p>
                          </li>
                        </ul>
                        <h5>
                          <Link href={`/tours/${tour.seo?.slug || tour._id}`}>
                            {tour.title}
                          </Link>
                        </h5>
                        <ul className="info">
                          <li>
                            <i className="bi bi-clock"></i>
                            {tour.duration}
                          </li>
                          <li>
                            <i className="bi bi-person"></i>
                            {tour.reviews || 0} reviews
                          </li>
                        </ul>
                        <div className="price">
                          <h6>
                            {formatCurrency(tour.price)} <br />
                            <span>/per person</span>
                          </h6>
                          <Link
                            href={`/tours/${tour.seo?.slug || tour._id}`}
                            className="theme-btn style-2"
                          >
                            Book Now<i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pagination && (
                <PaginationComponent
                  pagination={pagination}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  pageSize={pageLimit}
                />
              )}
            </div>
            <div className="col-xl-4">
              <div className="main-sidebar mt-0">
                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Search Tours</h3>
                  </div>
                  <div className="search-widget enhanced-search">
                    <form
                      onSubmit={handleSearch}
                      className="search-form-enhanced"
                    >
                      <div className="search-input-wrapper">
                        <i className="bi bi-search search-icon"></i>
                        <input
                          type="text"
                          placeholder="Search tours, destinations..."
                          className="search-input-enhanced"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="search-btn-enhanced"
                          disabled={!searchQuery.trim() && !searchTerm}
                        >
                          <i
                            className={`bi ${
                              searchTerm ? "bi-x-lg" : "bi-arrow-right"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Destination Category</h3>
                  </div>
                  <div className="categories-list">
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Canada</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Europe</span>
                      </span>
                      <span className="text-color">03</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">France</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Indonesia</span>
                      </span>
                      <span className="text-color">06</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Nepal</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Maldives</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                  </div>
                </div>

                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Activities</h3>
                  </div>
                  <div className="categories-list">
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" readOnly />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Canada</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Europe</span>
                      </span>
                      <span className="text-color">03</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">France</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Indonesia</span>
                      </span>
                      <span className="text-color">06</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Nepal</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Maldives</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                  </div>
                </div>
                <div className="single-sidebar-widget">
                  <div className="wid-title style-2">
                    <h3>Tour Types</h3>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <div className="categories-list">
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Premium</span>
                      </span>
                      <span className="text-color">04</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Luxury</span>
                      </span>
                      <span className="text-color">03</span>
                    </label>
                    <label className="checkbox-single d-flex justify-content-between align-items-center">
                      <span className="d-flex gap-xl-3 gap-2 align-items-center">
                        <span className="checkbox-area d-center">
                          <input type="checkbox" />
                          <span className="checkmark d-center"></span>
                        </span>
                        <span className="text-color">Standard</span>
                      </span>
                      <span className="text-color">05</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tour;
