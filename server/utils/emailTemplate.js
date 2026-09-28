/**
 * Raffles Jobs - Premium Email Template Generator
 * Generates responsive, high-converting HTML emails with Raffles Jobs branding.
 */

// Employer/user supplied strings (job titles, company names, candidate names)
// are interpolated into the markup below, so every dynamic value is escaped at
// the point of rendering. Callers may still pass intentional HTML through
// `bodyText` only.
const escapeHtml = (value) =>
  String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getRafflesEmailTemplate = ({
  title = "Notification from Raffles Jobs",
  subtitle = "Talent & Career Solutions",
  greeting = "Hello,",
  bodyText = "",
  otpCode = null,
  ctaText = null,
  ctaUrl = null,
  details = null, // Array of { label, value }
  footerNote = "Thank you for choosing Raffles Jobs. We are dedicated to connecting top talents with leading opportunities.",
}) => {
  const currentYear = new Date().getFullYear();
  const safeTitle = escapeHtml(title);
  const safeSubtitle = escapeHtml(subtitle);
  const safeGreeting = escapeHtml(greeting);
  const safeFooterNote = escapeHtml(footerNote);

  // Render OTP Box if provided
  const otpSectionHtml = otpCode
    ? `
    <div style="margin: 28px 0; text-align: center;">
      <div style="display: inline-block; background: #F8FAFC; border: 2px stroke #E2E8F0; border-radius: 16px; padding: 20px 32px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px;">Your Verification OTP Code</p>
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #2B2A8C; letter-spacing: 8px; display: block;">${otpCode}</span>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #94A3B8;">Valid for 5 minutes. Do not share this code with anyone.</p>
      </div>
    </div>
  `
    : "";

  // Render CTA Button if provided
  const ctaSectionHtml = ctaText && ctaUrl
    ? `
    <div style="margin: 28px 0; text-align: center;">
      <a href="${escapeHtml(ctaUrl)}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
        ${escapeHtml(ctaText)} &rarr;
      </a>
    </div>
  `
    : "";

  // Render Details Card if provided
  let detailsSectionHtml = "";
  if (details && Array.isArray(details) && details.length > 0) {
    detailsSectionHtml = `
      <div style="margin: 24px 0; background: #F8FAFC; border-left: 4px solid #2563EB; border-radius: 8px; padding: 16px 20px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          ${details
            .map(
              (item) => `
            <tr>
              <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #475569; width: 35%;">${escapeHtml(item.label)}:</td>
              <td style="padding: 6px 0; font-size: 13px; color: #0F172A; font-weight: 600;">${escapeHtml(item.value)}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9;">

  <!-- MAIN CONTAINER TABLE -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F1F5F9; padding: 40px 10px;">
    <tr>
      <td align="center">
        
        <!-- EMAIL CARD -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #E2E8F0;">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 36px 40px; text-align: left;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="display: inline-block; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 16px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.15);">
                      <span style="color: #60A5FA; font-size: 12px; font-weight: 800; tracking: 1px; text-transform: uppercase;">Raffles Jobs</span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.5px;">${safeTitle}</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #94A3B8;">${safeSubtitle}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY CONTENT -->
          <tr>
            <td style="padding: 40px; color: #334155; font-size: 15px; line-height: 1.6;">
              
              <p style="margin-top: 0; font-size: 16px; font-weight: 700; color: #0F172A;">
                ${safeGreeting}
              </p>

              <div style="color: #475569; font-size: 14px; line-height: 1.7;">
                ${bodyText}
              </div>

              ${otpSectionHtml}

              ${detailsSectionHtml}

              ${ctaSectionHtml}

              <p style="margin-top: 32px; font-size: 13px; color: #64748B; border-top: 1px solid #F1F5F9; padding-top: 20px;">
                ${safeFooterNote}
              </p>

            </td>
          </tr>

          <!-- BRAND FOOTER -->
          <tr>
            <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 28px 40px; text-align: center;">
              
              <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 800; color: #2B2A8C; tracking: 0.5px;">
                RAFFLES JOBS
              </p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748B;">
                Premier Recruitment, Executive Search & Talent Advisory Services
              </p>

              <div style="margin-bottom: 16px;">
                <a href="https://www.rafflesjobs.com" style="color: #2563EB; font-size: 12px; text-decoration: none; font-weight: 600; margin: 0 10px;">Official Website</a>
                <span style="color: #CBD5E1;">•</span>
                <a href="mailto:support@rafflesconsultancy.com" style="color: #2563EB; font-size: 12px; text-decoration: none; font-weight: 600; margin: 0 10px;">Support Team</a>
              </div>

              <p style="margin: 0; font-size: 11px; color: #94A3B8;">
                 &copy; ${currentYear} Raffles Jobs. All rights reserved.<br>
                This is an automated system notification. Please do not reply directly to this email.
              </p>

            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

module.exports = {
  getRafflesEmailTemplate,
  escapeHtml,
};
