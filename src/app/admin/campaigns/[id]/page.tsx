"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetCampaign,
  useSendCampaign,
  useDeleteCampaign,
  useNotification,
} from "@/lib/hooks";
import { Page, Stack, Group, Button } from "@/app/Components/Common";
import { CampaignStatus } from "@/lib/types/enums";

const CampaignDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [resolvedId, setResolvedId] = React.useState<string>("");

  React.useEffect(() => {
    params.then((resolved) => {
      setResolvedId(resolved.id);
    });
  }, [params]);

  const { data: campaignData, isLoading: loading } = useGetCampaign(resolvedId);
  const sendCampaignMutation = useSendCampaign();
  const deleteCampaignMutation = useDeleteCampaign();
  const { showSuccess, showError } = useNotification();

  const campaign = campaignData?.data;

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

  const handleSend = () => {
    const isResend = campaign?.status === CampaignStatus.FAILED;
    const confirmMessage = isResend
      ? `Are you sure you want to resend this failed campaign? This will attempt to send emails to all recipients again.`
      : `Are you sure you want to send this campaign? This will send emails to all recipients and cannot be undone.`;

    if (confirm(confirmMessage)) {
      sendCampaignMutation.mutate(campaign!._id, {
        onSuccess: (data) => {
          showSuccess(
            `Campaign is being sent to ${data.data.totalRecipients} recipients!`
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to send campaign");
        },
      });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaignMutation.mutate(campaign!._id, {
        onSuccess: () => {
          showSuccess("Campaign deleted successfully!");
          router.push("/admin/campaigns");
        },
        onError: (error) => {
          showError(error.message || "Failed to delete campaign");
        },
      });
    }
  };

  return (
    <Page
      title="Campaign Details"
      description="View and manage email campaign details"
      loading={loading}
      headerActions={
        <Button variant="outline" onClick={() => router.back()}>
          <i className="bi bi-arrow-left"></i> Back
        </Button>
      }
    >
      {campaign && (
        <Stack>
          {/* Campaign Header */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "1.5rem",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, marginBottom: "0.5rem" }}>
                  {campaign.title}
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={`status-badge ${getStatusBadgeClass(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                  <span className="badge badge-secondary">
                    {campaign.templateType}
                  </span>
                  <span style={{ color: "#6c757d", fontSize: "0.875rem" }}>
                    Created: {new Date(campaign.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {(campaign.status === CampaignStatus.DRAFT ||
              campaign.status === CampaignStatus.FAILED) && (
              <Group>
                <Button color="success" onClick={handleSend}>
                  <i className="bi bi-send"></i>{" "}
                  {campaign.status === CampaignStatus.FAILED
                    ? "Resend Campaign"
                    : "Send Campaign"}
                </Button>
                {(campaign.status === CampaignStatus.DRAFT ||
                  campaign.status === CampaignStatus.FAILED) && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/admin/campaigns/edit/${campaign._id}`)
                    }
                  >
                    <i className="bi bi-pencil"></i> Edit
                  </Button>
                )}
                {campaign.status === CampaignStatus.DRAFT && (
                  <Button
                    color="error"
                    variant="outline"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </Button>
                )}
              </Group>
            )}
          </div>

          {/* Campaign Content */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "1.5rem",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: "1rem",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              Email Subject
            </h3>
            <p style={{ fontSize: "1.1rem", color: "#374151" }}>
              {campaign.subject}
            </p>

            <h3
              style={{
                margin: "2rem 0 1rem 0",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              Email Content
            </h3>
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                padding: "1rem",
                background: "#f9fafb",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: campaign.content }}
                style={{ lineHeight: "1.6" }}
              />
            </div>
          </div>

          {/* Recipients Info */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "1.5rem",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: "1rem",
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              Recipients
            </h3>
            <p>
              <strong>Type:</strong>{" "}
              {campaign.recipients.type === "all"
                ? "All Subscribers"
                : campaign.recipients.type === "active"
                ? "Active Subscribers Only"
                : "Custom Email List"}
            </p>
            {campaign.recipients.type === "custom" &&
              campaign.recipients.emails && (
                <div>
                  <strong>Emails ({campaign.recipients.emails.length}):</strong>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "0.5rem",
                      background: "#f9fafb",
                      borderRadius: "4px",
                    }}
                  >
                    {campaign.recipients.emails.map((email, index) => (
                      <div key={index} style={{ fontSize: "0.875rem" }}>
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Statistics */}
          {campaign.status === CampaignStatus.SENT && (
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "1.5rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: "1.5rem",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                }}
              >
                Campaign Statistics
              </h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Total Recipients</h4>
                    <p>{campaign.stats.total}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Sent</h4>
                    <p>{campaign.stats.sent}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Delivered</h4>
                    <p>{campaign.stats.delivered}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Opened</h4>
                    <p>{campaign.stats.opened}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Clicked</h4>
                    <p>{campaign.stats.clicked}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Failed</h4>
                    <p>{campaign.stats.failed}</p>
                  </div>
                </div>
              </div>
              {campaign.sentAt && (
                <p
                  style={{
                    marginTop: "1rem",
                    color: "#6c757d",
                    fontSize: "0.875rem",
                  }}
                >
                  Sent at: {new Date(campaign.sentAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </Stack>
      )}
    </Page>
  );
};

export default CampaignDetails;
