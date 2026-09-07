import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PixelPet } from '../ui/PixelPet';
import { PixelMotif } from '../ui/PixelMotif';
import type { PetType } from '../features/pet/types';
import { usePet } from '../features/pet/state/usePet';
import { playSfx } from '../audio/sfx';
import styles from './PetSelectRoute.module.css';

interface PetProfile {
  type: PetType;
  slot: string;
  name: string;
  archetype: string;
  tagline: string;
  description: string;
  tags: string[];
  accentVar: string;
}

const PET_PROFILES: Record<PetType, PetProfile> = {
  cat: {
    type: 'cat',
    slot: '01',
    name: 'Cat',
    archetype: 'The Cozy',
    tagline: 'The Cozy Companion',
    description: 'Quiet, observant, and independent. Loves afternoon window naps and batting at stray yarn.',
    tags: ['Calm', 'Independent', 'Nap Lover'],
    accentVar: 'var(--color-pixel-pink)',
  },
  dog: {
    type: 'dog',
    slot: '02',
    name: 'Dog',
    archetype: 'The Scout',
    tagline: 'The Playful Scout',
    description: 'Warm, loyal, and full of energy. Loves fetching toys and greeting you with enthusiastic tail wags.',
    tags: ['Loyal', 'Energetic', 'Playful'],
    accentVar: 'var(--color-pixel-yellow)',
  },
  hamster: {
    type: 'hamster',
    slot: '03',
    name: 'Hamster',
    archetype: 'The Explorer',
    tagline: 'The Tiny Explorer',
    description: 'Tiny, industrious, and endlessly curious. Loves stuffing cheeks with snacks and scurrying around.',
    tags: ['Tiny', 'Curious', 'Snack Fan'],
    accentVar: 'var(--color-pixel-green)',
  },
  bird: {
    type: 'bird',
    slot: '04',
    name: 'Bird',
    archetype: 'The Singer',
    tagline: 'The Cheerful Singer',
    description: 'Bright, cheerful, and musical. Loves chirping sweet morning melodies and hopping around the room.',
    tags: ['Musical', 'Alert', 'Cheerful'],
    accentVar: 'var(--color-pixel-blue)',
  },
};

const PET_TYPES: PetType[] = ['cat', 'dog', 'hamster', 'bird'];

export function PetSelectRoute() {
  const navigate = useNavigate();
  const { pet, isHydrated } = usePet();
  const [selected, setSelected] = useState<PetType>('cat');
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 800,
  );

  // Track viewport width for responsive pet cell size:
  // Desktop (>=960px): cellSize 17 (~238px)
  // Tablet  (>=640px): cellSize 15 (~210px)
  // Mobile  (<640px):  cellSize 13 (~182px)
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Returning players with an existing pet go straight to the room
  useEffect(() => {
    if (isHydrated && pet) {
      navigate('/room', { replace: true });
    }
  }, [isHydrated, pet, navigate]);

  const handleSelect = (type: PetType) => {
    if (type !== selected) {
      playSfx('click');
      setSelected(type);
    }
  };

  const handleConfirm = () => {
    playSfx('click');
    navigate(`/name?type=${selected}`);
  };

  const activeProfile = PET_PROFILES[selected];
  const heroCellSize = viewportWidth >= 960 ? 16 : viewportWidth >= 640 ? 14 : 12;
  const rosterCellSize = viewportWidth >= 640 ? 4 : 3;

  return (
    <main className={styles.route} data-active-pet={selected}>
      {/* Background ambient stars */}
      <div className={styles['stars-bg']} aria-hidden="true" />

      <div className={styles.stage}>
        {/* Game Header */}
        <header className={styles.header}>
          <div className={styles['step-pill']}>
            <span className={styles['step-star']}>★</span>
            <span>STEP 01</span>
            <span className={styles['step-divider']}>:</span>
            <span className={styles['step-label']}>COMPANION SELECTION</span>
            <span className={styles['step-star']}>★</span>
          </div>
          <h1 className={styles.title}>Choose Your Buddy</h1>
          <p className={styles.subtitle}>Pick the little friend you want to take home</p>
        </header>

        {/* Central Companion Showcase */}
        <section
          className={styles.showcase}
          aria-label={`${activeProfile.name} companion showcase`}
          style={{ ['--pet-accent' as string]: activeProfile.accentVar }}
        >
          {/* Decorative pixel-art corner brackets */}
          <div className={`${styles.corner} ${styles['corner-tl']}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles['corner-tr']}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles['corner-bl']}`} aria-hidden="true" />
          <div className={`${styles.corner} ${styles['corner-br']}`} aria-hidden="true" />

          {/* Ambient pixel sparkles */}
          <div className={`${styles.sparkle} ${styles['sparkle-1']}`} aria-hidden="true">
            <PixelMotif type="sparkle" size={14} />
          </div>
          <div className={`${styles.sparkle} ${styles['sparkle-2']}`} aria-hidden="true">
            <PixelMotif type="sparkle" size={12} />
          </div>
          <div className={`${styles.sparkle} ${styles['sparkle-3']}`} aria-hidden="true">
            <PixelMotif type="sparkle" size={10} />
          </div>

          {/* Spotlight Stage */}
          <div className={styles['stage-platform']}>
            {/* Ambient circular spotlight glow */}
            <div className={styles.spotlight} aria-hidden="true" />

            {/* Main Dominant Pet Character */}
            <div className={styles['hero-pet']} key={selected}>
              <PixelPet type={selected} mood="happy" cellSize={heroCellSize} />
            </div>

            {/* Layered Arcade Pedestal */}
            <div className={styles['pedestal-wrap']} aria-hidden="true">
              <div className={styles['pedestal-top']} />
              <div className={styles['pedestal-base']} />
              <div className={styles['floor-shadow']} />
            </div>
          </div>

          {/* Companion Identity & Description */}
          <div className={styles['companion-info']}>
            <div className={styles['archetype-banner']}>
              <span className={styles['archetype-text']}>{activeProfile.tagline}</span>
            </div>

            <div className={styles['name-row']}>
              <div className={styles['motif-icon-wrap']} title={`${activeProfile.name} emblem`} aria-hidden="true">
                <PixelMotif type={selected} size={22} />
              </div>
              <h2 className={styles['hero-name']}>{activeProfile.name}</h2>
              <div className={styles['motif-icon-wrap']} title={`${activeProfile.name} emblem`} aria-hidden="true">
                <PixelMotif type={selected} size={22} />
              </div>
            </div>

            <p className={styles['hero-desc']}>{activeProfile.description}</p>

            {/* Retro Game Trait Chips */}
            <div className={styles.tags} aria-label="Personality traits">
              {activeProfile.tags.map((t) => (
                <span key={t} className={styles.tag}>
                  <span className={styles['tag-diamond']} aria-hidden="true">◆</span>
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Character-Select Roster */}
        <section className={styles['roster-section']} aria-label="Character select roster">
          <div className={styles['roster-header']}>
            <span className={styles['roster-title']}>CHARACTER ROSTER</span>
          </div>

          <div className={styles['selector-grid']} role="radiogroup" aria-label="Choose pet character">
            {PET_TYPES.map((type) => {
              const profile = PET_PROFILES[type];
              const isSelected = selected === type;
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={styles['roster-card']}
                  data-selected={isSelected}
                  data-type={type}
                  onClick={() => handleSelect(type)}
                  style={{ ['--card-accent' as string]: profile.accentVar }}
                >
                  <div className={styles['card-slot']}>
                    <span>{profile.slot}</span>
                    {isSelected && (
                      <span className={styles['active-badge']} aria-hidden="true">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className={styles['card-sprite']}>
                    <PixelPet type={type} mood="happy" cellSize={rosterCellSize} />
                  </div>

                  <div className={styles['card-label-group']}>
                    <span className={styles['card-name']}>{profile.name}</span>
                    <span className={styles['card-archetype']}>{profile.archetype}</span>
                  </div>

                  {isSelected && (
                    <div className={styles['card-pointer']} aria-hidden="true">
                      ▲
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tactile Arcade CTA & Secondary Actions */}
        <footer className={styles.actions}>
          <button
            type="button"
            className={styles['confirm-button']}
            onClick={handleConfirm}
            aria-label={`Adopt ${activeProfile.name} and proceed to naming`}
          >
            <span className={styles['confirm-label']}>CHOOSE {activeProfile.name.toUpperCase()}</span>
            <span className={styles['confirm-arrow']} aria-hidden="true">▶</span>
          </button>

          <button
            type="button"
            className={styles['back-link']}
            onClick={() => navigate('/')}
          >
            ← TITLE SCREEN
          </button>
        </footer>
      </div>
    </main>
  );
}
