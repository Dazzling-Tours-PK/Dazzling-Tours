import nodemailer from "nodemailer";

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create transporter based on environment variables
const createTransporter = () => {
  // Check if Mailtrap is configured (preferred for development/testing)
  const useMailtrap =
    process.env.MAILTRAP_HOST &&
    process.env.MAILTRAP_USER &&
    process.env.MAILTRAP_PASS;

  if (useMailtrap) {
    // Mailtrap configuration
    const config: EmailConfig = {
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: parseInt(process.env.MAILTRAP_PORT || "2525"),
      secure: false, // Mailtrap uses TLS on port 2525
      auth: {
        user: process.env.MAILTRAP_USER || "",
        pass: process.env.MAILTRAP_PASS || "",
      },
    };
    return nodemailer.createTransport(config);
  }

  // Fallback to SMTP configuration (for production)
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  return nodemailer.createTransport(config);
};

// Email options interface
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
  }>;
}

// Send email function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email service is configured (Mailtrap or SMTP)
    const hasMailtrap =
      !!process.env.MAILTRAP_HOST &&
      !!process.env.MAILTRAP_USER &&
      !!process.env.MAILTRAP_PASS;
    const hasSMTP = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

    if (!hasMailtrap && !hasSMTP) {
      throw new Error(
        "Email configuration is missing. Please set either Mailtrap (MAILTRAP_HOST, MAILTRAP_USER, MAILTRAP_PASS) or SMTP (SMTP_USER, SMTP_PASS) environment variables.",
      );
    }

    const transporter = createTransporter();

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw new Error(
        `SMTP connection failed: ${
          verifyError instanceof Error ? verifyError.message : "Unknown error"
        }`,
      );
    }

    const useMailtrap =
      process.env.MAILTRAP_HOST &&
      process.env.MAILTRAP_USER &&
      process.env.MAILTRAP_PASS;
    const defaultFromEmail = useMailtrap
      ? "noreply@dazzlingtours.com"
      : process.env.SMTP_USER || "noreply@dazzlingtours.com";
    const fromEmail = options.from || defaultFromEmail;
    const fromName = process.env.SMTP_FROM_NAME || "Dazzling Tours";

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      to: options.to,
      subject: options.subject,
    });
    throw error;
  }
}

// Send bulk emails (with rate limiting)
export async function sendBulkEmails(
  recipients: string[],
  options: Omit<EmailOptions, "to">,
  batchSize: number = 10,
  delayMs: number = 1000,
): Promise<{
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>,
  };

  // Process in batches to avoid overwhelming the email server
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (email) => {
        try {
          await sendEmail({
            ...options,
            to: email,
          });
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            email,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }),
    );

    // Delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    // Check if Mailtrap or SMTP is configured
    const useMailtrap =
      process.env.MAILTRAP_HOST &&
      process.env.MAILTRAP_USER &&
      process.env.MAILTRAP_PASS;
    const useSMTP = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!useMailtrap && !useSMTP) {
      console.error(
        "Email configuration missing: Please set either Mailtrap (MAILTRAP_HOST, MAILTRAP_USER, MAILTRAP_PASS) or SMTP (SMTP_USER, SMTP_PASS) environment variables.",
      );
      return false;
    }

    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("SMTP verification failed:", error);
    return false;
  }
}
