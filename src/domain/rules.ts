import type { CalculatorConfig } from './types';

export const HP_PER_BOTTLE = 500;
export const DEFAULT_END_DATE = '2026-10-18';
export const RECOVERY_RATE_OPTIONS = [320] as const;

export const GUILD_BOTTLE_TOTALS = [
  0, 3, 11, 24, 42, 65, 93, 126, 164, 207, 255, 306, 360, 417,
  477, 540, 606, 675, 747, 822, 900, 981, 1064, 1149, 1236, 1325,
  1416, 1509, 1604, 1701, 1800, 1901, 2004, 2109, 2216, 2325, 2436,
  2549, 2664, 2781, 2900,
] as const;

export function createDefaultConfig(id: string = crypto.randomUUID()): CalculatorConfig {
  return {
    id,
    currentMerit: '0',
    maxHpReset: '237300',
    currentHp: '237469',
    hpBackup: '31842',
    currentBottles: '2000',
    recoveryLimit: '949876',
    guildLevel: '0',
    maxGuildLevel: 27,
    endDate: DEFAULT_END_DATE,
    recoveryRate: 320,
    buyPackage249: true,
    buyDailyDiamonds: true,
  };
}
