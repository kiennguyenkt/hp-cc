import type { CalculatorConfig, Locale } from '../domain/types';
import type { TranslationKey } from '../i18n';
import { cx } from '../shared/cx';
import styles from './Header.module.css';

const localeLabels: Record<Locale, string> = {
  vi: 'VN',
  en: 'EN',
  th: 'TH',
  id: 'ID',
  zh: '中文',
};
const locales = Object.keys(localeLabels) as Locale[];

interface HeaderProps {
  configs: Pick<CalculatorConfig, 'id' | 'name'>[];
  activeId: string;
  locale: Locale;
  saveStatus: 'saved' | 'unsaved' | 'error';
  onSave: () => void;
  onRename: () => void;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onLocaleChange: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export function Header({
  configs,
  activeId,
  locale,
  saveStatus,
  onSave,
  onRename,
  onSelect,
  onAdd,
  onLocaleChange,
  t,
}: HeaderProps) {
  const saveLabel = saveStatus === 'error' ? t('saveError') : t(saveStatus);
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarBrand}>
        <span className={styles.brandMark} aria-hidden="true">
          HP
        </span>
        <div>
          <h1>{t('appTitle')}</h1>
          <p id="51921435" className={styles.devIngameId}>
            {t('developerCredit')} <strong>Hunter[517]</strong>
          </p>
        </div>
      </div>

      <div className={styles.topbarControls}>
        <div className={styles.configArea}>
          <span className={styles.controlLabel}>{t('config')}</span>
          <div className={styles.configActions}>
            <button
              type="button"
              className={styles.configSave}
              onClick={onRename}
              title={t('renameConfig')}
            >
              {t('rename')}
            </button>
            <button
              type="button"
              className={styles.configSave}
              onClick={onSave}
              title={t('saveConfig')}
              aria-label={t('saveConfig')}
            >
              {t('save')}
            </button>
            <span className={styles.configDivider} aria-hidden="true" />
            <div
              className={styles.configTabs}
              role="tablist"
              aria-label={t('config')}
            >
              {configs.map(({ id, name }, index) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={id === activeId}
                  className={cx(
                    styles.configTab,
                    id === activeId && styles.isActive,
                  )}
                  onClick={() => onSelect(id)}
                  title={name || (id === activeId ? t('selected') : undefined)}
                >
                  {name || index + 1}
                </button>
              ))}
              <button
                type="button"
                className={cx(styles.configTab, styles.configTabAdd)}
                onClick={onAdd}
                aria-label={t('addConfig')}
                title={t('addConfig')}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className={styles.headerMeta}>
          <span
            className={cx(styles.saveStatus, styles[saveStatus])}
            aria-live="polite"
          >
            <span className={styles.saveDot} />
            {saveLabel}
          </span>
          <div className={styles.languageSwitch} aria-label={t('language')}>
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                className={locale === code ? styles.isActive : ''}
                onClick={() => onLocaleChange(code)}
              >
                {localeLabels[code]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
