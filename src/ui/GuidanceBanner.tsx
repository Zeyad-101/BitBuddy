import styles from './GuidanceBanner.module.css';

interface GuidanceBannerProps {
  message: string;
  isPositive?: boolean;
}

export function GuidanceBanner({ message, isPositive = false }: GuidanceBannerProps) {
  return (
    <div
      className={styles.banner}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        {isPositive ? '★' : '👉'}
      </span>
      <span className={styles.text}>{message}</span>
    </div>
  );
}
