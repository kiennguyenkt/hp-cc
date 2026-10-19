import type { CalculatorConfig, CalculatorResult } from '../../domain/types';
import { EventEstimation } from './EventEstimation';
import { TargetProgress } from './TargetProgress';
import styles from './ResultsDashboard.module.css';

interface ResultsProps {
  config: CalculatorConfig;
  result: CalculatorResult;
}

export function ResultsDashboard({ config, result }: ResultsProps) {
  return (
    <div className={styles.resultsStack}>
      <EventEstimation result={result} />
      <TargetProgress config={config} result={result} />
    </div>
  );
}
