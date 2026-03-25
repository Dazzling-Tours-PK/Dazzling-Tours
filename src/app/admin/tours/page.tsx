"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetTours,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
  useNotification,
  useGetCategories,
} from "@/lib/hooks";
import { CreateTourData } from "@/lib/types/tour";
import { useRouter } from "next/navigation";
import { TourStatus, TOUR_STATUS_OPTIONS } from "@/lib/enums";
import { formatCurrency } from "@/lib/utils/currencyConverter";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import Image from "next/image";
import {
  Group,
  Stack,
  Page,
  Button,
  Badge,
  Table,
  ConfirmModal,
  Title,
  Text,
  Icon,
} from "@/app/Components/Common";

const ToursList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: toursData, isLoading: loading } = useGetTours({
    page: currentPage,
    limit: pageSize,
    status: filterStatus,
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
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTourMutation.mutate(deleteId, {
        onSuccess: () => {
          showSuccess("Tour deleted successfully!");
          setDeleteId(null);
        },
        onError: () => setDeleteId(null),
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
            `Tour ${!currentFeatured ? "featured" : "unfeatured"} successfully!`,
          );
        },
      },
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
            }!`,
          );
        },
      },
    );
  };
  const getStatusBadgeColor = (
    status: TourStatus,
  ): "success" | "warning" | "error" | "gray" => {
    switch (status) {
      case TourStatus.ACTIVE:
        return "success";
      case TourStatus.DRAFT:
        return "warning";
      case TourStatus.INACTIVE:
        return "error";
      case TourStatus.ARCHIVED:
        return "gray";
      default:
        return "gray";
    }
  };

  const getCategoryBadgeColor = (
    category: string,
  ): "primary" | "secondary" | "success" | "warning" | "error" | "blue" => {
    const colors: (
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "blue"
    )[] = ["primary", "secondary", "success", "warning", "error", "blue"];
    const hash = (category || "").split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleFeaturedChange = (value: string) => {
    setFilterFeatured(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const router = useRouter();
  const createTourMutation = useCreateTour();

  const handleCreateTour = async () => {
    try {
      const result = await createTourMutation.mutateAsync({
        status: TourStatus.DRAFT,
        title: "New Tour Draft",
        description: "Draft Description",
        shortDescription: "Draft Short Description",
        price: 0,
        duration: "Draft Duration",
        location: "Draft Location",
        category: "Draft Category",
        images: [],
      } as CreateTourData);

      // Successfully created draft, route to unified management page
      router.push(`/admin/tours/${result.data._id}`);
    } catch (err) {
      console.error("Failed to create tour draft:", err);
    }
  };

  return (
    <Page
      title="Tours Management"
      description="Manage your tour packages, view bookings, and update tour information"
      loading={loading}
      headerActions={
        <Button
          onClick={handleCreateTour}
          loading={createTourMutation.isPending}
        >
          <Icon name="plus-circle" /> Add New Tour
        </Button>
      }
    >
      <Stack>
        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search tours..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Icon name="search" />}
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

        <Table verticalSpacing="sm" horizontalSpacing="md">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th style={{ textAlign: "center" }}>Duration</th>
              <th style={{ textAlign: "center" }}>Category</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Featured</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {tour.images && tour.images[0] ? (
                      <div
                        style={{
                          width: "64px",
                          height: "48px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid #eee",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={tour.images[0]}
                          alt={tour.title}
                          width={64}
                          height={48}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "64px",
                          height: "48px",
                          borderRadius: "6px",
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #eee",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          name="image"
                          color="#dee2e6"
                          size="1rem"
                        />
                      </div>
                    )}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <Title order={6} size="h6" weight={700}>
                        {tour.title}
                      </Title>
                      <Text size="xs" color="dimmed">
                        ID: {tour._id.substring(0, 8)}...
                      </Text>
                    </div>
                  </div>
                </td>
                <td style={{ verticalAlign: "middle", padding: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Icon name="geo-alt" color="dimmed" size="0.9rem" />
                    <Text size="sm">{tour.location}</Text>
                  </div>
                </td>
                <td style={{ verticalAlign: "middle", padding: "0.75rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Text weight={600}>
                      {formatCurrency(tour.price)}
                    </Text>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {tour.priceType || "Per Person"}
                    </small>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Badge variant="light" color="blue" size="sm">
                    {tour.duration}
                  </Badge>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Badge
                    variant="filled"
                    color={getCategoryBadgeColor(tour.category)}
                    size="sm"
                    style={{ textTransform: "uppercase" }}
                  >
                    {tour.category}
                  </Badge>
                </td>
                <td style={{ textAlign: "center" }}>
                  <div
                    onClick={() => toggleStatus(tour._id, tour.status)}
                    style={{ cursor: "pointer" }}
                  >
                    <Badge
                      variant="filled"
                      color={getStatusBadgeColor(tour.status)}
                      size="sm"
                    >
                      {tour.status}
                    </Badge>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    onClick={() => toggleFeatured(tour._id, tour.featured)}
                    variant="subtle"
                    size="sm"
                    style={{ padding: 0, minWidth: "auto", height: "auto" }}
                  >
                    {tour.featured ? (
                      <Icon
                        name="star-fill"
                        color="#ffc107"
                        size="1.2rem"
                      />
                    ) : (
                      <Icon
                        name="star"
                        color="#cbd5e0"
                        size="1.2rem"
                      />
                    )}
                  </Button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <div
                    className="action-buttons"
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <Link
                      href={`/admin/tours/${tour._id}`}
                      passHref
                    >
                      <Button variant="outline" size="sm" title="Edit">
                        <Icon name="pencil" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => deleteTour(tour._id)}
                      variant="outline"
                      color="error"
                      size="sm"
                      title="Delete"
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {tours.length === 0 && !loading && (
          <div className="no-data">
            <Text>No tours found</Text>
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
        title="Delete Tour"
        confirmLabel="Delete"
        color="error"
        loading={deleteTourMutation.isPending}
      >
        Are you sure you want to delete this tour? This action cannot be undone.
      </ConfirmModal>
    </Page>
  );
};

export default ToursList;
