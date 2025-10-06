// lib/date/cursor.ts

// YearMonth uses a 1-based month (1..12).
export type YearMonth = { year: number; month: number }; // month: 1..12

// Accept only "reasonable" years. Returns NaN if out of range.
export const clampYear = (y: number) => (y >= 2000 && y <= 3000 ? y : NaN);

/**
 * Get the current year/month in a specific IANA timezone.
 * Uses the "toLocaleString(..., { timeZone })" trick to construct a local
 * time in the requested TZ, then rehydrates it into a Date.
 * Example tz: "Europe/Paris".
 */
export function nowYearMonthTZ(tz = 'Europe/Paris'): YearMonth {
  const nowTZ = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
  return { year: nowTZ.getFullYear(), month: nowTZ.getMonth() + 1 };
}

/**
 * Parse a URL cursor (e.g., "2025-10") into { year, month }.
 * - Supports either a string or an array (takes the first element).
 * - Validates year (via clampYear) and 1..12 month range.
 * - Falls back to the current month in the given timezone on any invalid input.
 */
export function parseCursor(
  raw?: string | string[],
  tz = 'Europe/Paris',
): YearMonth {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s && /^\d{4}-\d{1,2}$/.test(s)) {
    const [y, m] = s.split('-').map(Number);
    if (
      Number.isFinite(y) &&
      Number.isFinite(m) &&
      clampYear(y) &&
      m >= 1 &&
      m <= 12
    ) {
      return { year: y, month: m };
    }
  }
  // Fallback: current month in the given timezone.
  return nowYearMonthTZ(tz);
}

/**
 * Format a YearMonth as a canonical zero-padded "YYYY-MM".
 * Example: { year: 2025, month: 3 } -> "2025-03"
 */
export function formatCursor({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Shift a YearMonth by a number of months (can be negative).
 * - Converts to a 0-based absolute month index, adds delta,
 *   then re-derives { year, month }.
 * - Modulo math ensures negatives wrap correctly.
 */
export function shiftMonth(
  { year, month }: YearMonth,
  delta: number,
): YearMonth {
  const idx = year * 12 + (month - 1) + delta; // 0-based month index
  const y = Math.floor(idx / 12);
  const m = ((idx % 12) + 12) % 12; // normalize into 0..11
  return { year: y, month: m + 1 }; // back to 1..12
}

// First day of a YearMonth as a Date, normalized to local midnight.
export function firstOfMonth({ year, month }: YearMonth): Date {
  const d = new Date(year, month - 1, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Add N days to a Date (does not mutate the original).
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/**
 * Compute the first visible cell of a 6x7 month grid.
 * - If startOnMonday is true, the grid starts on Monday; otherwise Sunday.
 * - Returns a Date at the beginning of the grid (often in the previous month).
 */
export function startOfGrid(firstOfMonth: Date, startOnMonday: boolean): Date {
  const jsDay = firstOfMonth.getDay(); // Sun=0..Sat=6
  // Number of days to step back from the 1st to reach the grid start.
  const leading = startOnMonday ? mondayIndex(jsDay) : jsDay;
  return addDays(firstOfMonth, -leading);
}

/**
 * Translate JS getDay() (Sun=0..Sat=6) to a Monday-first index:
 * Mon -> 0, Tue -> 1, ..., Sun -> 6.
 */
function mondayIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}
