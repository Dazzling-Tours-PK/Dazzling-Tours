// Email Templates for Newsletter Campaigns

interface TemplateData {
  unsubscribeUrl?: string;
  companyName?: string;
  companyLogo?: string;
  [key: string]: unknown;
}

// Base email template wrapper
const baseTemplate = (content: string, data: TemplateData = {}): string => {
  const companyName = data.companyName || "Dazzling Tours";
  const companyLogo =
    data.companyLogo || "/assets/img/logo dazzling/Dazzling Tours Png.png";
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .email-header img {
      max-width: 150px;
      height: auto;
    }
    .email-body {
      padding: 30px 20px;
    }
    .email-footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #667eea;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .unsubscribe-link {
      color: #6c757d;
      text-decoration: none;
      font-size: 12px;
    }
    .unsubscribe-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="${companyLogo}" alt="${companyName}" />
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>&copy; ${year} ${companyName}. All rights reserved.</p>
      ${
        data.unsubscribeUrl
          ? `<p><a href="${data.unsubscribeUrl}" class="unsubscribe-link">Unsubscribe from this newsletter</a></p>`
          : ""
      }
      <p>You are receiving this email because you subscribed to our newsletter.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Newsletter Campaign Template
export const newsletterCampaignTemplate = (
  subject: string,
  content: string,
  data: TemplateData = {}
): string => {
  const unsubscribeUrl = data.unsubscribeUrl || "#";

  const emailContent = `
    <h1 style="color: #667eea; margin-top: 0;">${subject}</h1>
    <div style="margin: 20px 0;">
      ${content}
    </div>
    ${
      data.ctaText && data.ctaUrl
        ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.ctaUrl}" class="button">${data.ctaText}</a>
      </div>
    `
        : ""
    }
  `;

  return baseTemplate(emailContent, { ...data, unsubscribeUrl });
};

// Welcome Email Template
export const welcomeEmailTemplate = (data: TemplateData = {}): string => {
  const companyName = data.companyName || "Dazzling Tours";

  const content = `
    <h1 style="color: #667eea; margin-top: 0;">Welcome to ${companyName}!</h1>
    <p>Thank you for subscribing to our newsletter. We're excited to share amazing travel experiences, exclusive deals, and travel tips with you.</p>
    <p>Stay tuned for:</p>
    <ul>
      <li>Exclusive tour packages and discounts</li>
      <li>Travel tips and destination guides</li>
      <li>Latest news and updates</li>
      <li>Special offers just for subscribers</li>
    </ul>
    <p>Happy travels!</p>
    <p><strong>The ${companyName} Team</strong></p>
  `;

  return baseTemplate(content, data);
};

// Unsubscribe Confirmation Template
export const unsubscribeConfirmationTemplate = (
  data: TemplateData = {}
): string => {
  const companyName = data.companyName || "Dazzling Tours";

  const content = `
    <h1 style="color: #667eea; margin-top: 0;">You've been unsubscribed</h1>
    <p>We're sorry to see you go! You have been successfully unsubscribed from our newsletter.</p>
    <p>If you change your mind, you can always subscribe again from our website.</p>
    <p>Thank you for being part of our community.</p>
    <p><strong>The ${companyName} Team</strong></p>
  `;

  return baseTemplate(content, data);
};

// Simple Text Template (for plain text emails)
export const simpleTextTemplate = (
  subject: string,
  content: string,
  data: TemplateData = {}
): string => {
  const unsubscribeUrl = data.unsubscribeUrl || "#";
  const companyName = data.companyName || "Dazzling Tours";
  const year = new Date().getFullYear();

  return `
${subject}

${content}

---
${companyName}
© ${year} ${companyName}. All rights reserved.

${unsubscribeUrl ? `Unsubscribe: ${unsubscribeUrl}` : ""}
  `.trim();
};

// Tour Promotion Template
export const tourPromotionTemplate = (
  tourTitle: string,
  tourDescription: string,
  tourImage: string,
  tourUrl: string,
  data: TemplateData = {}
): string => {
  const companyName = data.companyName || "Dazzling Tours";

  const content = `
    <h1 style="color: #667eea; margin-top: 0;">Special Offer: ${tourTitle}</h1>
    ${
      tourImage
        ? `<img src="${tourImage}" alt="${tourTitle}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;" />`
        : ""
    }
    <p>${tourDescription}</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${tourUrl}" class="button">View Tour Details</a>
    </div>
    <p>Don't miss out on this amazing opportunity!</p>
    <p><strong>The ${companyName} Team</strong></p>
  `;

  return baseTemplate(content, {
    ...data,
    ctaText: "View Tour",
    ctaUrl: tourUrl,
  });
};

// Generic HTML Template (for custom content)
export const genericHtmlTemplate = (
  title: string,
  htmlContent: string,
  data: TemplateData = {}
): string => {
  const content = `
    <h1 style="color: #667eea; margin-top: 0;">${title}</h1>
    ${htmlContent}
  `;

  return baseTemplate(content, data);
};
