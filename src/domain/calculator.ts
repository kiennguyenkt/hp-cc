import { GUILD_BOTTLE_TOTALS, HP_PER_BOTTLE } from './rules';
import type { CalculatorConfig, CalculatorResult, ScenarioTotal, TargetGap } from './types';
import { parseNumericDraft } from './validation';

function parseEndDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 20, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function calendarDayDifference(from: Date, to: Date): number {
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((toDay - fromDay) / 86_400_000));
}

function add(...values: Array<number | null>): number | null {
  return values.some((value) => value === null)
    ? null
    : (values as number[]).reduce((total, value) => total + value, 0);
}

function scenario(current: number | null, extraMaxHp: number | null): ScenarioTotal {
  return { current, max: add(current, extraMaxHp) };
}

function targetGap(target: number, total: number | null): TargetGap {
  if (total === null) return { hp: null, bottles: null };
  const hp = Math.max(0, target - total);
  return { hp, bottles: Math.ceil(hp / HP_PER_BOTTLE) };
}

export function calculate(config: CalculatorConfig, now = new Date()): CalculatorResult {
  const merit = parseNumericDraft(config.currentMerit);
  const resetPerDay = parseNumericDraft(config.maxHpReset);
  const currentHp = parseNumericDraft(config.currentHp);
  const hpBackup = parseNumericDraft(config.hpBackup);
  const currentBottles = parseNumericDraft(config.currentBottles);
  const recoveryLimit = parseNumericDraft(config.recoveryLimit);
  const guildLevel = parseNumericDraft(config.guildLevel);
  const end = parseEndDate(config.endDate);

  const daysRemaining = end ? calendarDayDifference(now, end) : null;
  const minutesRemaining = end
    ? Math.max(0, Math.floor((end.getTime() - now.getTime()) / 60_000))
    : null;
  const hoursRemaining = end
    ? Math.max(0, Math.round((end.getTime() - now.getTime()) / 3_600_000))
    : null;
  const recoveryHp = hoursRemaining === null ? null : hoursRemaining * 60 * config.recoveryRate;
  const resetHp = daysRemaining === null || resetPerDay === null ? null : daysRemaining * resetPerDay;

  const dailyBottles = 60 + (config.buyDailyDiamonds ? 90 * 5 : 0);
  const futureDailyBottles = daysRemaining === null ? null : daysRemaining * dailyBottles;
  const packagePerDay = config.buyPackage249 ? 210 : 10;
  const futurePackageBottles = daysRemaining === null ? null : daysRemaining * packagePerDay;
  const totalBottles = add(currentBottles, futureDailyBottles, futurePackageBottles);
  const totalBottleHp = totalBottles === null ? null : totalBottles * HP_PER_BOTTLE;

  const validGuildLevel = guildLevel !== null && guildLevel <= config.maxGuildLevel ? guildLevel : null;
  const extraMaxBottles = validGuildLevel === null
    ? null
    : GUILD_BOTTLE_TOTALS[config.maxGuildLevel] - GUILD_BOTTLE_TOTALS[validGuildLevel];
  const extraMaxHp = extraMaxBottles === null ? null : extraMaxBottles * HP_PER_BOTTLE;
  const projectedCurrent = add(merit, currentHp, hpBackup, totalBottleHp, resetHp, recoveryHp);
  const projectedMax = add(projectedCurrent, extraMaxHp);

  const hoursToFill = hpBackup === null || recoveryLimit === null
    ? null
    : Math.floor((recoveryLimit - hpBackup) / (config.recoveryRate * 60));
  const dischargeHours = hoursRemaining === null || hoursToFill === null
    ? null
    : hoursRemaining - hoursToFill + 2;
  const dischargeHp = dischargeHours === null ? null : dischargeHours * config.recoveryRate * 60;

  const alwaysBottleHp = daysRemaining === null || currentBottles === null
    ? null
    : (currentBottles + daysRemaining * (60 + 10)) * HP_PER_BOTTLE;
  const base = add(merit, currentHp, hpBackup, alwaysBottleHp, resetHp, recoveryHp);
  const paidPackageHp = daysRemaining === null ? null : daysRemaining * 200 * HP_PER_BOTTLE;
  const paidDailyHp = daysRemaining === null ? null : daysRemaining * 90 * 5 * HP_PER_BOTTLE;
  const bothCurrent = add(base, paidPackageHp, paidDailyHp);
  const noPackageCurrent = add(base, paidDailyHp);
  const noDailyCurrent = add(base, paidPackageHp);

  const scenarios = {
    both: scenario(bothCurrent, extraMaxHp),
    noPackage: scenario(noPackageCurrent, extraMaxHp),
    noDaily: scenario(noDailyCurrent, extraMaxHp),
    neither: scenario(base, extraMaxHp),
  };

  return {
    daysRemaining,
    minutesRemaining,
    hoursRemaining,
    recoveryHp,
    resetHp,
    dailyBottles,
    futureDailyBottles,
    futurePackageBottles,
    totalBottles,
    totalBottleHp,
    extraMaxBottles,
    extraMaxHp,
    projectedCurrent,
    projectedMax,
    hoursToFill,
    dischargeHours,
    dischargeHp,
    scenarios,
    targets: {
      '3500000': {
        current: targetGap(3_500_000, projectedCurrent),
        max: targetGap(3_500_000, projectedMax),
      },
      '5000000': {
        current: targetGap(5_000_000, projectedCurrent),
        max: targetGap(5_000_000, projectedMax),
      },
    },
  };
}
