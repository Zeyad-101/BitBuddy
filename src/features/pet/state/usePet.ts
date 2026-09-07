import { useContext } from 'react';
import { PetContext } from './PetContext';
import type { PetState } from '../types';
import { calculateMood } from '../simulation';
import { getTirednessBoost } from '../simulation/timeOfDay';
import { useTimeOfDay } from './useTimeOfDay';
import { now as clockNow } from '../../../lib/time';

export interface UsePetResult {
  pet: PetState | null;
  mood: ReturnType<typeof calculateMood> | null;
  isHydrated: boolean;
  feed: () => void;
  play: () => void;
  clean: () => void;
  sleep: () => void;
  setPet: (pet: PetState) => void;
  clear: () => void;
}

export function usePet(): UsePetResult {
  const ctx = useContext(PetContext);
  if (!ctx) throw new Error('usePet must be used within a PetProvider');

  const { pet, isHydrated, dispatch } = ctx;
  const phase = useTimeOfDay();
  const tirednessBoost = getTirednessBoost(phase);

  return {
    pet,
    mood: pet ? calculateMood(pet, tirednessBoost) : null,
    isHydrated,
    feed: () => dispatch({ type: 'FEED', now: clockNow() }),
    play: () => dispatch({ type: 'PLAY', now: clockNow() }),
    clean: () => dispatch({ type: 'CLEAN', now: clockNow() }),
    sleep: () => dispatch({ type: 'SLEEP', now: clockNow() }),
    setPet: (p: PetState) => dispatch({ type: 'HYDRATE', pet: p }),
    clear: () => dispatch({ type: 'CLEAR' }),
  };
}
