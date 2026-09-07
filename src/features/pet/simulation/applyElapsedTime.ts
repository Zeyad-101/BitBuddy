import type { PetState } from '../types';
import {
  DECAY_PER_HOUR,
  HEALTH_DRAIN_PER_HOUR_WHEN_NEGLECTED,
  NEGLECTED_THRESHOLD,
  SLEEP_RECOVERY_PER_HOUR,
  STAT_MAX,
  STAT_MIN,
} from '../constants';
import { maybeWakeUp } from './startSleeping';

/**
 * Pure function. Apply real-world elapsed time to a PetState.
 * No mutation; returns a new PetState.
 */
export function applyElapsedTime(
  pet: PetState,
  now: number,
): PetState {
  const elapsedMs = Math.max(0, now - pet.lastActiveAt);
  if (elapsedMs === 0) return pet;
  const hours = elapsedMs / (1000 * 60 * 60);

  // Sleeping (player-initiated or auto): energy recovers, hunger decays
  // slower, no happiness/cleanliness decay.
  if (pet.forcedSleep || isAutoSleeping(pet)) {
    const energy = clamp(
      pet.energy + SLEEP_RECOVERY_PER_HOUR * hours,
      STAT_MIN,
      STAT_MAX,
    );
    const hunger = clamp(
      pet.hunger + DECAY_PER_HOUR.hunger * 0.25 * hours,
      STAT_MIN,
      STAT_MAX,
    );
    return maybeWakeUp({
      ...pet,
      energy,
      hunger,
      lastActiveAt: now,
    });
  }

  const hunger = clamp(
    pet.hunger - DECAY_PER_HOUR.hunger * hours,
    STAT_MIN,
    STAT_MAX,
  );
  const happiness = clamp(
    pet.happiness - DECAY_PER_HOUR.happiness * hours,
    STAT_MIN,
    STAT_MAX,
  );
  const energy = clamp(
    pet.energy - DECAY_PER_HOUR.energy * hours,
    STAT_MIN,
    STAT_MAX,
  );
  const cleanliness = clamp(
    pet.cleanliness - DECAY_PER_HOUR.cleanliness * hours,
    STAT_MIN,
    STAT_MAX,
  );

  const neglectedCount = [hunger, happiness, cleanliness].filter(
    (v) => v < NEGLECTED_THRESHOLD,
  ).length;
  const healthDrain =
    neglectedCount * HEALTH_DRAIN_PER_HOUR_WHEN_NEGLECTED * hours;
  const health = clamp(pet.health - healthDrain, STAT_MIN, STAT_MAX);

  return {
    ...pet,
    hunger,
    happiness,
    energy,
    cleanliness,
    health,
    lastActiveAt: now,
  };
}

/**
 * Heuristic: a pet is "auto-sleeping" when energy is below the sleep
 * threshold AND its mood has tipped it into sleeping mode without
 * the player commanding it.
 */
function isAutoSleeping(pet: PetState): boolean {
  return pet.energy < 20 && pet.happiness < 50;
}

function clamp(v: number, min: number, max: number): number {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}
