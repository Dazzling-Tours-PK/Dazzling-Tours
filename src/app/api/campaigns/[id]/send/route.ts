import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Campaign, Newsletter } from "@/models";
import {
  newsletterCampaignTemplate,
  genericHtmlTemplate,
} from "@/lib/templates/emailTemplates";
import { CampaignTemplateType, CampaignRecipientType } from "@/lib/types/enums";
import { verifyEmailConfig } from "@/lib/services/emailService";

// POST /api/campaigns/[id]/send - Send a campaign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Verify email configuration before proceeding
    const isEmailConfigured = await verifyEmailConfig();
    if (!isEmailConfigured) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not configured. Please check your SMTP settings in environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).",
        },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const campaign = await Campaign.findById(resolvedParams.id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Allow resending failed campaigns, but prevent resending if already sending or successfully sent
    if (campaign.status === "Sending") {
      return NextResponse.json(
        { success: false, error: "Campaign is currently being sent" },
        { status: 400 }
      );
    }

    if (campaign.status === "Sent") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Campaign has already been sent. Create a new campaign to send again.",
        },
        { status: 400 }
      );
    }

    // Reset stats if resending a failed campaign
    if (campaign.status === "Failed") {
      campaign.stats.sent = 0;
      campaign.stats.delivered = 0;
      campaign.stats.failed = 0;
      campaign.stats.opened = 0;
      campaign.stats.clicked = 0;
      campaign.stats.bounced = 0;
    }

    // Update campaign status to "Sending"
    campaign.status = "Sending";
    await campaign.save();

    // Get recipient emails based on campaign settings
    let recipientEmails: string[] = [];

    if (campaign.recipients.type === CampaignRecipientType.ALL) {
      const allSubscribers = await Newsletter.find({});
      recipientEmails = allSubscribers.map((s) => s.email);
    } else if (campaign.recipients.type === CampaignRecipientType.ACTIVE) {
      const activeSubscribers = await Newsletter.find({ status: "Active" });
      recipientEmails = activeSubscribers.map((s) => s.email);
    } else if (
      campaign.recipients.type === CampaignRecipientType.CUSTOM &&
      campaign.recipients.emails
    ) {
      recipientEmails = campaign.recipients.emails;
    }

    if (recipientEmails.length === 0) {
      campaign.status = "Failed";
      await campaign.save();
      return NextResponse.json(
        { success: false, error: "No recipients found" },
        { status: 400 }
      );
    }

    // Update total count
    campaign.stats.total = recipientEmails.length;
    await campaign.save();

    // Generate unsubscribe URLs for each recipient
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    // Send emails in background (don't wait for completion)
    // Process each email individually to include personalized unsubscribe links
    const sendPromises = recipientEmails.map(async (email, index) => {
      // Add delay between emails to avoid rate limiting
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      }

      try {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(
          email
        )}&token=${Buffer.from(email).toString("base64")}`;

        // Prepare email content based on template type with personalized unsubscribe URL
        let emailHtml: string;
        if (campaign.templateType === CampaignTemplateType.NEWSLETTER) {
          emailHtml = newsletterCampaignTemplate(
            campaign.subject,
            campaign.content,
            {
              companyName: "Dazzling Tours",
              unsubscribeUrl: unsubscribeUrl,
            }
          );
        } else {
          emailHtml = genericHtmlTemplate(campaign.subject, campaign.content, {
            companyName: "Dazzling Tours",
            unsubscribeUrl: unsubscribeUrl,
          });
        }

        const { sendEmail } = await import("@/lib/services/emailService");
        await sendEmail({
          to: email,
          subject: campaign.subject,
          html: emailHtml,
        });

        console.log(`Email sent successfully to: ${email}`);

        // Update sent count
        await Campaign.findByIdAndUpdate(campaign._id, {
          $inc: { "stats.sent": 1, "stats.delivered": 1 },
        });

        return { email, success: true };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);

        // Update failed count
        await Campaign.findByIdAndUpdate(campaign._id, {
          $inc: { "stats.failed": 1 },
        });
        return {
          email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    // Process emails in background
    Promise.all(sendPromises)
      .then((results) => {
        const successCount = results.filter((r) => r.success).length;
        const failedCount = results.filter((r) => !r.success).length;
        const errors = results.filter((r) => !r.success);

        // Log errors for debugging
        if (errors.length > 0) {
          console.error("Campaign email sending errors:", errors);
        }

        // Update campaign stats
        Campaign.findByIdAndUpdate(campaign._id, {
          status: successCount > 0 ? "Sent" : "Failed",
          sentAt: successCount > 0 ? new Date() : undefined,
          "stats.sent": successCount,
          "stats.failed": failedCount,
          "stats.delivered": successCount, // Assuming sent = delivered for now
        }).exec();
      })
      .catch((error) => {
        console.error("Campaign email sending failed:", error);
        Campaign.findByIdAndUpdate(campaign._id, {
          status: "Failed",
          "stats.failed": recipientEmails.length,
        }).exec();
      });

    return NextResponse.json({
      success: true,
      message: "Campaign is being sent",
      data: {
        totalRecipients: recipientEmails.length,
        campaignId: campaign._id,
      },
    });
  } catch (error) {
    console.error("Campaign send error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send campaign",
      },
      { status: 500 }
    );
  }
}
