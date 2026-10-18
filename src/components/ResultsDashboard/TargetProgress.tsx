import type { CalculatorResult } from '../../domain/types';
import type { TranslationKey } from '../../i18n';

interface TargetProgressProps {
  result: CalculatorResult;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

export function TargetProgress({ result, format, t }: TargetProgressProps) {
  return (
    <section className="card targets-card">
      <div className="section-heading"><h2>{t('targets')}</h2><span className="section-index">04</span></div>
      <div className="target-grid">
        {(['3500000', '5000000'] as const).map((target) => (
          <article className="target-block" key={target}>
            <div className="target-title"><span>{t('target')}</span><strong>{target === '3500000' ? '3.5M' : '5M'}</strong></div>
            <div className="target-columns">
              {(['current', 'max'] as const).map((level) => (
                <div key={level}>
                  <h3>{level === 'current' ? t('currentLevel') : t('guildMax')}</h3>
                  <p><span>{t('missingHp')}</span><strong>{format(result.targets[target][level].hp)}</strong></p>
                  <p><span>{t('missingBottles')}</span><strong>{format(result.targets[target][level].bottles)}</strong></p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
