import nodemailer from "nodemailer";
import { Resend } from "resend";

// Initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

  // Fallback to SMTP configuration
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
    const fromName = process.env.SMTP_FROM_NAME || "Dazzling Tours";
    const defaultFromEmail =
      process.env.RESEND_FROM_EMAIL || process.env.SMTP_USER;
    const fromEmail = options.from || defaultFromEmail;
    const formattedFrom = `${fromName} <${fromEmail}>`;

    // 1. Try Resend first (Production Preferred)
    if (resend && process.env.NODE_ENV === "production") {
      try {
        const { error } = await resend.emails.send({
          from: formattedFrom,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>/g, ""),
          replyTo: options.replyTo,
          attachments: options.attachments?.map((att) => ({
            filename: att.filename,
            content: att.content,
            path: att.path,
          })),
        });

        if (error) {
          console.error("Resend error:", error);
          throw error;
        }

        return true;
      } catch (resendError) {
        console.warn(
          "Resend failed, falling back to SMTP/Mailtrap:",
          resendError,
        );
        // Fall through to Nodemailer...
      }
    }

    // 2. Fallback to Nodemailer (Mailtrap/SMTP)
    const hasMailtrap =
      !!process.env.MAILTRAP_HOST &&
      !!process.env.MAILTRAP_USER &&
      !!process.env.MAILTRAP_PASS;
    const hasSMTP = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

    if (!hasMailtrap && !hasSMTP) {
      throw new Error(
        "No mail service configured. Please set RESEND_API_KEY, Mailtrap, or SMTP credentials.",
      );
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: formattedFrom,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Email sending fatal error:", error);
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

    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    if (resend) return true;

    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("Email config verification failed:", error);
    return false;
  }
}
