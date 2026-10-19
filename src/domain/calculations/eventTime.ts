import { parseLocalDate } from '../../shared/date';

// The event runs on a fixed 3-day window ending on the selected date (end 30 → days 28–30),
// so time counting starts at 00:00 of the first event day and remaining time never exceeds
// the window even when the end date lies further ahead.
const EVENT_WINDOW_DAYS = 3;

export function resolveEventEndTime(value: string): Date | null {
  const date = parseLocalDate(value);
  if (date === null) return null;
  date.setHours(20, 0, 0, 0);
  return date;
}

function calendarDayDifference(from: Date, to: Date): number {
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((toDay - fromDay) / 86_400_000));
}

export function calculateEventTimeRemaining(endDate: string, now: Date) {
  const end = resolveEventEndTime(endDate);
  if (end === null) {
    return { daysRemaining: null, minutesRemaining: null, hoursRemaining: null };
  }
  const windowStart = new Date(end);
  windowStart.setDate(windowStart.getDate() - (EVENT_WINDOW_DAYS - 1));
  windowStart.setHours(0, 0, 0, 0);
  const countedNow = now.getTime() < windowStart.getTime() ? windowStart : now;
  const remainingMs = end.getTime() - countedNow.getTime();
  return {
    daysRemaining: Math.min(EVENT_WINDOW_DAYS, calendarDayDifference(now, end)),
    minutesRemaining: Math.max(0, Math.floor(remainingMs / 60_000)),
    hoursRemaining: Math.max(0, Math.round(remainingMs / 3_600_000)),
  };
}
