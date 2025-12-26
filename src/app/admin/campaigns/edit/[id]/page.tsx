"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  useGetCampaign,
  useUpdateCampaign,
  useGetNewsletters,
  useNotification,
} from "@/lib/hooks";
import { Page, Stack, Group, Button } from "@/app/Components/Common";
import {
  TextInput,
  Select,
  TiptapRichTextEditor,
  Textarea,
} from "@/app/Components/Form";
import { useForm } from "@/lib/hooks";
import {
  CampaignTemplateType,
  CampaignRecipientType,
  getCampaignTemplateTypes,
  CampaignStatus,
} from "@/lib/types/enums";

const EditCampaign = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [resolvedId, setResolvedId] = React.useState<string>("");

  React.useEffect(() => {
    params.then((resolved) => {
      setResolvedId(resolved.id);
    });
  }, [params]);

  const { data: campaignData, isLoading: loading } = useGetCampaign(resolvedId);
  const updateCampaignMutation = useUpdateCampaign();
  const { data: subscribersData } = useGetNewsletters({ limit: 1000 });

  const campaign = campaignData?.data;

  const form = useForm({
    initialValues: {
      title: "",
      subject: "",
      content: "",
      templateType: CampaignTemplateType.NEWSLETTER,
      recipients: {
        type: CampaignRecipientType.ACTIVE,
        emails: [] as string[],
      },
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title) errors.title = "Title is required";
      if (!values.subject) errors.subject = "Subject is required";
      if (!values.content) errors.content = "Content is required";
      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Populate form when campaign data is loaded
  React.useEffect(() => {
    if (campaign) {
      form.setValues({
        title: campaign.title || "",
        subject: campaign.subject || "",
        content: campaign.content || "",
        templateType:
          (campaign.templateType as CampaignTemplateType) ||
          CampaignTemplateType.NEWSLETTER,
        recipients: {
          type:
            (campaign.recipients.type as CampaignRecipientType) ||
            CampaignRecipientType.ACTIVE,
          emails: campaign.recipients.emails || [],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.validate()) {
      showError("Please fill in all required fields");
      return;
    }

    if (!resolvedId) {
      showError("Campaign ID is missing");
      return;
    }

    updateCampaignMutation.mutate(
      {
        _id: resolvedId,
        ...form.values,
      },
      {
        onSuccess: () => {
          showSuccess("Campaign updated successfully!");
          router.push(`/admin/campaigns/${resolvedId}`);
        },
        onError: (error) => {
          showError(error.message || "Failed to update campaign");
        },
      }
    );
  };

  const activeSubscribers =
    subscribersData?.data?.filter((s) => s.status === "Active") || [];
  const allSubscribers = subscribersData?.data || [];

  // Don't allow editing if campaign is already sent
  if (campaign && campaign.status === CampaignStatus.SENT) {
    return (
      <Page
        title="Edit Campaign"
        description="Edit email campaign details"
        headerActions={
          <Button variant="outline" onClick={() => router.back()}>
            <i className="bi bi-arrow-left"></i> Back
          </Button>
        }
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "2rem",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <i
            className="bi bi-exclamation-triangle"
            style={{ fontSize: "3rem", color: "#f59e0b", marginBottom: "1rem" }}
          ></i>
          <h3 style={{ marginBottom: "1rem" }}>Cannot Edit Sent Campaign</h3>
          <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
            This campaign has already been sent and cannot be edited. Create a
            new campaign to make changes.
          </p>
          <Group style={{ justifyContent: "center" }}>
            <Button onClick={() => router.push("/admin/campaigns/create")}>
              <i className="bi bi-plus-circle"></i> Create New Campaign
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              <i className="bi bi-arrow-left"></i> Go Back
            </Button>
          </Group>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title="Edit Campaign"
      description="Edit email campaign details"
      loading={loading}
      headerActions={
        <Button variant="outline" onClick={() => router.back()}>
          <i className="bi bi-arrow-left"></i> Back
        </Button>
      }
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Group>
            <TextInput
              label="Campaign Title"
              placeholder="e.g., Summer Tour Promotion"
              value={form.values.title}
              onChange={(value) => form.setFieldValue("title", value)}
              error={form.errors.title}
              required
              style={{ flex: 1 }}
            />

            <Select
              label="Template Type"
              value={form.values.templateType}
              onChange={(value) =>
                form.setFieldValue(
                  "templateType",
                  value as CampaignTemplateType
                )
              }
              data={getCampaignTemplateTypes()}
              style={{ minWidth: "200px" }}
            />
          </Group>

          <TextInput
            label="Email Subject"
            placeholder="e.g., Exclusive Summer Deals - Up to 30% Off!"
            value={form.values.subject}
            onChange={(value) => form.setFieldValue("subject", value)}
            error={form.errors.subject}
            required
            description="This is what recipients will see in their inbox"
          />

          <div>
            <TiptapRichTextEditor
              label="Email Content"
              description="Write your email content here. You can use rich text formatting."
              value={form.values.content}
              onChange={(content) => form.setFieldValue("content", content)}
              required
            />
            {form.errors.content && (
              <div
                style={{
                  color: "red",
                  fontSize: "0.875rem",
                  marginTop: "0.25rem",
                }}
              >
                {form.errors.content}
              </div>
            )}
          </div>

          <Select
            label="Recipients"
            value={form.values.recipients.type}
            onChange={(value) =>
              form.setFieldValue("recipients", {
                ...form.values.recipients,
                type: value as CampaignRecipientType,
              })
            }
            data={[
              {
                value: CampaignRecipientType.ALL,
                label: `All Subscribers (${allSubscribers.length})`,
              },
              {
                value: CampaignRecipientType.ACTIVE,
                label: `Active Subscribers Only (${activeSubscribers.length})`,
              },
              {
                value: CampaignRecipientType.CUSTOM,
                label: "Custom Email List",
              },
            ]}
            description={
              form.values.recipients.type === CampaignRecipientType.ALL
                ? `This campaign will be sent to all ${allSubscribers.length} subscribers.`
                : form.values.recipients.type === CampaignRecipientType.ACTIVE
                ? `This campaign will be sent to ${activeSubscribers.length} active subscribers.`
                : `This campaign will be sent to ${
                    form.values.recipients.emails?.length || 0
                  } custom email addresses.`
            }
          />

          {form.values.recipients.type === CampaignRecipientType.CUSTOM && (
            <Textarea
              label="Email Addresses"
              description="Enter email addresses (one per line)"
              value={form.values.recipients.emails?.join("\n") || ""}
              onChange={(value) => {
                const emails = value
                  .split("\n")
                  .map((email) => email.trim())
                  .filter((email) => email.length > 0);
                form.setFieldValue("recipients", {
                  ...form.values.recipients,
                  emails: emails,
                });
              }}
              rows={5}
              placeholder="email1@example.com&#10;email2@example.com"
              resize="vertical"
            />
          )}

          <Group>
            <Button
              type="submit"
              disabled={updateCampaignMutation.isPending}
            >
              {updateCampaignMutation.isPending ? (
                <>
                  <i className="bi bi-hourglass-split"></i> Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Update Campaign
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </Page>
  );
};

export default EditCampaign;

