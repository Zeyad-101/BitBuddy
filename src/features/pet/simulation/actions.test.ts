import { describe, it, expect } from 'vitest';
import { feedPet } from './feedPet';
import { playWithPet } from './playWithPet';
import { cleanPet } from './cleanPet';
import { startSleeping } from './startSleeping';
import { ACTION_EFFECTS, STAT_MAX } from '../constants';
import type { PetState } from '../types';

function makePet(): PetState {
  return {
    id: 'p1',
    type: 'cat',
    name: 'Mittens',
    growthStage: 'baby',
    growthProgress: 0,
    hunger: 50,
    happiness: 50,
    energy: 50,
    cleanliness: 50,
    health: 80,
    createdAt: 0,
    lastActiveAt: 0,
    forcedSleep: false,
  };
}

describe('feedPet', () => {
  it('applies feed effects', () => {
    const pet = makePet();
    const result = feedPet(pet, 1000);
    expect(result.hunger).toBe(50 + ACTION_EFFECTS.feed.hunger);
    expect(result.cleanliness).toBe(50 + ACTION_EFFECTS.feed.cleanliness);
  });

  it('clamps to STAT_MAX', () => {
    const pet = makePet();
    const result = feedPet(pet, 1000);
    expect(result.hunger).toBeLessThanOrEqual(STAT_MAX);
  });

  it('does not mutate the input pet', () => {
    const pet = makePet();
    feedPet(pet, 1000);
    expect(pet.hunger).toBe(50);
  });

  it('increases growthProgress and updates lastActiveAt', () => {
    const pet = makePet();
    const result = feedPet(pet, 1234);
    expect(result.growthProgress).toBeGreaterThan(0);
    expect(result.lastActiveAt).toBe(1234);
  });
});

describe('playWithPet', () => {
  it('boosts happiness and drains energy', () => {
    const pet = makePet();
    const result = playWithPet(pet, 1000);
    expect(result.happiness).toBe(50 + ACTION_EFFECTS.play.happiness);
    expect(result.energy).toBe(50 + ACTION_EFFECTS.play.energy);
  });
});

describe('cleanPet', () => {
  it('boosts cleanliness', () => {
    const pet = makePet();
    const result = cleanPet(pet, 1000);
    // Starting cleanliness is 50, +60 effect = 110 — clamps to STAT_MAX (100).
    expect(result.cleanliness).toBe(STAT_MAX);
  });
});

describe('startSleeping', () => {
  it('boosts energy and health', () => {
    const pet = makePet();
    const result = startSleeping(pet, 1000);
    expect(result.energy).toBe(50 + ACTION_EFFECTS.sleep.energy);
    expect(result.health).toBe(80 + ACTION_EFFECTS.sleep.health);
  });
});
