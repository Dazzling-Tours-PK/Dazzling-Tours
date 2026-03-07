"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetContactInquiry,
  useUpdateContactInquiry,
  useNotification,
} from "@/lib/hooks";
import { Page, Stack, Group, Button } from "@/app/Components/Common";
import { Select } from "@/app/Components/Form";
import { ContactStatus, getContactStatuses } from "@/lib/types/enums";

const ContactQueryDetails = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const router = useRouter();
  const [resolvedId, setResolvedId] = React.useState<string>("");

  React.useEffect(() => {
    params.then((resolved) => {
      setResolvedId(resolved.id);
    });
  }, [params]);

  const { data: queryData, isLoading: loading } =
    useGetContactInquiry(resolvedId);
  const updateContactMutation = useUpdateContactInquiry();
  const { showSuccess, showError } = useNotification();

  const query = queryData?.data;

  const updateStatus = (newStatus: string) => {
    if (!query) return;

    updateContactMutation.mutate(
      {
        _id: query._id,
        status: newStatus,
      },
      {
        onSuccess: () => {
          showSuccess("Contact query status updated successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to update contact query status");
        },
      },
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

  return (
    <Page
      title="Contact Query Details"
      description="View and manage contact inquiry details"
      loading={loading}
      headerActions={
        <Button variant="outline" onClick={() => router.back()}>
          <i className="bi bi-arrow-left"></i> Back
        </Button>
      }
    >
      {query && (
        <Stack>
          {/* Query Header */}
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
                  {query.subject}
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#6c757d", fontSize: "0.875rem" }}>
                    <i className="bi bi-calendar"></i>{" "}
                    {new Date(query.createdAt).toLocaleString()}
                  </span>
                  <span
                    className={`status-badge ${getStatusBadgeClass(
                      query.status,
                    )}`}
                  >
                    {query.status}
                  </span>
                </div>
              </div>
              <div style={{ minWidth: "200px" }}>
                <Select
                  value={query.status}
                  onChange={(value) => updateStatus(value)}
                  data={getContactStatuses()}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
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
              Contact Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#6c757d",
                    marginBottom: "0.25rem",
                    fontWeight: 500,
                  }}
                >
                  Name
                </label>
                <div style={{ fontSize: "1rem", fontWeight: 500 }}>
                  {query.name}
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    color: "#6c757d",
                    marginBottom: "0.25rem",
                    fontWeight: 500,
                  }}
                >
                  Email
                </label>
                <div>
                  <a
                    href={`mailto:${query.email}`}
                    style={{
                      color: "#1976d2",
                      textDecoration: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {query.email}
                  </a>
                </div>
              </div>
              {query.phone && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "#6c757d",
                      marginBottom: "0.25rem",
                      fontWeight: 500,
                    }}
                  >
                    Phone
                  </label>
                  <div>
                    <a
                      href={`tel:${query.phone}`}
                      style={{
                        color: "#1976d2",
                        textDecoration: "none",
                        fontSize: "1rem",
                      }}
                    >
                      {query.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
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
              Message
            </h3>
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                color: "#374151",
              }}
            >
              {query.message}
            </div>
          </div>

          {/* Actions */}
          <Group>
            <a
              href={`mailto:${query.email}?subject=Re: ${query.subject}&body=Dear ${query.name},%0D%0A%0D%0AThank you for contacting Dazzling Tours.%0D%0A%0D%0A`}
              className="btn btn-primary"
            >
              <i className="bi bi-reply"></i> Reply via Email
            </a>
            <Button
              color="success"
              onClick={() => updateStatus(ContactStatus.REPLIED)}
              disabled={query.status === ContactStatus.REPLIED}
            >
              <i className="bi bi-check-circle"></i> Mark as Replied
            </Button>
            <Button
              color="secondary"
              onClick={() => updateStatus(ContactStatus.CLOSED)}
              disabled={query.status === ContactStatus.CLOSED}
            >
              <i className="bi bi-x-circle"></i> Close Query
            </Button>
          </Group>
        </Stack>
      )}

      {!query && !loading && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <i
            className="bi bi-exclamation-circle"
            style={{
              fontSize: "3rem",
              color: "#6c757d",
              marginBottom: "1rem",
            }}
          ></i>
          <p style={{ fontSize: "1.1rem", color: "#6c757d" }}>
            Contact query not found
          </p>
        </div>
      )}
    </Page>
  );
};

export default ContactQueryDetails;
