import { describe, it, expect } from 'vitest';
import {
  getYawnChance,
  getBedAffinity,
  getYawnText,
  getActionReaction,
} from './moodBehavior';

describe('getYawnChance', () => {
  it('is 0 when energy is high', () => {
    expect(getYawnChance(80)).toBe(0);
    expect(getYawnChance(100)).toBe(0);
  });
  it('rises as energy drops', () => {
    expect(getYawnChance(40)).toBeGreaterThan(getYawnChance(60));
    expect(getYawnChance(20)).toBeGreaterThan(getYawnChance(40));
  });
  it('is capped at 0.5', () => {
    expect(getYawnChance(0)).toBeLessThanOrEqual(0.5);
  });
});

describe('getBedAffinity', () => {
  it('is 0 when energy is high', () => {
    expect(getBedAffinity(80)).toBe(0);
  });
  it('rises as energy drops', () => {
    expect(getBedAffinity(40)).toBeGreaterThan(getBedAffinity(60));
    expect(getBedAffinity(20)).toBeGreaterThan(getBedAffinity(40));
  });
  it('approaches 1 at very low energy', () => {
    expect(getBedAffinity(0)).toBeGreaterThan(0.85);
  });
});

describe('getYawnText', () => {
  it('returns a string for every pet type', () => {
    expect(getYawnText('cat')).toBeTruthy();
    expect(getYawnText('dog')).toBeTruthy();
    expect(getYawnText('hamster')).toBeTruthy();
    expect(getYawnText('bird')).toBeTruthy();
  });
});

describe('getActionReaction', () => {
  it('returns type-aware reaction per action', () => {
    expect(getActionReaction('feed', 'cat')).toMatch(/yum|purr/i);
    expect(getActionReaction('play', 'dog')).toMatch(/again|wag/i);
    expect(getActionReaction('clean', 'hamster')).toBeTruthy();
    expect(getActionReaction('sleep', 'bird')).toBeTruthy();
  });
});
