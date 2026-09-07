import type { SpriteSet } from './palette';
import { validateSprites } from './palette';

/**
 * Cat — pointed ears, calico stripes, long tail, sitting posture.
 *
 * Palette:
 *   . transparent
 *   C cream body       #f4d8a8
 *   S body shadow      #c9a87a
 *   O orange stripe    #e89856
 *   D dark stripe      #a86840
 *   e eye              #1a1340
 *   p pink (nose)      #ff7eb6
 *   w white (muzzle)   #fff7e0
 *   c cheek dot        #ff9bc4
 *   z sleep Z          #6ad1ff
 *   t tail tip         #a86840
 */
const cat: SpriteSet = {
  labels: {
    happy: 'content sitting',
    'well-cared-for': 'alert + bright',
    hungry: 'looking down at bowl',
    sad: 'low posture, droopy eyes',
    tired: 'yawning, half-closed eyes',
    sleeping: 'curled up, eyes closed',
    eating: 'head down at bowl',
    playing: 'pounce pose',
  },
  palette: {
    '.': 'transparent',
    C: '#f4d8a8',
    S: '#c9a87a',
    O: '#e89856',
    D: '#a86840',
    e: '#1a1340',
    p: '#ff7eb6',
    w: '#fff7e0',
    c: '#ff9bc4',
    z: '#6ad1ff',
    t: '#a86840',
  },
  frames: {
    happy: [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOO....OOCD.',
      '.CweC....CewC.',
      '.Ccpp....ppcC.',
      '..Cww....wwC..',
      '..COOOwwOOC...',
      '.COOCCCCCOOC..',
      '.COCCwCwCCOC..',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
    'well-cared-for': [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOO....OOCD.',
      '.CweC....CewC.',
      '.Ccpp....ppcC.',
      '..Cww....wwC..',
      '..COOOwwOOC...',
      '.COOCCCCCOOC..',
      '.COCCwCwCCOCC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '...CCCCCCCC...',
    ],
    hungry: [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOOO..OOOCD.',
      '.Cwwww..wwwwC.',
      '.Cppp....pppC.',
      '..CCC....CCC..',
      '..COOCCCCOC...',
      '.COOCCCCCOOC..',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
    sad: [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOO....OOCD.',
      '.Cwww....wwwC.',
      '.Cppp....pppC.',
      '..CCw....wCC..',
      '..COCCCCOOC...',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
    tired: [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOOO..OOOCD.',
      '.Cweww..wweC..',
      '.Cppp....pppC.',
      '..CCCw..wCCC..',
      '..COOCCCCOC...',
      '.COOCCCCCOOC..',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
    sleeping: [
      '..............',
      '..............',
      '.CCCSD..DCCC..',
      '.COOOO..OOOC..',
      '.CODDO..ODDC..',
      '.CCwwwwwwCC...',
      '.Cppp..pppC...',
      '..CCwwwwCC....',
      '..CCCCCCCC....',
      '..COOCCCCOC...',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
    eating: [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOO....OOCD.',
      '.CwwwwwwwwwwC.',
      '.Cppppp.pppC..',
      '..CCCppppCC...',
      '..COOCCCCOC...',
      '.COOCCCCCOOC..',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
    playing: [
      '..............',
      '..C.O....O.C..',
      '.CSD......DSC.',
      '.COOO....OOOC.',
      '.CDOO....OOCD.',
      '.CwewwwwweC...',
      '.Ccppppppc....',
      '..CCOCCCCOOC..',
      '.COOCCCCCOOC..',
      '.COCCwwwwCCOC.',
      '.COCCCCCCCCOC.',
      '.COCCCCCCCCOC.',
      '..CCCCCCCCCC..',
      '....CCCCCC....',
    ],
  },
};

validateSprites(cat);
export default cat;
