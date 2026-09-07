/**
 * Backwards-compatible re-export of the new sprite registry.
 * Old call sites import from this file; new code imports from ./sprites directly.
 */
export {
  SPRITES,
  getPetSpriteSet,
  getFrame,
} from './sprites';
