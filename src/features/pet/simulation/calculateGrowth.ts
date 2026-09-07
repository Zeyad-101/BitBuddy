import type { GrowthStage, PetState } from '../types';
import { GROWTH_THRESHOLDS } from '../constants';

/**
 * Pure: derive the growth stage from cumulative growthProgress.
 * growthProgress increases with each care action (0..1 per stage).
 */
export function calculateGrowth(pet: PetState): GrowthStage {
  const cumulative = stageCumulative(pet.growthStage) + pet.growthProgress;
  if (cumulative >= GROWTH_THRESHOLDS.adult) return 'adult';
  if (cumulative >= GROWTH_THRESHOLDS.teen) return 'teen';
  if (cumulative >= GROWTH_THRESHOLDS.child) return 'child';
  return 'baby';
}

/** Care-points already banked into earlier stages. */
function stageCumulative(stage: GrowthStage): number {
  if (stage === 'adult') return GROWTH_THRESHOLDS.adult;
  if (stage === 'teen') return GROWTH_THRESHOLDS.teen;
  if (stage === 'child') return GROWTH_THRESHOLDS.child;
  return GROWTH_THRESHOLDS.baby;
}
