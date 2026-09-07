/**
 * All game-tuning constants live here.
 * If you find yourself writing a magic number anywhere else, add it here.
 */

// --- Stats ------------------------------------------------------------------
export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STAT_INITIAL: {
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
} = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  cleanliness: 100,
  health: 100,
};

// --- Real-time decay (per hour) --------------------------------------------
export const DECAY_PER_HOUR = {
  hunger: 8,
  happiness: 6,
  energy: 5,
  cleanliness: 4,
} as const;

/** Health drains when other stats are neglected. Per hour. */
export const HEALTH_DRAIN_PER_HOUR_WHEN_NEGLECTED = 3;
/** Stats below this count as "neglected" for health purposes. */
export const NEGLECTED_THRESHOLD = 25;

// --- Action effects --------------------------------------------------------
export const ACTION_EFFECTS = {
  feed: {
    hunger: 35,
    happiness: 2,
    cleanliness: -2,
    energy: 0,
    health: 4,
  },
  play: {
    hunger: -10,
    happiness: 30,
    energy: -15,
    cleanliness: -5,
    health: 2,
  },
  clean: {
    hunger: 0,
    happiness: 4,
    energy: 0,
    cleanliness: 60,
    health: 3,
  },
  sleep: {
    hunger: -4,
    happiness: 0,
    energy: 50,
    cleanliness: 0,
    health: 6,
  },
} as const;

// --- Sleep ------------------------------------------------------------------
export const SLEEP_RECOVERY_PER_HOUR = 40;

// --- Growth -----------------------------------------------------------------
/** Care-points awarded per action. Used to track growthProgress. */
export const GROWTH_CARE_PER_ACTION = {
  feed: 0.08,
  play: 0.05,
  clean: 0.05,
  sleep: 0.04,
} as const;
/** Thresholds (cumulative care-points) for advancing growth stages. */
export const GROWTH_THRESHOLDS = {
  baby: 0,
  child: 1.0,
  teen: 3.0,
  adult: 6.0,
} as const;

// --- Mood thresholds --------------------------------------------------------
export const MOOD_THRESHOLDS = {
  sleepingEnergyBelow: 20,
  hungryHungerBelow: 30,
  tiredEnergyBelow: 30,
  sadHappinessBelow: 25,
  wellCaredHappinessAbove: 80,
  wellCaredHungerAbove: 60,
} as const;

// --- Persistence ------------------------------------------------------------
export const STORAGE_KEY = 'bitbuddy:pet:v1';
export const AUTOSAVE_INTERVAL_MS = 5000;
/** Game tick — drives real-time decay while the app is open. */
export const TICK_INTERVAL_MS = 1000;

// --- Behavior (UI-driven, but timing constants live here) ------------------
/** ms between wander decisions while in idle. */
export const WANDER_DECISION_MIN_MS = 2500;
export const WANDER_DECISION_MAX_MS = 6000;
/** How long the pet rests at an anchor before picking the next one. */
export const WANDER_REST_MIN_MS = 1500;
export const WANDER_REST_MAX_MS = 4000;
/** ms the action overlay animation lasts (eating, playing). */
export const ACTION_OVERLAY_MS = 2400;
/** ms the reaction bubble shows. */
export const REACTION_BUBBLE_MS = 1800;

// --- Room layout (anchor positions in % of viewport) -----------------------
import type { WanderAnchor } from './types';

export const ROOM_ANCHORS: readonly WanderAnchor[] = [
  { id: 'bed', x: 18, y: 64, label: 'Bed' },
  { id: 'bowl', x: 78, y: 70, label: 'Bowl' },
  { id: 'toy', x: 50, y: 36, label: 'Toy' },
  { id: 'window', x: 18, y: 28, label: 'Window' },
  { id: 'plant', x: 82, y: 32, label: 'Plant' },
  { id: 'center', x: 50, y: 60, label: 'Center' },
] as const;

// --- Pet pixel-art sizing --------------------------------------------------
export const PET_CELL_SIZE_DESKTOP = 18; // px per cell when 16x16 grid
export const PET_CELL_SIZE_MOBILE = 12;
