"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  useGetTours,
  useGetTourLocations,
  useGetTourDifficulties,
  useGetTourActivities,
} from "@/lib/hooks";
import { TourStatus } from "@/lib/enums";
import { TourDifficulty } from "@/lib/enums/tour";
import { StarRating } from "@/app/Components/Form";
import { formatCurrency } from "@/lib/utils/currencyConverter";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { ActionIcon, Loading } from "@/app/Components/Common";

const Tour = () => {
  const pageLimit = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    TourDifficulty[]
  >([]);

  // Fetch tour locations
  const { data: locationsData } = useGetTourLocations(TourStatus.ACTIVE);
  const locations = locationsData?.data || [];

  // Fetch tour difficulties with counts
  const { data: difficultiesData } = useGetTourDifficulties(TourStatus.ACTIVE);
  const difficulties = difficultiesData?.data || [];

  // Fetch tour activities (highlights) with counts
  const { data: activitiesData } = useGetTourActivities(TourStatus.ACTIVE);
  const activities = activitiesData?.data || [];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem("tourFavorites");
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
          console.error("Error parsing favorites from localStorage:", error);
        }
      }
    }
  }, []);

  const {
    data: toursData,
    isLoading: loading,
    error,
  } = useGetTours({
    status: TourStatus.ACTIVE,
    search: searchTerm || undefined,
    location:
      selectedLocations.length > 0 ? selectedLocations.join(",") : undefined,
    difficulty:
      selectedDifficulties.length > 0
        ? selectedDifficulties.join(",")
        : undefined,
    page: currentPage,
    limit: pageLimit,
  });

  const tours = React.useMemo(() => toursData?.data || [], [toursData?.data]);
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

  // Handle location filter change
  const handleLocationChange = (locationName: string, checked: boolean) => {
    setSelectedLocations((prev) => {
      if (checked) {
        return [...prev, locationName];
      } else {
        return prev.filter((loc) => loc !== locationName);
      }
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (
    difficulty: TourDifficulty,
    checked: boolean
  ) => {
    setSelectedDifficulties((prev) => {
      if (checked) {
        return [...prev, difficulty];
      } else {
        return prev.filter((diff) => diff !== difficulty);
      }
    });
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Toggle favorite status
  const toggleFavorite = (tourId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(tourId);
      let newFavorites: string[];

      if (isFavorite) {
        // Remove from favorites
        newFavorites = prevFavorites.filter((id) => id !== tourId);
      } else {
        // Add to favorites
        newFavorites = [...prevFavorites, tourId];
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tourFavorites", JSON.stringify(newFavorites));
      }

      return newFavorites;
    });
  };

  // Check if a tour is favorited
  const isFavorite = (tourId: string): boolean => {
    return favorites.includes(tourId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "800px", width: "100%" }}
                >
                  <Loading
                    variant="spinner"
                    size="lg"
                    color="primary"
                    text="Loading tours..."
                  />
                </div>
              ) : tours.length === 0 ? (
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{ minHeight: "400px", width: "100%" }}
                >
                  <i
                    className="bi bi-inbox"
                    style={{
                      fontSize: "4rem",
                      color: "#ccc",
                      marginBottom: "1rem",
                    }}
                  ></i>
                  <h4 style={{ color: "#666", marginBottom: "0.5rem" }}>
                    No Tours Found
                  </h4>
                  <p style={{ color: "#999", textAlign: "center" }}>
                    {searchTerm ||
                    selectedLocations.length > 0 ||
                    selectedDifficulties.length > 0
                      ? "Try adjusting your search or filters to find more tours."
                      : "We couldn't find any tours at the moment. Please check back later."}
                  </p>
                </div>
              ) : (
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
                              tour.images?.[0] ||
                              "/assets/img/destination/01.jpg"
                            }
                            alt={tour.title}
                            width={287}
                            height={240}
                            priority
                          />
                          <ActionIcon
                            variant={isFavorite(tour._id) ? "filled" : "light"}
                            color="primary"
                            size="md"
                            radius="round"
                            onClick={(e) => toggleFavorite(tour._id, e)}
                            className="heart-icon"
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              zIndex: 10,
                            }}
                            aria-label={
                              isFavorite(tour._id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            <i
                              className={`bi ${
                                isFavorite(tour._id)
                                  ? "bi-heart-fill"
                                  : "bi-heart"
                              }`}
                            />
                          </ActionIcon>
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
              )}
              {!loading && pagination && (
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
                    <h3>Destinations</h3>
                  </div>
                  <div className="categories-list">
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <label
                          key={location.name}
                          className="checkbox-single d-flex justify-content-between align-items-center"
                        >
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedLocations.includes(
                                  location.name
                                )}
                                onChange={(e) =>
                                  handleLocationChange(
                                    location.name,
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">{location.name}</span>
                          </span>
                          <span className="text-color">{location.count}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-muted p-3">
                        No destinations available
                      </p>
                    )}
                  </div>
                </div>

                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Activities</h3>
                  </div>
                  <div className="categories-list">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <label
                          key={activity.name}
                          className="checkbox-single d-flex justify-content-between align-items-center"
                        >
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input type="checkbox" readOnly />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">{activity.name}</span>
                          </span>
                          <span className="text-color">{activity.count}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-muted p-3">No activities available</p>
                    )}
                  </div>
                </div>
                <div className="single-sidebar-widget">
                  <div className="wid-title style-2">
                    <h3>Tour Difficulty</h3>
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <div className="categories-list">
                    {difficulties.length > 0 ? (
                      difficulties.map((difficulty) => (
                        <label
                          key={difficulty.value}
                          className="checkbox-single d-flex justify-content-between align-items-center"
                        >
                          <span className="d-flex gap-xl-3 gap-2 align-items-center">
                            <span className="checkbox-area d-center">
                              <input
                                type="checkbox"
                                checked={selectedDifficulties.includes(
                                  difficulty.value as TourDifficulty
                                )}
                                onChange={(e) =>
                                  handleDifficultyChange(
                                    difficulty.value as TourDifficulty,
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="checkmark d-center"></span>
                            </span>
                            <span className="text-color">
                              {difficulty.label}
                            </span>
                          </span>
                          <span className="text-color">{difficulty.count}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-muted p-3">
                        No difficulty levels available
                      </p>
                    )}
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
