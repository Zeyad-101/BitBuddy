/**
 * Pure functions for local time-of-day. BitBuddy is local-only, so
 * the "world clock" is the browser's clock.
 *
 * The 4 phases:
 *   morning  6..10
 *   day     10..17
 *   evening 17..20
 *   night   20..6
 *
 * The phase influences:
 *   - room visual tint (CSS data-attribute)
 *   - clock display
 *   - pet wander activity (multiplier on getWanderChance)
 *   - tiredness tendency (boost to the "tired" energy threshold)
 *   - ambient window art (sun / day / sunset / moon + stars)
 */

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export const TIME_OF_DAY: ReadonlyArray<TimeOfDay> = ['morning', 'day', 'evening', 'night'];

/** Hour bounds for each phase, in 24h local time. */
const PHASE_HOURS: Record<TimeOfDay, { start: number; end: number }> = {
  morning: { start: 6, end: 10 },
  day: { start: 10, end: 17 },
  evening: { start: 17, end: 20 },
  night: { start: 20, end: 6 },
};

/** Pure: derive the phase from a local Date. */
export function getTimeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= PHASE_HOURS.morning.start && h < PHASE_HOURS.morning.end) return 'morning';
  if (h >= PHASE_HOURS.day.start && h < PHASE_HOURS.day.end) return 'day';
  if (h >= PHASE_HOURS.evening.start && h < PHASE_HOURS.evening.end) return 'evening';
  return 'night';
}

/** Human label for HUD display. */
export function getPhaseLabel(phase: TimeOfDay): string {
  switch (phase) {
    case 'morning': return 'Morning';
    case 'day': return 'Day';
    case 'evening': return 'Evening';
    case 'night': return 'Night';
  }
}

/** Short glyph for the HUD. */
export function getPhaseGlyph(phase: TimeOfDay): string {
  switch (phase) {
    case 'morning': return '☀';
    case 'day': return '☀';
    case 'evening': return '☾';
    case 'night': return '☾';
  }
}

/**
 * Multiplier applied to wander probability. Pets are more active during
 * the day, less at night. UI layers this on top of the mood-based chance.
 */
export function getWanderMultiplier(phase: TimeOfDay): number {
  switch (phase) {
    case 'morning': return 1.1;
    case 'day': return 1.0;
    case 'evening': return 0.85;
    case 'night': return 0.5;
  }
}

/**
 * Boost to the "tired" energy threshold. At night, pets get tired more
 * easily — energy threshold effectively becomes 15 lower, so they're
 * more likely to feel sleepy.
 */
export function getTirednessBoost(phase: TimeOfDay): number {
  switch (phase) {
    case 'morning': return 0;
    case 'day': return 0;
    case 'evening': return 5;
    case 'night': return 15;
  }
}

/** CSS color tint the room applies for this phase. */
export function getRoomTint(phase: TimeOfDay): {
  wallpaperOverlay: string;
  floorTint: string;
  glow: string;
} {
  switch (phase) {
    case 'morning':
      return {
        wallpaperOverlay: 'rgba(255, 240, 180, 0.08)',
        floorTint: 'rgba(255, 200, 120, 0.06)',
        glow: 'rgba(255, 220, 150, 0.15)',
      };
    case 'day':
      return {
        wallpaperOverlay: 'rgba(255, 255, 200, 0.04)',
        floorTint: 'rgba(255, 240, 200, 0.04)',
        glow: 'rgba(255, 255, 200, 0.10)',
      };
    case 'evening':
      return {
        wallpaperOverlay: 'rgba(255, 140, 80, 0.12)',
        floorTint: 'rgba(220, 120, 80, 0.08)',
        glow: 'rgba(255, 160, 100, 0.20)',
      };
    case 'night':
      return {
        wallpaperOverlay: 'rgba(20, 30, 80, 0.30)',
        floorTint: 'rgba(20, 30, 60, 0.20)',
        glow: 'rgba(100, 130, 220, 0.10)',
      };
  }
}
