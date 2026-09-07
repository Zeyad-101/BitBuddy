import type { Mood, PetState } from '../types';
import { MOOD_THRESHOLDS } from '../constants';

/**
 * Pure: derive a mood from pet state. UI uses this for sprite/animation hints.
 *
 * `tirednessBoost` is added to the "tired" energy threshold, so the UI
 * can make pets feel sleepy more easily at night.
 */
export function calculateMood(pet: PetState, tirednessBoost: number = 0): Mood {
  // Player-initiated sleep takes priority.
  if (pet.forcedSleep) return 'sleeping';
  if (pet.energy < MOOD_THRESHOLDS.sleepingEnergyBelow && pet.happiness < 50) {
    return 'sleeping';
  }
  if (pet.hunger < MOOD_THRESHOLDS.hungryHungerBelow) return 'hungry';
  if (pet.energy < MOOD_THRESHOLDS.tiredEnergyBelow + tirednessBoost) return 'tired';
  if (pet.happiness < MOOD_THRESHOLDS.sadHappinessBelow) return 'sad';
  if (
    pet.happiness > MOOD_THRESHOLDS.wellCaredHappinessAbove &&
    pet.hunger > MOOD_THRESHOLDS.wellCaredHungerAbove
  ) {
    return 'well-cared-for';
  }
  return 'happy';
}
