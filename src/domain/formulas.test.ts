import { describe, expect, it } from 'vitest';
import { translator } from '../i18n';
import type { ResultWithFormula, FormulaFormat } from './resultWithFormula';
import { calculate } from './calculator';
import { createDefaultFormValue } from './defaultFormValue';
import type { CalculatorConfig, Locale } from './types';

const now = new Date(2026, 9, 16, 16);
const config: CalculatorConfig = {
  ...createDefaultFormValue('formulas'),
  currentMerit: '100', currentHp: '200', hpBackup: '300', currentBottles: '10',
  maxHpReset: '1000', recoveryLimit: '38700', guildLevel: '26', maxGuildLevel: 27,
  endDate: '2026-10-18', recoveryRate: 320, buyPackage249: true, buyDailyDiamonds: true,
};
const plain: FormulaFormat = {
  formatNumber: (value) => value === null ? '—' : String(value),
  label: translator('en'),
};

describe('calculation formulas', () => {
  it('explains recovery, reset, bottles, discharge and guild bonus from the calculated inputs', () => {
    const result = calculate(config, now);
    expect(result.recoveryHp.value).toBe(998400);
    expect(result.recoveryHp.formatFormula(plain)).toBe('52 hours × 60 minutes/hours × 320 HP/minutes = 998400 HP');
    expect(result.resetHp.formatFormula(plain)).toBe('2 days × 1000 HP/days = 2000 HP');
    expect(result.totalBottles.formatFormula(plain)).toBe('10 + 2 × 510 [Daily] + 2 × (10 [free] + 200 [249]) = 1450 batteries');
    expect(result.totalBottleHp.formatFormula(plain)).toBe('1450 batteries × 500 HP = 725000 HP');
    expect(result.hoursToFill.formatFormula(plain)).toBe('Round down: (HP recovery limit − HP backup) ÷ (HP recovery / minute × 60)\n⌊(38700 − 300) ÷ (320 × 60)⌋ = 2 hours');
    expect(result.dischargeHours.formatFormula(plain)).toBe('Time remaining − Time to fill reserve + 2 hours\n52 − 2 + 2 = 52 hours');
    expect(result.dischargeHp.formatFormula(plain)).toBe('Time to discharge × 60 × HP recovery / minute\n52 hours × 60 minutes/hours × 320 HP/minutes = 998400 HP');
    expect(result.extraMaxHp.value).toBe(46500);
    expect(result.extraMaxHp.formatFormula(plain)).toBe('+46500 HP (93 batteries)');
  });

  it.each([
    { buyPackage249: true, buyDailyDiamonds: true, key: 'both', bottles: 1450, total: 1726000, daily: 510, packageFormula: '(10 [free] + 200 [249])' },
    { buyPackage249: false, buyDailyDiamonds: true, key: 'noPackage', bottles: 1050, total: 1526000, daily: 510, packageFormula: '10 [free]' },
    { buyPackage249: true, buyDailyDiamonds: false, key: 'noDaily', bottles: 550, total: 1276000, daily: 60, packageFormula: '(10 [free] + 200 [249])' },
    { buyPackage249: false, buyDailyDiamonds: false, key: 'neither', bottles: 150, total: 1076000, daily: 60, packageFormula: '10 [free]' },
  ] as const)('keeps all comparison formulas independent of the selected $key scenario', ({ buyPackage249, buyDailyDiamonds, key, bottles, total, daily, packageFormula }) => {
    const result = calculate({ ...config, buyPackage249, buyDailyDiamonds }, now);
    expect(result.selectedScenario).toBe(key);
    expect(result.projectedCurrent).toBe(result.scenarios[key].current);
    expect(result.projectedMax).toBe(result.scenarios[key].max);
    expect(result.projectedCurrent.value).toBe(total);
    expect(result.projectedMax.value).toBe(total + 46500);
    expect(result.totalBottles.value).toBe(bottles);
    expect(result.totalBottles.formatFormula(plain)).toBe(`10 + 2 × ${daily} [Daily] + 2 × ${packageFormula} = ${bottles} batteries`);
    expect(result.scenarios.both.current.formatFormula(plain)).toBe(`${translator('en')('scenarioTotalFormula')}\n100 + 200 + 300 + 725000 + 2000 + 998400 = 1726000 HP`);
    expect(result.scenarios.noPackage.current.formatFormula(plain)).toBe('1726000 − 200 × 2 × 500 = 1526000 HP');
    expect(result.scenarios.noDaily.current.formatFormula(plain)).toBe('1726000 − 90 × 5 × 2 × 500 = 1276000 HP');
    expect(result.scenarios.neither.current.formatFormula(plain)).toBe('1726000 − 200 × 2 × 500 − 90 × 5 × 2 × 500 = 1076000 HP');
    expect(result.scenarios[key].max.formatFormula(plain)).toBe(`${total} + 46500 = ${total + 46500} HP`);
  });

  it.each(['', '-'])('propagates missing or invalid input %j only to dependent calculations', (invalid) => {
    const result = calculate({ ...config, currentBottles: invalid }, now);
    expect(result.totalBottles.value).toBeNull();
    expect(result.totalBottles.formatFormula(plain)).toBe('— + 2 × 510 [Daily] + 2 × (10 [free] + 200 [249]) = — batteries');
    expect(result.totalBottleHp.formatFormula(plain)).toBe('— batteries × 500 HP = — HP');
    for (const scenario of Object.values(result.scenarios)) {
      expect(scenario.current.value).toBeNull();
      expect(scenario.current.formatFormula(plain)).toContain('= — HP');
      expect(scenario.max.value).toBeNull();
    }
    expect(result.recoveryHp.value).toBe(998400);
    expect(result.futureDailyBottles).toBe(1020);
    expect(result.extraMaxHp.value).toBe(46500);
  });

  it('keeps missing time, reserve and guild inputs consistent with their explanations', () => {
    const missingTime = calculate({ ...config, endDate: '' }, now);
    expect(missingTime.recoveryHp.value).toBeNull();
    expect(missingTime.recoveryHp.formatFormula(plain)).toBe('— hours × 60 minutes/hours × 320 HP/minutes = — HP');
    const missingReserve = calculate({ ...config, recoveryLimit: '' }, now);
    expect(missingReserve.hoursToFill.value).toBeNull();
    expect(missingReserve.dischargeHours.value).toBeNull();
    expect(missingReserve.dischargeHp.formatFormula(plain)).toContain('= — HP');
    expect(missingReserve.projectedCurrent.value).toBe(1726000);
    const missingGuild = calculate({ ...config, guildLevel: '' }, now);
    expect(missingGuild.extraMaxHp.formatFormula(plain)).toBe('+— HP (— batteries)');
    expect(missingGuild.projectedMax.value).toBeNull();
    expect(missingGuild.projectedCurrent.value).toBe(1726000);
  });

  it('preserves floor rounding and negative discharge values after the event ends', () => {
    const result = calculate({ ...config, recoveryLimit: '58000' }, new Date(2026, 9, 18, 20));
    expect(result.hoursToFill.value).toBe(3);
    expect(result.dischargeHours.value).toBe(-1);
    expect(result.dischargeHours.formatFormula(plain)).toContain('0 − 3 + 2 = -1 hours');
    expect(result.dischargeHp.value).toBe(-19200);
    expect(result.dischargeHp.formatFormula(plain)).toContain('= -19200 HP');
    expect(result.totalBottles.value).toBe(10);
    expect(result.scenarios.noDaily.current.formatFormula(plain)).toBe('5600 − 90 × 5 × 0 × 500 = 5600 HP');
  });

  it('formats one calculation snapshot in every supported language without recalculating', () => {
    const result = calculate(config, now);
    const locales: Record<Locale, string> = { vi: 'vi-VN', en: 'en-US', th: 'th-TH', id: 'id-ID', zh: 'zh-CN' };
    const calculations: ResultWithFormula[] = [result.recoveryHp, result.resetHp, result.totalBottleHp, ...Object.values(result.scenarios).flatMap(({ current, max }) => [current, max])];
    for (const [locale, numberLocale] of Object.entries(locales)) {
      const label = translator(locale as Locale);
      const nf = new Intl.NumberFormat(numberLocale);
      const context: FormulaFormat = { label, formatNumber: (value) => value === null ? '—' : nf.format(value) };
      for (const item of calculations) {
        expect(item.formatFormula(context)).toContain(`= ${context.formatNumber(item.value)} HP`);
      }
      expect(result.recoveryHp.formatFormula(context)).toContain(label('hours'));
      expect(result.totalBottles.formatFormula(context)).toContain(label('bottles'));
      expect(result.totalBottles.formatFormula(context)).toContain(`[${label('dailySource')}]`);
      expect(result.totalBottles.formatFormula(context)).toContain(`(10 [${label('freeSource')}] + 200 [249])`);
      expect(result.scenarios.both.current.formatFormula(context)).toContain(label('scenarioTotalFormula'));
    }
  });
});
