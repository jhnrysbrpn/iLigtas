const NAME_PART_REGEX = /^[A-Za-z'-]{2,60}$/;
const FULL_NAME_REGEX = /^[A-Za-z'-]+(?:\s+[A-Za-z'-]+)+$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;
const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
const PH_MOBILE_E164_REGEX = /^\+639\d{9}$/;
const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;
const PROFANITY_REGEX = /\b(fuck|shit|bitch|asshole|bobo|tanga|gago|ulol|puta|puke)\b/i;
const HTML_TAG_REGEX = /<[^>]*>/g;

const allowedRoles = ['Resident', 'Responder', 'Admin'];
const allowedDepartments = ['bfp', 'medics', 'rescue'];
const incidentCategories = [
  'Structural Fire / Sunog',
  'Electrical Sparking / Spark',
  'LPG / Gas Leak / Singaw',
  'Illegal Rubbish Burning',
  'Smoke or Fire Alarm'
];
const priorityLevels = ['High', 'Medium', 'Low'];
const alertSeverities = ['Extreme Danger', 'Warning', 'Advisory'];

function trimString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function stripHtml(value) {
  return typeof value === 'string' ? value.replace(HTML_TAG_REGEX, '').trim() : value;
}

function normalizePhone(value) {
  if (typeof value !== 'string') return value;
  const compact = value.replace(/[\s-]/g, '');
  if (/^09\d{9}$/.test(compact)) return `+63${compact.slice(1)}`;
  if (/^639\d{9}$/.test(compact)) return `+${compact}`;
  return compact;
}

function isMobilePhone(value) {
  return PH_MOBILE_E164_REGEX.test(normalizePhone(value));
}

function isStrongPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    PASSWORD_SPECIAL_REGEX.test(password)
  );
}

function passwordContainsIdentity(password, values) {
  const lowerPassword = String(password || '').toLowerCase();
  return values
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().trim())
    .some((value) => value.length >= 3 && lowerPassword.includes(value));
}

function containsProfanity(value) {
  return PROFANITY_REGEX.test(String(value || ''));
}

function getNameParts(fullName) {
  return String(fullName || '').trim().split(/\s+/).filter(Boolean);
}

function validateFullNameParts(fullName) {
  const parts = getNameParts(fullName);
  if (parts.length < 2) return false;
  return parts.every((part) => NAME_PART_REGEX.test(part));
}

function isNearDuplicate(a, b) {
  const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const first = normalize(a);
  const second = normalize(b);
  if (!first || !second) return false;
  return first === second || first.includes(second) || second.includes(first);
}

module.exports = {
  NAME_PART_REGEX,
  FULL_NAME_REGEX,
  USERNAME_REGEX,
  E164_PHONE_REGEX,
  PH_MOBILE_E164_REGEX,
  allowedRoles,
  allowedDepartments,
  incidentCategories,
  priorityLevels,
  alertSeverities,
  trimString,
  stripHtml,
  normalizePhone,
  isMobilePhone,
  isStrongPassword,
  passwordContainsIdentity,
  containsProfanity,
  validateFullNameParts,
  isNearDuplicate
};
