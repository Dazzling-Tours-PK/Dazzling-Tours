"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetCampaigns,
  useDeleteCampaign,
  useSendCampaign,
  useNotification,
} from "@/lib/hooks";
import { CampaignStatus } from "@/lib/types/enums";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import { Group, Stack, Page } from "@/app/Components/Common";

const CampaignsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: campaignsData, isLoading: loading } = useGetCampaigns({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    search: searchTerm || undefined,
  });

  const deleteCampaignMutation = useDeleteCampaign();
  const sendCampaignMutation = useSendCampaign();
  const { showSuccess, showError } = useNotification();

  const campaigns = useMemo(
    () => campaignsData?.data || [],
    [campaignsData?.data]
  );
  const pagination = campaignsData?.pagination;

  // Calculate statistics
  const stats = useMemo(() => {
    const allCampaigns = campaignsData?.data || [];
    return {
      total: campaignsData?.pagination?.total || 0,
      draft: allCampaigns.filter((c) => c.status === "Draft").length,
      scheduled: allCampaigns.filter((c) => c.status === "Scheduled").length,
      sent: allCampaigns.filter((c) => c.status === "Sent").length,
    };
  }, [campaignsData]);

  const deleteCampaign = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaignMutation.mutate(id, {
        onSuccess: () => {
          showSuccess("Campaign deleted successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to delete campaign");
        },
      });
    }
  };

  const sendCampaign = (id: string) => {
    const campaign = campaigns.find((c) => c._id === id);
    const isResend = campaign?.status === CampaignStatus.FAILED;
    const confirmMessage = isResend
      ? "Are you sure you want to resend this failed campaign? This will attempt to send emails again."
      : "Are you sure you want to send this campaign? This action cannot be undone.";

    if (confirm(confirmMessage)) {
      sendCampaignMutation.mutate(id, {
        onSuccess: (data) => {
          showSuccess(
            `Campaign is being ${isResend ? "resent" : "sent"} to ${
              data.data.totalRecipients
            } recipients!`
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to send campaign");
        },
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Draft":
        return "status-badge warning";
      case "Scheduled":
        return "status-badge info";
      case "Sending":
        return "status-badge primary";
      case "Sent":
        return "status-badge success";
      case "Failed":
        return "status-badge error";
      default:
        return "status-badge secondary";
    }
  };

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
      title="Email Campaigns"
      description="Create and manage email campaigns for your newsletter subscribers"
      loading={loading}
      headerActions={
        <Link href="/admin/campaigns/create" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Create Campaign
        </Link>
      }
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <i className="bi bi-envelope" style={{ color: "#1976d2" }}></i>
            </div>
            <div className="stat-content">
              <h4>Total Campaigns</h4>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <i className="bi bi-file-text" style={{ color: "#f57c00" }}></i>
            </div>
            <div className="stat-content">
              <h4>Drafts</h4>
              <p>{stats.draft}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e1f5fe" }}>
              <i className="bi bi-clock" style={{ color: "#0288d1" }}></i>
            </div>
            <div className="stat-content">
              <h4>Scheduled</h4>
              <p>{stats.scheduled}</p>
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
              <h4>Sent</h4>
              <p>{stats.sent}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search campaigns by title or subject..."
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
              { value: "Draft", label: "Draft" },
              { value: "Scheduled", label: "Scheduled" },
              { value: "Sending", label: "Sending" },
              { value: "Sent", label: "Sent" },
              { value: "Failed", label: "Failed" },
            ]}
            style={{ minWidth: "150px" }}
          />
        </Group>

        {/* Campaigns Table */}
        <div className="blogs-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Subject</th>
                <th>Template</th>
                <th>Status</th>
                <th>Recipients</th>
                <th>Stats</th>
                <th>Created</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td>
                    <strong>{campaign.title}</strong>
                  </td>
                  <td>{campaign.subject}</td>
                  <td>
                    <span className="badge badge-secondary">
                      {campaign.templateType}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        campaign.status
                      )}`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td>
                    {campaign.recipients.type === "all"
                      ? "All Subscribers"
                      : campaign.recipients.type === "active"
                      ? "Active Only"
                      : `${campaign.recipients.emails?.length || 0} Custom`}
                  </td>
                  <td>
                    <div style={{ fontSize: "0.875rem" }}>
                      <div>Sent: {campaign.stats.sent}</div>
                      <div>Opened: {campaign.stats.opened}</div>
                      <div>Clicked: {campaign.stats.clicked}</div>
                    </div>
                  </td>
                  <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        href={`/admin/campaigns/${campaign._id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                      {(campaign.status === CampaignStatus.DRAFT ||
                        campaign.status === CampaignStatus.FAILED) && (
                        <Link
                          href={`/admin/campaigns/edit/${campaign._id}`}
                          className="btn btn-sm btn-outline-info"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                      )}
                      {(campaign.status === CampaignStatus.DRAFT ||
                        campaign.status === CampaignStatus.FAILED) && (
                        <button
                          onClick={() => sendCampaign(campaign._id)}
                          className="btn btn-sm btn-outline-success"
                          title={
                            campaign.status === CampaignStatus.FAILED
                              ? "Resend Campaign"
                              : "Send Campaign"
                          }
                        >
                          <i className="bi bi-send"></i>
                        </button>
                      )}
                      {campaign.status === CampaignStatus.DRAFT && (
                        <button
                          onClick={() => deleteCampaign(campaign._id)}
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {campaigns.length === 0 && !loading && (
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
              No campaigns found
            </p>
            <Link
              href="/admin/campaigns/create"
              className="btn btn-primary mt-3"
            >
              <i className="bi bi-plus-circle"></i> Create Your First Campaign
            </Link>
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

export default CampaignsList;
