/**
 * Find every row in every sprite that's not exactly 14 chars.
 * Usage: node scripts/find-bad-sprite-rows.mjs
 */
import { readFileSync } from 'node:fs';

const files = [
  'src/features/pet/assets/sprites/cat.ts',
  'src/features/pet/assets/sprites/dog.ts',
  'src/features/pet/assets/sprites/hamster.ts',
  'src/features/pet/assets/sprites/bird.ts',
];

const W = 14;

for (const f of files) {
  const txt = readFileSync(f, 'utf8');
  const lines = txt.split('\n');
  let inFrameArray = false;
  let frameKey = '';
  let rowIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const frameStart = line.match(/^\s*(\w[\w-]*):\s*\[/);
    if (frameStart) {
      inFrameArray = true;
      frameKey = frameStart[1];
      rowIdx = 0;
      continue;
    }
    if (inFrameArray && line.trim().startsWith(']')) {
      inFrameArray = false;
      continue;
    }
    if (inFrameArray) {
      const m = line.match(/^\s*'(.*)',?\s*$/);
      if (m) {
        const content = m[1];
        if (content.length !== W) {
          console.log(`${f}: frame "${frameKey}" row ${rowIdx}: ${content.length} chars — ${JSON.stringify(content)}`);
        }
        rowIdx++;
      }
    }
  }
}
