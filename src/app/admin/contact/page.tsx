"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetContactInquiries,
  useUpdateContactInquiry,
  useDeleteContactInquiry,
  useBulkUpdateContactInquiries,
  useNotification,
} from "@/lib/hooks";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select, Checkbox } from "@/app/Components/Form";
import {
  Group,
  Stack,
  Page,
  Button,
  ActionIcon,
  Text,
  ConfirmModal,
  Table,
  Title,
  Icon,
} from "@/app/Components/Common";
import { ContactStatus, getContactStatuses } from "@/lib/types/enums";

const ContactQueriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    opened: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
    loading?: boolean;
  }>({
    opened: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const { data: queriesData, isLoading: loading } = useGetContactInquiries({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    search: searchTerm || undefined,
  });

  const updateContactMutation = useUpdateContactInquiry();
  const deleteContactMutation = useDeleteContactInquiry();
  const bulkUpdateContactMutation = useBulkUpdateContactInquiries();
  const { showSuccess, showError } = useNotification();

  const queries = useMemo(() => queriesData?.data || [], [queriesData?.data]);
  const pagination = queriesData?.pagination;

  // Calculate statistics
  const stats = useMemo(() => {
    const allQueries = queriesData?.data || [];
    return {
      total: queriesData?.pagination?.total || 0,
      new: allQueries.filter((q) => q.status === ContactStatus.NEW).length,
      read: allQueries.filter((q) => q.status === ContactStatus.READ).length,
      replied: allQueries.filter((q) => q.status === ContactStatus.REPLIED)
        .length,
      closed: allQueries.filter((q) => q.status === ContactStatus.CLOSED)
        .length,
    };
  }, [queriesData]);

  const handleDeleteQuery = (id: string) => {
    setConfirmModalConfig({
      opened: true,
      title: "Delete Inquiry",
      message: "Are you sure you want to delete this contact inquiry? This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: () => {
        deleteContactMutation.mutate(id, {
          onSuccess: () => {
            showSuccess("Contact query deleted successfully!");
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          },
          onError: (error) => {
            showError(error.message || "Failed to delete contact query");
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
          },
        });
      },
      loading: deleteContactMutation.isPending,
    });
  };

  const updateStatus = (id: string, newStatus: string) => {
    updateContactMutation.mutate(
      {
        _id: id,
        status: newStatus as ContactStatus,
      },
      {
        onSuccess: () => {
          showSuccess("Contact query status updated successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to update contact query");
        },
      },
    );
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedQueries.length === 0) {
      showError("Please select queries to update");
      return;
    }

    bulkUpdateContactMutation.mutate(
      {
        ids: selectedQueries,
        action: "updateStatus",
        data: { status: status as ContactStatus },
      },
      {
        onSuccess: () => {
          showSuccess(
            `${selectedQueries.length} contact query/queries updated successfully!`,
          );
          setSelectedQueries([]);
        },
        onError: (error) => {
          showError(error.message || "Failed to update contact queries");
        },
      },
    );
  };

  const bulkDelete = () => {
    if (selectedQueries.length === 0) {
      showError("Please select queries to delete");
      return;
    }

    setConfirmModalConfig({
      opened: true,
      title: "Delete Multiple Inquiries",
      message: `Are you sure you want to delete ${selectedQueries.length} selected inquiries? This action cannot be undone.`,
      confirmLabel: `Delete ${selectedQueries.length} Items`,
      onConfirm: () => {
        bulkUpdateContactMutation.mutate(
          {
            ids: selectedQueries,
            action: "delete",
          },
          {
            onSuccess: () => {
              showSuccess(
                `${selectedQueries.length} contact query/queries deleted successfully!`,
              );
              setSelectedQueries([]);
              setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
            },
            onError: (error) => {
              showError(error.message || "Failed to delete contact queries");
              setConfirmModalConfig((prev) => ({ ...prev, opened: false }));
            },
          },
        );
      },
      loading: bulkUpdateContactMutation.isPending,
    });
  };

  const toggleQuerySelection = (id: string) => {
    setSelectedQueries((prev) =>
      prev.includes(id)
        ? prev.filter((queryId) => queryId !== id)
        : [...prev, id],
    );
  };

  const selectAllQueries = () => {
    const allQueryIds = queries.map((query) => query._id);
    setSelectedQueries(
      selectedQueries.length === allQueryIds.length ? [] : allQueryIds,
    );
  };

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Page
      title="Contact Queries"
      description="Manage contact inquiries, view statistics, and respond to customer queries"
      loading={loading}
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <Icon name="envelope" color="#1976d2" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Total Queries
              </Title>
              <Text weight={700} size="lg">
                {stats.total}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e1f5fe" }}>
              <Icon name="circle-fill" color="#0288d1" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                New
              </Title>
              <Text weight={700} size="lg">
                {stats.new}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <Icon name="eye" color="#f57c00" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Read
              </Title>
              <Text weight={700} size="lg">
                {stats.read}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <Icon name="reply" color="#388e3c" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Replied
              </Title>
              <Text weight={700} size="lg">
                {stats.replied}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <Icon name="check-circle" color="#7b1fa2" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Closed
              </Title>
              <Text weight={700} size="lg">
                {stats.closed}
              </Text>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedQueries.length > 0 && (
          <div
            className="bulk-actions"
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div className="bulk-info">
              <Icon name="check-circle" className="me-2" />
              <Text weight={600} component="span">
                {selectedQueries.length} query/queries selected
              </Text>
            </div>
            <div
              className="bulk-buttons"
              style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
            >
              <Button
                size="sm"
                color="primary"
                onClick={() => bulkUpdateStatus(ContactStatus.READ)}
              >
                <Icon name="eye" /> Mark as Read
              </Button>
              <Button
                size="sm"
                color="success"
                onClick={() => bulkUpdateStatus(ContactStatus.REPLIED)}
              >
                <Icon name="reply" /> Mark as Replied
              </Button>
              <Button
                size="sm"
                color="warning"
                onClick={() => bulkUpdateStatus(ContactStatus.CLOSED)}
              >
                <Icon name="check-circle" /> Mark as Closed
              </Button>
              <Button size="sm" color="error" onClick={bulkDelete}>
                <Icon name="trash" /> Delete Selected
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => setSelectedQueries([])}
              >
                <Icon name="x-circle" /> Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search queries by name, email, or subject..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Icon name="search" />}
            style={{ flex: 1, minWidth: "400px" }}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              ...getContactStatuses(),
            ]}
            style={{ minWidth: "150px" }}
          />
        </Group>

        <Table verticalSpacing="sm" horizontalSpacing="md">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>
                  <Checkbox
                    checked={
                      selectedQueries.length === queries.length &&
                      queries.length > 0
                    }
                    onChange={selectAllQueries}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "220px" }}>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>
                    <Checkbox
                      checked={selectedQueries.includes(query._id)}
                      onChange={() => toggleQuerySelection(query._id)}
                    />
                  </td>
                  <td>
                    <Text size="sm" weight={500} component="div">
                      {query.name}
                    </Text>
                  </td>
                  <td>
                    <Stack spacing={2} align="start">
                      <Text size="sm" component="span">
                        {query.email}
                      </Text>

                      {query.phone && (
                        <Text size="xs" color="dimmed" component="div">
                          <Icon name="telephone" className="me-1" />{" "}
                          {query.phone}
                        </Text>
                      )}
                    </Stack>
                  </td>
                  <td style={{ maxWidth: "220px" }}>
                    <div className="subject-info">
                      {query.tourId ? (
                        <Link
                          href={`/admin/tours/${query.tourId}`}
                          style={{ textDecoration: "none" }}
                          title="View Tour Details"
                        >
                          <Text
                            size="sm"
                            color="primary"
                            weight={400}
                            component="span"
                          >
                            {query.subject}
                          </Text>
                        </Link>
                      ) : (
                        <Text size="sm" weight={400} component="span">
                          {query.subject}
                        </Text>
                      )}
                      {query.message && (
                        <Text size="sm" color="dimmed" component="div">
                          {query.message.substring(0, 80)}
                          {query.message.length > 80 && "..."}
                        </Text>
                      )}
                    </div>
                  </td>
                  <td>
                    <Select
                      size="sm"
                      value={query.status}
                      onChange={(val) => updateStatus(query._id, val)}
                      data={getContactStatuses()}
                    />
                  </td>
                  <td>
                    <div className="date-info">
                      {new Date(query.createdAt).toLocaleDateString()}
                      <br />
                      <small style={{ color: "#6c757d" }}>
                        {new Date(query.createdAt).toLocaleTimeString()}
                      </small>
                    </div>
                  </td>
                  <td>
                    <Group spacing={12}>
                      <Link href={`/admin/contact/${query._id}`} passHref>
                        <ActionIcon
                          variant="light"
                          color="primary"
                          title="View Details"
                        >
                          <Icon name="eye" />
                        </ActionIcon>
                      </Link>
                      <ActionIcon
                        variant="light"
                        color="error"
                        title="Delete Query"
                        loading={
                          deleteContactMutation.isPending &&
                          confirmModalConfig.opened
                        }
                        onClick={() => handleDeleteQuery(query._id)}
                      >
                        <Icon name="trash" />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

        {queries.length === 0 && !loading && (
          <div
            className="no-data"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <Icon
              name="inbox"
              size={48}
              color="dimmed"
              style={{ marginBottom: "1rem" }}
            />
            <Text color="dimmed" weight={500} size="lg">
              No contact queries found
            </Text>
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
        {/* Deletion Confirmation Modal */}
        <ConfirmModal
          opened={confirmModalConfig.opened}
          onClose={() =>
            setConfirmModalConfig((prev) => ({ ...prev, opened: false }))
          }
          onConfirm={confirmModalConfig.onConfirm}
          title={confirmModalConfig.title}
          confirmLabel={confirmModalConfig.confirmLabel}
          color="error"
          loading={confirmModalConfig.loading}
        >
          {confirmModalConfig.message}
        </ConfirmModal>


      </Stack>
    </Page>
  );
};

export default ContactQueriesList;
