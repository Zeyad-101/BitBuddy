import { describe, it, expect } from 'vitest';
import { SPRITES, getPetSpriteSet, getFrame } from './index';
import { SPRITE_W, SPRITE_H } from './palette';
import type { PetType } from '../../types';

const TYPES: PetType[] = ['cat', 'dog', 'hamster', 'bird'];
const FRAME_KEYS = [
  'happy',
  'well-cared-for',
  'hungry',
  'sad',
  'tired',
  'sleeping',
  'eating',
  'playing',
] as const;

describe('sprites', () => {
  it('exports all four pet types', () => {
    for (const t of TYPES) {
      expect(SPRITES[t]).toBeDefined();
    }
  });

  it('every sprite set has all 8 mood/action frames', () => {
    for (const t of TYPES) {
      const set = getPetSpriteSet(t);
      for (const key of FRAME_KEYS) {
        expect(() => getFrame(set, key)).not.toThrow();
      }
    }
  });

  it('every frame is exactly SPRITE_W x SPRITE_H', () => {
    for (const t of TYPES) {
      const set = getPetSpriteSet(t);
      for (const key of FRAME_KEYS) {
        const frame = getFrame(set, key);
        expect(frame.length, `${t}.${key} row count`).toBe(SPRITE_H);
        for (let i = 0; i < frame.length; i++) {
          expect(
            frame[i]!.length,
            `${t}.${key} row ${i} width`,
          ).toBe(SPRITE_W);
        }
      }
    }
  });

  it('every used palette code is defined for that pet', () => {
    for (const t of TYPES) {
      const set = getPetSpriteSet(t);
      const used = new Set<string>();
      for (const key of FRAME_KEYS) {
        const frame = getFrame(set, key);
        for (const row of frame) {
          for (const ch of row) used.add(ch);
        }
      }
      for (const code of used) {
        if (code === '.') continue;
        expect(
          set.palette[code],
          `${t} palette[${code}]`,
        ).toBeDefined();
      }
    }
  });
});
