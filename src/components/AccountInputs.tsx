import type { CalculatorConfig, NumericField } from '../domain/types';
import type { TranslationKey } from '../i18n';
import { useTranslation } from '../hooks/LocaleContext';
import { cx } from '../shared/cx';
import shared from './shared.module.css';
import styles from './AccountInputs.module.css';

interface AccountInputsProps {
  config: CalculatorConfig;
  onChange: (field: NumericField, value: string) => void;
  onBlur: (field: NumericField) => void;
}

const fields: Array<{ field: NumericField; label: TranslationKey }> = [
  { field: 'currentMerit', label: 'currentMerit' },
  { field: 'maxHpReset', label: 'maxHpReset' },
  { field: 'currentHp', label: 'currentHp' },
  { field: 'hpBackup', label: 'hpBackup' },
  { field: 'currentBottles', label: 'currentBottles' },
  { field: 'recoveryLimit', label: 'recoveryLimit' },
];

export function AccountInputs({
  config,
  onChange,
  onBlur,
}: AccountInputsProps) {
  const t = useTranslation();
  return (
    <section className={cx(shared.card, styles.accountCard)}>
      <div className={shared.sectionHeading}>
        <h2>{t('accountData')}</h2>
        <span className={shared.sectionIndex}>01</span>
      </div>
      <div className={styles.accountGrid}>
        {fields.map(({ field, label }) => (
          <label className={shared.field} key={field}>
            <span>{t(label)}</span>
            <input
              inputMode="decimal"
              value={config[field] as string}
              onChange={(event) => onChange(field, event.target.value)}
              onBlur={() => onBlur(field)}
              aria-label={t(label)}
              placeholder={t('inputHint')}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
