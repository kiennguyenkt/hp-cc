import type { CalculatorResult } from '../../domain/types';
import { useFormat, useTranslation } from '../../hooks/LocaleContext';
import { cx } from '../../shared/cx';
import shared from '../shared.module.css';
import styles from './TargetProgress.module.css';

interface TargetProgressProps {
  result: CalculatorResult;
}

export function TargetProgress({ result }: TargetProgressProps) {
  const t = useTranslation();
  const format = useFormat();
  return (
    <section className={cx(shared.card, styles.targetsCard)}>
      <div className={shared.sectionHeading}>
        <h2>{t('targets')}</h2>
        <span className={shared.sectionIndex}>03</span>
      </div>
      <div className={styles.targetGrid}>
        {(['3500000', '5000000'] as const).map((target) => (
          <article className={styles.targetBlock} key={target}>
            <div className={styles.targetTitle}>
              <span>{t('target')}</span>
              <strong>{target === '3500000' ? '3.5M' : '5M'}</strong>
            </div>
            <div className={styles.targetColumns}>
              {(['current', 'max'] as const).map((level) => (
                <div key={level}>
                  <h3>
                    {level === 'current' ? t('currentLevel') : t('guildMax')}
                  </h3>
                  <p>
                    <span>{t('missingHp')}</span>
                    <strong>{format(result.targets[target][level].hp)}</strong>
                  </p>
                  <p>
                    <span>{t('missingBottles')}</span>
                    <strong>
                      {format(result.targets[target][level].bottles)}
                    </strong>
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
