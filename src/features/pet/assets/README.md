# Pet assets

This folder is the **asset abstraction boundary** for BitBuddy.

The current `pets.ts` renders **placeholder** pixel-art using small `8x8` color grids + CSS. This is enough to ship the architecture and feel like a tiny handheld game. The brief explicitly allows temporary assets.

## Swapping in final pixel art

When real sprite sheets are ready:

1. Drop PNG sprite sheets into `src/features/pet/assets/sprites/` (or `public/sprites/`).
2. Replace `PixelGrid` with a `SpriteRef` (path + frame size + frame count).
3. Update `selectSpriteForMood` to return the correct frame index.

The rest of the codebase only ever reads `getPetSprite(type)` and `selectSpriteForMood(sprite, mood)`, so consumers (UI components) won't change.
