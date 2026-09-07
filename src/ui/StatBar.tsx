import styles from './StatBar.module.css';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  max?: number;
}

export function StatBar({ label, value, color, max = 100 }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={styles['stat-bar']}>
      <span className={styles.label}>{label}</span>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className={styles.value}>{Math.round(value)}</span>
    </div>
  );
}
