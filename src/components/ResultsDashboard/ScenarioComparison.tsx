import type { CalculatorResult } from '../../domain/types';
import type { TranslationKey } from '../../i18n';
import { InfoTip } from '../InfoTip';

interface ScenarioComparisonProps {
  result: CalculatorResult;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

const scenarioKeys = ['both', 'noPackage', 'noDaily', 'neither'] as const;

export function ScenarioComparison({ result, format, t }: ScenarioComparisonProps) {
  const formulaFormat = { formatNumber: format, label: t };
  const selectedScenario = result.selectedScenario;

  return (
    <details className="comparison-details result-accordion">
      <summary className="accordion-heading">
        <h3>{t('comparisons')}</h3>
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
  );
}
