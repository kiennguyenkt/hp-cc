import type { ResultWithFormula } from './resultWithFormula';

export type Locale = 'vi' | 'en' | 'th' | 'id' | 'zh';
export type MaxGuildLevel = 27 | 40;

export interface CalculatorConfig {
  id: string;
  name: string;
  currentMerit: string;
  maxHpReset: string;
  currentHp: string;
  hpBackup: string;
  currentBottles: string;
  recoveryLimit: string;
  guildLevel: string;
  maxGuildLevel: MaxGuildLevel;
  endDate: string;
  recoveryRate: number;
  buyPackage249: boolean;
  buyDailyDiamonds: boolean;
}

export type NumericField =
  | 'currentMerit'
  | 'maxHpReset'
  | 'currentHp'
  | 'hpBackup'
  | 'currentBottles'
  | 'recoveryLimit'
  | 'guildLevel';

export interface ScenarioTotal {
  current: ResultWithFormula;
  max: ResultWithFormula;
}

export type ScenarioKey = 'both' | 'noPackage' | 'noDaily' | 'neither';

export interface TargetGap {
  hp: number | null;
  bottles: number | null;
}

export interface CalculatorResult {
  daysRemaining: number | null;
  minutesRemaining: number | null;
  hoursRemaining: number | null;
  recoveryHp: ResultWithFormula;
  resetHp: ResultWithFormula;
  dailyBottles: number;
  futureDailyBottles: number | null;
  futurePackageBottles: number | null;
  totalBottles: ResultWithFormula;
  totalBottleHp: ResultWithFormula;
  extraMaxBottles: number | null;
  extraMaxHp: ResultWithFormula;
  projectedCurrent: ResultWithFormula;
  projectedMax: ResultWithFormula;
  hoursToFill: ResultWithFormula;
  dischargeHours: ResultWithFormula;
  dischargeHp: ResultWithFormula;
  selectedScenario: ScenarioKey;
  scenarios: Record<ScenarioKey, ScenarioTotal>;
  targets: Record<
    '3500000' | '5000000',
    { current: TargetGap; max: TargetGap }
  >;
}
