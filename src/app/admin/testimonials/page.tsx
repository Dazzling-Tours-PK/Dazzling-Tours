"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetTestimonials,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useNotification,
} from "@/lib/hooks";
import { Page, Group, Stack, Avatar } from "@/app/Components/Common";
import { TextInput, Select } from "@/app/Components/Form";
import StarRating from "@/app/Components/Form/StarRating";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import {
  TestimonialStatus,
  TESTIMONIAL_STATUS_OPTIONS,
} from "@/lib/enums/testimonial";

const TestimonialsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: testimonialsData, isLoading: loading } = useGetTestimonials({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    featured:
      filterFeatured === "all"
        ? undefined
        : filterFeatured === "featured"
          ? true
          : false,
    search: searchTerm || undefined,
  });

  const updateTestimonialMutation = useUpdateTestimonial();
  const deleteTestimonialMutation = useDeleteTestimonial();
  const { showSuccess, showError } = useNotification();

  const testimonials = testimonialsData?.data || [];
  const pagination = testimonialsData?.pagination;

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleFeaturedChange = (value: string) => {
    setFilterFeatured(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const deleteTestimonial = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonialMutation.mutate(id, {
        onSuccess: () => {
          showSuccess("Testimonial deleted successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to delete testimonial");
        },
      });
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    updateTestimonialMutation.mutate(
      {
        _id: id,
        featured: !currentFeatured,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Testimonial ${
              !currentFeatured ? "featured" : "unfeatured"
            } successfully!`,
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to update testimonial");
        },
      },
    );
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateTestimonialMutation.mutate(
      {
        _id: id,
        status:
          currentStatus === TestimonialStatus.ACTIVE
            ? TestimonialStatus.INACTIVE
            : TestimonialStatus.ACTIVE,
      },
      {
        onSuccess: () => {
          showSuccess("Testimonial status updated successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to update testimonial");
        },
      },
    );
  };

  return (
    <Page
      title="Testimonials Management"
      description="Manage customer testimonials, reviews, and feedback"
      loading={loading}
      headerActions={
        <Link href="/admin/testimonials/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Testimonial
        </Link>
      }
    >
      <Stack>
        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<i className="bi bi-search"></i>}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              ...TESTIMONIAL_STATUS_OPTIONS,
            ]}
            searchable={false}
          />

          <Select
            value={filterFeatured}
            onChange={handleFeaturedChange}
            data={[
              { value: "all", label: "All Testimonials" },
              { value: "featured", label: "Featured Only" },
              { value: "not-featured", label: "Non-Featured Only" },
            ]}
            searchable={false}
          />
        </Group>

        {/* Testimonials Table */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Related Tour</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial) => (
              <tr key={testimonial._id}>
                <td>
                  <Group>
                    <Avatar src={testimonial.image} size="sm" shape="circle" />
                    <strong>{testimonial.name}</strong>
                  </Group>
                </td>
                <td>{testimonial.location || "N/A"}</td>
                <td>
                  <StarRating
                    rating={testimonial.rating}
                    maxStars={5}
                    size="sm"
                    readonly={true}
                  />
                </td>
                <td>
                  <div className="testimonial-content-preview">
                    {testimonial.content.length > 100
                      ? `${testimonial.content.substring(0, 100)}...`
                      : testimonial.content}
                  </div>
                </td>
                <td>
                  {testimonial.tourId ? (
                    <span className="tour-link">
                      <i className="bi bi-map"></i>{" "}
                      {typeof testimonial.tourId === "object"
                        ? testimonial.tourId.title
                        : "Tour"}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button
                    onClick={() =>
                      toggleStatus(testimonial._id, testimonial.status)
                    }
                    className={`status-badge ${testimonial.status.toLowerCase()} clickable`}
                  >
                    {testimonial.status}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      toggleFeatured(testimonial._id, testimonial.featured)
                    }
                    className="btn btn-sm btn-link p-0"
                  >
                    {testimonial.featured ? (
                      <i className="bi bi-star-fill text-warning"></i>
                    ) : (
                      <i className="bi bi-star text-muted"></i>
                    )}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/admin/testimonials/edit/${testimonial._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      onClick={() => deleteTestimonial(testimonial._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {testimonials.length === 0 && !loading && (
          <div className="no-data">
            <p>No testimonials found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <PaginationComponent
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        )}
      </Stack>
    </Page>
  );
};

export default TestimonialsList;
