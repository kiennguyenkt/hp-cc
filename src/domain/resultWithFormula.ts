export type FormulaLabel =
  | 'hours' | 'minutes' | 'days' | 'bottles'
  | 'dailySource' | 'freeSource'
  | 'roundDown' | 'recoveryLimit' | 'hpBackup' | 'hpRecoveryRate'
  | 'timeLeft' | 'fillTime' | 'dischargeTime' | 'scenarioTotalFormula';

export interface FormulaFormat {
  formatNumber: (value: number | null) => string;
  label: (key: FormulaLabel) => string;
}

/** A calculated value and its explanation share the same input snapshot. */
export interface ResultWithFormula {
  readonly value: number | null;
  formatFormula: (context: FormulaFormat) => string;
}

export function createResultWithFormula(
  value: number | null,
  describe: (value: number | null, context: FormulaFormat) => string,
): ResultWithFormula {
  return { value, formatFormula: (context) => describe(value, context) };
}

export const MINUTES_PER_HOUR = 60;
