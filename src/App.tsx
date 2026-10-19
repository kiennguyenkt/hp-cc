import { useMemo, useState } from 'react';
import { AccountInputs } from './components/AccountInputs';
import { Header } from './components/Header';
import { ParameterPanel } from './components/ParameterPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { useCalculatorProfiles } from './hooks/useCalculatorProfiles';
import { useCalculatorInputHandlers } from './hooks/useCalculatorInputHandlers';
import { calculate } from './domain/calculator';
import { useCalculatorCurrentTime } from './hooks/useCalculatorCurrentTime';
import { useTranslation } from './hooks/LocaleContext';
import { cx } from './shared/cx';
import shared from './components/shared.module.css';
import styles from './App.module.css';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [renameDraft, setRenameDraft] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    configs,
    activeId,
    activeConfig,
    saveStatus,
    updateActive,
    saveCurrentConfig,
    selectConfig,
    addConfig,
    renameConfig,
  } = useCalculatorProfiles();
  const {
    handleNumericChange,
    handleParameterChange,
    normalizeField,
    showBackupNotice,
    dismissBackupNotice,
  } = useCalculatorInputHandlers(activeConfig, updateActive);

  const now = useCalculatorCurrentTime();
  const t = useTranslation();
  const result = useMemo(
    () => calculate(activeConfig, now),
    [activeConfig, now],
  );

  return (
    <div className={styles.appShell}>
      <Header
        configs={configs}
        activeId={activeId}
        saveStatus={saveStatus}
        onRename={() =>
          setRenameDraft({ id: activeId, name: activeConfig.name })
        }
        onSave={saveCurrentConfig}
        onSelect={selectConfig}
        onAdd={addConfig}
      />
      <main className={cx(styles.workspace, collapsed && styles.isCollapsed)}>
        <ParameterPanel
          config={activeConfig}
          collapsed={collapsed}
          daysRemaining={result.daysRemaining}
          hoursRemaining={result.hoursRemaining}
          extraBottles={result.extraMaxBottles}
          onToggle={() => setCollapsed((value) => !value)}
          onChange={handleParameterChange}
          onGuildBlur={() => normalizeField('guildLevel')}
        />
        <div className={styles.mainColumn}>
          <AccountInputs
            config={activeConfig}
            onChange={handleNumericChange}
            onBlur={normalizeField}
          />
          <ResultsDashboard config={activeConfig} result={result} />
        </div>
      </main>

      {renameDraft && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setRenameDraft(null)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setRenameDraft(null);
          }}
        >
          <form
            className={cx(styles.modal, styles.renameModal)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              const name = renameDraft.name.trim();
              if (!name) return;
              renameConfig(renameDraft.id, name);
              setRenameDraft(null);
            }}
          >
            <h2 id="rename-title">{t('renameConfig')}</h2>
            <label className={cx(shared.field, styles.renameField)}>
              <span>{t('configName')}</span>
              <input
                autoFocus
                required
                maxLength={60}
                value={renameDraft.name}
                onChange={(event) =>
                  setRenameDraft({ ...renameDraft, name: event.target.value })
                }
              />
            </label>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => setRenameDraft(null)}
              >
                {t('cancel')}
              </button>
              <button type="submit" disabled={!renameDraft.name.trim()}>
                {t('rename')}
              </button>
            </div>
          </form>
        </div>
      )}

      {showBackupNotice && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={dismissBackupNotice}
        >
          <div
            className={styles.modal}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="backup-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className={styles.modalIcon}>!</span>
            <h2 id="backup-title">{t('backupAdjustedTitle')}</h2>
            <p>{t('backupAdjustedBody')}</p>
            <button type="button" autoFocus onClick={dismissBackupNotice}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
