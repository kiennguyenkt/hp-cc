interface HpDischargeInputs {
  hpBackup: number | null;
  recoveryLimit: number | null;
  recoveryRate: number;
  hoursRemaining: number | null;
}

export function calculateHpDischarge({ hpBackup, recoveryLimit, recoveryRate, hoursRemaining }: HpDischargeInputs) {
  const hoursToFill = hpBackup === null || recoveryLimit === null
    ? null
    : Math.floor((recoveryLimit - hpBackup) / (recoveryRate * 60));
  const dischargeHours = hoursRemaining === null || hoursToFill === null
    ? null
    : hoursRemaining - hoursToFill + 2;
  const dischargeHp = dischargeHours === null ? null : dischargeHours * recoveryRate * 60;

  return { hoursToFill, dischargeHours, dischargeHp };
}
