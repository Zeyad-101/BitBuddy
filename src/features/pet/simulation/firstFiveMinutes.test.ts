import { describe, it, expect, beforeEach } from 'vitest';
import { createPet } from '../state/createPet';
import { feedPet } from './feedPet';
import { playWithPet } from './playWithPet';
import { applyElapsedTime } from './applyElapsedTime';
import { LocalStoragePetRepository } from '../persistence/LocalStoragePetRepository';
import { DECAY_PER_HOUR, STAT_INITIAL } from '../constants';

describe('First Five Minutes Experience & Persistence', () => {
  let repo: LocalStoragePetRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStoragePetRepository();
  });

  it('1. Creates a Buddy with honest initial stats', () => {
    const pet = createPet('dog', 'Barnaby');
    expect(pet.name).toBe('Barnaby');
    expect(pet.type).toBe('dog');
    expect(pet.hunger).toBe(STAT_INITIAL.hunger);
    expect(pet.happiness).toBe(STAT_INITIAL.happiness);
    expect(pet.energy).toBe(STAT_INITIAL.energy);
    expect(pet.cleanliness).toBe(STAT_INITIAL.cleanliness);
    expect(pet.health).toBe(STAT_INITIAL.health);
    expect(pet.growthStage).toBe('baby');
  });

  it('2. Interactions modify stats and update lastActiveAt as expected', () => {
    const start = 1_000_000;
    const pet = { ...createPet('cat', 'Milo'), lastActiveAt: start };
    const fed = feedPet(pet, start);
    expect(fed.hunger).toBeGreaterThan(pet.hunger);
    expect(fed.lastActiveAt).toBe(start);

    const played = playWithPet(fed, start + 1000);
    expect(played.happiness).toBeGreaterThan(fed.happiness);
    expect(played.lastActiveAt).toBe(start + 1000);
  });

  it('3. Persists to repository, closes, and reloads without loss', async () => {
    const start = 1_000_000;
    const pet = createPet('hamster', 'Peanut');
    const fed = feedPet(pet, start);

    await repo.save(fed);
    const loaded = await repo.load();

    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(fed.id);
    expect(loaded?.name).toBe('Peanut');
    expect(loaded?.type).toBe('hamster');
    expect(loaded?.hunger).toBe(fed.hunger);
    expect(loaded?.cleanliness).toBe(fed.cleanliness);
  });

  it('4. Applies elapsed time simulation over a 5-minute absence (300 seconds)', async () => {
    const start = 1_000_000;
    const pet = { ...createPet('bird', 'Kiwi'), lastActiveAt: start };
    await repo.save(pet);

    // Player closes tab and returns 5 minutes (300 seconds) later
    const fiveMinutesLater = start + 300 * 1000;
    const simulated = applyElapsedTime(pet, fiveMinutesLater);

    // 5 minutes is 1/12th of an hour
    const expectedHungerLoss = DECAY_PER_HOUR.hunger * (300 / 3600);
    const expectedHappinessLoss = DECAY_PER_HOUR.happiness * (300 / 3600);
    const expectedEnergyLoss = DECAY_PER_HOUR.energy * (300 / 3600);

    expect(simulated.hunger).toBeCloseTo(STAT_INITIAL.hunger - expectedHungerLoss, 1);
    expect(simulated.happiness).toBeCloseTo(STAT_INITIAL.happiness - expectedHappinessLoss, 1);
    expect(simulated.energy).toBeCloseTo(STAT_INITIAL.energy - expectedEnergyLoss, 1);

    // Health should remain at 100 since stats are well above the neglected threshold
    expect(simulated.health).toBe(100);
    expect(simulated.lastActiveAt).toBe(fiveMinutesLater);
  });

  it('5. Safe reset deletes the buddy from local storage permanently', async () => {
    const pet = createPet('cat', 'Milo');
    await repo.save(pet);
    expect(await repo.load()).not.toBeNull();

    await repo.delete(pet.id);
    expect(await repo.load()).toBeNull();
  });
});
