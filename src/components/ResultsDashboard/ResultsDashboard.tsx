import type { CalculatorResult } from '../../domain/types';
import { EventEstimation } from './EventEstimation';
import { TargetProgress } from './TargetProgress';
import styles from './ResultsDashboard.module.css';

interface ResultsProps {
  result: CalculatorResult;
}

export function ResultsDashboard({ result }: ResultsProps) {
  return (
    <div className={styles.resultsStack}>
      <EventEstimation result={result} />
      <TargetProgress result={result} />
    </div>
  );
}
