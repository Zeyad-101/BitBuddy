import { useEffect, useState } from 'react';
import styles from './ParticleBurst.module.css';

export type ParticleVariant =
  | 'burst'
  | 'crumbs'
  | 'sparkles'
  | 'bubbles'
  | 'zzz'
  | 'hearts'
  | 'puffs';

interface ParticleBurstProps {
  /** Increments to trigger a new burst. */
  trigger: number;
  /** Visual flavor of the burst. */
  variant?: ParticleVariant;
  /** Base color of the particles. */
  color?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  rotate: number;
}

const COUNT_BY_VARIANT: Record<ParticleVariant, number> = {
  burst: 8,
  crumbs: 6,
  sparkles: 7,
  bubbles: 5,
  zzz: 3,
  hearts: 4,
  puffs: 5,
};

const DURATION_BY_VARIANT: Record<ParticleVariant, number> = {
  burst: 700,
  crumbs: 900,
  sparkles: 800,
  bubbles: 1100,
  zzz: 1600,
  hearts: 1100,
  puffs: 900,
};

/** CSS-driven pixel particles for action feedback. No canvas. */
export function ParticleBurst({ trigger, variant = 'burst', color }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const count = COUNT_BY_VARIANT[variant];
  const duration = DURATION_BY_VARIANT[variant];

  useEffect(() => {
    if (trigger === 0) return;
    const base = Date.now();
    const next: Particle[] = Array.from({ length: count }, (_, i) => {
      const ang = (i / count) * Math.PI * 2 + rand(i, count) * 0.4;
      const dist = 30 + rand(count + i, count) * 30;
      return {
        id: base + i,
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist,
        delay: rand(i * 2, count) * 80,
        rotate: rand(i * 3, count) * 60 - 30,
      };
    });
    setParticles(next);
    const t = window.setTimeout(() => setParticles([]), duration + 200);
    return () => window.clearTimeout(t);
  }, [trigger, count, duration]);

  if (particles.length === 0) return null;

  return (
    <div
      className={`${styles.burst} ${styles[`v-${variant}`] ?? ''}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          data-variant={variant}
          style={
            {
              ['--x' as string]: `${p.x}px`,
              ['--y' as string]: `${p.y}px`,
              ['--delay' as string]: `${p.delay}ms`,
              ['--rot' as string]: `${p.rotate}deg`,
              ['--dur' as string]: `${duration}ms`,
              backgroundColor: color ?? 'var(--color-pixel-yellow)',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Deterministic pseudo-random so server/client renders match. */
function rand(i: number, salt: number): number {
  const v = Math.sin(i * 9301 + salt * 49297) * 233280;
  return v - Math.floor(v);
}
