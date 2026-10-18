import { describe, expect, it } from 'vitest';
import { calculateEventTimeRemaining, resolveEventEndTime } from './eventTime';

describe('event time', () => {
  it('ends at 20:00 local time on the configured date', () => {
    expect(resolveEventEndTime('2026-10-18')).toEqual(new Date(2026, 9, 18, 20));
  });

  it.each(['', '2026-02-29', '2026-04-31', '2026-13-01', '2026-1-18'])(
    'returns unknown remaining time for invalid date %j',
    (value) => {
      expect(calculateEventTimeRemaining(value, new Date(2026, 9, 16))).toEqual({
        daysRemaining: null,
        minutesRemaining: null,
        hoursRemaining: null,
      });
    },
  );

  it('accepts a leap day', () => {
    expect(resolveEventEndTime('2028-02-29')).toEqual(new Date(2028, 1, 29, 20));
  });

  it('counts calendar days separately from rounded hours and whole minutes', () => {
    expect(calculateEventTimeRemaining('2026-10-18', new Date(2026, 9, 17, 23, 45, 30))).toEqual({
      daysRemaining: 1,
      minutesRemaining: 1214,
      hoursRemaining: 20,
    });
  });

  it('clamps all remaining time to zero after the event', () => {
    expect(calculateEventTimeRemaining('2026-10-18', new Date(2026, 9, 19, 8))).toEqual({
      daysRemaining: 0,
      minutesRemaining: 0,
      hoursRemaining: 0,
    });
  });
});
