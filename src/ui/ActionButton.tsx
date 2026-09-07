import type { MouseEvent } from 'react';
import styles from './ActionButton.module.css';

export type ActionVariant = 'feed' | 'play' | 'clean' | 'sleep';

interface ActionButtonProps {
  variant: ActionVariant;
  label: string;
  icon: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionButton({ variant, label, icon, onClick, disabled }: ActionButtonProps) {
  const handleClick = (_e: MouseEvent<HTMLButtonElement>) => {
    onClick();
  };
  return (
    <button
      type="button"
      className={`pixel-btn ${styles['action-btn']}`}
      data-variant={variant}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
