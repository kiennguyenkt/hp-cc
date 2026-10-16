import type { CalculatorConfig, CalculatorResult } from '../domain/types';
import { HP_PER_BOTTLE } from '../domain/rules';
import { parseNumericDraft } from '../domain/validation';
import type { TranslationKey } from '../i18n';
import { InfoTip } from './InfoTip';

interface ResultsProps {
  result: CalculatorResult;
  config: CalculatorConfig;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

const scenarioKeys = ['both', 'noPackage', 'noDaily', 'neither'] as const;

export function ResultsDashboard({ result, config, format, t }: ResultsProps) {
  const selectedScenario = config.buyPackage249
    ? (config.buyDailyDiamonds ? 'both' : 'noDaily')
    : (config.buyDailyDiamonds ? 'noPackage' : 'neither');
  const recoveryFormula = `${format(result.hoursRemaining)} ${t('hours')} × 60 ${t('minutes')}/${t('hours')} × ${format(config.recoveryRate)} HP/${t('minutes')} = ${format(result.recoveryHp)} HP`;
  const resetFormula = `${format(result.daysRemaining)} ${t('days')} × ${format(parseNumericDraft(config.maxHpReset))} HP/${t('days')} = ${format(result.resetHp)} HP`;
  const packageBottlesPerDay = config.buyPackage249 ? 210 : 10;
  const bottlesFormula = `${format(parseNumericDraft(config.currentBottles))} + ${format(result.daysRemaining)} × ${format(result.dailyBottles)} (Daily) + ${format(result.daysRemaining)} × ${format(packageBottlesPerDay)} (249/free) = ${format(result.totalBottles)} ${t('bottles')}`;
  const bottleHpFormula = `${format(result.totalBottles)} ${t('bottles')} × ${format(HP_PER_BOTTLE)} HP = ${format(result.totalBottleHp)} HP`;

  return (
    <div className="results-stack">
      <section className="card details-card">
        <div className="section-heading"><h2>{t('details')}</h2><span className="section-index">02</span></div>
        <div className="detail-list">
          <div><span>{t('hpRecovered')} <InfoTip label={recoveryFormula} /></span><strong>{format(result.recoveryHp)}</strong></div>
          <div><span>{t('hpReset')} <InfoTip label={resetFormula} /></span><strong>{format(result.resetHp)}</strong></div>
          <div><span>{t('bottlesToEnd')} <InfoTip label={bottlesFormula} /></span><strong>{format(result.totalBottles)}</strong></div>
          <div><span>{t('bottleHp')} <InfoTip label={bottleHpFormula} /></span><strong>{format(result.totalBottleHp)}</strong></div>
        </div>

        <div className="comparison-heading"><h3>{t('comparisons')}</h3><span>{t('currentLevel')}</span><span>{t('guildMax')}</span></div>
        <div className="comparison-table">
          {scenarioKeys.map((key) => (
            <div className={key === selectedScenario ? 'comparison-row is-current' : 'comparison-row'} key={key}>
              <span>{t(key)} {key === selectedScenario && <em>{t('currentScenario')}</em>}</span>
              <strong><small className="mobile-label">{t('currentLevel')}</small>{format(result.scenarios[key].current)}</strong>
              <strong><small className="mobile-label">{t('guildMax')}</small>{format(result.scenarios[key].max)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="summary-card card">
        <div className="section-heading section-heading--light"><h2>{t('projectedTitle')}</h2><span className="section-index">03</span></div>
        <div className="projection-grid">
          <div className="projection projection--primary">
            <span>{t('currentLevel')}</span><strong>{format(result.projectedCurrent)}</strong><small>HP</small>
          </div>
          <div className="projection">
            <span>{t('guildMax')} <InfoTip label={t('maxTip')} /></span><strong>{format(result.projectedMax)}</strong><small>HP</small>
          </div>
        </div>
        <div className="timing-grid">
          <div><span>{t('fillTime')}</span><strong>{format(result.hoursToFill)} <small>{t('hours')}</small></strong></div>
          <div className="timing-accent"><span>{t('dischargeTime')}</span><strong>{format(result.dischargeHours)} <small>{t('hours')}</small></strong></div>
          <div><span>{t('dischargeHp')}</span><strong>{format(result.dischargeHp)} <small>HP</small></strong></div>
        </div>
      </section>

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
