import type { PetState } from '../types';
import { ACTION_EFFECTS, GROWTH_CARE_PER_ACTION, STAT_MAX, STAT_MIN } from '../constants';

/**
 * Pure: put the pet to sleep (player-initiated).
 * Pins forcedSleep = true so the pet stays in sleeping mood while
 * energy recovers, and the special sleep recovery applies.
 */
export function startSleeping(pet: PetState, now: number): PetState {
  const e = ACTION_EFFECTS.sleep;
  return {
    ...pet,
    hunger: clamp(pet.hunger + e.hunger),
    happiness: clamp(pet.happiness + e.happiness),
    energy: clamp(pet.energy + e.energy),
    cleanliness: clamp(pet.cleanliness + e.cleanliness),
    health: clamp(pet.health + e.health),
    growthProgress: Math.min(1, pet.growthProgress + GROWTH_CARE_PER_ACTION.sleep),
    lastActiveAt: now,
    forcedSleep: true,
  };
}

/** Pure: wake the pet if its energy has recovered past the wake threshold. */
export function maybeWakeUp(pet: PetState, wakeThreshold: number = 80): PetState {
  if (pet.forcedSleep && pet.energy >= wakeThreshold) {
    return { ...pet, forcedSleep: false };
  }
  return pet;
}

function clamp(v: number): number {
  if (v < STAT_MIN) return STAT_MIN;
  if (v > STAT_MAX) return STAT_MAX;
  return v;
}
