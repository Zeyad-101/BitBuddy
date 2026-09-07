import { createContext, type Dispatch } from 'react';
import type { PetState } from '../types';

export type PetAction =
  | { type: 'HYDRATE'; pet: PetState }
  | { type: 'CLEAR' }
  | { type: 'TICK'; now: number }
  | { type: 'FEED'; now: number }
  | { type: 'PLAY'; now: number }
  | { type: 'CLEAN'; now: number }
  | { type: 'SLEEP'; now: number };

export interface PetContextValue {
  pet: PetState | null;
  isHydrated: boolean;
  dispatch: Dispatch<PetAction>;
}

export const PetContext = createContext<PetContextValue | null>(null);
