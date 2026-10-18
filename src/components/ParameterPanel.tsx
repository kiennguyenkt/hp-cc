import { RECOVERY_RATE_OPTIONS } from '../domain/defaultFormValue';
import type { CalculatorConfig } from '../domain/types';
import type { TranslationKey } from '../i18n';

interface ParameterPanelProps {
  config: CalculatorConfig;
  collapsed: boolean;
  daysRemaining: number | null;
  hoursRemaining: number | null;
  extraBottles: number | null;
  onToggle: () => void;
  onChange: (patch: Partial<CalculatorConfig>) => void;
  onGuildBlur: () => void;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

export function ParameterPanel(props: ParameterPanelProps) {
  const { config, collapsed, daysRemaining, hoursRemaining, extraBottles, onToggle, onChange, onGuildBlur, format, t } = props;
  if (collapsed) {
    return <button type="button" className="expand-button" onClick={onToggle}><span>→</span>{t('expand')}</button>;
  }

  return (
    <aside className="parameter-panel card">
      <div className="section-heading">
        <h2>{t('parameters')}</h2>
        <button type="button" className="text-button" onClick={onToggle}>{t('collapse')} ←</button>
      </div>

      <div className="field-stack">
        <label className="field">
          <span>{t('endDate')}</span>
          <input type="date" value={config.endDate} onChange={(event) => onChange({ endDate: event.target.value })} />
          <small>{t('endsAt')}</small>
        </label>
        <div className="time-panel">
          <span>{t('timeLeft')}</span>
          <strong>
            {format(hoursRemaining)} <small>{t('hours')}</small>{' '}
            <small>({format(daysRemaining)} {t('days')})</small>
          </strong>
        </div>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>{t('currentGuildLevel')}</span>
          <input inputMode="decimal" value={config.guildLevel} onChange={(event) => onChange({ guildLevel: event.target.value })} onBlur={onGuildBlur} />
        </label>
        <label className="field">
          <span>{t('maxGuildLevel')}</span>
          <select value={config.maxGuildLevel} onChange={(event) => onChange({ maxGuildLevel: Number(event.target.value) as 27 | 40 })}>
            <option value={27}>27</option><option value={40}>40</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>{t('hpRecoveryRate')}</span>
        <select value={config.recoveryRate} onChange={(event) => onChange({ recoveryRate: Number(event.target.value) })}>
          {RECOVERY_RATE_OPTIONS.map((rate) => <option key={rate} value={rate}>{rate}</option>)}
        </select>
      </label>

      <div className="stat-row"><span>{t('extraBottlesAtMax')}</span><strong>{format(extraBottles)}</strong></div>

      <div className="rule-block">
        <p className="mini-heading">{t('otherRules')}</p>
        <p className="rule-callout">{t('bottleRate')}</p>
        <label className="check-row">
          <input type="checkbox" checked={config.buyPackage249} onChange={(event) => onChange({ buyPackage249: event.target.checked })} />
          <span>{t('package249')}</span>
        </label>
        <label className="check-row">
          <input type="checkbox" checked={config.buyDailyDiamonds} onChange={(event) => onChange({ buyDailyDiamonds: event.target.checked })} />
          <span>{t('dailyDiamonds')}</span>
        </label>
        <div className="rule-notes"><span>{t('dailyHint')}</span><span>{t('packageHint')}</span></div>
      </div>
    </aside>
  );
}
