BitBuddy 🐾

Your little digital friend.

BitBuddy is a cozy pixel-art virtual pet game that runs in your browser.

Pick a buddy, give them a name, take care of them, and come back later to see how they're doing. Your buddy is saved locally in the browser, so there is no account, login, or backend required.







What is BitBuddy?

BitBuddy is built around a simple idea: give the player one small character worth checking on.

You can:

🐱 Choose a cat, dog, hamster, or bird

✏️ Give your buddy a name

🍖 Feed them

🎾 Play with them

🫧 Clean them

😴 Put them to sleep

🏠 Let them wander around their room

🌅 See the room change with the time of day

💾 Close the game and come back to the same buddy later

📱 Play from a phone, tablet, or desktop browser

There are no accounts and no cloud saves. BitBuddy keeps the current buddy in the browser's local storage.

The vibe

BitBuddy takes the look of a tiny retro handheld game and gives it a modern web home.

The visual direction uses:

crisp pixel-art rendering

a small retro color palette

deep navy and purple backgrounds

chunky game-style controls

animated pets

room decorations

small particle effects

simple sound effects

a mobile-first layout

The goal is for the interface to feel like a game screen rather than a typical web dashboard.

Pets

Choose one buddy and stick with them.

Buddy

Personality

🐱 Cat

Calm, curious, independent

🐶 Dog

Energetic, friendly, playful

🐹 Hamster

Curious, busy, always looking for something

🐦 Bird

Lively, social, and cheerful

Each pet has its own pixel-art palette, reactions, movement style, and personality cues.

Core loop

Choose a buddy
      ↓
Give them a name
      ↓
Meet your buddy
      ↓
Feed • Play • Clean • Sleep
      ↓
Watch their mood change
      ↓
Come back later
      ↓
See the same buddy waiting for you

The game also keeps track of elapsed time. When you return after being away, the pet's needs are updated from the time that has passed.

Rooms and behavior

Your buddy lives in a small pixel-art room with objects such as a bed, food bowl, toy, window, plant, clock, picture, and rug.

The pet can wander between room points and react to its current state.

For example:

High happiness → more energetic behavior

Low hunger → hungry reactions

Low energy → slower movement and sleepy behavior

Sleep → the pet settles into the bed and recovers over time

Time of day → changes the room atmosphere and affects activity

Small details are meant to make the pet feel like a character instead of a static sprite.

Persistence

BitBuddy is intentionally local-first.

Browser
  │
  └── localStorage
        │
        └── Your Buddy

No sign-up is required.

The save includes the pet's current state, including things such as:

name

species

stats

growth state

timestamps

sleep state

activity-related data

Because the save lives in the browser, it stays with that browser/device. It does not automatically sync to another device.

Tech stack

Part

Technology

UI

React 18

Language

TypeScript

Build tool

Vite

Routing

React Router

State

React Context + useReducer

Game logic

Pure TypeScript simulation functions

Persistence

Browser localStorage

Styling

CSS + CSS Modules

Audio

Web Audio API

Tests

Vitest

Installability

PWA via vite-plugin-pwa

Project structure

BitBuddy/
├── public/
│   ├── favicon.svg
│   ├── pwa-192.png
│   ├── pwa-512.png
│   └── sprites/
│
├── scripts/
│   └── project utility scripts
│
├── src/
│   ├── audio/
│   ├── features/
│   │   └── pet/
│   │       ├── assets/
│   │       ├── persistence/
│   │       ├── simulation/
│   │       └── state/
│   │
│   ├── routes/
│   ├── styles/
│   └── ui/
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts

The game simulation is kept separate from the UI:

UI
 ↓
Game State
 ↓
Simulation Engine
 ↓
Local Persistence

This keeps the rules for feeding, playing, cleaning, sleeping, mood, growth, and elapsed time out of the visual components.

Run locally

Make sure Node.js is installed, then:

git clone https://github.com/Zeyad-101/BitBuddy.git
cd BitBuddy
npm install
npm run dev

Open the local URL shown by Vite.

Useful commands

npm run dev

Start the development server.

npm run test

Run the test suite.

npm run typecheck

Run the TypeScript compiler without emitting files.

npm run build

Create the production build.

npm run preview

Preview the production build locally.

Build and deployment

BitBuddy is a client-side Vite application and can be deployed as a static web app.

For Vercel, the usual setup is:

Framework Preset: Vite
Build Command:    npm run build
Output Directory: dist

No backend service or environment variables are required for the local-only version.

PWA

BitBuddy includes PWA support so supported browsers can install it to a device home screen.

The game can still be opened directly from its normal web URL.

Roadmap

The project is intentionally growing in small steps.

Possible future additions include:

🛏️ More room interactions

🌱 More room decorations

🌟 More detailed growth stages

📖 Buddy memories and a small journal

🎮 Mini-games

🎨 More customization

🔊 More polished sound and music

📱 Better offline support

The priority is keeping the core care loop fun before adding a large number of systems.

Contributing

This is a personal project. Suggestions, bug reports, and improvements are welcome through GitHub issues or pull requests.

License

Personal project.

<p align="center">
  <sub>Built with pixels, TypeScript, and a small digital buddy. 🐾</sub>
</p>
