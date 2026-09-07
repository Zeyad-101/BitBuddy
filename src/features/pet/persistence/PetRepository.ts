import type { PetState } from '../types';

/**
 * Persistence interface. BitBuddy is local-only — the only
 * implementation is LocalStoragePetRepository — but the UI/state
 * code talks to this interface so storage can be swapped.
 */
export interface PetRepository {
  load(): Promise<PetState | null>;
  save(pet: PetState): Promise<void>;
  delete(petId: string): Promise<void>;
}
