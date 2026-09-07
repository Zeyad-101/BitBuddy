import { memo, type CSSProperties, type ReactNode } from 'react';

import { Bed, Bowl, Toy, Window, Plant, Clock, Picture, Rug } from './Furniture';
import furnitureStyles from './Furniture.module.css';
import { ROOM_ANCHORS } from '../features/pet/constants';
import type { Mood, WanderAnchorId } from '../features/pet/types';
import type { TimeOfDay } from '../features/pet/simulation/timeOfDay';
import { getRoomTint } from '../features/pet/simulation/timeOfDay';
import styles from './RoomScene.module.css';

interface RoomSceneProps {
  /** Where the pet is currently standing. */
  petAnchor: WanderAnchorId;
  /** Pet pixel-cell size. Used for sizing the slot container. */
  petCellSize: number;
  /** Pet mood — used for visual filter hints. */
  mood: Mood;
  /** CSS transition-duration for the walk, set as a CSS var. */
  walkDurationMs: number;
  /** Reaction bubble text above the pet. */
  reactionText?: string | null;
  /** Current time-of-day phase — drives room tint and window art. */
  phase?: TimeOfDay;
  children?: ReactNode;

  /** Interactive secret props & callbacks */
  onClockClick?: () => void;
  onWindowClick?: () => void;
  onPlantClick?: () => void;
  onBedClick?: () => void;
  onBowlClick?: () => void;
  onPictureClick?: () => void;
  onToyClick?: () => void;

  pictureVariant?: number;
  windowVisitor?: 'ufo' | 'pigeon' | 'star' | null;
  isClockRinging?: boolean;
  isPlantWiggling?: boolean;
  isBedFluffing?: boolean;
  isBowlRinging?: boolean;
  poopNode?: ReactNode;
}

interface InteractiveRoomDecorProps {
  phase: TimeOfDay;
  onClockClick?: () => void;
  onWindowClick?: () => void;
  onPlantClick?: () => void;
  onBedClick?: () => void;
  onBowlClick?: () => void;
  onPictureClick?: () => void;
  onToyClick?: () => void;
  pictureVariant?: number;
  windowVisitor?: 'ufo' | 'pigeon' | 'star' | null;
  isClockRinging?: boolean;
  isPlantWiggling?: boolean;
  isBedFluffing?: boolean;
  isBowlRinging?: boolean;
}

const InteractiveRoomDecor = memo(function InteractiveRoomDecor({
  phase,
  onClockClick,
  onWindowClick,
  onPlantClick,
  onBedClick,
  onBowlClick,
  onPictureClick,
  onToyClick,
  pictureVariant = 0,
  windowVisitor = null,
  isClockRinging = false,
  isPlantWiggling = false,
  isBedFluffing = false,
  isBowlRinging = false,
}: InteractiveRoomDecorProps) {
  return (
    <>
      {/* Decor (wall items) — behind furniture */}
      <div className={`${styles.layer} ${styles['decor-layer']}`}>
        {/* Window with outside visitors */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', left: '12%', top: '14%', width: '90px' }}
          onClick={onWindowClick}
          role="button"
          tabIndex={0}
          aria-label="Room window. Click to look outside!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onWindowClick?.();
            }
          }}
        >
          <div className={styles['window-wrapper']}>
            <Window phase={phase} />
            {windowVisitor === 'ufo' && (
              <span className={`${styles['window-visitor']} ${styles['visitor-ufo']}`} aria-hidden="true">
                🛸
              </span>
            )}
            {windowVisitor === 'pigeon' && (
              <span className={`${styles['window-visitor']} ${styles['visitor-pigeon']}`} aria-hidden="true">
                🐦
              </span>
            )}
            {windowVisitor === 'star' && (
              <span className={`${styles['window-visitor']} ${styles['visitor-star']}`} aria-hidden="true">
                ⭐
              </span>
            )}
          </div>
        </div>

        {/* House Plant */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', right: '8%', top: '22%', width: '72px' }}
          onClick={onPlantClick}
          role="button"
          tabIndex={0}
          aria-label="House plant. Click to inspect!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPlantClick?.();
            }
          }}
        >
          <Plant className={isPlantWiggling ? furnitureStyles['plant-wiggle'] : undefined} />
          {isPlantWiggling && (
            <span className={styles['falling-leaf']} aria-hidden="true">
              🍃
            </span>
          )}
        </div>

        {/* Clock */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', right: '18%', top: '8%', width: '60px' }}
          onClick={onClockClick}
          role="button"
          tabIndex={0}
          aria-label="Cuckoo clock. Click to dance!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClockClick?.();
            }
          }}
        >
          <Clock className={isClockRinging ? furnitureStyles['clock-ring'] : undefined} />
        </div>

        {/* Picture Frame */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', left: '54%', top: '10%', width: '80px' }}
          onClick={onPictureClick}
          role="button"
          tabIndex={0}
          aria-label="Art frame. Click to switch paintings!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPictureClick?.();
            }
          }}
        >
          <Picture
            variant={pictureVariant}
            className={pictureVariant % 2 === 1 ? furnitureStyles['picture-tilt'] : undefined}
          />
        </div>

        {/* Rug */}
        <div style={{ position: 'absolute', left: '32%', bottom: '4%', width: '160px', opacity: 0.6 }}>
          <Rug />
        </div>
      </div>

      {/* Furniture (bed, bowl, toy) */}
      <div className={`${styles.layer} ${styles['furniture-layer']}`}>
        {/* Bed */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', left: '8%', bottom: '20%', width: '120px' }}
          onClick={onBedClick}
          role="button"
          tabIndex={0}
          aria-label="Bed. Click to fluff!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onBedClick?.();
            }
          }}
        >
          <Bed className={isBedFluffing ? furnitureStyles['bed-fluff'] : undefined} />
          {isBedFluffing && (
            <span className={styles['feather-puff']} aria-hidden="true">
              🪶
            </span>
          )}
        </div>

        {/* Bowl */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', left: '70%', bottom: '22%', width: '80px' }}
          onClick={onBowlClick}
          role="button"
          tabIndex={0}
          aria-label="Food bowl. Click to ring dinner bell!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onBowlClick?.();
            }
          }}
        >
          <Bowl className={isBowlRinging ? furnitureStyles['bowl-ding'] : undefined} />
        </div>

        {/* Toy */}
        <div
          className={`${styles['interactive-item']} ${furnitureStyles['interactive-decor']}`}
          style={{ position: 'absolute', left: '44%', top: '38%', width: '64px' }}
          onClick={onToyClick}
          role="button"
          tabIndex={0}
          aria-label="Floor toy. Click to toss!"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToyClick?.();
            }
          }}
        >
          <Toy />
        </div>
      </div>
    </>
  );
});

export function RoomScene({
  petAnchor,
  petCellSize,
  mood,
  walkDurationMs,
  reactionText,
  phase = 'day',
  children,
  onClockClick,
  onWindowClick,
  onPlantClick,
  onBedClick,
  onBowlClick,
  onPictureClick,
  onToyClick,
  pictureVariant,
  windowVisitor,
  isClockRinging,
  isPlantWiggling,
  isBedFluffing,
  isBowlRinging,
  poopNode,
}: RoomSceneProps) {
  const anchor = ROOM_ANCHORS.find((a) => a.id === petAnchor) ?? ROOM_ANCHORS[5]!;
  const tint = getRoomTint(phase);

  // Anchor (x,y) is in 0..100 % of the room.
  // The pet slot sits at (x, y) bottom-centered; pet sprite cellSize determines visual offset.
  const petSlotStyle = {
    ['--pet-x' as string]: `${anchor.x}%`,
    ['--pet-y' as string]: `${anchor.y}%`,
    ['--walk-duration' as string]: `${walkDurationMs}ms`,
    width: `${petCellSize * 14}px`,
    height: `${petCellSize * 16}px`,
  } as CSSProperties;

  const roomStyle = {
    ['--phase-wall' as string]: tint.wallpaperOverlay,
    ['--phase-floor' as string]: tint.floorTint,
    ['--phase-glow' as string]: tint.glow,
  } as CSSProperties;

  return (
    <div
      className={styles.room}
      data-time-of-day={phase}
      style={roomStyle}
      aria-label={`BitBuddy room, ${phase}`}
    >
      <InteractiveRoomDecor
        phase={phase}
        onClockClick={onClockClick}
        onWindowClick={onWindowClick}
        onPlantClick={onPlantClick}
        onBedClick={onBedClick}
        onBowlClick={onBowlClick}
        onPictureClick={onPictureClick}
        onToyClick={onToyClick}
        pictureVariant={pictureVariant}
        windowVisitor={windowVisitor}
        isClockRinging={isClockRinging}
        isPlantWiggling={isPlantWiggling}
        isBedFluffing={isBedFluffing}
        isBowlRinging={isBowlRinging}
      />

      {/* Room Mess / Poop */}
      {poopNode}

      {/* Pet on top */}
      <div className={`${styles.layer} ${styles['pet-layer']}`}>
        <div className={styles['pet-slot']} style={petSlotStyle} data-mood={mood}>
          <div className={styles['pet-shadow']} aria-hidden="true" />
          {children}
          {reactionText ? (
            <div className={styles['reaction-bubble']} aria-live="polite">
              {reactionText}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

