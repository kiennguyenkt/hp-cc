import type { CalculatorResult } from '../../domain/types';
import type { TranslationKey } from '../../i18n';
import { EventEstimation } from './EventEstimation';
import { ScenarioComparison } from './ScenarioComparison';
import { TargetProgress } from './TargetProgress';

interface ResultsProps {
  result: CalculatorResult;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

export function ResultsDashboard({ result, format, t }: ResultsProps) {
  return (
    <div className="results-stack">
      <EventEstimation result={result} format={format} t={t} />
      <ScenarioComparison result={result} format={format} t={t} />
      <TargetProgress result={result} format={format} t={t} />
    </div>
  );
}
