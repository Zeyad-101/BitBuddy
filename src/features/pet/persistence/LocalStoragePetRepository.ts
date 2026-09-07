import type { PetRepository } from './PetRepository';
import type { GrowthStage, PetState, PetType } from '../types';
import { STAT_INITIAL, STORAGE_KEY } from '../constants';

const VALID_TYPES: readonly PetType[] = ['cat', 'dog', 'hamster', 'bird'] as const;
const VALID_STAGES: readonly GrowthStage[] = ['baby', 'child', 'teen', 'adult'] as const;

/**
 * Validates and safely migrates a persisted pet record.
 * Returns null if the record is completely unrecoverable.
 */
export function migrateOrValidatePetState(candidate: unknown): PetState | null {
  if (!candidate || typeof candidate !== 'object') return null;
  const raw = candidate as Record<string, unknown>;

  if (typeof raw.id !== 'string' || !raw.id.trim()) {
    return null;
  }

  // Normalize pet type with safe fallback
  const rawType = typeof raw.type === 'string' ? (raw.type.toLowerCase().trim() as PetType) : 'cat';
  const type: PetType = VALID_TYPES.includes(rawType) ? rawType : 'cat';

  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : 'Buddy';

  // Normalize growth stage
  const rawStage = typeof raw.growthStage === 'string' ? (raw.growthStage.toLowerCase().trim() as GrowthStage) : 'baby';
  const growthStage: GrowthStage = VALID_STAGES.includes(rawStage) ? rawStage : 'baby';

  const now = Date.now();
  const createdAt = typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : now;
  const lastActiveAt = typeof raw.lastActiveAt === 'number' && Number.isFinite(raw.lastActiveAt) ? raw.lastActiveAt : now;

  const clamp = (val: unknown, fallback: number) => {
    if (typeof val !== 'number' || !Number.isFinite(val)) return fallback;
    return Math.max(0, Math.min(100, val));
  };

  const hunger = clamp(raw.hunger, STAT_INITIAL.hunger);
  const happiness = clamp(raw.happiness, STAT_INITIAL.happiness);
  const energy = clamp(raw.energy, STAT_INITIAL.energy);
  const cleanliness = clamp(raw.cleanliness, STAT_INITIAL.cleanliness);
  const health = clamp(raw.health, STAT_INITIAL.health);

  const growthProgress =
    typeof raw.growthProgress === 'number' && Number.isFinite(raw.growthProgress)
      ? Math.max(0, Math.min(1, raw.growthProgress))
      : 0;

  const forcedSleep = Boolean(raw.forcedSleep);

  return {
    id: raw.id.trim(),
    type,
    name,
    growthStage,
    growthProgress,
    hunger,
    happiness,
    energy,
    cleanliness,
    health,
    createdAt,
    lastActiveAt,
    forcedSleep,
  };
}

/**
 * BitBuddy's only persistence: stores one pet in localStorage.
 * Schema-versioned via the storage key so we can migrate later.
 */
export class LocalStoragePetRepository implements PetRepository {
  async load(): Promise<PetState | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Corrupted JSON in storage — remove cleanly to prevent persistent crash
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      const validated = migrateOrValidatePetState(parsed);
      if (!validated) {
        // Unrecoverable record — remove cleanly to prevent crash
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return validated;
    } catch {
      return null;
    }
  }

  async save(pet: PetState): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
    } catch {
      // Ignore quota or private mode errors gracefully
    }
  }

  async delete(_petId: string): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors gracefully
    }
  }
}
