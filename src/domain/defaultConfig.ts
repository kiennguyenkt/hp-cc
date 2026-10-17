import type { CalculatorConfig } from './types';

export const DEFAULT_END_DATE = '2026-10-18';
export const RECOVERY_RATE_OPTIONS = [320] as const;

export function createDefaultConfig(id: string = crypto.randomUUID()): CalculatorConfig {
  return {
    id,
    name: '',
    currentMerit: '965686',
    maxHpReset: '237478',
    currentHp: '114790',
    hpBackup: '324118',
    currentBottles: '5300',
    recoveryLimit: '949912',
    guildLevel: '40',
    maxGuildLevel: 40,
    endDate: DEFAULT_END_DATE,
    recoveryRate: 320,
    buyPackage249: true,
    buyDailyDiamonds: true,
  };
}
