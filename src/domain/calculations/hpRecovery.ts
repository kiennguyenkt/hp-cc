import {
  createResultWithFormula as resultWithFormula,
  MINUTES_PER_HOUR,
  type FormulaFormat,
} from '../resultWithFormula';

export function calculateRecoveryHp(hours: number | null, rate: number) {
  const recoveryHpValue =
    hours === null ? null : hours * MINUTES_PER_HOUR * rate;
  const recoveryHpFormula = (
    value: number | null,
    { formatNumber: f, label: l }: FormulaFormat,
  ) =>
    `${f(hours)} ${l('hours')} × ${f(MINUTES_PER_HOUR)} ${l('minutes')}/${l('hours')} × ${f(rate)} HP/${l('minutes')} = ${f(value)} HP`;

  return resultWithFormula(recoveryHpValue, recoveryHpFormula);
}

export function calculateResetHp(
  days: number | null,
  resetPerDay: number | null,
) {
  const resetHpValue =
    days === null || resetPerDay === null ? null : days * resetPerDay;
  const resetHpFormula = (
    value: number | null,
    { formatNumber: f, label: l }: FormulaFormat,
  ) =>
    `${f(days)} ${l('days')} × ${f(resetPerDay)} HP/${l('days')} = ${f(value)} HP`;

  return resultWithFormula(resetHpValue, resetHpFormula);
}
