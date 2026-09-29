const sendEmail = require('../config/email');
const { escapeHtml } = require('../utils/emailTemplate');

// Published support mailbox on the Contact page.
const DEFAULT_INBOX = 'hr@rafflesconsulting.in';

const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/**
 * @desc    Forward the public contact form to the support mailbox
 * @route   POST /api/contact
 * @access  Public (rate limited)
 *
 * The form used to show a success toast from a setTimeout without ever
 * sending anything, so visitors believed they had reached the team.
 */
exports.submitContactForm = async (req, res, next) => {
  try {
    const body = req.body || {};
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const queryType = typeof body.queryType === 'string' ? body.queryType.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!fullName || fullName.length > 120) {
      return res.status(400).json({ success: false, message: 'Please provide your name.' });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!message || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message (max 5000 characters).',
      });
    }

    const inbox = process.env.CONTACT_INBOX || DEFAULT_INBOX;

    const textLines = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      queryType ? `Query type: ${queryType}` : null,
      '',
      message,
    ].filter((line) => line !== null);

    const htmlLines = [
      '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">',
      `<tr><td style="padding:4px 12px;font-weight:bold">Name</td><td>${escapeHtml(fullName)}</td></tr>`,
      `<tr><td style="padding:4px 12px;font-weight:bold">Email</td><td>${escapeHtml(email)}</td></tr>`,
      phone ? `<tr><td style="padding:4px 12px;font-weight:bold">Phone</td><td>${escapeHtml(phone)}</td></tr>` : '',
      queryType ? `<tr><td style="padding:4px 12px;font-weight:bold">Query type</td><td>${escapeHtml(queryType)}</td></tr>` : '',
      '</table>',
      `<p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>`,
    ].join('');

    await sendEmail({
      to: inbox,
      replyTo: email,
      subject: `[RafflesJobs Contact] ${queryType || 'General'} – ${fullName}`.replace(/[\r\n]+/g, ' '),
      text: textLines.join('\n'),
      html: htmlLines,
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting Raffles Jobs! Our team will get back to you shortly.',
    });
  } catch (error) {
    next(error);
  }
};
