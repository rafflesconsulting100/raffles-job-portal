const nodemailer = require('nodemailer');
const { getRafflesEmailTemplate } = require('../utils/emailTemplate');

// Parse sender name and email address cleanly
const parseSender = () => {
  const defaultEmail = process.env.BREVO_SMTP_USER || 'rafflesjobs37@gmail.com';
  const defaultName = 'Raffles Jobs';
  const rawFrom = process.env.EMAIL_FROM || `"${defaultName}" <${defaultEmail}>`;

  const match = rawFrom.match(/(?:"?([^"]*)"?\s)?<?([^>]+)>?/);
  if (match) {
    const name = (match[1] || defaultName).trim();
    let email = (match[2] || defaultEmail).trim();
    return { name, email, raw: `"${name}" <${email}>` };
  }
  return { name: defaultName, email: defaultEmail, raw: `"${defaultName}" <${defaultEmail}>` };
};

/**
 * Send email via Brevo REST API over HTTPS (Port 443)
 * Requires a Brevo API v3 key (starts with "xkeysib-")
 */
const sendViaBrevoRestApi = async (apiKey, sender, options, htmlContent) => {
  const url = 'https://api.brevo.com/v3/smtp/email';
  const payload = {
    sender: {
      name: sender.name,
      email: sender.email,
    },
    to: [
      {
        email: options.to,
        name: options.toName || options.to.split('@')[0],
      },
    ],
    subject: options.subject,
    htmlContent: htmlContent,
    textContent: options.text || options.body || '',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000), // 5 second timeout
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errCode = data.code || response.status;
    const errMsg = data.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`Brevo API error (${errCode}): ${errMsg}`);
  }

  return {
    provider: 'brevo-https-api',
    messageId: data.messageId || `brevo-${Date.now()}`,
    success: true,
  };
};

/**
 * Send via Nodemailer SMTP with automatic port failover (465 SSL, 587 TLS, 2525)
 * Cloud hosts like Render frequently block port 587, but port 465 (SSL) works reliably.
 */
const sendViaNodemailerSmtpWithFallback = async (sender, options, htmlContent) => {
  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS || process.env.BREVO_API_KEY;

  if (!user || !pass) {
    throw new Error('SMTP credentials missing (BREVO_SMTP_USER / BREVO_SMTP_PASS)');
  }

  // Priority port order: Configured port -> 465 (SSL) -> 2525 -> 587
  const configuredPort = parseInt(process.env.BREVO_SMTP_PORT || '465', 10);
  const portsToTry = [
    { port: configuredPort, secure: configuredPort === 465 },
    { port: 465, secure: true },
    { port: 2525, secure: false },
    { port: 587, secure: false },
  ];

  // Remove duplicates from portsToTry
  const uniquePorts = portsToTry.filter(
    (item, index, self) => index === self.findIndex((t) => t.port === item.port && t.secure === item.secure)
  );

  let lastError = null;

  for (const { port, secure } of uniquePorts) {
    try {
      const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure, // true for 465, false for 587/2525
        auth: {
          user: user,
          pass: pass,
        },
        connectionTimeout: 3500, // Fast 3.5s connection timeout so Render never hangs
        greetingTimeout: 3500,
        socketTimeout: 5000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: sender.raw,
        to: options.to,
        subject: options.subject,
        text: options.text || options.body || '',
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      return {
        provider: `brevo-smtp-port-${port}`,
        messageId: info.messageId,
        success: true,
      };
    } catch (err) {
      lastError = err;
      console.warn(`[SMTP Port ${port} (${secure ? 'SSL' : 'TLS'}) Failed]: ${err.message}. Trying next available port...`);
    }
  }

  throw lastError || new Error('All SMTP ports failed');
};

/**
 * Main Email Dispatcher
 */
const sendEmail = async (options) => {
  const sender = parseSender();
  const rawKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS || '';

  // Prepare HTML content using RAFFLES JOBS email template
  let finalHtml = options.html;
  if (!finalHtml) {
    finalHtml = getRafflesEmailTemplate({
      title: options.title || options.subject || 'RAFFLES JOBS Notification',
      subtitle: options.subtitle || 'Talent & Career Solutions',
      greeting: options.greeting || 'Dear User,',
      bodyText: options.text || options.body || '',
      otpCode: options.otpCode || options.otp || null,
      ctaText: options.ctaText || null,
      ctaUrl: options.ctaUrl || null,
      details: options.details || null,
    });
  }

  // Tier 1: If an API Key (starts with "xkeysib-") or explicit BREVO_API_KEY is present, use Brevo REST API over HTTPS
  const isV3ApiKey = rawKey.startsWith('xkeysib-') || !!process.env.BREVO_API_KEY;
  if (isV3ApiKey && rawKey) {
    try {
      const result = await sendViaBrevoRestApi(rawKey, sender, options, finalHtml);
      console.log(`[Email Delivered] Sent to ${options.to} via Brevo HTTPS REST API (ID: ${result.messageId})`);
      return result;
    } catch (apiError) {
      console.warn(`[Brevo REST API Warning]: ${apiError.message}`);
    }
  }

  // Tier 2: Brevo SMTP with Multi-Port Fallback (Port 465 SSL is open on Render!)
  if (process.env.BREVO_SMTP_USER && (process.env.BREVO_SMTP_PASS || process.env.BREVO_API_KEY)) {
    try {
      const result = await sendViaNodemailerSmtpWithFallback(sender, options, finalHtml);
      console.log(`[Email Delivered] Sent to ${options.to} via ${result.provider} (ID: ${result.messageId})`);
      return result;
    } catch (smtpError) {
      console.error(`[Brevo SMTP Error]: All ports failed - ${smtpError.message}`);
    }
  }

  // Tier 3: Local Dev / Simulation Fallback (Ensures server never hangs or crashes)
  console.log('----------------------------------------------------');
  console.log('--- EMAIL SIMULATION / DEV FALLBACK ---');
  console.log(`From: ${sender.raw}`);
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log(`Message: ${options.text || options.body || 'HTML Content'}`);
  console.log('----------------------------------------------------');

  return {
    provider: 'simulation-fallback',
    success: true,
  };
};

module.exports = sendEmail;
