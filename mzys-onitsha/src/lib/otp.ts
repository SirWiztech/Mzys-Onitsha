import { readData, writeData, generateId } from './data';

export type OtpPurpose = 'register' | 'reset';

export interface OtpRecord {
  id: string;
  email: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: number;
  attempts: number;
  createdAt: string;
}

const OTP_FILE = 'otps.json';
const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createOtp(email: string, purpose: OtpPurpose): Promise<string> {
  const otps = await readData<OtpRecord>(OTP_FILE);
  const cleaned = otps.filter(
    (o) => !(o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose)
  );
  cleaned.push({
    id: generateId(),
    email,
    code: generateOtp(),
    purpose,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    createdAt: new Date().toISOString(),
  });
  await writeData(OTP_FILE, cleaned);
  return cleaned[cleaned.length - 1].code;
}

export async function verifyOtp(
  email: string,
  code: string,
  purpose: OtpPurpose
): Promise<boolean> {
  const otps = await readData<OtpRecord>(OTP_FILE);
  const index = otps.findIndex(
    (o) => o.email.toLowerCase() === email.toLowerCase() && o.purpose === purpose
  );
  if (index === -1) return false;

  const record = otps[index];
  if (record.expiresAt < Date.now()) {
    await writeData(OTP_FILE, otps.filter((o) => o.id !== record.id));
    return false;
  }

  if (record.code !== code) {
    record.attempts += 1;
    if (record.attempts >= MAX_ATTEMPTS) {
      await writeData(OTP_FILE, otps.filter((o) => o.id !== record.id));
      return false;
    }
    await writeData(OTP_FILE, otps);
    return false;
  }

  await writeData(OTP_FILE, otps.filter((o) => o.id !== record.id));
  return true;
}
