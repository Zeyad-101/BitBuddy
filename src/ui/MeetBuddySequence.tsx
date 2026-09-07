import { useEffect } from 'react';
import type { PetState } from '../features/pet/types';
import { PixelPet } from './PixelPet';
import styles from './MeetBuddySequence.module.css';

interface MeetBuddySequenceProps {
  pet: PetState;
  onComplete: () => void;
}

export function MeetBuddySequence({ pet, onComplete }: MeetBuddySequenceProps) {
  useEffect(() => {
    // Auto-advance after 3.2 seconds
    const timer = window.setTimeout(() => {
      onComplete();
    }, 3200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Meet ${pet.name}`}
      onClick={onComplete}
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <span className={styles.badge}>Welcome Home</span>
        <h2 className={styles.title}>Meet {pet.name}!</h2>

        <div className={styles['pet-preview']}>
          <PixelPet type={pet.type} mood="well-cared-for" cellSize={8} />
        </div>

        <p className={styles.message}>"You're my new best friend."</p>

        <button
          type="button"
          className={styles['skip-btn']}
          onClick={onComplete}
          aria-label="Skip welcome sequence and start playing"
          autoFocus
        >
          Start Playing [Esc]
        </button>
      </div>
    </div>
  );
}
