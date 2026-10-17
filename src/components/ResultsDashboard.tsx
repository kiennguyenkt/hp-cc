import type { CalculatorConfig, CalculatorResult } from '../domain/types';
import { HP_PER_BOTTLE } from '../domain/bottleResources';
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
  const fillTimeFormula = `${t('roundDown')}: (${t('recoveryLimit')} − ${t('hpBackup')}) ÷ (${t('hpRecoveryRate')} × 60)\n⌊(${format(parseNumericDraft(config.recoveryLimit))} − ${format(parseNumericDraft(config.hpBackup))}) ÷ (${format(config.recoveryRate)} × 60)⌋ = ${format(result.hoursToFill)} ${t('hours')}`;
  const dischargeTimeFormula = `${t('timeLeft')} − ${t('fillTime')} + 2 ${t('hours')}\n${format(result.hoursRemaining)} − ${format(result.hoursToFill)} + 2 = ${format(result.dischargeHours)} ${t('hours')}`;
  const dischargeHpFormula = `${t('dischargeTime')} × 60 × ${t('hpRecoveryRate')}\n${format(result.dischargeHours)} ${t('hours')} × 60 ${t('minutes')}/${t('hours')} × ${format(config.recoveryRate)} HP/${t('minutes')} = ${format(result.dischargeHp)} HP`;
  const packageBottlesPerDay = config.buyPackage249 ? 210 : 10;
  const bottlesFormula = `${format(parseNumericDraft(config.currentBottles))} + ${format(result.daysRemaining)} × ${format(result.dailyBottles)} (Daily) + ${format(result.daysRemaining)} × ${format(packageBottlesPerDay)} (249/free) = ${format(result.totalBottles)} ${t('bottles')}`;
  const bottleHpFormula = `${format(result.totalBottles)} ${t('bottles')} × ${format(HP_PER_BOTTLE)} HP = ${format(result.totalBottleHp)} HP`;
  const currentBottles = parseNumericDraft(config.currentBottles);
  // The comparison baseline always includes both purchases, regardless of the selected toggles.
  const fullBottleHp = currentBottles === null || result.daysRemaining === null
    ? null
    : (currentBottles + result.daysRemaining * (60 + 90 * 5 + 210)) * HP_PER_BOTTLE;
  const extraBottlesFormula = `+${format(result.extraMaxHp)} HP (${format(result.extraMaxBottles)} ${t('bottles')})`;
  const scenarioFormula = (key: typeof scenarioKeys[number]) => {
    const total = `${format(result.scenarios[key].current)} HP`;
    if (key === 'both') {
      const terms = [
        parseNumericDraft(config.currentMerit),
        parseNumericDraft(config.currentHp),
        parseNumericDraft(config.hpBackup),
        fullBottleHp,
        result.resetHp,
        result.recoveryHp,
      ];
      return `${t('scenarioTotalFormula')}\n${terms.map(format).join(' + ')} = ${total}`;
    }
    const deductions = [];
    if (key === 'noPackage' || key === 'neither') {
      deductions.push(`200 × ${format(result.daysRemaining)} × ${format(HP_PER_BOTTLE)}`);
    }
    if (key === 'noDaily' || key === 'neither') {
      deductions.push(`90 × 5 × ${format(result.daysRemaining)} × ${format(HP_PER_BOTTLE)}`);
    }
    return `${format(result.scenarios.both.current)} − ${deductions.join(' − ')} = ${total}`;
  };

  return (
    <div className="results-stack">
      <section className="summary-card card">
        <div className="section-heading section-heading--light"><h2>{t('projectedTitle')}</h2><span className="section-index">02</span></div>
        <details className="calculation-details result-accordion">
          <summary className="accordion-heading"><h3>{t('details')}</h3></summary>
          <div className="detail-list">
            <div><span>{t('projectedBottles')} <InfoTip label={bottlesFormula} /></span><strong>{format(result.totalBottles)}</strong></div>
            <div><span>{t('bottleHp')} <InfoTip label={bottleHpFormula} /></span><strong>{format(result.totalBottleHp)}</strong></div>
            <div><span>{t('hpReset')} <InfoTip label={resetFormula} /></span><strong>{format(result.resetHp)}</strong></div>
            <div><span>{t('hpRecovered')} <InfoTip label={recoveryFormula} /></span><strong>{format(result.recoveryHp)}</strong></div>
          </div>
        </details>
        <div className="projection-grid">
          <div className="projection">
            <span>{t('currentLevel')}</span><strong>{format(result.projectedCurrent)}</strong><small>HP</small>
          </div>
          <div className="projection">
            <span>{t('guildMax')} <InfoTip label={t('maxTip')} /></span><strong>{format(result.projectedMax)}</strong><small>HP</small>
          </div>
        </div>
        <div className="timing-grid">
          <div><span>{t('fillTime')} <InfoTip label={fillTimeFormula} /></span><strong>{format(result.hoursToFill)} <small>{t('hours')}</small></strong></div>
          <div className="timing-accent"><span>{t('dischargeTime')} <InfoTip label={dischargeTimeFormula} /></span><strong>{format(result.dischargeHours)} <small>{t('hours')}</small></strong></div>
          <div><span>{t('dischargeHp')} <InfoTip label={dischargeHpFormula} /></span><strong>{format(result.dischargeHp)} <small>HP</small></strong></div>
        </div>
      </section>

      <details className="card comparison-card result-accordion">
        <summary className="accordion-heading section-heading">
          <h2>{t('comparisons')}</h2><span className="section-index">03</span>
        </summary>
        <div className="comparison-content">
          <div className="comparison-heading"><span aria-hidden="true" /><span>{t('currentLevel')}</span><span>{t('guildMax')} <InfoTip label={extraBottlesFormula} /></span></div>
          <div className="comparison-table">
            {scenarioKeys.map((key) => (
              <div className={key === selectedScenario ? 'comparison-row is-current' : 'comparison-row'} key={key}>
                <span>{t(key)} <InfoTip label={scenarioFormula(key)} /> {key === selectedScenario && <em>{t('currentScenario')}</em>}</span>
                <strong><small className="mobile-label">{t('currentLevel')}</small>{format(result.scenarios[key].current)}</strong>
                <strong><small className="mobile-label">{t('guildMax')}</small>{format(result.scenarios[key].max)}</strong>
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
