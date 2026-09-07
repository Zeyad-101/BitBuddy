import { memo, useEffect } from 'react';
import type { PetState } from '../features/pet/types';
import styles from './PetDiaryModal.module.css';

interface PetDiaryModalProps {
  pet: PetState;
  onClose: () => void;
}

interface DiaryEntry {
  id: string;
  tag: string;
  moodEmoji: string;
  timestamp: string;
  text: string;
  authorNote: string;
}

export const PetDiaryModal = memo(function PetDiaryModal({ pet, onClose }: PetDiaryModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const daysOld = Math.max(1, Math.floor((Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24)) + 1);

  // Species-specific signature sticker & flavor
  const sticker =
    pet.type === 'cat' ? '🐾' :
    pet.type === 'dog' ? '🦴' :
    pet.type === 'hamster' ? '🌻' : '🪶';

  const speciesEntry: DiaryEntry =
    pet.type === 'cat'
      ? {
          id: 'species-quirk',
          tag: 'RULES OF ENGAGEMENT',
          moodEmoji: '😼',
          timestamp: '3:15 AM',
          text: `Demanded belly rubs. Human gave exactly 3 rubs. Perfect. Human attempted a 4th rub. Immediate soft claw retribution. Boundaries must be respected in this household.`,
          authorNote: '— Signed with a paw stamp',
        }
      : pet.type === 'dog'
      ? {
          id: 'species-quirk',
          tag: 'CRITICAL MISSION',
          moodEmoji: '🐶',
          timestamp: '11:42 AM',
          text: `THE BALL BOUNCED! I CHASED THE BALL! HUMAN PICKED IT UP! WHY TAKE IT? WAIT... THEY THREW IT AGAIN! OH BOY OH BOY OH BOY BEST DAY EVER!`,
          authorNote: '— Written while aggressively wagging',
        }
      : pet.type === 'hamster'
      ? {
          id: 'species-quirk',
          tag: 'TACTICAL INVENTORY',
          moodEmoji: '🐹',
          timestamp: '2:30 AM',
          text: `Successfully cached 4 seeds, a dried blueberry, and an entire square inch of napkin fluff inside my left cheek pouch. Human suspects nothing. The stash grows.`,
          authorNote: '— Stored securely in cheeks',
        }
      : {
          id: 'species-quirk',
          tag: 'AERIAL DOMINANCE',
          moodEmoji: '🐦',
          timestamp: '8:00 AM',
          text: `Calculated orbital trajectory to land directly onto human's keyboard during important task. Hit Enter 14 times. They called it modern poetry. Naturally.`,
          authorNote: '— Pecked with beak',
        };

  const entries: DiaryEntry[] = [
    {
      id: 'entry-1',
      tag: 'FIRST IMPRESSIONS',
      moodEmoji: '📦',
      timestamp: 'Day 1',
      text: `A giant pair of hands arrived from above and bestowed the name "${pet.name}" upon me. There is a food bowl and a bed. I shall graciously allow them to serve me.`,
      authorNote: '— First royal decree',
    },
    speciesEntry,
    {
      id: 'entry-3',
      tag: 'CULINARY CRITIQUE',
      moodEmoji: '🍲',
      timestamp: 'Yesterday',
      text: `Discovered a vintage mystery crumb under the rug edge. Aged to perfection. Subtle notes of carpet fiber and pure bliss. 10/10, would scavenge again.`,
      authorNote: '— Michelin Star review',
    },
    {
      id: 'entry-4',
      tag: 'MONSTER REPORT',
      moodEmoji: '🚨',
      timestamp: 'Recently',
      text: `THE ROARING SUCTION TUBE OF DOOM (the vacuum) made an appearance today. I bravely maintained high tactical ground until the beast retreated back to the closet. You're welcome.`,
      authorNote: '— Guard duty log',
    },
    {
      id: 'entry-5',
      tag: 'NAPLYMPICS RECORD',
      moodEmoji: '💤',
      timestamp: 'Today',
      text: `Planned nap schedule: 16 hours. Actual sleep achieved: 19.5 hours. Fluffed the pillow with precision. Next goal: uninterrupted slumber straight into next week.`,
      authorNote: '— Certified sleepyhead',
    },
  ];

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="diary-modal-title"
    >
      <div className={styles.notebook} onClick={(e) => e.stopPropagation()}>
        {/* Retro spiral rings */}
        <div className={styles.spine}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={styles.ring} />
          ))}
        </div>

        {/* Notebook header */}
        <div className={styles.header}>
          <div className={styles['title-group']}>
            <span className={styles.sticker} aria-hidden="true">
              {sticker}
            </span>
            <div>
              <h2 id="diary-modal-title" className={styles.title}>
                {pet.name}'s Secret Diary
              </h2>
              <p className={styles.subtitle}>Confidential thoughts & observations</p>
            </div>
          </div>
          <button
            type="button"
            className={styles['close-btn']}
            onClick={onClose}
            aria-label="Close diary"
          >
            ✕ Close
          </button>
        </div>

        {/* Notebook pages */}
        <div className={styles.content}>
          {entries.map((entry) => (
            <article key={entry.id} className={styles['entry-card']}>
              <div className={styles['entry-header']}>
                <span className={styles['entry-tag']}>{entry.tag}</span>
                <span className={styles['entry-mood']} aria-hidden="true">
                  {entry.moodEmoji} <small>{entry.timestamp}</small>
                </span>
              </div>
              <p className={styles['entry-text']}>"{entry.text}"</p>
              <div className={styles['entry-footer']}>{entry.authorNote}</div>
            </article>
          ))}

          {/* Bottom stats stamp */}
          <div className={styles['stats-stamp']}>
            <div className={styles['stamp-item']}>
              <span>COMPANION AGE</span>
              <span className={styles['stamp-val']}>{daysOld} Day{daysOld > 1 ? 's' : ''}</span>
            </div>
            <div className={styles['stamp-item']}>
              <span>STAGE</span>
              <span className={styles['stamp-val']}>{pet.growthStage.toUpperCase()}</span>
            </div>
            <div className={styles['stamp-item']}>
              <span>SMILE RATING</span>
              <span className={styles['stamp-val']}>{pet.happiness}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
