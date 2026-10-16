import type { CalculatorConfig, NumericField } from '../domain/types';
import type { TranslationKey } from '../i18n';
import { InfoTip } from './InfoTip';

interface AccountInputsProps {
  config: CalculatorConfig;
  onChange: (field: NumericField, value: string) => void;
  onBlur: (field: NumericField) => void;
  t: (key: TranslationKey) => string;
}

const fields: Array<{ field: NumericField; label: TranslationKey; info?: boolean }> = [
  { field: 'currentMerit', label: 'currentMerit' },
  { field: 'maxHpReset', label: 'maxHpReset' },
  { field: 'currentHp', label: 'currentHp' },
  { field: 'hpBackup', label: 'hpBackup' },
  { field: 'currentBottles', label: 'currentBottles', info: true },
  { field: 'recoveryLimit', label: 'recoveryLimit' },
];

export function AccountInputs({ config, onChange, onBlur, t }: AccountInputsProps) {
  return (
    <section className="card account-card">
      <div className="section-heading"><h2>{t('accountData')}</h2><span className="section-index">01</span></div>
      <div className="account-grid">
        {fields.map(({ field, label, info }) => (
          <label className="field" key={field}>
            <span>{t(label)} {info && <InfoTip label={t('snapshotTip')} />}</span>
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
