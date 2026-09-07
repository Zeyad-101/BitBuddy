import { memo, useMemo, type CSSProperties } from 'react';
import styles from './Furniture.module.css';

/**
 * Each piece of room furniture is rendered as a crisp vector pixel-art SVG.
 * Contiguous horizontal pixels of the same color are merged into single rects,
 * keeping DOM nodes to a single element per furniture item with zero layout shifts.
 */

export interface PixelArt {
  /** Each string is one row; '.' = transparent. */
  rows: string[];
  palette: Record<string, string>;
  /** Width/height in cells; derived from the first row if not given. */
  width?: number;
  height?: number;
  cellSize?: number;
}

interface RectSpan {
  x: number;
  y: number;
  width: number;
  fill: string;
}

function computeRects(art: PixelArt): RectSpan[] {
  const rects: RectSpan[] = [];
  art.rows.forEach((row, y) => {
    let currentFill: string | null = null;
    let startX = 0;
    let runLength = 0;

    const flush = () => {
      if (currentFill && currentFill !== 'transparent') {
        rects.push({ x: startX, y, width: runLength, fill: currentFill });
      }
      currentFill = null;
      runLength = 0;
    };

    for (let x = 0; x < row.length; x++) {
      const ch = row[x]!;
      const color = art.palette[ch] ?? 'transparent';
      if (color === currentFill) {
        runLength++;
      } else {
        flush();
        if (color !== 'transparent') {
          currentFill = color;
          startX = x;
          runLength = 1;
        }
      }
    }
    flush();
  });
  return rects;
}

function PixelArtView({ art, className, style }: { art: PixelArt; className?: string; style?: CSSProperties }) {
  const w = art.width ?? art.rows[0]!.length;
  const h = art.height ?? art.rows.length;
  const cs = art.cellSize ?? 10;
  const rects = useMemo(() => computeRects(art), [art]);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * cs}
      height={h * cs}
      shapeRendering="crispEdges"
      className={`${styles.furniture} pixelated ${className ?? ''}`}
      style={{ width: '100%', height: 'auto', display: 'block', ...style }}
      aria-hidden="true"
    >
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.width}
          height={1}
          fill={r.fill}
        />
      ))}
    </svg>
  );
}


// --- Bed (12 wide × 9 tall) --------------------------------------------------
const BED: PixelArt = {
  rows: [
    '............',
    '..wwwwwwww..',
    '.wWWWWWWWWw.',
    'wWBBBBBBBgWw',
    'wWBbbbbbBWw.',
    'wWBppppbBWw.',
    'wWBbbbbbBWw.',
    'wWBcccccBWw.',
    'wwggggggwwww',
  ],
  palette: {
    '.': 'transparent',
    w: '#fff7e0',
    W: '#e8d8b0',
    B: '#a86840',
    b: '#f4d8a8',
    p: '#ff7eb6',
    c: '#c9a87a',
    g: '#8b5a2b',
  },
  cellSize: 10,
};

// --- Food bowl (10 × 6) -----------------------------------------------------
const BOWL: PixelArt = {
  rows: [
    '...yyyyy...',
    '..YYYYYYY..',
    '.YYYwwwwYY.',
    'YwwwwwwwwYY',
    'YwwwwwwwwYY',
    'ggggggggggg',
  ],
  palette: {
    '.': 'transparent',
    y: '#e89856',
    Y: '#c97840',
    w: '#a86840',
    g: '#8b5a2b',
  },
  cellSize: 8,
};

// --- Toy (yarn ball) (8 × 7) -------------------------------------------------
const TOY: PixelArt = {
  rows: [
    '..wwww..',
    '.wPPPPw.',
    'wPRwPRPw',
    'wPwPwPRw',
    'wPRwPRPw',
    '.wPPPPw.',
    '..wwww..',
  ],
  palette: {
    '.': 'transparent',
    w: '#fff7e0',
    P: '#ff7eb6',
    R: '#c97840',
  },
  cellSize: 8,
};

// --- Window: day (sun + sky) (10 × 10) -------------------------------------
const WINDOW_DAY: PixelArt = {
  rows: [
    'WWWWWWWWWW',
    'WbbbbbbbbW',
    'WbwwwwwwbW',
    'WbwwwwwwbW',
    'WbwwYywwbW',
    'WbwwYywwbW',
    'WbwwwwwwbW',
    'WbwwwwwwbW',
    'WbbbbbbbbW',
    'WWWWWWWWWW',
  ],
  palette: {
    W: '#a86840',
    b: '#7ec0e8',
    w: '#bfe4f5',
    Y: '#fff09a',
    y: '#ffd86b',
  },
  cellSize: 9,
};

// --- Window: evening (sunset) (10 × 10) ------------------------------------
const WINDOW_EVENING: PixelArt = {
  rows: [
    'WWWWWWWWWW',
    'WbbbbbbbbW',
    'WbwwwwwwbW',
    'WbwwwwwwbW',
    'WbwwrrwwbW',
    'WbwwRRwwbW',
    'WbwwrrwwbW',
    'WbwwwwwwbW',
    'WbbbbbbbbW',
    'WWWWWWWWWW',
  ],
  palette: {
    W: '#a86840',
    b: '#3a2a5a',
    w: '#6a4080',
    R: '#ff8a3a',
    r: '#ffc06a',
  },
  cellSize: 9,
};

// --- Window: night (moon + stars) (10 × 10) --------------------------------
const WINDOW_NIGHT: PixelArt = {
  rows: [
    'WWWWWWWWWW',
    'WbbbbbbbbW',
    'WbwwswwwbW',
    'WbwwyywwbW',
    'WbwwyywwbW',
    'WbwwwwwwbW',
    'WbwwwwswbW',
    'WbwwwwwwbW',
    'WbbbbbbbbW',
    'WWWWWWWWWW',
  ],
  palette: {
    W: '#a86840',
    b: '#1a1340',
    w: '#2a1f5a',
    y: '#fff7e0',
    s: '#fff7e0',
  },
  cellSize: 9,
};

// --- Window: morning (light blue + small sun) (10 × 10) --------------------
const WINDOW_MORNING: PixelArt = {
  rows: [
    'WWWWWWWWWW',
    'WbbbbbbbbW',
    'WbwwwwwwbW',
    'WbwwwwwwbW',
    'WbwwwwwwbW',
    'WbwwwYwwbW',
    'WbwwYYwwbW',
    'WbwwwYwwbW',
    'WbwwwwwwbW',
    'WWWWWWWWWW',
  ],
  palette: {
    W: '#a86840',
    b: '#a4c8e8',
    w: '#d4e8f5',
    Y: '#ffe89a',
  },
  cellSize: 9,
};

// --- Potted plant (8 × 11) --------------------------------------------------
const PLANT: PixelArt = {
  rows: [
    '...ggg....',
    '..gGGGg...',
    '.gGGGGGG..',
    '.gGGgGGG..',
    '.gGGGGGG..',
    '..gGGg....',
    '...gg.....',
    '..rrrrr...',
    '.rRRRRRr..',
    'rRRRRRRRr.',
    'rrrrrrrrr.',
  ],
  palette: {
    '.': 'transparent',
    g: '#8be38b',
    G: '#6ad16b',
    r: '#8b5a2b',
    R: '#a86840',
  },
  cellSize: 9,
};

// --- Wall clock (10 × 10) ---------------------------------------------------
const CLOCK: PixelArt = {
  rows: [
    '..wwwwww..',
    '.wBBBBBBw.',
    'wBwWWWWBww',
    'wBWWWwWBww',
    'wBWWWWWWBw',
    'wBWWWWWWBw',
    'wBWWWwWBww',
    'wBwWWWWBww',
    '.wBBBBBBw.',
    '..wwwwww..',
  ],
  palette: {
    '.': 'transparent',
    w: '#fff7e0',
    B: '#a86840',
    W: '#f4d8a8',
  },
  cellSize: 6,
};

// --- Picture frame (10 × 8) Variants ----------------------------------------
const PICTURE_MEADOW: PixelArt = {
  rows: [
    'wwwwwwwwww',
    'wBBBBBBBBw',
    'wBGGGGGGbw',
    'wBGyyyyGbw',
    'wBGyyyyGbw',
    'wBGGGGGGbw',
    'wBBBBBBBBw',
    'wwwwwwwwww',
  ],
  palette: {
    w: '#fff7e0',
    B: '#a86840',
    G: '#6ad1ff',
    y: '#ffd86b',
    b: '#4090c8',
  },
  cellSize: 8,
};

const PICTURE_MONA_LISA: PixelArt = {
  rows: [
    'wwwwwwwwww',
    'wBBBBBBBBw',
    'wBggddggbw',
    'wBgDDDDgbw',
    'wBgDdDdgbw',
    'wBgDrrDgbw',
    'wBBBBBBBBw',
    'wwwwwwwwww',
  ],
  palette: {
    w: '#fff7e0',
    B: '#a86840',
    g: '#4b5320',
    d: '#2f3513',
    D: '#f3c99f',
    r: '#d96459',
    b: '#382310',
  },
  cellSize: 8,
};

const PICTURE_SHADES: PixelArt = {
  rows: [
    'wwwwwwwwww',
    'wBBBBBBBBw',
    'wBppFFppbw',
    'wBpKKKKpbw',
    'wBpWKwKpbw',
    'wBppwwppbw',
    'wBBBBBBBBw',
    'wwwwwwwwww',
  ],
  palette: {
    w: '#fff7e0',
    B: '#a86840',
    p: '#ffd86b',
    F: '#e8a838',
    K: '#181226',
    W: '#ffffff',
    b: '#945228',
  },
  cellSize: 8,
};

const PICTURE_VARIANTS = [PICTURE_MEADOW, PICTURE_MONA_LISA, PICTURE_SHADES];

// --- Rug (20 × 6) -----------------------------------------------------------
const RUG: PixelArt = {
  rows: [
    'rrrrrrrrrrrrrrrrrrrr',
    'rRRRRRRRRRRRRRRRRRRr',
    'rRyyyyyyyyyyyyyyyyRr',
    'rRyyyyRRRyyyyRRRyyRr',
    'rRRRRRRRRRRRRRRRRRRr',
    'rrrrrrrrrrrrrrrrrrrr',
  ],
  palette: {
    r: '#ff5a6e',
    R: '#c9384e',
    y: '#ffd86b',
  },
  cellSize: 8,
};

export const Bed = memo(function Bed({ className, style }: { className?: string; style?: CSSProperties }) {
  return <PixelArtView art={BED} className={`${styles.bed} ${className ?? ''}`} style={style} />;
});
export const Bowl = memo(function Bowl({ className, style }: { className?: string; style?: CSSProperties }) {
  return <PixelArtView art={BOWL} className={`${styles.bowl} ${className ?? ''}`} style={style} />;
});
export const Toy = memo(function Toy({ className, style }: { className?: string; style?: CSSProperties }) {
  return <PixelArtView art={TOY} className={`${styles.toy} ${className ?? ''}`} style={style} />;
});
export const Window = memo(function Window({
  phase,
  className,
  style,
}: {
  phase?: 'morning' | 'day' | 'evening' | 'night';
  className?: string;
  style?: CSSProperties;
}) {
  const art =
    phase === 'night' ? WINDOW_NIGHT :
    phase === 'evening' ? WINDOW_EVENING :
    phase === 'morning' ? WINDOW_MORNING :
    WINDOW_DAY;
  return <PixelArtView art={art} className={`${styles.window} ${className ?? ''}`} style={style} />;
});
export const Plant = memo(function Plant({ className, style }: { className?: string; style?: CSSProperties }) {
  return <PixelArtView art={PLANT} className={`${styles.plant} ${className ?? ''}`} style={style} />;
});
export const Clock = memo(function Clock({ className, style }: { className?: string; style?: CSSProperties }) {
  return <PixelArtView art={CLOCK} className={`${styles.clock} ${className ?? ''}`} style={style} />;
});
export const Picture = memo(function Picture({
  variant = 0,
  className,
  style,
}: {
  variant?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const art = PICTURE_VARIANTS[variant % PICTURE_VARIANTS.length] ?? PICTURE_MEADOW;
  return <PixelArtView art={art} className={`${styles.picture} ${className ?? ''}`} style={style} />;
});
export const Rug = memo(function Rug({ className, style }: { className?: string; style?: CSSProperties }) {
  return <PixelArtView art={RUG} className={`${styles.rug} ${className ?? ''}`} style={style} />;
});


