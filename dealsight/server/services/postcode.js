const UK_POSTCODE_PATTERN = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i;

export const extractPostcode = (value = '') => {
  const match = String(value).match(UK_POSTCODE_PATTERN);
  if (!match) return null;

  const compact = match[0].toUpperCase().replace(/\s+/g, '');
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
};
