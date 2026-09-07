import type { PetState, PetType, NewPetInput } from '../types';
import { STAT_INITIAL } from '../constants';
import { now as clockNow } from '../../../lib/time';

/** Pure-ish factory. Creates a brand-new baby PetState. */
export function createPet(type: PetType, name: string): PetState {
  const t = clockNow();
  const input: NewPetInput = { type, name };
  return {
    id: makeId(),
    type: input.type,
    name: input.name.trim(),
    growthStage: 'baby',
    growthProgress: 0,
    hunger: STAT_INITIAL.hunger,
    happiness: STAT_INITIAL.happiness,
    energy: STAT_INITIAL.energy,
    cleanliness: STAT_INITIAL.cleanliness,
    health: STAT_INITIAL.health,
    createdAt: t,
    lastActiveAt: t,
    forcedSleep: false,
  };
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `pet-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
