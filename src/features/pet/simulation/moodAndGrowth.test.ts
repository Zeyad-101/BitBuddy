import { describe, it, expect } from 'vitest';
import { calculateMood } from './calculateMood';
import { calculateGrowth } from './calculateGrowth';
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

describe('calculateMood', () => {
  it('returns sleeping when energy and happiness are low', () => {
    const pet = makePet({ energy: 10, happiness: 30 });
    expect(calculateMood(pet)).toBe('sleeping');
  });

  it('returns hungry when hunger is low', () => {
    const pet = makePet({ hunger: 10, happiness: 80, energy: 80 });
    expect(calculateMood(pet)).toBe('hungry');
  });

  it('returns tired when energy is low but pet is not sleeping', () => {
    const pet = makePet({ energy: 10, happiness: 80, hunger: 80 });
    expect(calculateMood(pet)).toBe('tired');
  });

  it('returns sad when happiness is low', () => {
    const pet = makePet({ happiness: 10, hunger: 80, energy: 80 });
    expect(calculateMood(pet)).toBe('sad');
  });

  it('returns well-cared-for when both happiness and hunger are high', () => {
    const pet = makePet({ happiness: 95, hunger: 90, energy: 80 });
    expect(calculateMood(pet)).toBe('well-cared-for');
  });

  it('returns happy as the default mood', () => {
    const pet = makePet({ happiness: 60, hunger: 60, energy: 60 });
    expect(calculateMood(pet)).toBe('happy');
  });
});

describe('calculateGrowth', () => {
  it('starts as baby', () => {
    expect(calculateGrowth(makePet({ growthStage: 'baby', growthProgress: 0 }))).toBe('baby');
  });

  it('advances to child after enough care points', () => {
    expect(calculateGrowth(makePet({ growthStage: 'baby', growthProgress: 1 }))).toBe('child');
  });

  it('advances to teen and adult across stages', () => {
    expect(calculateGrowth(makePet({ growthStage: 'baby', growthProgress: 3 }))).toBe('teen');
    expect(calculateGrowth(makePet({ growthStage: 'baby', growthProgress: 6 }))).toBe('adult');
  });
});
