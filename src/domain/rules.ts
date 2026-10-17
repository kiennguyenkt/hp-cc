import type { CalculatorConfig } from './types';

export const DEFAULT_END_DATE = '2026-10-18';
export const RECOVERY_RATE_OPTIONS = [320] as const;

export function createDefaultConfig(id: string = crypto.randomUUID()): CalculatorConfig {
  return {
    id,
    name: '',
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
