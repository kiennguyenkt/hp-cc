import type { Locale } from '../domain/types';
import type { TranslationKey } from '../i18n';

const localeLabels: Record<Locale, string> = { vi: 'VN', en: 'EN', th: 'TH', id: 'ID', zh: '中文' };
const locales = Object.keys(localeLabels) as Locale[];

interface HeaderProps {
  configIds: string[];
  activeId: string;
  locale: Locale;
  saveStatus: 'saved' | 'saving' | 'error';
  onSelect: (id: string) => void;
  onAdd: () => void;
  onLocaleChange: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export function Header({ configIds, activeId, locale, saveStatus, onSelect, onAdd, onLocaleChange, t }: HeaderProps) {
  const saveLabel = saveStatus === 'error' ? t('saveError') : t(saveStatus);
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="brand-mark" aria-hidden="true">HP</span>
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{t('appTitle')}</h1>
        </div>
      </div>

      <div className="topbar__controls">
        <div className="config-area">
          <span className="control-label">{t('config')}</span>
          <div className="config-tabs" role="tablist" aria-label={t('config')}>
            {configIds.map((id, index) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={id === activeId}
                className={id === activeId ? 'config-tab is-active' : 'config-tab'}
                onClick={() => onSelect(id)}
                title={id === activeId ? t('selected') : undefined}
              >
                {index + 1}
              </button>
            ))}
            <button type="button" className="config-tab config-tab--add" onClick={onAdd} aria-label={t('addConfig')} title={t('addConfig')}>+</button>
          </div>
        </div>

        <div className="header-meta">
          <span className={`save-status save-status--${saveStatus}`} aria-live="polite">
            <span className="save-dot" />{saveLabel}
          </span>
          <div className="language-switch" aria-label={t('language')}>
            {locales.map((code) => (
              <button key={code} type="button" className={locale === code ? 'is-active' : ''} onClick={() => onLocaleChange(code)}>
                {localeLabels[code]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
