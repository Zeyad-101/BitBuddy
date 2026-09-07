import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { PetContext, type PetAction } from './PetContext';
import type { PetState } from '../types';
import {
  applyElapsedTime,
  cleanPet,
  feedPet,
  playWithPet,
  startSleeping,
  calculateGrowth,
} from '../simulation';
import { createPetRepository } from '../persistence';
import {
  AUTOSAVE_INTERVAL_MS,
  TICK_INTERVAL_MS,
} from '../constants';
import { now as clockNow } from '../../../lib/time';

function reducer(state: PetState | null, action: PetAction): PetState | null {
  switch (action.type) {
    case 'HYDRATE':
      return action.pet;
    case 'CLEAR':
      return null;
    case 'TICK': {
      if (!state) return state;
      return applyElapsedTime(state, action.now);
    }
    case 'FEED': {
      if (!state) return state;
      const fed = feedPet(state, action.now);
      return { ...fed, growthStage: calculateGrowth(fed) };
    }
    case 'PLAY': {
      if (!state) return state;
      const played = playWithPet(state, action.now);
      return { ...played, growthStage: calculateGrowth(played) };
    }
    case 'CLEAN': {
      if (!state) return state;
      const cleaned = cleanPet(state, action.now);
      return { ...cleaned, growthStage: calculateGrowth(cleaned) };
    }
    case 'SLEEP': {
      if (!state) return state;
      const slept = startSleeping(state, action.now);
      return { ...slept, growthStage: calculateGrowth(slept) };
    }
    default:
      return state;
  }
}

interface PetProviderProps {
  children: ReactNode;
}

export function PetProvider({ children }: PetProviderProps) {
  const [pet, dispatch] = useReducer(reducer, null);
  const [isHydrated, setIsHydrated] = useState(false);
  const repoRef = useRef(createPetRepository());

  // Hydrate on mount.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await repoRef.current.load();
        if (cancelled) return;
        if (loaded) {
          const fresh = applyElapsedTime(loaded, clockNow());
          dispatch({ type: 'HYDRATE', pet: fresh });
          void repoRef.current.save(fresh);
        }
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Real-time tick — drives decay while the tab is open.
  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', now: clockNow() });
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  // Save whenever pet state updates or delete when cleared.
  useEffect(() => {
    if (!isHydrated) return;
    if (pet) {
      void repoRef.current.save(pet);
    } else {
      void repoRef.current.delete('');
    }
  }, [pet, isHydrated]);

  // Periodic autosave fallback.
  useEffect(() => {
    if (!pet || !isHydrated) return;
    const id = window.setInterval(() => {
      void repoRef.current.save(pet);
    }, AUTOSAVE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [pet, isHydrated]);

  return (
    <PetContext.Provider value={{ pet, isHydrated, dispatch }}>
      {children}
    </PetContext.Provider>
  );
}
