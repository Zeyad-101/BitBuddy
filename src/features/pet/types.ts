/**
 * Central PetState — the only source of truth for one pet.
 * The simulation engine reads/writes this. The UI never holds the rules.
 */

export type PetType = 'cat' | 'dog' | 'hamster' | 'bird';

export type GrowthStage = 'baby' | 'child' | 'teen' | 'adult';

export type Mood =
  | 'happy'
  | 'hungry'
  | 'tired'
  | 'sad'
  | 'sleeping'
  | 'well-cared-for';

/** Transient action overlay; not stored in PetState. */
export type ActionOverlay = 'none' | 'eating' | 'playing' | 'cleaning' | 'sleeping-action';

/** What the player can ask the pet to do. */
export type PetAction = 'feed' | 'play' | 'clean' | 'sleep';

export type StatKey = 'hunger' | 'happiness' | 'energy' | 'cleanliness' | 'health';

export interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
}

export interface PetState extends PetStats {
  id: string;
  type: PetType;
  name: string;
  growthStage: GrowthStage;
  /** 0..1 progress to next growth stage. */
  growthProgress: number;
  createdAt: number;
  lastActiveAt: number;
  /**
   * True while the player has commanded the pet to sleep.
   * Pins the pet to the bed, keeps the mood as 'sleeping' even
   * as energy recovers, and lets the special sleep recovery apply.
   * Cleared automatically once energy has been restored.
   */
  forcedSleep: boolean;
}

/** Pet with no id yet — used during creation. */
export interface NewPetInput {
  type: PetType;
  name: string;
}

/**
 * Named anchor points in the room where the pet can wander to or interact with.
 * Coordinates are percentages of the room viewport (0..100 on each axis).
 * UI is responsible for mapping them to actual pixel positions.
 */
export type WanderAnchorId = 'bed' | 'bowl' | 'toy' | 'window' | 'center' | 'plant';

export interface WanderAnchor {
  id: WanderAnchorId;
  x: number; // 0..100
  y: number; // 0..100
  label: string;
}

export type BehaviorState = 'idle' | 'walking' | 'reacting' | 'eating' | 'playing';

