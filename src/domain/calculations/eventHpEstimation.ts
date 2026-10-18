import { sumOrNull } from '../../shared/math';
import { BOTTLES_PER_DAILY_PURCHASE, DAILY_DIAMOND_PURCHASES, HP_PER_BOTTLE, PAID_PACKAGE_BOTTLES } from './bottleResources';
import { createResultWithFormula as resultWithFormula, type FormulaFormat, type ResultWithFormula } from '../resultWithFormula';
import type { ScenarioKey, ScenarioTotal } from '../types';

interface ProjectionInputs {
  merit: number | null;
  currentHp: number | null;
  hpBackup: number | null;
  bottleHp: number | null;
  resetHp: number | null;
  recoveryHp: number | null;
}

export function calculateProjection({ merit, currentHp, hpBackup, bottleHp, resetHp, recoveryHp }: ProjectionInputs) {
  const terms = [merit, currentHp, hpBackup, bottleHp, resetHp, recoveryHp];
  const projectionValue = sumOrNull(...terms);
  const projectionFormula = (value: number | null, { formatNumber: f, label: l }: FormulaFormat) =>
    `${l('scenarioTotalFormula')}\n${terms.map(f).join(' + ')} = ${f(value)} HP`;

  return resultWithFormula(projectionValue, projectionFormula);
}

function withGuildBonus(current: ResultWithFormula, extraMaxHp: ResultWithFormula): ScenarioTotal {
  const maxValue = sumOrNull(current.value, extraMaxHp.value);
  const maxFormula = (value: number | null, { formatNumber: f }: FormulaFormat) =>
    `${f(current.value)} + ${f(extraMaxHp.value)} = ${f(value)} HP`;
  const max = resultWithFormula(maxValue, maxFormula);

  return {
    current,
    max,
  };
}

export function calculateScenarios(baseline: ResultWithFormula, extraMaxHp: ResultWithFormula, days: number | null): Record<ScenarioKey, ScenarioTotal> {
  const withoutPurchases = (packageRemoved: boolean, dailyRemoved: boolean) => {
    const deductions: Array<Array<number | null>> = [];
    if (packageRemoved) deductions.push([PAID_PACKAGE_BOTTLES, days, HP_PER_BOTTLE]);
    if (dailyRemoved) deductions.push([BOTTLES_PER_DAILY_PURCHASE, DAILY_DIAMOND_PURCHASES, days, HP_PER_BOTTLE]);
    const deductionHp = sumOrNull(...deductions.map((factors) =>
      factors.reduce<number | null>((total, factor) => total === null || factor === null ? null : total * factor, 1)));
    const currentValue = baseline.value === null || deductionHp === null ? null : baseline.value - deductionHp;
    const currentFormula = (value: number | null, { formatNumber: f }: FormulaFormat) =>
      `${f(baseline.value)} − ${deductions.map((factors) => factors.map(f).join(' × ')).join(' − ')} = ${f(value)} HP`;
    const current = resultWithFormula(currentValue, currentFormula);

    return withGuildBonus(current, extraMaxHp);
  };

  return {
    both: withGuildBonus(baseline, extraMaxHp),
    noPackage: withoutPurchases(true, false),
    noDaily: withoutPurchases(false, true),
    neither: withoutPurchases(true, true),
  };
}
