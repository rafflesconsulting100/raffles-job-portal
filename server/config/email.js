const nodemailer = require('nodemailer');
const { getRafflesEmailTemplate } = require('../utils/emailTemplate');

// Helper to parse sender name and email from env or default
const parseSender = () => {
  const defaultEmail = process.env.BREVO_SMTP_USER || 'democracyonthepeak@gmail.com';
  const defaultName = 'Raffles Consulting';
  const rawFrom = process.env.EMAIL_FROM || `"${defaultName}" <${defaultEmail}>`;

  const match = rawFrom.match(/(?:"?([^"]*)"?\s)?<?([^>]+)>?/);
  if (match) {
    const name = (match[1] || defaultName).trim();
    let email = (match[2] || defaultEmail).trim();
    // If email is dummy noreply but BREVO_SMTP_USER exists, use BREVO_SMTP_USER for deliverability
    if (email.includes('noreply@') && process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_USER.includes('@')) {
      email = process.env.BREVO_SMTP_USER.trim();
    }
    return { name, email, raw: `"${name}" <${email}>` };
  }
  return { name: defaultName, email: defaultEmail, raw: `"${defaultName}" <${defaultEmail}>` };
};

/**
 * Send email via Brevo REST API over HTTPS (Port 443)
 * This avoids Render/Cloud SMTP port 587/465 blocking and connection timeouts.
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

  // Node 18+ native fetch with fast timeout
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(6000), // 6 second max timeout
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
 * Fallback to Nodemailer SMTP Transporter with strict connection timeouts
 */
const sendViaNodemailerSmtp = async (sender, options, htmlContent) => {
  const host = process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com';
  const port = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS || process.env.BREVO_API_KEY;

  if (!user || !pass) {
    throw new Error('SMTP user or pass missing');
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: {
      user: user,
      pass: pass,
    },
    pool: true, // Reuse connections
    connectionTimeout: 4000, // 4 seconds max to establish TCP connection
    greetingTimeout: 4000,   // 4 seconds max for SMTP handshake
    socketTimeout: 6000,     // 6 seconds socket inactivity timeout
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
    provider: 'brevo-smtp',
    messageId: info.messageId,
    success: true,
  };
};

/**
 * Main Email Dispatcher
 */
const sendEmail = async (options) => {
  const sender = parseSender();
  const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_PASS;

  // Prepare HTML content using Raffles Consulting email template
  let finalHtml = options.html;
  if (!finalHtml) {
    finalHtml = getRafflesEmailTemplate({
      title: options.title || options.subject || 'Raffles Consulting Notification',
      subtitle: options.subtitle || 'Talent & Career Solutions',
      greeting: options.greeting || 'Dear User,',
      bodyText: options.text || options.body || '',
      otpCode: options.otpCode || options.otp || null,
      ctaText: options.ctaText || null,
      ctaUrl: options.ctaUrl || null,
      details: options.details || null,
    });
  }

  // Tier 1: Try Brevo Official HTTPS REST API (Port 443 - Never blocked on Render/Cloud)
  if (apiKey) {
    try {
      const result = await sendViaBrevoRestApi(apiKey, sender, options, finalHtml);
      console.log(`[Email Success] Sent to ${options.to} via Brevo REST API (MessageID: ${result.messageId})`);
      return result;
    } catch (apiError) {
      console.warn(`[Brevo REST API Warning]: ${apiError.message}. Attempting SMTP fallback...`);
    }
  }

  // Tier 2: Try Optimized Nodemailer SMTP Transporter
  if (process.env.BREVO_SMTP_USER && (process.env.BREVO_SMTP_PASS || process.env.BREVO_API_KEY)) {
    try {
      const result = await sendViaNodemailerSmtp(sender, options, finalHtml);
      console.log(`[Email Success] Sent to ${options.to} via Brevo SMTP (MessageID: ${result.messageId})`);
      return result;
    } catch (smtpError) {
      console.error(`[Brevo SMTP Error]: ${smtpError.message}`);
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
