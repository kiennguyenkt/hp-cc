import { describe, expect, it } from 'vitest';
import { calculateGuildBonus } from './guildBonus';

describe('calculateGuildBonus', () => {
  it.each([
    { level: 0, max: 27, bottles: 1509 },
    { level: 27, max: 27, bottles: 0 },
    { level: 27, max: 40, bottles: 1391 },
    { level: 40, max: 40, bottles: 0 },
  ] as const)(
    'calculates rewards from level $level to $max',
    ({ level, max, bottles }) => {
      const result = calculateGuildBonus(level, max);
      expect({
        extraMaxBottles: result.extraMaxBottles,
        extraMaxHp: result.extraMaxHp.value,
      }).toEqual({
        extraMaxBottles: bottles,
        extraMaxHp: bottles * 500,
      });
    },
  );

  it.each([null, -1, 1.5, 28, NaN])(
    'returns unknown rewards for invalid level %j',
    (level) => {
      const result = calculateGuildBonus(level, 27);
      expect(result.extraMaxBottles).toBeNull();
      expect(result.extraMaxHp.value).toBeNull();
    },
  );
});
