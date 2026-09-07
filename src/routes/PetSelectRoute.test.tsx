import { describe, it, expect, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { PetSelectRoute } from './PetSelectRoute';
import { PetProvider } from '../features/pet/state/PetProvider';
import { PixelPet } from '../ui/PixelPet';
import type { PetType } from '../features/pet/types';

describe('PetSelectRoute & Pet Preview Rendering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders hero pet preview with non-empty pixel grid cells', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    root.render(
      <PetProvider>
        <MemoryRouter initialEntries={['/select']}>
          <PetSelectRoute />
        </MemoryRouter>
      </PetProvider>,
    );

    await new Promise((r) => setTimeout(r, 200));

    const heroPet = div.querySelector('[class*="hero-pet"]');
    expect(heroPet).not.toBeNull();

    const pixelPet = heroPet?.querySelector('[class*="pixel-pet"]');
    expect(pixelPet).not.toBeNull();
    expect(pixelPet?.getAttribute('data-type')).toBe('cat');

    const grid = pixelPet?.querySelector('[class*="grid"]');
    expect(grid?.children.length).toBe(196); // 14 x 14

    const colored = Array.from(grid?.children ?? []).filter(
      (c) => (c as HTMLElement).style.backgroundColor && (c as HTMLElement).style.backgroundColor !== 'transparent',
    );
    expect(colored.length).toBeGreaterThan(50);
  });

  it('renders all four character roster options with interactive radio states', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    root.render(
      <PetProvider>
        <MemoryRouter initialEntries={['/select']}>
          <PetSelectRoute />
        </MemoryRouter>
      </PetProvider>,
    );

    await new Promise((r) => setTimeout(r, 200));

    const radioButtons = div.querySelectorAll('button[role="radio"]');
    expect(radioButtons.length).toBe(4);

    const dogButton = Array.from(radioButtons).find(
      (b) => b.getAttribute('data-type') === 'dog',
    ) as HTMLButtonElement;
    expect(dogButton).toBeDefined();

    // Click Dog to switch selection
    dogButton.click();
    await new Promise((r) => setTimeout(r, 100));

    const heroPet = div.querySelector('[class*="hero-pet"]');
    const pixelPet = heroPet?.querySelector('[class*="pixel-pet"]');
    expect(pixelPet?.getAttribute('data-type')).toBe('dog');

    // Confirm CTA updates label
    const confirmBtn = div.querySelector('[class*="confirm-button"]');
    expect(confirmBtn?.textContent).toContain('CHOOSE DOG');
  });

  it('renders PixelPet for all four pet types with non-empty visible cells', async () => {
    const types: PetType[] = ['cat', 'dog', 'hamster', 'bird'];
    for (const type of types) {
      const div = document.createElement('div');
      const root = createRoot(div);
      root.render(<PixelPet type={type} mood="happy" cellSize={10} />);
      await new Promise((r) => setTimeout(r, 100));

      const pixelPet = div.querySelector('[class*="pixel-pet"]');
      expect(pixelPet?.getAttribute('data-type')).toBe(type);

      const grid = pixelPet?.querySelector('[class*="grid"]');
      expect(grid?.children.length).toBe(196);

      const colored = Array.from(grid?.children ?? []).filter(
        (c) => (c as HTMLElement).style.backgroundColor && (c as HTMLElement).style.backgroundColor !== 'transparent',
      );
      expect(colored.length).toBeGreaterThan(50);
    }
  });
});
