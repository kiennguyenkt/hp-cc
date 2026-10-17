import { describe, expect, it } from 'vitest';
import { calculate } from './calculator';
import { createDefaultConfig } from './defaultConfig';

describe('calculate', () => {
  it.each([
    { buyPackage249: true, buyDailyDiamonds: true, key: 'both', bottles: 3440 },
    { buyPackage249: false, buyDailyDiamonds: true, key: 'noPackage', bottles: 3040 },
    { buyPackage249: true, buyDailyDiamonds: false, key: 'noDaily', bottles: 2540 },
    { buyPackage249: false, buyDailyDiamonds: false, key: 'neither', bottles: 2140 },
  ] as const)('matches projected resources with the $key scenario', ({ key, bottles, ...toggles }) => {
    const result = calculate({ ...createDefaultConfig('test'), ...toggles }, new Date(2026, 9, 16, 16));
    expect(result.totalBottles).toBe(bottles);
    expect(result.totalBottleHp).toBe(bottles * 500);
    expect(result.projectedCurrent).toBe(result.scenarios[key].current);
    expect(result.projectedMax).toBe(result.scenarios[key].max);
  });

  it('keeps future bottle sources calculable when current bottles are missing', () => {
    const result = calculate({ ...createDefaultConfig('test'), currentBottles: '' }, new Date(2026, 9, 16, 16));
    expect(result.totalBottles).toBeNull();
    expect(result.totalBottleHp).toBeNull();
    expect(result.futureDailyBottles).toBe(1020);
    expect(result.futurePackageBottles).toBe(420);
    expect(result.scenarios.both.current).toBeNull();
  });

  it('calculates the default config two calendar days before the event', () => {
    const result = calculate(createDefaultConfig('test'), new Date(2026, 9, 16, 16));
    expect(result.daysRemaining).toBe(2);
    expect(result.minutesRemaining).toBe(52 * 60);
    expect(result.hoursRemaining).toBe(52);
    expect(result.recoveryHp).toBe(52 * 60 * 320);
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

  it('calculates recovered HP from the displayed whole hours', () => {
    const result = calculate(createDefaultConfig('test'), new Date(2026, 9, 16, 16, 30));
    expect(result.hoursRemaining).toBe(52);
    expect(result.recoveryHp).toBe(52 * 60 * 320);
  });

  it('returns zero future resources once the event ends', () => {
    const result = calculate(createDefaultConfig('test'), new Date(2026, 9, 18, 20));
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
