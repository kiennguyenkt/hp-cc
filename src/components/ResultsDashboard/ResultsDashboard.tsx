import { EventEstimation } from './EventEstimation';
import { TargetProgress } from './TargetProgress';
import styles from './ResultsDashboard.module.css';

export function ResultsDashboard() {
  return (
    <div className={styles.resultsStack}>
      <EventEstimation />
      <TargetProgress />
    </div>
  );
}
