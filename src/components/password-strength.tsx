'use client';

// Password strength meter + match indicator for signup forms.
// Score 0-4: length (>=6, >=10), mixed case, digits, symbols.

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 10) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(4, score);
}

const LEVELS = [
  { label: 'Too weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Weak', bar: 'bg-red-500', text: 'text-red-600' },
  { label: 'Fair', bar: 'bg-orange-500', text: 'text-orange-600' },
  { label: 'Good', bar: 'bg-amber-400', text: 'text-amber-600' },
  { label: 'Strong', bar: 'bg-emerald-500', text: 'text-emerald-600' },
] as const;

export function PasswordStrengthMeter({ password }: { password: string }) {
  const score = password ? scorePassword(password) : 0;
  const meta = LEVELS[score];

  return (
    <div className="mt-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i <= score ? meta.bar : 'bg-mzys-gray-200'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className={`mt-1 text-xs font-medium ${meta.text}`}>
          {meta.label}
          {score < 4 && (
            <span className="text-mzys-gray-400 font-normal">
              {' '}
              — use 10+ characters with upper &amp; lowercase, a number and a symbol
            </span>
          )}
        </p>
      )}
    </div>
  );
}

export function PasswordMatchIndicator({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) {
  if (!confirmPassword) return null;
  const match = password === confirmPassword;
  return (
    <p
      className={`mt-1.5 text-xs font-medium ${
        match ? 'text-emerald-600' : 'text-mzys-danger'
      }`}
      aria-live="polite"
    >
      {match ? '✓ Passwords match' : '✗ Passwords do not match'}
    </p>
  );
}
