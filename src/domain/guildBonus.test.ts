import { describe, expect, it } from 'vitest';
import { calculateGuildBonus } from './guildBonus';

describe('calculateGuildBonus', () => {
  it.each([
    { level: 0, max: 27, bottles: 1509 },
    { level: 27, max: 27, bottles: 0 },
    { level: 27, max: 40, bottles: 1391 },
    { level: 40, max: 40, bottles: 0 },
  ] as const)('calculates rewards from level $level to $max', ({ level, max, bottles }) => {
    expect(calculateGuildBonus(level, max)).toEqual({
      extraMaxBottles: bottles,
      extraMaxHp: bottles * 500,
    });
  });

  it.each([null, -1, 1.5, 28, NaN])('returns unknown rewards for invalid level %j', (level) => {
    expect(calculateGuildBonus(level, 27)).toEqual({ extraMaxBottles: null, extraMaxHp: null });
  });
});
