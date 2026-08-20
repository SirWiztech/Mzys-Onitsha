import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = (process.env.MAIL_FROM || '').match(/<(.+)>/)?.[1] || 'okpechichinaza0@gmail.com';

const TO = 'edgematrix2026@gmail.com';

const html = `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="color: #1e3a8a; margin: 0;">MZYS Onitsha</h2>
      <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 13px;">Methodist Youth Society</p>
    </div>
    <div style="background: #f0fdf4; border-radius: 12px; padding: 32px; text-align: center; border: 1px solid #bbf7d0;">
      <p style="color: #166534; font-size: 16px; font-weight: bold; margin: 0 0 12px 0;">✅ Brevo Mailer Connected!</p>
      <p style="color: #374151; margin: 0 0 16px 0; font-size: 14px;">
        This is a test email sent from your MZYS Onitsha application using Brevo transactional email API.
      </p>
      <div style="font-size: 13px; color: #6b7280; border-top: 1px solid #d1fae5; padding-top: 16px; margin-top: 16px;">
        <p style="margin: 4px 0;">Sent at: ${new Date().toLocaleString()}</p>
        <p style="margin: 4px 0;">From: ${FROM_EMAIL}</p>
      </div>
    </div>
  </div>
`;

console.log(`📧 Sending test email to ${TO} from ${FROM_EMAIL}...`);

const res = await fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'api-key': BREVO_API_KEY,
    accept: 'application/json',
  },
  body: JSON.stringify({
    sender: { name: 'MZYS Onitsha', email: FROM_EMAIL },
    to: [{ email: TO, name: 'EdgeMatrix' }],
    subject: '✅ MZYS Brevo Mailer Test — Connection Successful',
    htmlContent: html,
  }),
});

if (res.ok) {
  const data = await res.json();
  console.log('✅ Email sent successfully!');
  console.log(`   Message ID: ${data.messageId}`);
  console.log(`   From: ${FROM_EMAIL}`);
  console.log(`   To: ${TO}`);
} else {
  const error = await res.text();
  console.error(`❌ Brevo API error (${res.status}):`);
  console.error(error);
}
