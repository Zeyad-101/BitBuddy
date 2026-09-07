import type { ReactNode } from 'react';

interface RetroButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export function RetroButton({
  children,
  onClick,
  disabled,
  type = 'button',
  ariaLabel,
}: RetroButtonProps) {
  return (
    <button
      type={type}
      className="pixel-btn"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
