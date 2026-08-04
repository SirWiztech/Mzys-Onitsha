import dns from 'node:dns';
import net from 'node:net';
import nodemailer from 'nodemailer';

dns.setDefaultResultOrder('ipv4first');
net.setDefaultAutoSelectFamily(true);
net.setDefaultAutoSelectFamilyAttemptTimeout(1000);

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.MAIL_FROM || USER || 'no-reply@mzysonitsha.com';

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  if (!HOST || !USER || !PASS) {
    console.log(`[mail:dev] To: ${to}`);
    console.log(`[mail:dev] Subject: ${subject}`);
    console.log(`[mail:dev] Body: ${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    return true;
  }

  let smtpHost = HOST;
  try {
    const { address, family } = await dns.promises.lookup(HOST, { family: 4 });
    if (address && family === 4) smtpHost = address;
  } catch {
    smtpHost = HOST;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: PORT,
    secure: PORT === 465,
    tls: { servername: HOST },
    auth: { user: USER, pass: PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });

  await transporter.sendMail({ from: FROM, to, subject, html });
  return true;
}

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: 'register' | 'reset'
): Promise<boolean> {
  const subject =
    purpose === 'reset'
      ? 'Reset your MZYS password'
      : 'Verify your MZYS registration';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1e3a8a;">MZYS Onitsha</h2>
      <p>Hello,</p>
      <p>${purpose === 'reset' ? 'Use the code below to reset your password.' : 'Use the code below to complete your registration.'}</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e3a8a;">${code}</p>
      <p>This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
    </div>
  `;
  try {
    await sendEmail(to, subject, html);
    return true;
  } catch (err) {
    console.error(`[mail:error] Failed to send ${purpose} OTP to ${to}: ${(err as Error).message}`);
    console.error(`[mail:dev-fallback] ${purpose} OTP code for ${to}: ${code}`);
    return false;
  }
}
