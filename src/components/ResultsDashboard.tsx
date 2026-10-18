import type { CalculatorResult } from '../domain/types';
import type { TranslationKey } from '../i18n';
import { InfoTip } from './InfoTip';

interface ResultsProps {
  result: CalculatorResult;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

const scenarioKeys = ['both', 'noPackage', 'noDaily', 'neither'] as const;

export function ResultsDashboard({ result, format, t }: ResultsProps) {
  const formulaFormat = { formatNumber: format, label: t };
  const selectedScenario = result.selectedScenario;

  return (
    <div className="results-stack">
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
        <div className="timing-grid">
          <div><span>{t('fillTime')} <InfoTip label={result.hoursToFill.formatFormula(formulaFormat)} /></span><strong>{format(result.hoursToFill.value)} <small>{t('hours')}</small></strong></div>
          <div className="timing-accent"><span>{t('dischargeTime')} <InfoTip label={result.dischargeHours.formatFormula(formulaFormat)} /></span><strong>{format(result.dischargeHours.value)} <small>{t('hours')}</small></strong></div>
          <div><span>{t('dischargeHp')} <InfoTip label={result.dischargeHp.formatFormula(formulaFormat)} /></span><strong>{format(result.dischargeHp.value)} <small>HP</small></strong></div>
        </div>
      </section>

      <details className="card comparison-card result-accordion">
        <summary className="accordion-heading section-heading">
          <h2>{t('comparisons')}</h2><span className="section-index">03</span>
        </summary>
        <div className="comparison-content">
          <div className="comparison-heading"><span aria-hidden="true" /><span>{t('currentLevel')}</span><span>{t('guildMax')} <InfoTip label={result.extraMaxHp.formatFormula(formulaFormat)} /></span></div>
          <div className="comparison-table">
            {scenarioKeys.map((key) => (
              <div className={key === selectedScenario ? 'comparison-row is-current' : 'comparison-row'} key={key}>
                <span>{t(key)} <InfoTip label={result.scenarios[key].current.formatFormula(formulaFormat)} /> {key === selectedScenario && <em>{t('currentScenario')}</em>}</span>
                <strong><small className="mobile-label">{t('currentLevel')}</small>{format(result.scenarios[key].current.value)}</strong>
                <strong><small className="mobile-label">{t('guildMax')}</small>{format(result.scenarios[key].max.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      </details>

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

    </div>
  );
}
