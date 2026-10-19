import { useState } from 'react';
import type { CalculatorConfig, NumericField } from '../domain/types';
import { normalizeNumericInput, parseNumericDraft } from '../domain/validation';

/** Routes form edits into the shared config and applies field rules. */
export function useCalculatorInputHandlers(
  config: CalculatorConfig,
  updateConfig: (patch: Partial<CalculatorConfig>) => void,
) {
  const [showBackupNotice, setShowBackupNotice] = useState(false);

  const handleNumericChange = (field: NumericField, value: string) =>
    updateConfig({ [field]: value });

  const normalizeField = (field: NumericField) => {
    const normalized = normalizeNumericInput(config[field]);
    const next = { ...config, [field]: normalized };
    if (field === 'guildLevel') {
      const level = parseNumericDraft(normalized);
      if (level !== null)
        next.guildLevel = String(Math.min(level, next.maxGuildLevel));
    }
    if (field === 'hpBackup' || field === 'recoveryLimit') {
      const backup = parseNumericDraft(next.hpBackup);
      const limit = parseNumericDraft(next.recoveryLimit);
      if (backup !== null && limit !== null && backup > limit) {
        next.hpBackup = String(limit);
        setShowBackupNotice(true);
      }
    }
    updateConfig(next);
  };

  const handleParameterChange = (patch: Partial<CalculatorConfig>) => {
    const next = { ...patch };
    if (next.maxGuildLevel !== undefined) {
      const currentLevel = parseNumericDraft(config.guildLevel);
      if (currentLevel !== null && currentLevel > next.maxGuildLevel)
        next.guildLevel = String(next.maxGuildLevel);
    }
    updateConfig(next);
  };

  return {
    handleNumericChange,
    handleParameterChange,
    normalizeField,
    showBackupNotice,
    dismissBackupNotice: () => setShowBackupNotice(false),
  };
}
