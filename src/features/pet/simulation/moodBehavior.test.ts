import { describe, it, expect } from 'vitest';
import {
  moodToSpriteMood,
  getWalkDurationMs,
  getWanderChance,
  getSleepingAnchor,
  getReactionText,
  pickNextAnchor,
  isPetAnimated,
} from './moodBehavior';
import type { WanderAnchor } from '../types';
import { ROOM_ANCHORS } from '../constants';

describe('moodToSpriteMood', () => {
  it('maps every mood to a distinct sprite frame', () => {
    expect(moodToSpriteMood('happy')).toBe('happy');
    expect(moodToSpriteMood('hungry')).toBe('hungry');
    expect(moodToSpriteMood('tired')).toBe('tired');
    expect(moodToSpriteMood('sad')).toBe('sad');
    expect(moodToSpriteMood('sleeping')).toBe('sleeping');
    expect(moodToSpriteMood('well-cared-for')).toBe('well-cared-for');
  });
});

describe('mood-driven movement timing', () => {
  it('sleeping pets effectively do not walk', () => {
    expect(getWalkDurationMs('sleeping')).toBeGreaterThan(10000);
  });

  it('well-cared-for walks faster than sad', () => {
    expect(getWalkDurationMs('well-cared-for')).toBeLessThan(getWalkDurationMs('sad'));
  });

  it('wandering probability is zero when sleeping', () => {
    expect(getWanderChance('sleeping')).toBe(0);
  });

  it('well-cared-for wanders more than sad', () => {
    expect(getWanderChance('well-cared-for')).toBeGreaterThan(getWanderChance('sad'));
  });
});

describe('getSleepingAnchor', () => {
  it('returns bed when sleeping', () => {
    expect(getSleepingAnchor('sleeping')).toBe('bed');
  });
  it('returns null otherwise', () => {
    expect(getSleepingAnchor('happy')).toBeNull();
    expect(getSleepingAnchor('sad')).toBeNull();
  });
});

describe('getReactionText', () => {
  it('returns type-specific reactions for actions', () => {
    expect(getReactionText('happy', 'cat', 'feed')).toBe('purr purr...');
    expect(getReactionText('happy', 'dog', 'play')).toBe('wag wag!');
    expect(getReactionText('happy', 'bird', 'feed')).toBe('tweet!');
  });
  it('falls back to mood text when no action', () => {
    expect(getReactionText('hungry', 'cat', null)).toBe("I'm hungry...");
    expect(getReactionText('sleeping', 'dog', null)).toBe('zzz...');
  });
});

describe('pickNextAnchor', () => {
  const anchors: WanderAnchor[] = [...ROOM_ANCHORS];

  it('never returns the current anchor', () => {
    for (let i = 0; i < 50; i++) {
      const next = pickNextAnchor('bed', anchors, () => Math.random());
      expect(next).not.toBe('bed');
    }
  });

  it('returns some anchor when current is null', () => {
    const next = pickNextAnchor(null, anchors, () => 0);
    expect(anchors.some((a) => a.id === next)).toBe(true);
  });

  it('is deterministic with a controlled random', () => {
    const r = () => 0.99; // last index
    expect(pickNextAnchor(null, anchors, r)).toBe(anchors[anchors.length - 1]!.id);
  });
});

describe('isPetAnimated', () => {
  it('is true while eating or playing', () => {
    expect(isPetAnimated('sad', 'eating')).toBe(true);
    expect(isPetAnimated('sad', 'playing')).toBe(true);
  });
  it('is false while sleeping and not overlaying an action', () => {
    expect(isPetAnimated('sleeping', 'none')).toBe(false);
  });
});
