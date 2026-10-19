import { useCallback, useState } from 'react';
import type { CalculatorConfig } from '../domain/types';
import { loadProfiles, saveProfiles } from '../storage';

/** Owns profile drafts, selection, and explicit persistence. */
export function useCalculatorProfiles() {
  const [initial] = useState(loadProfiles);
  const [profiles, setProfiles] = useState(initial.configs);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [savedProfiles, setSavedProfiles] = useState(initial.configs);
  const [failedConfig, setFailedConfig] = useState<CalculatorConfig | null>(
    null,
  );
  const activeConfig =
    profiles.find((profile) => profile.id === activeId) ?? profiles[0];
  const savedProfile = savedProfiles.find((profile) => profile.id === activeId);
  const saveStatus: 'error' | 'saved' | 'unsaved' =
    failedConfig === activeConfig
      ? 'error'
      : JSON.stringify(activeConfig) === JSON.stringify(savedProfile)
        ? 'saved'
        : 'unsaved';

  const updateActive = useCallback(
    (patch: Partial<CalculatorConfig>) => {
      setProfiles((current) =>
        current.map((profile) =>
          profile.id === activeId ? { ...profile, ...patch } : profile,
        ),
      );
    },
    [activeId],
  );

  const saveCurrentProfile = () => {
    const nextSavedProfiles = savedProfile
      ? savedProfiles.map((profile) =>
          profile.id === activeId ? activeConfig : profile,
        )
      : [...savedProfiles, activeConfig];
    try {
      saveProfiles(nextSavedProfiles, activeId);
      setSavedProfiles(nextSavedProfiles);
      setFailedConfig(null);
    } catch {
      setFailedConfig(activeConfig);
    }
  };

  const addProfile = () => {
    const clone = { ...activeConfig, id: crypto.randomUUID() };
    setProfiles((current) => [...current, clone]);
    setActiveId(clone.id);
  };

  const renameProfile = (id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === id ? { ...profile, name: trimmedName } : profile,
      ),
    );
  };

  return {
    profiles,
    activeId,
    activeConfig,
    saveStatus,
    updateActive,
    saveCurrentProfile,
    addProfile,
    renameProfile,
    selectProfile: setActiveId,
  };
}
