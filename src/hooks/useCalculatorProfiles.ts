import { useCallback, useState } from 'react';
import type { CalculatorConfig } from '../domain/types';
import { loadConfigs, saveConfigs } from '../storage';

/** Owns config drafts, selection, and explicit persistence. */
export function useCalculatorProfiles() {
  const [initial] = useState(loadConfigs);
  const [configs, setConfigs] = useState(initial.configs);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [savedConfigs, setSavedConfigs] = useState(initial.configs);
  const [failedConfig, setFailedConfig] = useState<CalculatorConfig | null>(null);
  const activeConfig = configs.find((config) => config.id === activeId) ?? configs[0];
  const savedConfig = savedConfigs.find((config) => config.id === activeId);
  const saveStatus: 'error' | 'saved' | 'unsaved' = failedConfig === activeConfig
    ? 'error'
    : JSON.stringify(activeConfig) === JSON.stringify(savedConfig) ? 'saved' : 'unsaved';

  const updateActive = useCallback((patch: Partial<CalculatorConfig>) => {
    setConfigs((current) => current.map((config) => config.id === activeId ? { ...config, ...patch } : config));
  }, [activeId]);

  const saveCurrentConfig = () => {
    const nextSavedConfigs = savedConfig
      ? savedConfigs.map((config) => config.id === activeId ? activeConfig : config)
      : [...savedConfigs, activeConfig];
    try {
      saveConfigs(nextSavedConfigs, activeId);
      setSavedConfigs(nextSavedConfigs);
      setFailedConfig(null);
    } catch {
      setFailedConfig(activeConfig);
    }
  };

  const addConfig = () => {
    const clone = { ...activeConfig, id: crypto.randomUUID() };
    setConfigs((current) => [...current, clone]);
    setActiveId(clone.id);
  };

  const renameConfig = (id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setConfigs((current) => current.map((config) => config.id === id ? { ...config, name: trimmedName } : config));
  };

  return {
    configs, activeId, activeConfig, saveStatus,
    updateActive, saveCurrentConfig, addConfig, renameConfig, selectConfig: setActiveId,
  };
}
