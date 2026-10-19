import type { CalculatorResult } from '../../domain/types';
import { useFormat, useTranslation } from '../../hooks/LocaleContext';
import { InfoTip } from '../InfoTip';
import { cx } from '../../shared/cx';
import shared from '../shared.module.css';
import styles from './ScenarioComparison.module.css';

interface ScenarioComparisonProps {
  result: CalculatorResult;
}

const scenarioKeys = ['both', 'noPackage', 'noDaily', 'neither'] as const;

export function ScenarioComparison({ result }: ScenarioComparisonProps) {
  const t = useTranslation();
  const format = useFormat();
  const formulaFormat = { formatNumber: format, label: t };
  const selectedScenario = result.selectedScenario;

  return (
    <details className={cx(styles.comparisonDetails, shared.resultAccordion)}>
      <summary className={shared.accordionHeading}>
        <h3>{t('comparisons')}</h3>
      </summary>
      <div className={styles.comparisonContent}>
        <div className={styles.comparisonHeading}>
          <span aria-hidden="true" />
          <span>{t('currentLevel')}</span>
          <span>
            {t('guildMax')}{' '}
            <InfoTip label={result.extraMaxHp.formatFormula(formulaFormat)} />
          </span>
        </div>
        <div className={styles.comparisonTable}>
          {scenarioKeys.map((key) => (
            <div
              className={cx(
                styles.comparisonRow,
                key === selectedScenario && styles.isCurrent,
              )}
              key={key}
            >
              <span>
                {t(key)}{' '}
                <InfoTip
                  label={result.scenarios[key].current.formatFormula(
                    formulaFormat,
                  )}
                />{' '}
                {key === selectedScenario && <em>{t('currentScenario')}</em>}
              </span>
              <strong>
                <small className={styles.mobileLabel}>
                  {t('currentLevel')}
                </small>
                {format(result.scenarios[key].current.value)}
              </strong>
              <strong>
                <small className={styles.mobileLabel}>{t('guildMax')}</small>
                {format(result.scenarios[key].max.value)}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
