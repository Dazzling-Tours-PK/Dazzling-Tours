"use client";
import React, { useState, useMemo } from "react";
import {
  useGetNewsletters,
  useUpdateNewsletter,
  useDeleteNewsletter,
  useBulkUpdateNewsletters,
  useNotification,
} from "@/lib/hooks";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import { Group, Stack, Page, Button } from "@/app/Components/Common";

const NewsletterList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: subscribersData, isLoading: loading } = useGetNewsletters({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    search: searchTerm || undefined,
  });

  const updateNewsletterMutation = useUpdateNewsletter();
  const deleteNewsletterMutation = useDeleteNewsletter();
  const bulkUpdateNewslettersMutation = useBulkUpdateNewsletters();
  const { showSuccess, showError } = useNotification();

  const subscribers = useMemo(
    () => subscribersData?.data || [],
    [subscribersData?.data]
  );
  const pagination = subscribersData?.pagination;

  // Calculate statistics
  const stats = useMemo(() => {
    const allSubscribers = subscribersData?.data || [];
    return {
      total: subscribersData?.pagination?.total || 0,
      active: allSubscribers.filter((s) => s.status === "Active").length,
      unsubscribed: allSubscribers.filter((s) => s.status === "Unsubscribed")
        .length,
    };
  }, [subscribersData]);

  const deleteSubscriber = (id: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      deleteNewsletterMutation.mutate(id, {
        onSuccess: () => {
          showSuccess("Subscriber deleted successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to delete subscriber");
        },
      });
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    updateNewsletterMutation.mutate(
      {
        _id: id,
        status: newStatus as "Active" | "Unsubscribed",
      },
      {
        onSuccess: () => {
          showSuccess("Subscriber status updated successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to update subscriber");
        },
      }
    );
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedSubscribers.length === 0) {
      showError("Please select subscribers to update");
      return;
    }

    bulkUpdateNewslettersMutation.mutate(
      {
        ids: selectedSubscribers,
        action: "updateStatus",
        data: { status },
      },
      {
        onSuccess: () => {
          showSuccess(
            `${selectedSubscribers.length} subscriber(s) updated successfully!`
          );
          setSelectedSubscribers([]);
        },
        onError: (error) => {
          showError(error.message || "Failed to update subscribers");
        },
      }
    );
  };

  const bulkDelete = () => {
    if (selectedSubscribers.length === 0) {
      showError("Please select subscribers to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedSubscribers.length} subscriber(s)?`
      )
    ) {
      bulkUpdateNewslettersMutation.mutate(
        {
          ids: selectedSubscribers,
          action: "delete",
        },
        {
          onSuccess: () => {
            showSuccess(
              `${selectedSubscribers.length} subscriber(s) deleted successfully!`
            );
            setSelectedSubscribers([]);
          },
          onError: (error) => {
            showError(error.message || "Failed to delete subscribers");
          },
        }
      );
    }
  };

  const toggleSubscriberSelection = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id)
        ? prev.filter((subscriberId) => subscriberId !== id)
        : [...prev, id]
    );
  };

  const selectAllSubscribers = () => {
    const allSubscriberIds = subscribers.map((subscriber) => subscriber._id);
    setSelectedSubscribers(
      selectedSubscribers.length === allSubscriberIds.length
        ? []
        : allSubscriberIds
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
        return "status-badge success";
      case "Unsubscribed":
        return "status-badge secondary";
      default:
        return "status-badge secondary";
    }
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
      title="Newsletter Subscribers"
      description="Manage newsletter subscribers, view statistics, and update subscription status"
      loading={loading}
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <i className="bi bi-envelope" style={{ color: "#1976d2" }}></i>
            </div>
            <div className="stat-content">
              <h4>Total Subscribers</h4>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <i
                className="bi bi-check-circle"
                style={{ color: "#388e3c" }}
              ></i>
            </div>
            <div className="stat-content">
              <h4>Active</h4>
              <p>{stats.active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <i className="bi bi-x-circle" style={{ color: "#7b1fa2" }}></i>
            </div>
            <div className="stat-content">
              <h4>Unsubscribed</h4>
              <p>{stats.unsubscribed}</p>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSubscribers.length > 0 && (
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
            <div className="bulk-info" style={{ fontWeight: 600 }}>
              <i className="bi bi-check-circle me-2"></i>
              {selectedSubscribers.length} subscriber(s) selected
            </div>
            <div
              className="bulk-buttons"
              style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
            >
              <Button
                size="sm"
                color="success"
                onClick={() => bulkUpdateStatus("Active")}
              >
                <i className="bi bi-check-circle"></i> Activate Selected
              </Button>
              <Button
                size="sm"
                color="secondary"
                onClick={() => bulkUpdateStatus("Unsubscribed")}
              >
                <i className="bi bi-x-circle"></i> Unsubscribe Selected
              </Button>
              <Button size="sm" color="error" onClick={bulkDelete}>
                <i className="bi bi-trash"></i> Delete Selected
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => setSelectedSubscribers([])}
              >
                <i className="bi bi-x-circle"></i> Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search subscribers by email..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<i className="bi bi-search"></i>}
            style={{ flex: 1, minWidth: "250px" }}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              { value: "Active", label: "Active" },
              { value: "Unsubscribed", label: "Unsubscribed" },
            ]}
            style={{ minWidth: "150px" }}
          />
        </Group>

        {/* Subscribers Table */}
        <div className="blogs-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedSubscribers.length === subscribers.length &&
                      subscribers.length > 0
                    }
                    onChange={selectAllSubscribers}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed Date</th>
                <th>Unsubscribed Date</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber._id)}
                      onChange={() => toggleSubscriberSelection(subscriber._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <a
                      href={`mailto:${subscriber.email}`}
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      {subscriber.email}
                    </a>
                  </td>
                  <td>
                    <select
                      value={subscriber.status}
                      onChange={(e) =>
                        updateStatus(subscriber._id, e.target.value)
                      }
                      className={`status-select ${getStatusBadgeClass(
                        subscriber.status
                      )}`}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                    </select>
                  </td>
                  <td>
                    <div className="date-info">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      <br />
                      <small style={{ color: "#6c757d" }}>
                        {new Date(subscriber.subscribedAt).toLocaleTimeString()}
                      </small>
                    </div>
                  </td>
                  <td>
                    {subscriber.unsubscribedAt ? (
                      <div className="date-info">
                        {new Date(
                          subscriber.unsubscribedAt
                        ).toLocaleDateString()}
                        <br />
                        <small style={{ color: "#6c757d" }}>
                          {new Date(
                            subscriber.unsubscribedAt
                          ).toLocaleTimeString()}
                        </small>
                      </div>
                    ) : (
                      <span style={{ color: "#6c757d" }}>-</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => deleteSubscriber(subscriber._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {subscribers.length === 0 && !loading && (
          <div
            className="no-data"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <i
              className="bi bi-inbox"
              style={{
                fontSize: "3rem",
                color: "#6c757d",
                marginBottom: "1rem",
              }}
            ></i>
            <p style={{ fontSize: "1.1rem", color: "#6c757d" }}>
              No newsletter subscribers found
            </p>
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

export default NewsletterList;
