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
  current: number | null;
  max: number | null;
}

export interface TargetGap {
  hp: number | null;
  bottles: number | null;
}

export interface CalculatorResult {
  daysRemaining: number | null;
  minutesRemaining: number | null;
  hoursRemaining: number | null;
  recoveryHp: number | null;
  resetHp: number | null;
  dailyBottles: number;
  futureDailyBottles: number | null;
  futurePackageBottles: number | null;
  totalBottles: number | null;
  totalBottleHp: number | null;
  extraMaxBottles: number | null;
  extraMaxHp: number | null;
  projectedCurrent: number | null;
  projectedMax: number | null;
  hoursToFill: number | null;
  dischargeHours: number | null;
  dischargeHp: number | null;
  scenarios: Record<'both' | 'noPackage' | 'noDaily' | 'neither', ScenarioTotal>;
  targets: Record<'3500000' | '5000000', { current: TargetGap; max: TargetGap }>;
}
