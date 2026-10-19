import { RECOVERY_RATE_OPTIONS } from '../domain/defaultFormValue';
import type { CalculatorConfig } from '../domain/types';
import { useCalculator } from '../context/CalculatorContext';
import { useFormat, useTranslation } from '../context/LocaleContext';
import { cx } from '../shared/cx';
import shared from './shared.module.css';
import styles from './ParameterPanel.module.css';

interface ParameterPanelProps {
  collapsed: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<CalculatorConfig>) => void;
  onGuildBlur: () => void;
}

export function ParameterPanel({
  collapsed,
  onToggle,
  onChange,
  onGuildBlur,
}: ParameterPanelProps) {
  const { config, result } = useCalculator();
  const t = useTranslation();
  const format = useFormat();
  if (collapsed) {
    return (
      <button type="button" className={styles.expandButton} onClick={onToggle}>
        <span>→</span>
        {t('expand')}
      </button>
    );
  }

  return (
    <aside className={cx(shared.card, styles.panel)}>
      <div className={shared.sectionHeading}>
        <h2>{t('parameters')}</h2>
        <button type="button" className={styles.textButton} onClick={onToggle}>
          {t('collapse')} ←
        </button>
      </div>

      <div className={styles.fieldStack}>
        <label className={shared.field}>
          <span>{t('endDate')}</span>
          <input
            type="date"
            value={config.endDate}
            onChange={(event) => onChange({ endDate: event.target.value })}
          />
          <small>{t('endsAt')}</small>
        </label>
        <div className={styles.timePanel}>
          <span>{t('timeLeft')}</span>
          <strong>
            {format(result.hoursRemaining)} <small>{t('hours')}</small>{' '}
            <small>
              ({format(result.daysRemaining)} {t('days')})
            </small>
          </strong>
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <label className={shared.field}>
          <span>{t('currentGuildLevel')}</span>
          <input
            inputMode="decimal"
            value={config.guildLevel}
            onChange={(event) => onChange({ guildLevel: event.target.value })}
            onBlur={onGuildBlur}
          />
        </label>
        <label className={shared.field}>
          <span>{t('maxGuildLevel')}</span>
          <select
            value={config.maxGuildLevel}
            onChange={(event) =>
              onChange({ maxGuildLevel: Number(event.target.value) as 27 | 40 })
            }
          >
            <option value={27}>27</option>
            <option value={40}>40</option>
          </select>
        </label>
      </div>

      <label className={shared.field}>
        <span>{t('hpRecoveryRate')}</span>
        <select
          value={config.recoveryRate}
          onChange={(event) =>
            onChange({ recoveryRate: Number(event.target.value) })
          }
        >
          {RECOVERY_RATE_OPTIONS.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.statRow}>
        <span>{t('extraBottlesAtMax')}</span>
        <strong>{format(result.extraMaxBottles)}</strong>
      </div>

      <div className={styles.ruleBlock}>
        <p className={styles.miniHeading}>{t('otherRules')}</p>
        <p className={styles.ruleCallout}>{t('bottleRate')}</p>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={config.buyPackage249}
            onChange={(event) =>
              onChange({ buyPackage249: event.target.checked })
            }
          />
          <span>{t('package249')}</span>
        </label>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={config.buyDailyDiamonds}
            onChange={(event) =>
              onChange({ buyDailyDiamonds: event.target.checked })
            }
          />
          <span>{t('dailyDiamonds')}</span>
        </label>
        <div className={styles.ruleNotes}>
          <span>{t('dailyHint')}</span>
          <span>{t('packageHint')}</span>
        </div>
      </div>
    </aside>
  );
}
