import { DEFAULTS } from "./constants.js";

export const formatCurrency = (
  amount,
  currency = DEFAULTS.CURRENCY,
  locale = DEFAULTS.LOCALE
) => new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount ?? 0);

export const formatDate = (value, options = {}) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(DEFAULTS.DATE_FORMAT, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
};

export const copyToClipboard = async (text) => {
  if (!navigator.clipboard) return false;

  await navigator.clipboard.writeText(text);
  return true;
};

export const truncateText = (text, maxLength) => {
  if (!text || !maxLength || text.length <= maxLength) return text ?? "";

  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
};
