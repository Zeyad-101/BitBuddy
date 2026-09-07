import { useMemo, useState, useCallback } from 'react';
import type { ActionOverlay, Mood, PetType } from '../features/pet/types';
import { getPetSpriteSet, getFrame, getPetRasterUrl } from '../features/pet/assets/sprites';
import { moodToSpriteMood } from '../features/pet/simulation';
import { PixelMotif } from './PixelMotif';
import styles from './PixelPet.module.css';

interface PixelPetProps {
  type: PetType;
  mood: Mood;
  overlay?: ActionOverlay;
  happiness?: number;
  /** px per cell. 14×14 grid renders as cellSize × 14. */
  cellSize?: number;
  /** Legacy alias for `cellSize`. Kept for back-compat with existing call sites. */
  size?: number;
  /** Optional click-to-pet handler */
  onPet?: () => void;
  /** Disco dance trigger */
  isDancing?: boolean;
}

/**
 * Renders a pet sprite using high-resolution cel-shaded art when available,
 * with fallbacks to the classic pixel-matrix grid.
 *
 * Structure: outer `.pixel-pet` carries type-based idle animation
 * (cat tail-flick, dog wag, hamster hop, bird tilt). Inner `.pixel-pet__raster-wrap`
 * or `.pixel-pet__grid` carries mood + action animation. The two compound so the pet feels alive
 * AND mood-reactive.
 */
export function PixelPet({
  type,
  mood,
  overlay = 'none',
  happiness,
  cellSize,
  size,
  onPet,
  isDancing = false,
}: PixelPetProps) {
  const [isPetting, setIsPetting] = useState(false);
  const effectiveCellSize = cellSize ?? size ?? 12;
  const set = getPetSpriteSet(type);
  const frameKey = useMemo(() => {
    if (overlay === 'eating') return 'eating';
    if (overlay === 'playing') return 'playing';
    return (mood ? moodToSpriteMood(mood) : null) ?? 'happy';
  }, [mood, overlay]);
  const frame = useMemo(() => getFrame(set, frameKey), [set, frameKey]);

  const rasterUrl = useMemo(() => {
    return getPetRasterUrl(type, frameKey);
  }, [type, frameKey]);

  // Mood-reactive tail/ear speed: high happiness = faster wag, low happiness = slow droop
  const idleSpeed = useMemo(() => {
    if (happiness === undefined) return 1;
    if (happiness >= 75) return 0.75;
    if (happiness <= 35) return 1.5;
    return 1;
  }, [happiness]);

  const cellStyle = {
    ['--cell-size' as string]: `${effectiveCellSize}px`,
    ['--idle-speed' as string]: `${idleSpeed}`,
  } as React.CSSProperties;

  const handlePetClick = useCallback(() => {
    if (!onPet) return;
    setIsPetting(true);
    onPet();
    window.setTimeout(() => setIsPetting(false), 400);
  }, [onPet]);

  return (
    <div
      className={`${styles['pixel-pet']} pixelated`}
      data-type={type}
      data-mood={mood}
      data-overlay={overlay}
      data-interactive={Boolean(onPet)}
      data-petting={isPetting}
      data-dancing={isDancing}
      onClick={onPet ? handlePetClick : undefined}
      onKeyDown={
        onPet
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePetClick();
              }
            }
          : undefined
      }
      tabIndex={onPet ? 0 : undefined}
      style={cellStyle}
      aria-label={`${type} pet, ${mood}${overlay !== 'none' ? `, ${overlay}` : ''}${onPet ? '. Click to pet!' : ''}`}
      role={onPet ? 'button' : 'img'}
    >
      {/* Floating tickle heart feedback */}
      {isPetting && (
        <span className={styles['pet-tickle-heart']} aria-hidden="true">
          💖
        </span>
      )}
      {/* Species toy prop during Play action */}
      {overlay === 'playing' && (
        <div className={styles['playing-toy']} aria-hidden="true">
          <PixelMotif type={type} size={Math.round(effectiveCellSize * 2.2)} />
        </div>
      )}

      {/* Sparkle shine sweep during Clean action */}
      {overlay === 'cleaning' && (
        <div className={styles['clean-shine']} aria-hidden="true" />
      )}

      {/* Floating ZZZ during Sleep */}
      {(mood === 'sleeping' || overlay === 'sleeping-action') && (
        <div className={styles['sleep-zzz']} aria-hidden="true">
          <span className={styles['z-1']}>z</span>
          <span className={styles['z-2']}>Z</span>
          <span className={styles['z-3']}>Z</span>
        </div>
      )}

      {rasterUrl && (
        <div
          className={styles['pixel-pet__raster-wrap']}
          data-mood={mood}
          data-overlay={overlay}
        >
          <img
            src={rasterUrl}
            alt=""
            className={styles['raster-sprite']}
            draggable={false}
          />
        </div>
      )}
      <div
        className={`${styles['pixel-pet__grid']} ${rasterUrl ? styles['pixel-pet__grid--hidden'] : ''}`}
        data-mood={mood}
        data-overlay={overlay}
      >
        {frame.map((row, y) =>
          row.split('').map((ch, x) => (
            <div
              key={`${x}-${y}`}
              className={styles.cell}
              style={{ backgroundColor: set.palette[ch] ?? 'transparent' }}
            />
          )),
        )}
      </div>
    </div>
  );
}


