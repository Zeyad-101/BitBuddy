import { describe, it, expect, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from '../../../App';
import { STORAGE_KEY } from '../constants';
import { createPet } from '../state/createPet';
import { LocalStoragePetRepository } from '../persistence/LocalStoragePetRepository';

describe('Persistence Safety & Rendering Resilience', () => {
  let repo: LocalStoragePetRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalStoragePetRepository();
  });

  it('1. Fresh install (clean browser state) renders Landing title screen', async () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 150));
    expect(div.innerHTML).toContain('BitBuddy');
    expect(div.innerHTML).toContain('Start');
  });

  it('2. Existing valid save loads and renders pet room', async () => {
    const pet = createPet('cat', 'Milo');
    await repo.save(pet);

    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 200));
    expect(div.innerHTML).toContain('Milo');
  });

  it('3. Legacy or partial save safely migrates without crashing', async () => {
    const legacySave = {
      id: 'legacy-buddy-42',
      name: 'RetroBuddy',
      type: 'CAT', // uppercase
      hunger: 65,
      happiness: 70,
      // Missing energy, cleanliness, health, timestamps, forcedSleep
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacySave));

    const loaded = await repo.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.name).toBe('RetroBuddy');
    expect(loaded?.type).toBe('cat'); // normalized
    expect(loaded?.energy).toBe(80); // defaulted
    expect(loaded?.cleanliness).toBe(100); // defaulted
    expect(loaded?.forcedSleep).toBe(false);

    // Verify it renders in the UI without crashing
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 200));
    expect(div.innerHTML).toContain('RetroBuddy');
  });

  it('4. Malformed JSON does not crash the app and resets cleanly', async () => {
    localStorage.setItem(STORAGE_KEY, '<<<MALFORMED_JSON>>>');

    const loaded = await repo.load();
    expect(loaded).toBeNull();
    // Stale corrupted item removed from storage
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    // App renders landing route cleanly
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 150));
    expect(div.innerHTML).toContain('BitBuddy');
  });

  it('5. Unknown pet type falls back safely and does not crash PixelPet', async () => {
    const alienPet = {
      id: 'alien-1',
      name: 'Zorg',
      type: 'dragon', // unrecognised species
      hunger: 50,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alienPet));

    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await new Promise((r) => setTimeout(r, 200));
    // Renders gracefully with safe fallback type
    expect(div.innerHTML).toContain('Zorg');
  });
});
