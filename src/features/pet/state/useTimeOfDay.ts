import { useEffect, useState } from 'react';
import { getTimeOfDay, type TimeOfDay } from '../simulation/timeOfDay';

/**
 * Returns the current time-of-day phase, re-evaluated each minute.
 * Pure dependency on `Date.now()` — re-renders when the minute changes.
 */
export function useTimeOfDay(): TimeOfDay {
  const [phase, setPhase] = useState<TimeOfDay>(() => getTimeOfDay(new Date()));

  useEffect(() => {
    const tick = () => setPhase(getTimeOfDay(new Date()));
    // Re-evaluate every 30s so we don't miss a phase boundary.
    const id = window.setInterval(tick, 30 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return phase;
}
