
import { addDays, addWeeks, addMonths, formatISO, format } from 'date-fns';
import { Frequency, Row } from '../types.js';

export function resample(rows: Row[], freq: Frequency): Row[] {
  if (rows.length === 0) return [];

  // Group by period (start of period) and sum values
  const buckets = new Map<string, number>();
  for (const r of rows) {
    const d = new Date(r.date);
    const key = freq === 'D'
      ? format(d, 'yyyy-MM-dd')
      : freq === 'W'
        ? format(startOfWeekISO(d), 'yyyy-MM-dd')
        : format(startOfMonthISO(d), 'yyyy-MM-01');
    buckets.set(key, (buckets.get(key) || 0) + r.value);
  }

  const out: Row[] = Array.from(buckets.entries())
    .map(([k, v]) => ({ date: new Date(k), value: v }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return out;
}

function startOfWeekISO(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // ISO week starts Monday
  const day = d.getUTCDay() || 7;
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d;
}

function startOfMonthISO(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function step(date: Date, freq: Frequency): Date {
  if (freq === 'D') return addDays(date, 1);
  if (freq === 'W') return addWeeks(date, 1);
  return addMonths(date, 1);
}
