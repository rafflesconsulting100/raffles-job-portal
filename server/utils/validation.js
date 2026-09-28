// Mobile number validation shared by Employer registration.

// Accepts:
//   9876543210        -> 10 digit Indian mobile (starts 6-9)   => +919876543210
//   09876543210       -> 0 + 10 digit Indian mobile            => +919876543210
//   919876543210      -> 91 + 10 digit Indian mobile           => +919876543210
//   +919876543210     -> international format                  => +919876543210
//   +<country><number>-> 10 to 15 digits after "+"             => unchanged
// Returns the normalized number, or null when the value is invalid.
const normalizeMobileNumber = (value) => {
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

const isValidMobileNumber = (value) => normalizeMobileNumber(value) !== null;

// Values used to detect an already registered mobile number,
// including legacy records stored without the "+91" prefix.
const mobileSearchValues = (normalized) => {
  if (!normalized) return [];
  const digits = normalized.replace(/^\+/, '');
  const values = new Set([normalized, digits]);
  if (digits.length === 12 && digits.startsWith('91')) {
    values.add(digits.slice(2));
  }
  return Array.from(values);
};

module.exports = { normalizeMobileNumber, isValidMobileNumber, mobileSearchValues };
