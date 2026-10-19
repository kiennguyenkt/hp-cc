import {
  calculateBottleResources,
  HP_PER_BOTTLE,
} from './calculations/bottleResources';
import { calculateGuildBonus } from './calculations/guildBonus';
import { calculateHpDischarge } from './calculations/hpDischarge';
import type {
  CalculatorConfig,
  CalculatorResult,
  ScenarioKey,
  TargetGap,
} from './types';
import { parseNumericDraft } from './validation';
import { calculateEventTimeRemaining } from './calculations/eventTime';
import {
  calculateRecoveryHp,
  calculateResetHp,
} from './calculations/hpRecovery';
import {
  calculateProjection,
  calculateScenarios,
} from './calculations/eventHpEstimation';

function targetGap(target: number, total: number | null): TargetGap {
  if (total === null) return { hp: null, bottles: null };
  const hp = Math.max(0, target - total);
  return { hp, bottles: Math.ceil(hp / HP_PER_BOTTLE) };
}

export function calculate(
  config: CalculatorConfig,
  now = new Date(),
): CalculatorResult {
  const merit = parseNumericDraft(config.currentMerit);
  const resetPerDay = parseNumericDraft(config.maxHpReset);
  const currentHp = parseNumericDraft(config.currentHp);
  const hpBackup = parseNumericDraft(config.hpBackup);
  const currentBottles = parseNumericDraft(config.currentBottles);
  const recoveryLimit = parseNumericDraft(config.recoveryLimit);
  const guildLevel = parseNumericDraft(config.guildLevel);
  const { daysRemaining, minutesRemaining, hoursRemaining } =
    calculateEventTimeRemaining(config.endDate, now);
  const recoveryHp = calculateRecoveryHp(hoursRemaining, config.recoveryRate);
  const resetHp = calculateResetHp(daysRemaining, resetPerDay);

  const {
    dailyBottles,
    futureDailyBottles,
    futurePackageBottles,
    totalBottles,
    totalBottleHp,
  } = calculateBottleResources({
    currentBottles,
    daysRemaining,
    buyPackage249: config.buyPackage249,
    buyDailyDiamonds: config.buyDailyDiamonds,
  });
  const { extraMaxBottles, extraMaxHp } = calculateGuildBonus(
    guildLevel,
    config.maxGuildLevel,
  );

  const { hoursToFill, dischargeHours, dischargeHp } = calculateHpDischarge({
    hpBackup,
    recoveryLimit,
    recoveryRate: config.recoveryRate,
    hoursRemaining,
  });

  // Comparisons always use the baseline with both purchases enabled.
  const fullBottleHp =
    config.buyPackage249 && config.buyDailyDiamonds
      ? totalBottleHp
      : calculateBottleResources({
          currentBottles,
          daysRemaining,
          buyPackage249: true,
          buyDailyDiamonds: true,
        }).totalBottleHp;
  const baseline = calculateProjection({
    merit,
    currentHp,
    hpBackup,
    bottleHp: fullBottleHp.value,
    resetHp: resetHp.value,
    recoveryHp: recoveryHp.value,
  });
  const scenarios = calculateScenarios(baseline, extraMaxHp, daysRemaining);
  const selectedScenario: ScenarioKey = config.buyPackage249
    ? config.buyDailyDiamonds
      ? 'both'
      : 'noDaily'
    : config.buyDailyDiamonds
      ? 'noPackage'
      : 'neither';
  const { current: projectedCurrent, max: projectedMax } =
    scenarios[selectedScenario];

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
    selectedScenario,
    scenarios,
    targets: {
      '3500000': {
        current: targetGap(3_500_000, projectedCurrent.value),
        max: targetGap(3_500_000, projectedMax.value),
      },
      '5000000': {
        current: targetGap(5_000_000, projectedCurrent.value),
        max: targetGap(5_000_000, projectedMax.value),
      },
    },
  };
}
