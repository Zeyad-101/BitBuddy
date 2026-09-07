import type { SpriteSet } from './palette';
import { validateSprites } from './palette';

/**
 * Bird — sky-blue upright songbird, wings folded, yellow belly.
 *
 * Palette:
 *   . transparent
 *   B sky blue body    #6ad1ff
 *   b body shadow      #4090c8
 *   Y yellow belly     #ffd86b
 *   e eye black        #1a1340
 *   k beak orange      #ff9b50
 *   W wing accent      #ffffff
 *   w wing tip         #4090c8
 *   h head tuft        #6ad1ff
 *   c cheek dot        #ff9bc4
 *   s sparkle          #ffd86b
 */
const bird: SpriteSet = {
  labels: {
    happy: 'upright, chirping',
    'well-cared-for': 'wing flutter, bright',
    hungry: 'head tilted, pecking',
    sad: 'ruffled, head down',
    tired: 'drooping wings, eyes half-closed',
    sleeping: 'head tucked under wing',
    eating: 'pecking at food',
    playing: 'wings spread, hopping',
  },
  palette: {
    '.': 'transparent',
    B: '#6ad1ff',
    b: '#4090c8',
    Y: '#ffd86b',
    e: '#1a1340',
    k: '#ff9b50',
    W: '#ffffff',
    w: '#4090c8',
    h: '#6ad1ff',
    c: '#ff9bc4',
    s: '#ffd86b',
  },
  frames: {
    happy: [
      '..............',
      '....B.....B...',
      '...BhB...BhB..',
      '...BBB...BBB..',
      '..BBBeBBBeBB..',
      '..BBckBBckBB..',
      '..BBYBBYBYBB..',
      '..BBYYYYYYBB..',
      '..BBYYYYYYBB..',
      '..BbBBwwBBbB..',
      '...BbWwwWbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
    ],
    'well-cared-for': [
      '..............',
      '....B.....B...',
      '...BhB...BhB..',
      '...BBB...BBB..',
      '..BBBeBBBeBB..',
      '..BBckBBckBB..',
      '..BBYBBYBYBB..',
      '..BBYYYYYYBB..',
      '..BBYYssYYBB..',
      '..BbBBwwBBbB..',
      '...BbWwwWbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
    ],
    hungry: [
      '..............',
      '....B.....B...',
      '...BhB...BhB..',
      '...BBB...BBB..',
      '..BBBeBBBeBB..',
      '..BBkkBBBkBB..',
      '..BBYBBYBYBB..',
      '..BBYYYYYYBB..',
      '..BBYYYYYYBB..',
      '..BbBBwwBBbB..',
      '...BbWwwWbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
    ],
    sad: [
      '..............',
      '..............',
      '....b.....b...',
      '...bbb...bbb..',
      '..bBBBeBBbBB..',
      '..BBBkkBBBbBB.',
      '..BBYYYYYYBB..',
      '..BBYYYYYYBB..',
      '..BbBBwwBBbB..',
      '...BbWwwWbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
      '..............',
    ],
    tired: [
      '..............',
      '....B.....B...',
      '...BhB...BhB..',
      '...BBB...BBB..',
      '..BBweBBweBB..',
      '..BBckBBckBB..',
      '..BBYBBYBYBB..',
      '..BBYYYYYYBB..',
      '..BBYYYYYYBB..',
      '..BbBBwwBBbB..',
      '...BbWwwWbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
    ],
    sleeping: [
      '..............',
      '..............',
      '....b.....b...',
      '...bbb...bbb..',
      '..bBBwwwwbBB..',
      '..BBwwwwwwBB..',
      '..BBYYYYYYBB..',
      '..BBYYYYYYBB..',
      '..BbBBwwBBbB..',
      '...BbwwwwbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
      '..............',
    ],
    eating: [
      '..............',
      '....B.....B...',
      '...BhB...BhB..',
      '...BBB...BBB..',
      '..BBBwwwwBBB..',
      '..BBkkkkkkBB..',
      '..BBYYYYYYBB..',
      '..BBYYYYYYBB..',
      '..BbBBwwBBbB..',
      '...BbWwwWbB...',
      '...BB.BB.BB...',
      '....BBBBBB....',
      '..............',
      '..............',
    ],
    playing: [
      '..............',
      '....B.....B...',
      '...BhB...BhB..',
      '...BBB...BBB..',
      '..BBBeBBBeBB..',
      '.WBBckBBckBBW.',
      '.WWBYYYYYYBWW.',
      '..WBBYYYYBBW..',
      '...BbYYbbB....',
      '...BBwwBBB....',
      '....BBBBBB....',
      '...BB....BB...',
      '...BB....BB...',
      '..............',
    ],
  },
};

validateSprites(bird);
export default bird;
