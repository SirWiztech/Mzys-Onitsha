const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM = process.env.MAIL_FROM || 'MZYS Onitsha <noreply@mzysonitsha.com>';
const APP_URL = (process.env.APP_URL || '').replace(/\/+$/, '');

interface BrevoSendEmailParams {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
}

async function sendViaBrevo(params: BrevoSendEmailParams): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.log('[mail:dev] Brevo API key not set — logging instead of sending');
    console.log(`[mail:dev] To: ${params.to.map((t) => t.email).join(', ')}`);
    console.log(`[mail:dev] Subject: ${params.subject}`);
    console.log(`[mail:dev] Body: ${params.htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    return true;
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'MZYS Onitsha', email: (FROM.match(/<(.+)>/)?.[1] || FROM) },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${errorBody}`);
  }

  return true;
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  return sendViaBrevo({
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
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
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #1e3a8a; margin: 0;">MZYS Onitsha</h2>
        <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 13px;">Methodist Youth Society</p>
      </div>
      <div style="background: #f8fafc; border-radius: 12px; padding: 32px; text-align: center; border: 1px solid #e2e8f0;">
        <p style="color: #374151; margin: 0 0 16px 0; font-size: 15px;">
          ${purpose === 'reset'
            ? 'Use the code below to reset your password.'
            : 'Use the code below to complete your registration.'}
        </p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e3a8a; padding: 16px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; margin: 16px 0;">
          ${code}
        </div>
        <p style="color: #6b7280; font-size: 13px; margin: 16px 0 0 0;">
          This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.
        </p>
      </div>
      ${
        APP_URL
          ? `<div style="text-align: center; margin-top: 24px;">
              <a href="${APP_URL}/${purpose === 'reset' ? 'forgot-password' : 'register'}"
                 style="background: #1e3a8a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-size: 14px; font-weight: 500;">
                ${purpose === 'reset' ? 'Reset Password' : 'Complete Registration'}
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 12px;">
                Or copy and paste: ${APP_URL}/${purpose === 'reset' ? 'forgot-password' : 'register'}
              </p>
            </div>`
          : ''
      }
      <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} MZYS Onitsha. All rights reserved.
        </p>
      </div>
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
