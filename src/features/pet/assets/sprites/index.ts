import type { PetType } from '../../types';
import type { SpriteSet, SpriteFrame } from './palette';
import cat from './cat';
import dog from './dog';
import hamster from './hamster';
import bird from './bird';

import catIdle from './png/cat_idle.png';
import catHappy from './png/cat_happy.png';
import dogIdle from './png/dog_idle.png';
import dogHappy from './png/dog_happy.png';
import hamsterIdle from './png/hamster_idle.png';
import hamsterHappy from './png/hamster_happy.png';
import birdIdle from './png/bird_idle.png';
import birdHappy from './png/bird_happy.png';

export interface PetRasterSprite {
  idle: string;
  happy: string;
}

export const PET_RASTER_SPRITES: Record<PetType, PetRasterSprite> = {
  cat: {
    idle: catIdle,
    happy: catHappy,
  },
  dog: {
    idle: dogIdle,
    happy: dogHappy,
  },
  hamster: {
    idle: hamsterIdle,
    happy: hamsterHappy,
  },
  bird: {
    idle: birdIdle,
    happy: birdHappy,
  },
};

export function getPetRasterUrl(type: PetType, moodOrFrame?: string): string {
  const sprites = PET_RASTER_SPRITES[type] ?? PET_RASTER_SPRITES.cat;
  if (moodOrFrame === 'happy' || moodOrFrame === 'well-cared-for' || moodOrFrame === 'playing') {
    return sprites.happy;
  }
  return sprites.idle;
}

export const SPRITES: Record<PetType, SpriteSet> = {
  cat,
  dog,
  hamster,
  bird,
};

export function getPetSpriteSet(type: PetType): SpriteSet {
  return SPRITES[type] ?? SPRITES.cat;
}

export function getFrame(set: SpriteSet, key: string): SpriteFrame {
  const safeSet = set ?? SPRITES.cat;
  const frame = safeSet.frames[key] ?? safeSet.frames['happy'] ?? safeSet.frames['idle'];
  if (!frame) {
    const fallbackKey = Object.keys(safeSet.frames)[0];
    if (fallbackKey && safeSet.frames[fallbackKey]) return safeSet.frames[fallbackKey]!;
    return (SPRITES.cat.frames['idle'] ?? SPRITES.cat.frames['happy'])!;
  }
  return frame;
}

export type { SpriteSet, SpriteFrame };
export { SPRITE_W, SPRITE_H, SPRITE_SIZE, validateSprites } from './palette';

