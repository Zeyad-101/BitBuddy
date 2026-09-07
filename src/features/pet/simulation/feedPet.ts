import type { PetState } from '../types';
import { ACTION_EFFECTS, GROWTH_CARE_PER_ACTION, STAT_MAX, STAT_MIN } from '../constants';

/** Pure: feed the pet. Returns a new PetState. */
export function feedPet(pet: PetState, now: number): PetState {
  return applyEffects(pet, ACTION_EFFECTS.feed, GROWTH_CARE_PER_ACTION.feed, now);
}

function applyEffects(
  pet: PetState,
  effects: typeof ACTION_EFFECTS[keyof typeof ACTION_EFFECTS],
  care: number,
  now: number,
): PetState {
  return {
    ...pet,
    hunger: clamp(pet.hunger + effects.hunger),
    happiness: clamp(pet.happiness + effects.happiness),
    energy: clamp(pet.energy + effects.energy),
    cleanliness: clamp(pet.cleanliness + effects.cleanliness),
    health: clamp(pet.health + effects.health),
    growthProgress: Math.min(1, pet.growthProgress + care),
    lastActiveAt: now,
  };
}

function clamp(v: number): number {
  if (v < STAT_MIN) return STAT_MIN;
  if (v > STAT_MAX) return STAT_MAX;
  return v;
}
