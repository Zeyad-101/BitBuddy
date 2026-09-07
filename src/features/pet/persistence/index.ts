import type { PetRepository } from './PetRepository';
import { LocalStoragePetRepository } from './LocalStoragePetRepository';

/**
 * BitBuddy uses a single local repository. Kept behind a factory
 * so storage can be swapped (e.g. for tests) without touching call sites.
 */
export function createPetRepository(): PetRepository {
  return new LocalStoragePetRepository();
}

export { LocalStoragePetRepository };
export type { PetRepository };
