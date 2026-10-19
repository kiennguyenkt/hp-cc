import type { ReactNode } from 'react';
import type { CalculatorResult } from '../../domain/types';
import { useFormat, useTranslation } from '../../hooks/LocaleContext';
import { InfoTip } from '../InfoTip';
import { ScenarioComparison } from './ScenarioComparison';
import { cx } from '../../shared/cx';
import shared from '../shared.module.css';
import styles from './EventEstimation.module.css';

interface EventEstimationProps {
  result: CalculatorResult;
}

export function EventEstimation({ result }: EventEstimationProps) {
  const t = useTranslation();
  const format = useFormat();
  const formulaFormat = { formatNumber: format, label: t };
  // Âm nghĩa là không cần xả nữa — hiển thị 0, đơn vị với giá trị âm (in nghiêng, bỏ đậm) xếp hết vào ngoặc.
  const formatDischarge = (value: number | null, unit: string): ReactNode =>
    value !== null && value < 0 ? (
      <>
        {format(0)}{' '}
        <em>
          ({format(value)} {unit})
        </em>
      </>
    ) : (
      <>
        {format(value)} <small>{unit}</small>
      </>
    );

  return (
    <section className={cx(shared.card, styles.summaryCard)}>
      <div className={cx(shared.sectionHeading, shared.sectionHeadingLight)}>
        <h2>{t('projectedTitle')}</h2>
        <span className={shared.sectionIndex}>02</span>
      </div>
      <details
        className={cx(styles.calculationDetails, shared.resultAccordion)}
      >
        <summary className={shared.accordionHeading}>
          <h3>{t('details')}</h3>
        </summary>
        <div className={styles.detailList}>
          <div>
            <span>
              {t('projectedBottles')}{' '}
              <InfoTip
                label={result.totalBottles.formatFormula(formulaFormat)}
              />
            </span>
            <strong>{format(result.totalBottles.value)}</strong>
          </div>
          <div>
            <span>
              {t('bottleHp')}{' '}
              <InfoTip
                label={result.totalBottleHp.formatFormula(formulaFormat)}
              />
            </span>
            <strong>{format(result.totalBottleHp.value)}</strong>
          </div>
          <div>
            <span>
              {t('hpReset')}{' '}
              <InfoTip label={result.resetHp.formatFormula(formulaFormat)} />
            </span>
            <strong>{format(result.resetHp.value)}</strong>
          </div>
          <div>
            <span>
              {t('hpRecovered')}{' '}
              <InfoTip label={result.recoveryHp.formatFormula(formulaFormat)} />
            </span>
            <strong>{format(result.recoveryHp.value)}</strong>
          </div>
        </div>
      </details>
      <div className={styles.projectionGrid}>
        <div className={styles.projection}>
          <span>{t('currentLevel')}</span>
          <strong>{format(result.projectedCurrent.value)}</strong>
          <small>HP</small>
        </div>
        <div className={styles.projection}>
          <span>
            {t('guildMax')} <InfoTip label={t('maxTip')} />
          </span>
          <strong>{format(result.projectedMax.value)}</strong>
          <small>HP</small>
        </div>
      </div>
      <ScenarioComparison result={result} />
      <div className={styles.timingGrid}>
        <div>
          <span>
            {t('fillTime')}{' '}
            <InfoTip label={result.hoursToFill.formatFormula(formulaFormat)} />
          </span>
          <strong>
            {format(result.hoursToFill.value)} <small>{t('hours')}</small>
          </strong>
        </div>
        <div>
          <span>
            {t('dischargeTime')}{' '}
            <InfoTip
              label={result.dischargeHours.formatFormula(formulaFormat)}
            />
          </span>
          <strong>
            {formatDischarge(result.dischargeHours.value, t('hours'))}
          </strong>
        </div>
        <div className={styles.timingAccent}>
          <span>
            {t('dischargeHp')}{' '}
            <InfoTip label={result.dischargeHp.formatFormula(formulaFormat)} />
          </span>
          <strong>{formatDischarge(result.dischargeHp.value, 'HP')}</strong>
        </div>
      </div>
    </section>
  );
}
