/**
 * Request-input guards. Query/body values arrive as `unknown` shapes — Express
 * parses `?a[$ne]=x` into an object, so anything reaching a Mongo query must be
 * proven to be a string first.
 */

export function asString(value: unknown, maxLength = 500): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function asEmail(value: unknown): string | null {
  const str = asString(value, 254);
  if (!str || !EMAIL_RE.test(str)) return null;
  return str.toLowerCase();
}

const PHONE_RE = /^[+\d][\d\s()-]{6,19}$/;

export function asPhone(value: unknown): string | null {
  const str = asString(value, 20);
  if (!str || !PHONE_RE.test(str)) return null;
  return str;
}

export function asInt(value: unknown, min: number, max: number): number | null {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(num) || num < min || num > max) return null;
  return num;
}

/** Rejects Invalid Date and dates outside a sane booking horizon. */
export function asDate(value: unknown): Date | null {
  const str = asString(value, 40);
  if (!str) return null;
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getUTCFullYear();
  if (year < 2000 || year > 2100) return null;
  return date;
}

/** Midnight UTC for a date, so day comparisons ignore clock time. */
export function startOfUTCDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
