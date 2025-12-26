"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  useCreateCampaign,
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
} from "@/lib/types/enums";

const CreateCampaign = () => {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const createCampaignMutation = useCreateCampaign();
  const { data: subscribersData } = useGetNewsletters({ limit: 1000 });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.validate()) {
      showError("Please fill in all required fields");
      return;
    }

    createCampaignMutation.mutate(form.values, {
      onSuccess: (data) => {
        showSuccess("Campaign created successfully!");
        router.push(`/admin/campaigns/${data.data._id}`);
      },
      onError: (error) => {
        showError(error.message || "Failed to create campaign");
      },
    });
  };

  const activeSubscribers =
    subscribersData?.data?.filter((s) => s.status === "Active") || [];
  const allSubscribers = subscribersData?.data || [];

  return (
    <Page
      title="Create Email Campaign"
      description="Create a new email campaign for your newsletter subscribers"
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
            <Button type="submit" disabled={createCampaignMutation.isPending}>
              {createCampaignMutation.isPending ? (
                <>
                  <i className="bi bi-hourglass-split"></i> Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i> Create Campaign
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

export default CreateCampaign;
