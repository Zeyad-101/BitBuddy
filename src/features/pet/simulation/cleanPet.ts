import type { PetState } from '../types';
import { ACTION_EFFECTS, GROWTH_CARE_PER_ACTION, STAT_MAX, STAT_MIN } from '../constants';

/** Pure: clean the pet. Returns a new PetState. */
export function cleanPet(pet: PetState, now: number): PetState {
  const e = ACTION_EFFECTS.clean;
  return {
    ...pet,
    hunger: clamp(pet.hunger + e.hunger),
    happiness: clamp(pet.happiness + e.happiness),
    energy: clamp(pet.energy + e.energy),
    cleanliness: clamp(pet.cleanliness + e.cleanliness),
    health: clamp(pet.health + e.health),
    growthProgress: Math.min(1, pet.growthProgress + GROWTH_CARE_PER_ACTION.clean),
    lastActiveAt: now,
  };
}

function clamp(v: number): number {
  if (v < STAT_MIN) return STAT_MIN;
  if (v > STAT_MAX) return STAT_MAX;
  return v;
}
