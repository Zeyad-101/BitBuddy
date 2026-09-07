# BitBuddy

**Your little digital friend.**

A retro pixel-art virtual pet that lives in your browser. Hatch a tiny companion, take care of it, and watch it grow through life stages.

BitBuddy is an account-free local browser game. Your pet lives in this browser's `localStorage` — no accounts, no servers, no cloud.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # strict TypeScript
npm run test         # vitest — pure simulation functions
npm run build        # production build
npm run preview      # preview the production build
```

## Tech stack

| Layer | Choice |
|---|---|
| Bundler | Vite 5 |
| Framework | React 18 + TypeScript (strict) |
| Routing | react-router-dom |
| State | Context + `useReducer` (no extra deps) |
| Persistence | `LocalStoragePetRepository` (only) behind a `PetRepository` interface |
| PWA | `vite-plugin-pwa` |
| Tests | Vitest (pure simulation functions only) |
| Styling | Plain CSS + CSS Modules + custom-property tokens |
| Audio | Web Audio API (generated tones, no asset files) |

## Architecture

```
Game UI  →  Game State (Context/Reducer)  →  Simulation Engine (pure)  →  Local Persistence
```

- **UI** (`src/ui/`, `src/routes/`) — never holds game rules.
- **State** (`src/features/pet/state/`) — wires pure simulation results to React.
- **Simulation** (`src/features/pet/simulation/`) — all pure functions (`feedPet`, `applyElapsedTime`, `calculateMood`, `calculateGrowth`, `getTimeOfDay`, `getYawnChance`, `getBedAffinity`, …).
- **Persistence** (`src/features/pet/persistence/`) — `PetRepository` interface; `LocalStoragePetRepository` is the only implementation.
- **Audio** (`src/audio/sfx.ts`) — `playSfx(name)` abstraction with mute support.

All game-tuning numbers live in `src/features/pet/constants.ts`.

## Folder map

```
src/
├── main.tsx                       React entry + Router
├── App.tsx                        Routes + provider
├── styles/                        tokens.css, global.css, pixel.css
├── routes/                        Landing, Select, Name, Room
├── ui/                            PixelPet, Hud, RoomScene, ActionButton, ParticleBurst, Furniture, …
├── audio/                         sfx.ts — Web Audio API tone generator + mute
├── lib/                           time.ts (clock)
└── features/pet/
    ├── types.ts                   PetState, PetType, Mood, GrowthStage
    ├── constants.ts               ALL game constants
    ├── simulation/                Pure functions (feedPet, applyElapsedTime, …)
    ├── persistence/               PetRepository interface + LocalStorage implementation
    ├── state/                     PetContext, PetProvider, usePet, createPet, usePetBehavior
    └── assets/                    Sprite registry (cat, dog, hamster, bird)
```

## Swapping in final pixel-art assets

The pet sprite registry (`src/features/pet/assets/sprites/`) currently uses 14×14 color grids with one palette per pet. Replace with PNG sprite sheets following the README in that folder — no consumer code needs to change.

## Out of scope (deliberately)

BitBuddy stays focused on the core "take care of your pet" loop. Not in the game: mini-games, shop/economy, achievements, multiple pets, social features, accounts, cloud saves, background music.
