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
    data.companyLogo || "/assets/img/logo dazzling/Logo White.png";
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

// Simple Text Template (for plain text emails)
export const simpleTextTemplate = (
  subject: string,
  content: string,
  data: TemplateData = {},
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

// Generic HTML Template (for custom content)
export const genericHtmlTemplate = (
  title: string,
  htmlContent: string,
  data: TemplateData = {},
): string => {
  const content = `
    <h1 style="color: #667eea; margin-top: 0;">${title}</h1>
    ${htmlContent}
  `;

  return baseTemplate(content, data);
};
