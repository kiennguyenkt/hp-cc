import { parseLocalDate } from '../../shared/date';

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
  const remainingMs = end === null ? null : end.getTime() - now.getTime();
  return {
    daysRemaining: end === null ? null : calendarDayDifference(now, end),
    minutesRemaining: remainingMs === null ? null : Math.max(0, Math.floor(remainingMs / 60_000)),
    hoursRemaining: remainingMs === null ? null : Math.max(0, Math.round(remainingMs / 3_600_000)),
  };
}
