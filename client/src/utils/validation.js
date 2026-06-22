export const NAME_PART_REGEX = /^[A-Za-z'-]{2,60}$/;
export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;
export const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
export const PH_MOBILE_E164_REGEX = /^\+639\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PROFANITY_REGEX = /\b(fuck|shit|bitch|asshole|bobo|tanga|gago|ulol|puta|puke)\b/i;

export function normalizePhone(value) {
  const compact = String(value || '').replace(/[\s-]/g, '');
  if (/^09\d{9}$/.test(compact)) return `+63${compact.slice(1)}`;
  if (/^639\d{9}$/.test(compact)) return `+${compact}`;
  return compact;
}

export function validateFullName(value) {
  const parts = String(value || '').trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => NAME_PART_REGEX.test(part));
}

export function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-700' };
  if (score === 3) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-700' };
  if (score === 4) return { label: 'Strong', color: 'bg-blue-500', text: 'text-blue-700' };
  return { label: 'Very strong', color: 'bg-emerald-600', text: 'text-emerald-700' };
}

export function isStrongPassword(password) {
  return (
    String(password || '').length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function passwordContainsIdentity(password, values) {
  const lowerPassword = String(password || '').toLowerCase();
  return values
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().trim())
    .some((value) => value.length >= 3 && lowerPassword.includes(value));
}

export function hasProfanity(value) {
  return PROFANITY_REGEX.test(String(value || ''));
}

export function isAllowedImage(file) {
  return !!file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024;
}

export function createIdempotencyKey(prefix = 'form') {
  if (crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
