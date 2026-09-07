import type { Mood, PetType, WanderAnchorId } from '../types';

/**
 * Pure functions that derive behavior from mood/state.
 * The UI consumes these to pick animations, speeds, texts.
 * No DOM, no React — testable in isolation.
 */

export type SpriteMood =
  | 'idle'
  | 'happy'
  | 'hungry'
  | 'sad'
  | 'tired'
  | 'sleeping'
  | 'eating'
  | 'playing'
  | 'well-cared-for';

/** Map a high-level mood to a sprite-mood frame. */
export function moodToSpriteMood(mood: Mood): SpriteMood {
  switch (mood) {
    case 'sleeping':
      return 'sleeping';
    case 'hungry':
      return 'hungry';
    case 'tired':
      return 'tired';
    case 'sad':
      return 'sad';
    case 'well-cared-for':
      return 'well-cared-for';
    case 'happy':
      return 'happy';
  }
}

/** ms the pet takes to walk between two anchors. Mood-modulated. */
export function getWalkDurationMs(mood: Mood): number {
  switch (mood) {
    case 'sleeping':
      return 99999; // effectively doesn't walk
    case 'sad':
      return 3600;
    case 'tired':
      return 3200;
    case 'hungry':
      return 3000;
    case 'happy':
      return 2200;
    case 'well-cared-for':
      return 1800;
  }
}

/** Probability [0..1] that an idle pet picks a new anchor on each decision tick. */
export function getWanderChance(mood: Mood): number {
  switch (mood) {
    case 'sleeping':
      return 0;
    case 'sad':
      return 0.15;
    case 'tired':
      return 0.25;
    case 'hungry':
      return 0.4;
    case 'happy':
      return 0.7;
    case 'well-cared-for':
      return 0.9;
  }
}

/** ms the pet rests at an anchor. */
export function getRestDurationMs(mood: Mood): number {
  switch (mood) {
    case 'sleeping':
      return 99999;
    case 'sad':
      return 4500;
    case 'tired':
      return 3500;
    case 'hungry':
      return 2200;
    case 'happy':
      return 1800;
    case 'well-cared-for':
      return 1400;
  }
}

/**
 * When sleeping, pin the pet to a specific anchor (the bed).
 * Returns null when not sleeping — pet is free to wander.
 */
export function getSleepingAnchor(mood: Mood): WanderAnchorId | null {
  return mood === 'sleeping' ? 'bed' : null;
}

/** Per-action reaction library: species-aware, expressive, and short. */
export function getActionReaction(action: 'feed' | 'play' | 'clean' | 'sleep', type: PetType): string {
  const reactions: Record<'feed' | 'play' | 'clean' | 'sleep', Record<PetType, string>> = {
    feed: {
      cat: 'purr purr...',
      dog: 'yum!!',
      hamster: 'munch munch',
      bird: 'tweet!',
    },
    play: {
      cat: '*pounce*',
      dog: 'wag wag!',
      hamster: '*zoom*',
      bird: 'chirp!',
    },
    clean: {
      cat: '*clean*',
      dog: 'splash!',
      hamster: '*squeak*',
      bird: 'preen',
    },
    sleep: {
      cat: 'zzz...',
      dog: 'woof...',
      hamster: '...',
      bird: '*quiet*',
    },
  };
  return reactions[action][type];
}

/** A short reaction bubble string the pet shows above its head. */
export function getReactionText(
  mood: Mood,
  type: PetType,
  lastAction: 'feed' | 'play' | 'clean' | 'sleep' | null,
): string {
  // Action-driven reactions take priority.
  if (lastAction) {
    return getActionReaction(lastAction, type);
  }
  return moodReactions(mood);
}

function moodReactions(mood: Mood): string {
  switch (mood) {
    case 'sleeping':
      return 'zzz...';
    case 'hungry':
      return "I'm hungry...";
    case 'tired':
      return 'so sleepy...';
    case 'sad':
      return ':(';
    case 'well-cared-for':
      return '!';
    case 'happy':
      return '*squee*';
  }
}

/**
 * Pick a wander anchor that's NOT the current one.
 * Sleeping pets stay at the bed; everyone else wanders freely.
 */
export function pickNextAnchor(
  current: WanderAnchorId | null,
  anchors: readonly { id: WanderAnchorId }[],
  random: () => number = Math.random,
): WanderAnchorId {
  const candidates = current === null ? anchors : anchors.filter((a) => a.id !== current);
  const list = candidates.length > 0 ? candidates : anchors;
  const idx = Math.floor(random() * list.length);
  const choice = list[idx];
  // Defensive: idx is always valid because we computed it from list.length.
  if (!choice) return 'center';
  return choice.id;
}

/** Should the pet currently appear animated (vs frozen)? */
export function isPetAnimated(mood: Mood, overlay: 'none' | 'eating' | 'playing' | 'cleaning' | 'sleeping-action'): boolean {
  if (overlay === 'eating' || overlay === 'playing') return true;
  return mood !== 'sleeping';
}

/**
 * Probability [0..1] the pet yawns on a given decision tick.
 * Low when rested, rises sharply when energy is low.
 */
export function getYawnChance(energy: number): number {
  if (energy >= 70) return 0;
  if (energy >= 50) return 0.05;
  if (energy >= 30) return 0.18;
  if (energy >= 15) return 0.35;
  return 0.5;
}

/**
 * 0..1 — how much the pet prefers the bed over other anchors when
 * choosing a wander destination. 0 = no preference, 1 = always bed.
 *
 * At full energy the pet doesn't really care. As energy drains it
 * gravitates toward the bed until eventually auto-sleeping.
 */
export function getBedAffinity(energy: number): number {
  if (energy >= 70) return 0;
  if (energy >= 50) return 0.2;
  if (energy >= 30) return 0.5;
  if (energy >= 15) return 0.75;
  return 0.9;
}

/** A short "yawn" string the pet shows when very tired. */
export function getYawnText(petType: PetType): string {
  switch (petType) {
    case 'cat': return '*yawn*';
    case 'dog': return '*yawn*';
    case 'hamster': return '*squeak*';
    case 'bird': return '*tweet*';
  }
}
