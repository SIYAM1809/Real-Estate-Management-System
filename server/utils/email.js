// server/utils/email.js
const nodemailer = require('nodemailer');

const isEmailEnabled = () => {
  return String(process.env.EMAIL_ENABLED || '').toLowerCase() === 'true';
};

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!isEmailEnabled()) return { skipped: true, reason: 'EMAIL_ENABLED=false' };

  const transporter = getTransporter();
  if (!transporter) return { skipped: true, reason: 'SMTP not configured' };

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { ok: true, messageId: info.messageId };
};

module.exports = { sendEmail };
