import type { CalculatorResult } from '../../domain/types';
import type { TranslationKey } from '../../i18n';
import { EventEstimation } from './EventEstimation';
import { TargetProgress } from './TargetProgress';
import styles from './ResultsDashboard.module.css';

interface ResultsProps {
  result: CalculatorResult;
  format: (value: number | null) => string;
  t: (key: TranslationKey) => string;
}

export function ResultsDashboard({ result, format, t }: ResultsProps) {
  return (
    <div className={styles.resultsStack}>
      <EventEstimation result={result} format={format} t={t} />
      <TargetProgress result={result} format={format} t={t} />
    </div>
  );
}
