"use client";
import React, { use } from "react";
import { useGetTour } from "@/lib/hooks";
import { Page, Button } from "@/app/Components/Common";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/currencyConverter";

const ViewTour = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const { data, isLoading } = useGetTour(resolvedParams.id);
  const tour = data?.data;

  if (!tour) {
    return (
      <Page
        title="View Tour"
        description="Tour details and information"
        loading={isLoading}
        headerActions={
          <Button
            color="secondary"
            variant="outline"
            leftIcon={<i className="bi bi-arrow-left"></i>}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        }
      >
        <div className="card">
          <div className="card-body text-center py-5">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "3rem" }}
            ></i>
            <h3 className="mt-3">Tour Not Found</h3>
            <p className="text-muted">
              The tour you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button
              color="primary"
              leftIcon={<i className="bi bi-arrow-left"></i>}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="View Tour"
      description="Tour details and information"
      loading={isLoading}
      headerActions={
        <div className="d-flex gap-2">
          <Button
            color="primary"
            variant="outline"
            leftIcon={<i className="bi bi-eye"></i>}
            onClick={() => window.open(`/tours/${tour._id}`, "_blank")}
          >
            Preview
          </Button>
          <Button
            color="primary"
            leftIcon={<i className="bi bi-pencil"></i>}
            onClick={() =>
              (window.location.href = `/admin/tours/edit/${tour._id}`)
            }
          >
            Edit
          </Button>
          <Button
            color="secondary"
            variant="outline"
            leftIcon={<i className="bi bi-arrow-left"></i>}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>
      }
    >
      {/* Tour Overview */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="tour-header">
                <h2 className="mb-3">{tour.title}</h2>
                <div className="tour-meta mb-3">
                  <span
                    className={`badge me-2 ${
                      tour.status?.toLowerCase() === "active"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {tour.status || "Active"}
                  </span>
                  {tour.featured && (
                    <span className="badge bg-warning text-dark me-2">
                      Featured
                    </span>
                  )}
                  {tour.category && (
                    <span className="badge bg-info text-white me-2">
                      {tour.category}
                    </span>
                  )}
                </div>
                <div className="tour-description">
                  <p className="text-muted mb-0">{tour.shortDescription}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="text-center">
                <div className="price-display mb-2">
                  <span className="h3 text-primary">
                    {formatCurrency(tour.price)}
                  </span>
                  <span className="text-muted ms-1">
                    {tour.priceType || "Per Person"}
                  </span>
                </div>
                <div className="price-details">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {tour.duration}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Details */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Tour Details</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6 col-lg-4">
              <div className="detail-item">
                <i className="bi bi-geo-alt text-primary me-2"></i>
                <div className="detail-content">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{tour.location}</span>
                </div>
              </div>
            </div>
            {typeof tour.groupSize === "number" && (
              <div className="col-md-6 col-lg-4">
                <div className="detail-item">
                  <i className="bi bi-people text-primary me-2"></i>
                  <div className="detail-content">
                    <span className="detail-label">Group Size</span>
                    <span className="detail-value">
                      {tour.groupSize} people
                    </span>
                  </div>
                </div>
              </div>
            )}
            {tour.difficulty && (
              <div className="col-md-6 col-lg-4">
                <div className="detail-item">
                  <i className="bi bi-speedometer2 text-primary me-2"></i>
                  <div className="detail-content">
                    <span className="detail-label">Difficulty</span>
                    <span className="detail-value">{tour.difficulty}</span>
                  </div>
                </div>
              </div>
            )}
            {tour.rating > 0 && (
              <div className="col-md-6 col-lg-4">
                <div className="detail-item">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  <div className="detail-content">
                    <span className="detail-label">Rating</span>
                    <span className="detail-value">
                      {tour.rating}/5 ({tour.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Description */}
      {tour.description && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Full Description</h5>
          </div>
          <div className="card-body">
            <div className="full-description">
              <div
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tour Images Gallery */}
      {Array.isArray(tour.images) && tour.images.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Tour Images</h5>
          </div>
          <div className="card-body">
            <div className="tour-images-container">
              <div className="main-image-container mb-3">
                {tour.images[0] && (
                  <div className="main-image">
                    <Image
                      src={tour.images[0]}
                      alt={`${tour.title} - Main Image`}
                      width={800}
                      height={400}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                )}
              </div>

              {tour.images.length > 1 && (
                <div className="thumbnail-images">
                  <div className="row g-2">
                    {tour.images.slice(1).map((image, idx) => (
                      <div key={idx + 1} className="col-md-3 col-sm-4 col-6">
                        <div className="thumbnail-image">
                          <Image
                            src={image}
                            alt={`${tour.title} - Image ${idx + 2}`}
                            width={200}
                            height={120}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              objectPosition: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // Swap with main image
                              const newImages = [...tour.images];
                              [newImages[0], newImages[idx + 1]] = [
                                newImages[idx + 1],
                                newImages[0],
                              ];
                              // You could implement state management here if needed
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Highlights */}
      {Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Highlights</h5>
          </div>
          <div className="card-body">
            <div className="highlights-list">
              {tour.highlights.map((highlight, idx) => (
                <div key={idx} className="highlight-item">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Includes */}
      {Array.isArray(tour.includes) && tour.includes.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Includes</h5>
          </div>
          <div className="card-body">
            <div className="includes-list">
              {tour.includes.map((include, idx) => (
                <div key={idx} className="include-item">
                  <i className="bi bi-plus-circle-fill text-success me-2"></i>
                  <span>{include}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Excludes */}
      {Array.isArray(tour.excludes) && tour.excludes.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Excludes</h5>
          </div>
          <div className="card-body">
            <div className="excludes-list">
              {tour.excludes.map((exclude, idx) => (
                <div key={idx} className="exclude-item">
                  <i className="bi bi-dash-circle-fill text-danger me-2"></i>
                  <span>{exclude}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Itinerary */}
      {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Itinerary</h5>
          </div>
          <div className="card-body">
            <div className="itinerary-list">
              {tour.itinerary.map((item, idx) => (
                <div key={idx} className="itinerary-item">
                  <div className="day-number">
                    <span className="badge bg-primary">Day {item.day}</span>
                  </div>
                  <div className="day-content">
                    <h6 className="day-title">{item.title}</h6>
                    <p className="day-description text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tour Metadata */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Tour Information</h5>
        </div>
        <div className="card-body">
          <div className="tour-metadata">
            <div className="row">
              <div className="col-md-6">
                <div className="metadata-item">
                  <i className="bi bi-calendar-plus text-primary me-2"></i>
                  <div className="metadata-content">
                    <span className="metadata-label">Created</span>
                    <span className="metadata-value">
                      {tour.createdAt
                        ? new Date(tour.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="metadata-item">
                  <i className="bi bi-calendar-check text-primary me-2"></i>
                  <div className="metadata-content">
                    <span className="metadata-label">Last Updated</span>
                    <span className="metadata-value">
                      {tour.updatedAt
                        ? new Date(tour.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Details */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="bi bi-search me-2"></i>SEO Details
          </h5>
        </div>
        <div className="card-body">
          <div className="seo-details">
            <div className="row g-3">
              {/* Meta Title */}
              {tour.seo?.metaTitle && (
                <div className="col-12">
                  <div className="seo-item">
                    <div className="seo-label">
                      <i className="bi bi-type text-primary me-2"></i>
                      <strong>Meta Title</strong>
                      <span className="badge bg-info ms-2">
                        {tour.seo.metaTitle.length}/60
                      </span>
                    </div>
                    <div className="seo-value mt-2">
                      <p className="mb-0">{tour.seo.metaTitle}</p>
                      <small className="text-muted">
                        This title appears in search engine results
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Meta Description */}
              {tour.seo?.metaDescription && (
                <div className="col-12">
                  <div className="seo-item">
                    <div className="seo-label">
                      <i className="bi bi-text-paragraph text-primary me-2"></i>
                      <strong>Meta Description</strong>
                      <span className="badge bg-info ms-2">
                        {tour.seo.metaDescription.length}/160
                      </span>
                    </div>
                    <div className="seo-value mt-2">
                      <p className="mb-0">{tour.seo.metaDescription}</p>
                      <small className="text-muted">
                        This description appears in search engine results
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* URL Slug */}
              {tour.seo?.slug && (
                <div className="col-md-6">
                  <div className="seo-item">
                    <div className="seo-label">
                      <i className="bi bi-link-45deg text-primary me-2"></i>
                      <strong>URL Slug</strong>
                    </div>
                    <div className="seo-value mt-2">
                      <code className="bg-light p-2 rounded d-block">
                        /tours/{tour.seo.slug}
                      </code>
                      <small className="text-muted">
                        SEO-friendly URL path
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* Focus Keyword */}
              {tour.seo?.focusKeyword && (
                <div className="col-md-6">
                  <div className="seo-item">
                    <div className="seo-label">
                      <i className="bi bi-key text-primary me-2"></i>
                      <strong>Focus Keyword</strong>
                    </div>
                    <div className="seo-value mt-2">
                      <span className="badge bg-primary">
                        {tour.seo.focusKeyword}
                      </span>
                      <small className="text-muted d-block mt-1">
                        Primary keyword for this tour
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {/* OG Image */}
              {tour.seo?.ogImage && (
                <div className="col-12">
                  <div className="seo-item">
                    <div className="seo-label">
                      <i className="bi bi-image text-primary me-2"></i>
                      <strong>OG Image</strong>
                    </div>
                    <div className="seo-value mt-2">
                      <div className="og-image-preview">
                        <Image
                          src={tour.seo.ogImage}
                          alt="OG Image Preview"
                          width={120}
                          height={120}
                          className="rounded border"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <small className="text-muted d-block mt-2">
                        Image used for social media sharing (Open Graph)
                      </small>
                      <a
                        href={tour.seo.ogImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary mt-2"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i>
                        View Full Image
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* No SEO Data Message */}
              {(!tour.seo ||
                (!tour.seo.metaTitle &&
                  !tour.seo.metaDescription &&
                  !tour.seo.slug &&
                  !tour.seo.focusKeyword &&
                  !tour.seo.ogImage)) && (
                <div className="col-12">
                  <div className="alert alert-info mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    No SEO data configured for this tour. Consider adding SEO
                    settings to improve search engine visibility.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ViewTour;
