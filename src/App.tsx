import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccountInputs } from './components/AccountInputs';
import { Header } from './components/Header';
import { ParameterPanel } from './components/ParameterPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { calculate } from './domain/calculator';
import type { CalculatorConfig, Locale, NumericField } from './domain/types';
import { normalizeNumericInput, parseNumericDraft } from './domain/validation';
import { translator } from './i18n';
import { loadConfigs, loadLocale, saveConfigs, saveLocale } from './storage';

type SaveStatus = 'saved' | 'saving' | 'error';
const numberLocales: Record<Locale, string> = { vi: 'vi-VN', en: 'en-US', th: 'th-TH', id: 'id-ID', zh: 'zh-CN' };

export default function App() {
  const initial = useMemo(loadConfigs, []);
  const [configs, setConfigs] = useState(initial.configs);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [locale, setLocale] = useState<Locale>(loadLocale);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [collapsed, setCollapsed] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [showBackupNotice, setShowBackupNotice] = useState(false);
  const latestRef = useRef({ configs, activeId });
  const t = useMemo(() => translator(locale), [locale]);
  const activeConfig = configs.find((config) => config.id === activeId) ?? configs[0];

  latestRef.current = { configs, activeId };

  const persist = useCallback((nextConfigs = latestRef.current.configs, nextActive = latestRef.current.activeId) => {
    try {
      saveConfigs(nextConfigs, nextActive);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    setSaveStatus('saving');
    const timer = window.setTimeout(() => persist(configs, activeId), 2000);
    return () => window.clearTimeout(timer);
  }, [configs, activeId, persist]);

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    const onBeforeUnload = () => persist();
    const timer = window.setInterval(refresh, 5000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [persist]);

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  const updateActive = useCallback((patch: Partial<CalculatorConfig>) => {
    setConfigs((current) => current.map((config) => config.id === activeId ? { ...config, ...patch } : config));
  }, [activeId]);

  const handleNumericChange = (field: NumericField, value: string) => updateActive({ [field]: value });

  const normalizeFields = (field: NumericField) => {
    const normalized = normalizeNumericInput(activeConfig[field] as string);
    let next = { ...activeConfig, [field]: normalized };
    if (field === 'guildLevel') {
      const level = parseNumericDraft(normalized);
      if (level !== null) next.guildLevel = String(Math.min(level, next.maxGuildLevel));
    }
    if (field === 'hpBackup' || field === 'recoveryLimit') {
      const backup = parseNumericDraft(next.hpBackup);
      const limit = parseNumericDraft(next.recoveryLimit);
      if (backup !== null && limit !== null && backup > limit) {
        next.hpBackup = String(limit);
        setShowBackupNotice(true);
      }
    }
    setConfigs((current) => current.map((config) => config.id === activeId ? next : config));
  };

  const handleParameterChange = (patch: Partial<CalculatorConfig>) => {
    if (patch.maxGuildLevel !== undefined) {
      const currentLevel = parseNumericDraft(activeConfig.guildLevel);
      if (currentLevel !== null && currentLevel > patch.maxGuildLevel) patch.guildLevel = String(patch.maxGuildLevel);
    }
    updateActive(patch);
  };

  const selectConfig = (id: string) => {
    persist(configs, activeId);
    setActiveId(id);
  };

  const addConfig = () => {
    persist(configs, activeId);
    const clone = { ...activeConfig, id: crypto.randomUUID() };
    const next = [...configs, clone];
    setConfigs(next);
    setActiveId(clone.id);
  };

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    saveLocale(nextLocale);
  };

  const result = useMemo(() => calculate(activeConfig, now), [activeConfig, now]);
  const numberFormat = useMemo(() => new Intl.NumberFormat(numberLocales[locale], { maximumFractionDigits: 0 }), [locale]);
  const format = useCallback((value: number | null) => value === null || !Number.isFinite(value) ? t('invalid') : numberFormat.format(value), [numberFormat, t]);

  return (
    <div className="app-shell">
      <Header
        configIds={configs.map((config) => config.id)} activeId={activeId} locale={locale} saveStatus={saveStatus}
        onSelect={selectConfig} onAdd={addConfig} onLocaleChange={changeLocale} t={t}
      />
      <main className={collapsed ? 'workspace is-collapsed' : 'workspace'}>
        <ParameterPanel
          config={activeConfig} collapsed={collapsed} daysRemaining={result.daysRemaining} hoursRemaining={result.hoursRemaining}
          extraBottles={result.extraMaxBottles} onToggle={() => setCollapsed((value) => !value)} onChange={handleParameterChange}
          onGuildBlur={() => normalizeFields('guildLevel')} format={format} t={t}
        />
        <div className="main-column">
          <AccountInputs config={activeConfig} onChange={handleNumericChange} onBlur={normalizeFields} t={t} />
          <ResultsDashboard result={result} config={activeConfig} format={format} t={t} />
        </div>
      </main>

      {showBackupNotice && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowBackupNotice(false)}>
          <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="backup-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="modal-icon">!</span>
            <h2 id="backup-title">{t('backupAdjustedTitle')}</h2>
            <p>{t('backupAdjustedBody')}</p>
            <button type="button" autoFocus onClick={() => setShowBackupNotice(false)}>{t('close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
