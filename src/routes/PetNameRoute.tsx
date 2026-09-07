import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PixelPet } from '../ui/PixelPet';
import { createPet } from '../features/pet/state/createPet';
import { usePet } from '../features/pet/state/usePet';
import type { PetType } from '../features/pet/types';
import { playSfx } from '../audio/sfx';
import styles from './PetNameRoute.module.css';

const ALLOWED_TYPES: PetType[] = ['cat', 'dog', 'hamster', 'bird'];

const SUGGESTIONS: Record<PetType, string[]> = {
  cat: ['Milo', 'Luna', 'Mochi', 'Cleo', 'Oliver'],
  dog: ['Barnaby', 'Rusty', 'Pip', 'Daisy', 'Buster'],
  hamster: ['Peanut', 'Boba', 'Pebble', 'Nugget', 'Mimi'],
  bird: ['Kiwi', 'Sunny', 'Chirpy', 'Ziggy', 'Rio'],
};

export function PetNameRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setPet } = usePet();

  const typeParam = searchParams.get('type');
  const type: PetType | null = useMemo(
    () => (typeParam && ALLOWED_TYPES.includes(typeParam as PetType) ? (typeParam as PetType) : null),
    [typeParam],
  );

  const [name, setName] = useState('');
  const trimmed = name.trim();
  const canSubmit = Boolean(type) && trimmed.length > 0 && trimmed.length <= 16;

  if (!type) {
    return (
      <main className={styles.route}>
        <div className={styles.container}>
          <h1 className={styles.title}>Pick a Pet First</h1>
          <p className={styles.subtitle}>Head back and choose who you'd like to take home.</p>
          <button
            type="button"
            className={styles['submit-button']}
            onClick={() => navigate('/select')}
          >
            ← Choose Pet
          </button>
        </div>
      </main>
    );
  }

  const handleChipClick = (suggested: string) => {
    playSfx('click');
    setName(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Flag that this is the first entry into the room so MeetBuddy sequence fires
    try {
      localStorage.setItem('bitbuddy:intro_pending', 'true');
    } catch {
      // Ignore localStorage issues
    }

    const newPet = createPet(type, trimmed);
    setPet(newPet);
    playSfx('happy');
    navigate('/room');
  };

  const displayName = trimmed || 'Buddy';
  const suggestions = SUGGESTIONS[type];

  return (
    <main className={styles.route}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles['step-badge']}>Step 2 of 2</span>
          <h1 className={styles.title}>What will you name your buddy?</h1>
          <p className={styles.subtitle}>Give your new companion a name</p>
        </header>

        {/* Live Preview with Nameplate */}
        <div className={styles['preview-stage']} aria-label={`Preview of ${displayName}`}>
          <div className={styles['pet-wrapper']}>
            <PixelPet type={type} mood="happy" cellSize={9} />
          </div>
          <div className={styles.nameplate}>
            <span className={styles['nameplate-star']} aria-hidden="true">★</span>
            <span>{displayName}</span>
            <span className={styles['nameplate-star']} aria-hidden="true">★</span>
          </div>
        </div>

        {/* Name Entry Form */}
        <form className={styles['name-form']} onSubmit={handleSubmit}>
          <div className={styles['input-wrapper']}>
            <input
              className={styles['name-input']}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Milo"
              maxLength={16}
              aria-label="Pet name"
              autoFocus
            />
            <span className={styles['char-count']} aria-hidden="true">
              {trimmed.length}/16
            </span>
          </div>

          {/* Quick Suggestion Chips */}
          <div className={styles['suggestions-group']}>
            <span className={styles['suggestions-label']}>Ideas:</span>
            <div className={styles.chips}>
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  className={styles.chip}
                  onClick={() => handleChipClick(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles['submit-button']}
              disabled={!canSubmit}
              aria-label={`Confirm name and meet ${displayName}`}
            >
              <span>Meet {displayName}</span>
              <span aria-hidden="true">▶</span>
            </button>

            <button
              type="button"
              className={styles['back-link']}
              onClick={() => navigate('/select')}
            >
              ← Change Buddy
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
