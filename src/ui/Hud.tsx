import { memo, useEffect, useMemo, useState } from 'react';
import type { Mood, PetState } from '../features/pet/types';
import { getReactionText } from '../features/pet/simulation';
import { getPhaseLabel, type TimeOfDay } from '../features/pet/simulation/timeOfDay';
import styles from './Hud.module.css';

interface HudProps {
  pet: PetState;
  mood: Mood;
  lastAction: 'feed' | 'play' | 'clean' | 'sleep' | null;
  phase: TimeOfDay;
}

const STAT_META: Array<{ key: keyof PetState; label: string; color: string }> = [
  { key: 'hunger', label: 'Food', color: 'var(--color-stat-hunger)' },
  { key: 'happiness', label: 'Happy', color: 'var(--color-stat-happiness)' },
  { key: 'energy', label: 'Energy', color: 'var(--color-stat-energy)' },
  { key: 'cleanliness', label: 'Clean', color: 'var(--color-stat-cleanliness)' },
  { key: 'health', label: 'Health', color: 'var(--color-stat-health)' },
];

const MOOD_COLORS: Record<Mood, string> = {
  happy: 'var(--color-pixel-yellow)',
  'well-cared-for': 'var(--color-pixel-green)',
  hungry: 'var(--color-stat-hunger)',
  tired: 'var(--color-stat-energy)',
  sad: 'var(--color-stat-health)',
  sleeping: 'var(--color-pixel-blue)',
};

const PHASE_COLORS: Record<TimeOfDay, string> = {
  morning: 'var(--color-stat-hunger)',
  day: 'var(--color-pixel-yellow)',
  evening: 'var(--color-pixel-red)',
  night: 'var(--color-pixel-blue)',
};

export const Hud = memo(function Hud({ pet, mood, lastAction, phase }: HudProps) {

  const daysOld = useMemo(() => {
    const days = Math.floor((Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24));
    return days;
  }, [pet.createdAt]);

  // Live clock — re-renders every minute so the displayed time is honest.
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30 * 1000);
    return () => window.clearInterval(id);
  }, []);
  const clock = useMemo(() => {
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }, [now]);

  const moodColor = MOOD_COLORS[mood];
  const reaction = getReactionText(mood, pet.type, lastAction);
  const phaseColor = PHASE_COLORS[phase];

  return (
    <div className={styles.hud} aria-label="BitBuddy HUD">
      <div className={styles.identity}>
        <span className={styles.name}>{pet.name}</span>
        <div className={styles.subline}>
          <span className={styles.age}>Day {daysOld}</span>
          <span className={styles.stage}>{pet.growthStage}</span>
          <span>· "{reaction}"</span>
        </div>
      </div>
      <div className={styles['hud-right']}>
        <div
          className={styles.phase}
          data-phase={phase}
          style={{ ['--phase-color' as string]: phaseColor }}
          aria-label={`Time of day: ${getPhaseLabel(phase)}`}
          title={getPhaseLabel(phase)}
        >
          <span className={styles.clock} aria-hidden="true">{clock}</span>
          <span className={styles['phase-label']}>{getPhaseLabel(phase)}</span>
        </div>
        <div
          className={styles.mood}
          style={{ ['--mood-color' as string]: moodColor }}
          aria-label={`Mood: ${mood}`}
        >
          <span className={styles['mood-dot']} aria-hidden="true" />
          <span>{mood}</span>
        </div>
      </div>

      <div className={styles.stats}>
        {STAT_META.map((s) => {
          const v = pet[s.key] as number;
          const pct = Math.max(0, Math.min(100, v));
          return (
            <div key={s.key} className={styles.stat}>
              <span
                className={styles.icon}
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              <span className={styles['stat-label']}>{s.label}</span>
              <div className={styles['stat-bar']} aria-hidden="true">
                <div
                  className={styles['stat-fill']}
                  style={{
                    width: `${pct}%`,
                    ['--stat-color' as string]: s.color,
                  } as React.CSSProperties}
                />
              </div>
              <span className={styles['stat-value']}>{Math.round(v)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

