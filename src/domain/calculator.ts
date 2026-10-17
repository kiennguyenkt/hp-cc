import { calculateBottleResources, HP_PER_BOTTLE } from './bottleResources';
import { calculateGuildBonus } from './guildBonus';
import { calculateHpDischarge } from './hpDischarge';
import type { CalculatorConfig, CalculatorResult, ScenarioTotal, TargetGap } from './types';
import { parseNumericDraft } from './validation';
import { calculateEventTimeRemaining } from './eventTime';
import { sumOrNull } from '../shared/math';

function scenario(current: number | null, extraMaxHp: number | null): ScenarioTotal {
  return { current, max: sumOrNull(current, extraMaxHp) };
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
  const { daysRemaining, minutesRemaining, hoursRemaining } = calculateEventTimeRemaining(config.endDate, now);
  const recoveryHp = hoursRemaining === null ? null : hoursRemaining * 60 * config.recoveryRate;
  const resetHp = daysRemaining === null || resetPerDay === null ? null : daysRemaining * resetPerDay;

  const {
    dailyBottles, futureDailyBottles, futurePackageBottles, totalBottles, totalBottleHp,
    baseBottleHp, paidPackageHp, paidDailyHp,
  } = calculateBottleResources({
    currentBottles,
    daysRemaining,
    buyPackage249: config.buyPackage249,
    buyDailyDiamonds: config.buyDailyDiamonds,
  });
  const { extraMaxBottles, extraMaxHp } = calculateGuildBonus(guildLevel, config.maxGuildLevel);
  const projectedCurrent = sumOrNull(merit, currentHp, hpBackup, totalBottleHp, resetHp, recoveryHp);
  const projectedMax = sumOrNull(projectedCurrent, extraMaxHp);

  const { hoursToFill, dischargeHours, dischargeHp } = calculateHpDischarge({
    hpBackup,
    recoveryLimit,
    recoveryRate: config.recoveryRate,
    hoursRemaining,
  });

  const base = sumOrNull(merit, currentHp, hpBackup, baseBottleHp, resetHp, recoveryHp);
  const bothCurrent = sumOrNull(base, paidPackageHp, paidDailyHp);
  const noPackageCurrent = sumOrNull(base, paidDailyHp);
  const noDailyCurrent = sumOrNull(base, paidPackageHp);

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
