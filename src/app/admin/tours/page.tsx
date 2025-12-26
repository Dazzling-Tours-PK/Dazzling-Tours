"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetTours,
  useUpdateTour,
  useDeleteTour,
  useNotification,
  useGetCategories,
} from "@/lib/hooks";
import { TourStatus, TOUR_STATUS_OPTIONS } from "@/lib/enums";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import { Group, Stack, Page } from "@/app/Components/Common";

const ToursList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: toursData, isLoading: loading } = useGetTours({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    category: filterCategory === "all" ? undefined : filterCategory,
    featured:
      filterFeatured === "all"
        ? undefined
        : filterFeatured === "true"
        ? true
        : false,
    search: searchTerm || undefined,
  });

  const updateTourMutation = useUpdateTour();
  const deleteTourMutation = useDeleteTour();
  const { showSuccess } = useNotification();

  // Fetch categories for the filter dropdown
  const { data: categoriesData } = useGetCategories({ limit: 1000 });
  const categoryFilterOptions = React.useMemo(() => {
    const categories = categoriesData?.data || [];
    return [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    ];
  }, [categoriesData]);

  const tours = toursData?.data || [];
  const pagination = toursData?.pagination;

  const deleteTour = (id: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteTourMutation.mutate(id, {
        onSuccess: () => {
          showSuccess("Tour deleted successfully!");
        },
      });
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    updateTourMutation.mutate(
      {
        _id: id,
        featured: !currentFeatured,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Tour ${!currentFeatured ? "featured" : "unfeatured"} successfully!`
          );
        },
      }
    );
  };

  const toggleStatus = (id: string, currentStatus: TourStatus) => {
    updateTourMutation.mutate(
      {
        _id: id,
        status:
          currentStatus === TourStatus.ACTIVE
            ? TourStatus.INACTIVE
            : TourStatus.ACTIVE,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Tour status updated to ${
              currentStatus === TourStatus.ACTIVE
                ? TourStatus.INACTIVE
                : TourStatus.ACTIVE
            }!`
          );
        },
      }
    );
  };

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    console.log(value);
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    console.log(value);
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    console.log(value);
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleFeaturedChange = (value: string) => {
    console.log(value);
    setFilterFeatured(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log(page);
    setCurrentPage(page);
  };

  return (
    <Page
      title="Tours Management"
      description="Manage your tour packages, view bookings, and update tour information"
      loading={loading}
      headerActions={
        <Link href="/admin/tours/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Tour
        </Link>
      }
    >
      <Stack>
        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search tours..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<i className="bi bi-search"></i>}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              ...TOUR_STATUS_OPTIONS,
            ]}
          />

          <Select
            value={filterCategory}
            onChange={handleCategoryChange}
            data={categoryFilterOptions}
            searchable
          />

          <Select
            value={filterFeatured}
            onChange={handleFeaturedChange}
            data={[
              { value: "all", label: "All Tours" },
              { value: "true", label: "Featured Only" },
              { value: "false", label: "Non-Featured Only" },
            ]}
          />
        </Group>

        {/* Tours Table */}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id}>
                <td>{tour.title}</td>
                <td>{tour.location}</td>
                <td>${tour.price}</td>
                <td>{tour.duration}</td>
                <td>{tour.category}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(tour._id, tour.status)}
                    className={`status-badge ${tour.status.toLowerCase()} clickable`}
                  >
                    {tour.status}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => toggleFeatured(tour._id, tour.featured)}
                    className="btn btn-sm btn-link p-0"
                  >
                    {tour.featured ? (
                      <i className="bi bi-star-fill text-warning"></i>
                    ) : (
                      <i className="bi bi-star text-muted"></i>
                    )}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/admin/tours/edit/${tour._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <Link
                      href={`/admin/tours/view/${tour._id}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <button
                      onClick={() => deleteTour(tour._id)}
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

        {tours.length === 0 && !loading && (
          <div className="no-data">
            <p>No tours found</p>
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

export default ToursList;
