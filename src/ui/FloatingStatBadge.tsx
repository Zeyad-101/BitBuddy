import { memo, useEffect, useState } from 'react';
import styles from './FloatingStatBadge.module.css';

export interface FloatingStatItem {
  id: number;
  text: string;
  color: string;
}

interface FloatingStatBadgeProps {
  badge: FloatingStatItem | null;
}

export const FloatingStatBadge = memo(function FloatingStatBadge({ badge }: FloatingStatBadgeProps) {
  const [active, setActive] = useState<FloatingStatItem | null>(null);

  useEffect(() => {
    if (!badge) return;
    setActive(badge);
    const t = window.setTimeout(() => {
      setActive((curr) => (curr?.id === badge.id ? null : curr));
    }, 1100);
    return () => window.clearTimeout(t);
  }, [badge]);

  if (!active) return null;

  return (
    <div
      key={active.id}
      className={styles['floating-badge']}
      style={{ ['--badge-color' as string]: active.color }}
      aria-hidden="true"
    >
      <span className={styles['badge-pill']}>
        <span className={styles['badge-star']}>★</span>
        <span className={styles['badge-text']}>{active.text}</span>
      </span>
    </div>
  );
});
