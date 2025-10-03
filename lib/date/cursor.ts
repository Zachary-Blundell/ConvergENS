// lib/date/cursor.ts
export type YearMonth = { year: number; month: number }; // month: 1..12

const clampYear = (y: number) => (y >= 1900 && y <= 9999 ? y : NaN);

export function nowYearMonthTZ(tz = 'Europe/Paris'): YearMonth {
  const nowTZ = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
  return { year: nowTZ.getFullYear(), month: nowTZ.getMonth() + 1 };
}

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
  // Fallback: current month in the given timezone
  return nowYearMonthTZ(tz);
}

export function formatCursor({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function shiftMonth(
  { year, month }: YearMonth,
  delta: number,
): YearMonth {
  const idx = year * 12 + (month - 1) + delta; // 0-based month index
  const y = Math.floor(idx / 12);
  const m = ((idx % 12) + 12) % 12; // ensure positive
  return { year: y, month: m + 1 };
}

export function firstOfMonth({ year, month }: YearMonth): Date {
  const d = new Date(year, month - 1, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export function startOfGrid(firstOfMonth: Date, startOnMonday: boolean): Date {
  const jsDay = firstOfMonth.getDay(); // Sun=0..Sat=6
  const leading = startOnMonday ? mondayIndex(jsDay) : jsDay; // how many days to step back
  return addDays(firstOfMonth, -leading);
}

/** Monday=1..Sunday=7 index; JS getDay(): Sun=0..Sat=6 */
function mondayIndex(jsDay: number) {
  return (jsDay + 6) % 7; // Mon->0 ... Sun->6
}
