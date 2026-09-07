import { describe, it, expect } from 'vitest';
import { applyElapsedTime } from './applyElapsedTime';
import type { PetState } from '../types';

function makePet(overrides: Partial<PetState> = {}): PetState {
  return {
    id: 'p1',
    type: 'cat',
    name: 'Mittens',
    growthStage: 'baby',
    growthProgress: 0,
    hunger: 80,
    happiness: 80,
    energy: 80,
    cleanliness: 100,
    health: 100,
    createdAt: 0,
    lastActiveAt: 0,
    forcedSleep: false,
    ...overrides,
  };
}

describe('applyElapsedTime', () => {
  it('returns the same pet if zero time has elapsed', () => {
    const pet = makePet();
    expect(applyElapsedTime(pet, 0)).toBe(pet);
  });

  it('decays hunger over time', () => {
    const pet = makePet({ lastActiveAt: 0, hunger: 80 });
    const result = applyElapsedTime(pet, 60 * 60 * 1000); // 1 hour
    expect(result.hunger).toBeLessThan(80);
    expect(result.hunger).toBeCloseTo(72, 5);
  });

  it('clamps stats to the 0..100 range', () => {
    const pet = makePet({ lastActiveAt: 0, hunger: 0 });
    const result = applyElapsedTime(pet, 1000 * 60 * 60 * 24 * 7);
    expect(result.hunger).toBe(0);
    expect(result.cleanliness).toBe(0);
  });

  it('drains health when other stats are neglected', () => {
    const pet = makePet({
      lastActiveAt: 0,
      hunger: 10,
      happiness: 10,
      cleanliness: 10,
      health: 100,
    });
    const result = applyElapsedTime(pet, 60 * 60 * 1000);
    expect(result.health).toBeLessThan(100);
  });

  it('updates lastActiveAt to now', () => {
    const pet = makePet({ lastActiveAt: 0 });
    const result = applyElapsedTime(pet, 5000);
    expect(result.lastActiveAt).toBe(5000);
  });
});
