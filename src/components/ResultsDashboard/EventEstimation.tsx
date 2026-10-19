import type { ReactNode } from 'react';
import type { CalculatorResult } from '../../domain/types';
import type { TranslationKey } from '../../i18n';
import { InfoTip } from '../InfoTip';
import { ScenarioComparison } from './ScenarioComparison';

interface EventEstimationProps {
  result: CalculatorResult;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

export function EventEstimation({ result, format, t }: EventEstimationProps) {
  const formulaFormat = { formatNumber: format, label: t };
  // Âm nghĩa là không cần xả nữa — hiển thị 0, đơn vị với giá trị âm (in nghiêng, bỏ đậm) xếp hết vào ngoặc.
  const formatDischarge = (value: number | null, unit: string): ReactNode =>
    value !== null && value < 0
      ? <>{format(0)} <em>({format(value)} {unit})</em></>
      : <>{format(value)} <small>{unit}</small></>;

  return (
    <section className="summary-card card">
      <div className="section-heading section-heading--light"><h2>{t('projectedTitle')}</h2><span className="section-index">02</span></div>
      <details className="calculation-details result-accordion">
        <summary className="accordion-heading"><h3>{t('details')}</h3></summary>
        <div className="detail-list">
          <div><span>{t('projectedBottles')} <InfoTip label={result.totalBottles.formatFormula(formulaFormat)} /></span><strong>{format(result.totalBottles.value)}</strong></div>
          <div><span>{t('bottleHp')} <InfoTip label={result.totalBottleHp.formatFormula(formulaFormat)} /></span><strong>{format(result.totalBottleHp.value)}</strong></div>
          <div><span>{t('hpReset')} <InfoTip label={result.resetHp.formatFormula(formulaFormat)} /></span><strong>{format(result.resetHp.value)}</strong></div>
          <div><span>{t('hpRecovered')} <InfoTip label={result.recoveryHp.formatFormula(formulaFormat)} /></span><strong>{format(result.recoveryHp.value)}</strong></div>
        </div>
      </details>
      <div className="projection-grid">
        <div className="projection">
          <span>{t('currentLevel')}</span><strong>{format(result.projectedCurrent.value)}</strong><small>HP</small>
        </div>
        <div className="projection">
          <span>{t('guildMax')} <InfoTip label={t('maxTip')} /></span><strong>{format(result.projectedMax.value)}</strong><small>HP</small>
        </div>
      </div>
      <ScenarioComparison result={result} format={format} t={t} />
      <div className="timing-grid">
        <div><span>{t('fillTime')} <InfoTip label={result.hoursToFill.formatFormula(formulaFormat)} /></span><strong>{format(result.hoursToFill.value)} <small>{t('hours')}</small></strong></div>
        <div className="timing-accent"><span>{t('dischargeTime')} <InfoTip label={result.dischargeHours.formatFormula(formulaFormat)} /></span><strong>{formatDischarge(result.dischargeHours.value, t('hours'))}</strong></div>
        <div><span>{t('dischargeHp')} <InfoTip label={result.dischargeHp.formatFormula(formulaFormat)} /></span><strong>{formatDischarge(result.dischargeHp.value, 'HP')}</strong></div>
      </div>
    </section>
  );
}
