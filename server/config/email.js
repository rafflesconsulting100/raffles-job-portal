const nodemailer = require('nodemailer');
const { getRafflesEmailTemplate } = require('../utils/emailTemplate');

const sendEmail = async (options) => {
  // Determine SMTP configuration (Brevo SMTP preferred)
  const host = process.env.BREVO_SMTP_HOST|| 'smtp-relay.brevo.com';
  const port = parseInt(process.env.BREVO_SMTP_PORT || '587', 10);
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;
  const from = process.env.EMAIL_FROM || '"Raffles Consultancy" <noreply@rafflesconsultancy.com>';

  // Check if SMTP credentials exist
  if (!user || !pass) {
    console.log('----------------------------------------------------');
    console.log('--- BREVO SMTP SIMULATION (NO USER/PASS SET) ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.text || 'HTML Template Content'}`);
    console.log('----------------------------------------------------');
    return;
  }
//console.log("SMTP USER:", process.env.BREVO_SMTP_USER);
//console.log("SMTP PASS:", process.env.BREVO_SMTP_PASS ? "SET" : "MISSING");


  // Create Brevo Nodemailer Transporter
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465, // true for 465, false for other ports (587)
    auth: {
    user: user, // Brevo account email
    pass: pass, // SMTP key
    },
    // Optional TLS settings for Brevo relay
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Prepare HTML content using Raffles Consultancy template if not custom formatted
  let finalHtml = options.html;
  if (!finalHtml) {
    finalHtml = getRafflesEmailTemplate({
      title: options.title || options.subject || 'Raffles Consultancy Notification',
      subtitle: options.subtitle || 'Talent & Career Solutions',
      greeting: options.greeting || 'Dear User,',
      bodyText: options.text || options.body || '',
      otpCode: options.otpCode || options.otp || null,
      ctaText: options.ctaText || null,
      ctaUrl: options.ctaUrl || null,
      details: options.details || null,
    });
  }

  const mailOptions = {
    from: from,
    to: options.to,
    subject: options.subject,
    text: options.text || options.body || '',
    html: finalHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Brevo SMTP Email sent to ${options.to} (MessageID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error('Brevo SMTP Transporter Error:', error.message);
    console.log('----------------------------------------------------');
    console.log('--- FALLBACK: BREVO SMTP SIMULATION (DUE TO ERROR) ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.text || 'HTML Template Content'}`);
    console.log('----------------------------------------------------');
    // Do not throw the error so the API can still succeed locally
    return null;
  }
};

module.exports = sendEmail;
