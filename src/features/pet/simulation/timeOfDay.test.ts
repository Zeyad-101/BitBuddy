import { describe, it, expect } from 'vitest';
import {
  getTimeOfDay,
  getPhaseLabel,
  getWanderMultiplier,
  getTirednessBoost,
  getRoomTint,
} from './timeOfDay';

function at(hour: number, minute: number = 0): Date {
  return new Date(2026, 0, 1, hour, minute, 0, 0);
}

describe('getTimeOfDay', () => {
  it('morning 6-10', () => {
    expect(getTimeOfDay(at(6))).toBe('morning');
    expect(getTimeOfDay(at(9, 59))).toBe('morning');
  });
  it('day 10-17', () => {
    expect(getTimeOfDay(at(10))).toBe('day');
    expect(getTimeOfDay(at(16, 59))).toBe('day');
  });
  it('evening 17-20', () => {
    expect(getTimeOfDay(at(17))).toBe('evening');
    expect(getTimeOfDay(at(19, 59))).toBe('evening');
  });
  it('night 20-6', () => {
    expect(getTimeOfDay(at(20))).toBe('night');
    expect(getTimeOfDay(at(23))).toBe('night');
    expect(getTimeOfDay(at(0))).toBe('night');
    expect(getTimeOfDay(at(5, 59))).toBe('night');
  });
});

describe('getPhaseLabel', () => {
  it('returns a human label per phase', () => {
    expect(getPhaseLabel('morning')).toBe('Morning');
    expect(getPhaseLabel('day')).toBe('Day');
    expect(getPhaseLabel('evening')).toBe('Evening');
    expect(getPhaseLabel('night')).toBe('Night');
  });
});

describe('getWanderMultiplier', () => {
  it('is 1.0 during day', () => {
    expect(getWanderMultiplier('day')).toBe(1.0);
  });
  it('is greater than 1.0 in the morning', () => {
    expect(getWanderMultiplier('morning')).toBeGreaterThan(1.0);
  });
  it('is less than 1.0 in the evening and night', () => {
    expect(getWanderMultiplier('evening')).toBeLessThan(1.0);
    expect(getWanderMultiplier('night')).toBeLessThan(getWanderMultiplier('evening'));
  });
});

describe('getTirednessBoost', () => {
  it('is 0 during day and morning', () => {
    expect(getTirednessBoost('morning')).toBe(0);
    expect(getTirednessBoost('day')).toBe(0);
  });
  it('rises at evening and peaks at night', () => {
    expect(getTirednessBoost('evening')).toBeGreaterThan(0);
    expect(getTirednessBoost('night')).toBeGreaterThan(getTirednessBoost('evening'));
  });
});

describe('getRoomTint', () => {
  it('returns distinct tints per phase', () => {
    const morning = getRoomTint('morning');
    const night = getRoomTint('night');
    expect(morning.wallpaperOverlay).not.toBe(night.wallpaperOverlay);
  });
});
