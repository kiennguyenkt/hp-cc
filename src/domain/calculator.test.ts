import { describe, expect, it } from 'vitest';
import { calculate } from './calculator';
import { createDefaultConfig } from './rules';

describe('calculate', () => {
  it('calculates the default config two calendar days before the event', () => {
    const result = calculate(createDefaultConfig('test'), new Date(2026, 9, 16, 8));
    expect(result.daysRemaining).toBe(2);
    expect(result.totalBottles).toBe(3440);
    expect(result.extraMaxBottles).toBe(1509);
  });

  it('keeps free daily sources when both purchases are disabled', () => {
    const config = createDefaultConfig('test');
    config.buyPackage249 = false;
    config.buyDailyDiamonds = false;
    const result = calculate(config, new Date(2026, 9, 16, 8));
    expect(result.totalBottles).toBe(2140);
    expect(result.scenarios.neither.current).toBe(result.projectedCurrent);
  });

  it('returns zero future resources once the event ends', () => {
    const result = calculate(createDefaultConfig('test'), new Date(2026, 9, 18, 8));
    expect(result.daysRemaining).toBe(0);
    expect(result.minutesRemaining).toBe(0);
    expect(result.futureDailyBottles).toBe(0);
    expect(result.futurePackageBottles).toBe(0);
  });

  it('only invalidates values that depend on an invalid input', () => {
    const config = createDefaultConfig('test');
    config.currentMerit = '-';
    const result = calculate(config, new Date(2026, 9, 16, 8));
    expect(result.projectedCurrent).toBeNull();
    expect(result.totalBottles).toBe(3440);
  });
});
