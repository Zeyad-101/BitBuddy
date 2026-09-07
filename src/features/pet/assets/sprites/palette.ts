/**
 * Shared sprite types and the runtime validator.
 * Every sprite frame must be exactly SPRITE_W x SPRITE_H.
 */

export const SPRITE_W = 14;
export const SPRITE_H = 14;
export const SPRITE_SIZE = SPRITE_W * SPRITE_H;

export type SpriteFrame = string[];

export interface SpriteSet {
  /** Human-readable label per frame for debugging. */
  labels: Record<string, string>;
  /** Frames keyed by SpriteMood. */
  frames: Record<string, SpriteFrame>;
  /** Color palette keyed by single-character cell code. */
  palette: Record<string, string>;
}

export function validateSprites(set: SpriteSet): void {
  for (const [key, frame] of Object.entries(set.frames)) {
    if (frame.length !== SPRITE_H) {
      throw new Error(
        `Sprite frame "${key}" has ${frame.length} rows; expected ${SPRITE_H}.`,
      );
    }
    for (let i = 0; i < frame.length; i++) {
      const row = frame[i]!;
      if (row.length !== SPRITE_W) {
        throw new Error(
          `Sprite frame "${key}" row ${i} has ${row.length} cols; expected ${SPRITE_W}.`,
        );
      }
    }
  }
}
