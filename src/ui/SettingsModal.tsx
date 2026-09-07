import { useEffect, useRef } from 'react';
import type { PetState } from '../features/pet/types';
import { MuteToggle } from './MuteToggle';
import { playSfx } from '../audio/sfx';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  pet: PetState;
  onClose: () => void;
  onReset: () => void;
}

export function SettingsModal({ pet, onClose, onReset }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleKeepBuddy = () => {
    playSfx('click');
    onClose();
  };

  const handleStartOver = () => {
    playSfx('click');
    onReset();
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="settings-title" className={styles.title}>Settings</h2>
          <button
            type="button"
            className={styles['close-btn']}
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </header>

        {/* Audio Section */}
        <div className={styles.section}>
          <span className={styles['section-title']}>Sound</span>
          <div className={styles.row}>
            <span>Sound Effects</span>
            <MuteToggle />
          </div>
        </div>

        {/* Buddy Profile */}
        <div className={styles.section}>
          <span className={styles['section-title']}>Buddy Profile</span>
          <div className={styles.row}>
            <span>Name & Type</span>
            <span className={styles['info-val']}>{pet.name} ({pet.type})</span>
          </div>
          <div className={styles.row}>
            <span>Growth Stage</span>
            <span className={styles['info-val']}>{pet.growthStage}</span>
          </div>
        </div>

        {/* Safe Reset Section */}
        <div className={styles['danger-zone']}>
          <span className={styles['danger-header']}>Start over?</span>
          <p className={styles['danger-text']}>
            This will permanently remove your current Buddy from this browser.
          </p>
          <div className={styles['btn-group']}>
            <button
              type="button"
              className={styles['keep-btn']}
              onClick={handleKeepBuddy}
              autoFocus
            >
              Keep Buddy
            </button>
            <button
              type="button"
              className={styles['reset-btn']}
              onClick={handleStartOver}
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
