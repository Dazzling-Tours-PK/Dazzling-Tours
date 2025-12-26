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
import { TextInput, Select } from "@/app/Components/Form";
import { Group, Stack, Page, Button } from "@/app/Components/Common";
import { ContactStatus, getContactStatuses } from "@/lib/types/enums";

const ContactQueriesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedQueries, setSelectedQueries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

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

  const deleteQuery = (id: string) => {
    if (confirm("Are you sure you want to delete this contact query?")) {
      deleteContactMutation.mutate(id, {
        onSuccess: () => {
          showSuccess("Contact query deleted successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to delete contact query");
        },
      });
    }
  };

  const updateStatus = (id: string, newStatus: string) => {
    updateContactMutation.mutate(
      {
        _id: id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          showSuccess("Contact query status updated successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to update contact query");
        },
      }
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
        data: { status },
      },
      {
        onSuccess: () => {
          showSuccess(
            `${selectedQueries.length} contact query/queries updated successfully!`
          );
          setSelectedQueries([]);
        },
        onError: (error) => {
          showError(error.message || "Failed to update contact queries");
        },
      }
    );
  };

  const bulkDelete = () => {
    if (selectedQueries.length === 0) {
      showError("Please select queries to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedQueries.length} contact query/queries?`
      )
    ) {
      bulkUpdateContactMutation.mutate(
        {
          ids: selectedQueries,
          action: "delete",
        },
        {
          onSuccess: () => {
            showSuccess(
              `${selectedQueries.length} contact query/queries deleted successfully!`
            );
            setSelectedQueries([]);
          },
          onError: (error) => {
            showError(error.message || "Failed to delete contact queries");
          },
        }
      );
    }
  };

  const toggleQuerySelection = (id: string) => {
    setSelectedQueries((prev) =>
      prev.includes(id)
        ? prev.filter((queryId) => queryId !== id)
        : [...prev, id]
    );
  };

  const selectAllQueries = () => {
    const allQueryIds = queries.map((query) => query._id);
    setSelectedQueries(
      selectedQueries.length === allQueryIds.length ? [] : allQueryIds
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case ContactStatus.NEW:
        return "status-badge info";
      case ContactStatus.READ:
        return "status-badge warning";
      case ContactStatus.REPLIED:
        return "status-badge success";
      case ContactStatus.CLOSED:
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
      title="Contact Queries"
      description="Manage contact inquiries, view statistics, and respond to customer queries"
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
              <h4>Total Queries</h4>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e1f5fe" }}>
              <i className="bi bi-circle-fill" style={{ color: "#0288d1" }}></i>
            </div>
            <div className="stat-content">
              <h4>New</h4>
              <p>{stats.new}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <i className="bi bi-eye" style={{ color: "#f57c00" }}></i>
            </div>
            <div className="stat-content">
              <h4>Read</h4>
              <p>{stats.read}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <i className="bi bi-reply" style={{ color: "#388e3c" }}></i>
            </div>
            <div className="stat-content">
              <h4>Replied</h4>
              <p>{stats.replied}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#f3e5f5" }}>
              <i
                className="bi bi-check-circle"
                style={{ color: "#7b1fa2" }}
              ></i>
            </div>
            <div className="stat-content">
              <h4>Closed</h4>
              <p>{stats.closed}</p>
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
            <div className="bulk-info" style={{ fontWeight: 600 }}>
              <i className="bi bi-check-circle me-2"></i>
              {selectedQueries.length} query/queries selected
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
                <i className="bi bi-eye"></i> Mark as Read
              </Button>
              <Button
                size="sm"
                color="success"
                onClick={() => bulkUpdateStatus(ContactStatus.REPLIED)}
              >
                <i className="bi bi-reply"></i> Mark as Replied
              </Button>
              <Button
                size="sm"
                color="warning"
                onClick={() => bulkUpdateStatus(ContactStatus.CLOSED)}
              >
                <i className="bi bi-check-circle"></i> Mark as Closed
              </Button>
              <Button size="sm" color="error" onClick={bulkDelete}>
                <i className="bi bi-trash"></i> Delete Selected
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => setSelectedQueries([])}
              >
                <i className="bi bi-x-circle"></i> Clear Selection
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
            leftIcon={<i className="bi bi-search"></i>}
            style={{ flex: 1, minWidth: "250px" }}
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

        {/* Queries Table */}
        <div className="blogs-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedQueries.length === queries.length &&
                      queries.length > 0
                    }
                    onChange={selectAllQueries}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedQueries.includes(query._id)}
                      onChange={() => toggleQuerySelection(query._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <div className="contact-info">
                      <strong>{query.name}</strong>
                      {query.phone && (
                        <div style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                          <i className="bi bi-telephone"></i> {query.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <a
                      href={`mailto:${query.email}`}
                      style={{ color: "#1976d2", textDecoration: "none" }}
                    >
                      {query.email}
                    </a>
                  </td>
                  <td>
                    <div className="subject-info">
                      <strong>{query.subject}</strong>
                      {query.message && (
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#6c757d",
                            marginTop: "0.25rem",
                          }}
                        >
                          {query.message.substring(0, 80)}
                          {query.message.length > 80 && "..."}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <select
                      value={query.status}
                      onChange={(e) => updateStatus(query._id, e.target.value)}
                      className={`status-select ${getStatusBadgeClass(
                        query.status
                      )}`}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    >
                      {getContactStatuses().map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
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
                    <div className="action-buttons">
                      <Link
                        href={`/admin/contact/${query._id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                      <a
                        href={`mailto:${query.email}?subject=Re: ${query.subject}`}
                        className="btn btn-sm btn-outline-success"
                        title="Reply via Email"
                      >
                        <i className="bi bi-reply"></i>
                      </a>
                      <button
                        onClick={() => deleteQuery(query._id)}
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

        {queries.length === 0 && !loading && (
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
              No contact queries found
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

export default ContactQueriesList;
