import {
  createResultWithFormula as resultWithFormula,
  MINUTES_PER_HOUR,
  type FormulaFormat,
} from '../resultWithFormula';

export const DISCHARGE_BUFFER_HOURS = 2;

interface HpDischargeInputs {
  hpBackup: number | null;
  recoveryLimit: number | null;
  recoveryRate: number;
  hoursRemaining: number | null;
}

export function calculateHpDischarge({
  hpBackup,
  recoveryLimit,
  recoveryRate,
  hoursRemaining,
}: HpDischargeInputs) {
  const hoursToFillValue =
    hpBackup === null || recoveryLimit === null
      ? null
      : Math.floor(
          (recoveryLimit - hpBackup) / (recoveryRate * MINUTES_PER_HOUR),
        );
  const hoursToFillFormula = (
    value: number | null,
    { formatNumber: f, label: l }: FormulaFormat,
  ) =>
    `${l('roundDown')}: (${l('recoveryLimit')} − ${l('hpBackup')}) ÷ (${l('hpRecoveryRate')} × ${f(MINUTES_PER_HOUR)})\n⌊(${f(recoveryLimit)} − ${f(hpBackup)}) ÷ (${f(recoveryRate)} × ${f(MINUTES_PER_HOUR)})⌋ = ${f(value)} ${l('hours')}`;
  const hoursToFill = resultWithFormula(hoursToFillValue, hoursToFillFormula);

  const dischargeHoursValue =
    hoursRemaining === null || hoursToFill.value === null
      ? null
      : hoursRemaining - hoursToFill.value + DISCHARGE_BUFFER_HOURS;
  const dischargeHoursFormula = (
    value: number | null,
    { formatNumber: f, label: l }: FormulaFormat,
  ) =>
    `${l('timeLeft')} − ${l('fillTime')} + ${f(DISCHARGE_BUFFER_HOURS)} ${l('hours')}\n${f(hoursRemaining)} − ${f(hoursToFill.value)} + ${f(DISCHARGE_BUFFER_HOURS)} = ${f(value)} ${l('hours')}`;
  const dischargeHours = resultWithFormula(
    dischargeHoursValue,
    dischargeHoursFormula,
  );

  const dischargeHpValue =
    dischargeHours.value === null
      ? null
      : dischargeHours.value * recoveryRate * MINUTES_PER_HOUR;
  const dischargeHpFormula = (
    value: number | null,
    { formatNumber: f, label: l }: FormulaFormat,
  ) =>
    `${l('dischargeTime')} × ${f(MINUTES_PER_HOUR)} × ${l('hpRecoveryRate')}\n${f(dischargeHours.value)} ${l('hours')} × ${f(MINUTES_PER_HOUR)} ${l('minutes')}/${l('hours')} × ${f(recoveryRate)} HP/${l('minutes')} = ${f(value)} HP`;
  const dischargeHp = resultWithFormula(dischargeHpValue, dischargeHpFormula);

  return { hoursToFill, dischargeHours, dischargeHp };
}
