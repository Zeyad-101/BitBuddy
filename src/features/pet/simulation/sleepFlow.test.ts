import { describe, it, expect } from 'vitest';
import { startSleeping, maybeWakeUp } from './startSleeping';
import { applyElapsedTime } from './applyElapsedTime';
import { calculateMood } from './calculateMood';
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

describe('startSleeping', () => {
  it('sets forcedSleep = true', () => {
    const pet = makePet();
    const result = startSleeping(pet, 1000);
    expect(result.forcedSleep).toBe(true);
  });
  it('restores energy and health', () => {
    const pet = makePet({ energy: 30, health: 60 });
    const result = startSleeping(pet, 1000);
    expect(result.energy).toBeGreaterThan(30);
    expect(result.health).toBeGreaterThan(60);
  });
});

describe('maybeWakeUp', () => {
  it('clears forcedSleep when energy is restored', () => {
    const pet = makePet({ forcedSleep: true, energy: 80 });
    const result = maybeWakeUp(pet, 80);
    expect(result.forcedSleep).toBe(false);
  });
  it('keeps forcedSleep when energy is still low', () => {
    const pet = makePet({ forcedSleep: true, energy: 50 });
    const result = maybeWakeUp(pet, 80);
    expect(result.forcedSleep).toBe(true);
  });
});

describe('applyElapsedTime with forcedSleep', () => {
  it('recovers energy faster when forcedSleep is true', () => {
    const pet = makePet({ forcedSleep: true, energy: 30, lastActiveAt: 0 });
    const after = applyElapsedTime(pet, 60 * 60 * 1000); // 1h
    expect(after.energy).toBeGreaterThan(30);
  });
  it('clears forcedSleep once energy passes the wake threshold', () => {
    const pet = makePet({ forcedSleep: true, energy: 79, lastActiveAt: 0 });
    const after = applyElapsedTime(pet, 60 * 60 * 1000); // 1h: +40 = 119, capped
    expect(after.forcedSleep).toBe(false);
  });
});

describe('calculateMood with forcedSleep', () => {
  it('returns sleeping when forcedSleep is true even at high energy', () => {
    const pet = makePet({ forcedSleep: true, energy: 100, happiness: 100 });
    expect(calculateMood(pet)).toBe('sleeping');
  });
});
