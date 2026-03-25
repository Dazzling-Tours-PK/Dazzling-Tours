"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetTestimonials,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useNotification,
} from "@/lib/hooks";
import {
  Page,
  Group,
  Stack,
  Avatar,
  Badge,
  Table,
  Button,
  ConfirmModal,
  Text,
  Icon,
} from "@/app/Components/Common";
import { TextInput, Select } from "@/app/Components/Form";
import StarRating from "@/app/Components/Form/StarRating";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import {
  TestimonialStatus,
  TestimonialSource,
  TESTIMONIAL_STATUS_OPTIONS,
} from "@/lib/enums/testimonial";

const TestimonialsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTestimonialMutation.mutate(deleteId, {
        onSuccess: () => {
          showSuccess("Testimonial deleted successfully!");
          setDeleteId(null);
        },
        onError: (error) => {
          showError(error.message || "Failed to delete testimonial");
          setDeleteId(null);
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
        <Link href="/admin/testimonials/add">
          <Button>
            <Icon name="plus-circle" /> Add New Testimonial
          </Button>
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
            leftIcon={<Icon name="search" />}
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
        <Table verticalSpacing="sm" horizontalSpacing="md">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Source</th>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      minWidth: "200px",
                    }}
                  >
                    <Avatar src={testimonial.image} size="md" shape="circle" />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "1.2",
                      }}
                    >
                      <Text size="sm" weight={700}>
                        {testimonial.name}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {testimonial.email}
                      </Text>
                      {testimonial.phone && (
                        <Text size="xs" color="dimmed">
                          {testimonial.phone}
                        </Text>
                      )}
                    </div>
                  </div>
                </td>
                <td>{testimonial.location || "N/A"}</td>
                <td>
                  <Badge
                    variant="light"
                    color={
                      testimonial.source === TestimonialSource.ADMIN
                        ? "blue"
                        : "gray"
                    }
                  >
                    {testimonial.source}
                  </Badge>
                </td>
                <td>
                  <StarRating
                    rating={testimonial.rating}
                    maxStars={5}
                    size="sm"
                    readonly={true}
                  />
                </td>
                <td>
                  <Text
                    className="testimonial-content-preview"
                    color="dimmed"
                    size="xs"
                    style={{ maxWidth: "250px" }}
                  >
                    {testimonial.content.length > 80
                      ? `${testimonial.content.substring(0, 80)}...`
                      : testimonial.content}
                  </Text>
                </td>
                <td>
                  {testimonial.tourId ? (
                    <Link
                      href={`/admin/tours/${
                        typeof testimonial.tourId === "object"
                          ? testimonial.tourId._id
                          : testimonial.tourId
                      }`}
                      style={{
                        color: "var(--primary)",
                      }}
                    >
                      {typeof testimonial.tourId === "object"
                        ? testimonial.tourId.title
                        : "View Tour"}
                    </Link>
                  ) : (
                    <Text color="dimmed" component="span">
                      N/A
                    </Text>
                  )}
                </td>
                <td>
                  <Badge
                    variant={
                      testimonial.status === TestimonialStatus.PENDING
                        ? "filled"
                        : "light"
                    }
                    color={
                      testimonial.status === TestimonialStatus.ACTIVE
                        ? "success"
                        : testimonial.status === TestimonialStatus.PENDING
                          ? "warning"
                          : "gray"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      toggleStatus(testimonial._id, testimonial.status)
                    }
                  >
                    {testimonial.status === TestimonialStatus.PENDING
                      ? "Pending (Approve)"
                      : testimonial.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    onClick={() =>
                      toggleFeatured(testimonial._id, testimonial.featured)
                    }
                    variant="subtle"
                    size="sm"
                    style={{ padding: 0, minWidth: "auto", height: "auto" }}
                  >
                    {testimonial.featured ? (
                      <Icon
                        name="star-fill"
                        color="warning"
                        className="text-warning"
                      />
                    ) : (
                      <Icon name="star" color="dimmed" className="text-muted" />
                    )}
                  </Button>
                </td>
                <td>
                  <div
                    className="action-buttons"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href={`/admin/testimonials/edit/${testimonial._id}`}
                        passHref
                      >
                        <Button
                          variant="outline"
                          color="warning"
                          size="sm"
                          title="Edit"
                          style={{
                            width: "32px",
                            height: "32px",
                            padding: 0,
                          }}
                        >
                          <Icon name="pencil" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteTestimonial(testimonial._id)}
                        variant="outline"
                        color="error"
                        size="sm"
                        title="Delete"
                        style={{
                          width: "32px",
                          height: "32px",
                          padding: 0,
                        }}
                      >
                        <Icon name="trash" />
                      </Button>
                    </div>
                    {testimonial.status === TestimonialStatus.PENDING && (
                      <Button
                        onClick={() =>
                          toggleStatus(testimonial._id, testimonial.status)
                        }
                        color="success"
                        size="sm"
                        style={{ fontSize: "11px", padding: "4px 8px" }}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {testimonials.length === 0 && !loading && (
          <div className="no-data">
            <Text>No testimonials found</Text>
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

      <ConfirmModal
        opened={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Testimonial"
        confirmLabel="Delete"
        color="error"
        loading={deleteTestimonialMutation.isPending}
      >
        Are you sure you want to delete this testimonial? This action cannot be
        undone.
      </ConfirmModal>
    </Page>
  );
};

export default TestimonialsList;
