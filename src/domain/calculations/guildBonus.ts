import { bottlesToHp } from './bottleResources';
import {
  createResultWithFormula as resultWithFormula,
  type FormulaFormat,
} from '../resultWithFormula';
import type { MaxGuildLevel } from '../types';

export const GUILD_BOTTLE_TOTALS = [
  0, 3, 11, 24, 42, 65, 93, 126, 164, 207, 255, 306, 360, 417, 477, 540, 606,
  675, 747, 822, 900, 981, 1064, 1149, 1236, 1325, 1416, 1509, 1604, 1701, 1800,
  1901, 2004, 2109, 2216, 2325, 2436, 2549, 2664, 2781, 2900,
] as const;

export function calculateGuildBonus(
  guildLevel: number | null,
  maxGuildLevel: MaxGuildLevel,
) {
  const validLevel =
    guildLevel !== null &&
    Number.isInteger(guildLevel) &&
    guildLevel >= 0 &&
    guildLevel <= maxGuildLevel;
  const extraMaxBottles = validLevel
    ? GUILD_BOTTLE_TOTALS[maxGuildLevel] - GUILD_BOTTLE_TOTALS[guildLevel]
    : null;
  const extraMaxHpValue = bottlesToHp(extraMaxBottles);
  const extraMaxHpFormula = (
    value: number | null,
    { formatNumber: f, label: l }: FormulaFormat,
  ) => `+${f(value)} HP (${f(extraMaxBottles)} ${l('bottles')})`;
  const extraMaxHp = resultWithFormula(extraMaxHpValue, extraMaxHpFormula);

  return { extraMaxBottles, extraMaxHp };
}
