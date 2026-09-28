// Mobile number validation for Employer registration (mirrors server/utils/validation.js).
// Accepts 10-digit Indian mobile numbers, 0-prefixed, 91-prefixed and +<country><number>
// formats (10 to 15 digits after "+"). Returns the normalized number or null when invalid.
export const normalizeMobileNumber = (value) => {
  if (value === null || value === undefined) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const cleaned = raw.replace(/[\s\-().]/g, '');
  if (!/^\+?\d+$/.test(cleaned)) return null;

  const hasPlus = cleaned.startsWith('+');
  const digits = cleaned.replace(/^\+/, '');

  if (hasPlus) {
    if (digits.length < 10 || digits.length > 15) return null;
    return `+${digits}`;
  }

  if (digits.length === 10) {
    if (!/^[6-9]/.test(digits)) return null;
    return `+91${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    const national = digits.slice(1);
    if (!/^[6-9]/.test(national)) return null;
    return `+91${national}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    const national = digits.slice(2);
    if (!/^[6-9]/.test(national)) return null;
    return `+91${national}`;
  }

  return null;
};

export const isValidMobileNumber = (value) => normalizeMobileNumber(value) !== null;
