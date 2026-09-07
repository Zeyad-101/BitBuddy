import { useEffect, useRef, useState } from 'react';
import type { Mood, PetType, WanderAnchorId } from '../types';
import {
  getBedAffinity,
  getRestDurationMs,
  getSleepingAnchor,
  getWalkDurationMs,
  getWanderChance,
  getYawnChance,
  getYawnText,
  pickNextAnchor,
} from '../simulation';
import { getWanderMultiplier, type TimeOfDay } from '../simulation/timeOfDay';
import { ROOM_ANCHORS, WANDER_DECISION_MAX_MS, WANDER_DECISION_MIN_MS } from '../constants';

interface UsePetBehaviorArgs {
  mood: Mood;
  petType: PetType;
  energy: number;
  /** When set, the pet walks to this anchor and pauses for overlayMs. */
  actionTarget?: { anchor: WanderAnchorId; overlayMs: number } | null;
  /** Current time-of-day phase. Multiplies wander chance. */
  phase?: TimeOfDay;
}

interface PetBehaviorState {
  anchor: WanderAnchorId;
  walkDurationMs: number;
  /** Drives the reaction bubble text shown above the pet. */
  reactionText: string | null;
  /** Setter used to surface a one-off reaction after an action. */
  showReaction: (text: string, durationMs?: number) => void;
}

/**
 * Drives the pet's idle/walk loop.
 * - Sleeping → stay near bed, no wander.
 * - Otherwise → rest, then maybe walk to a different anchor.
 * - Mood modulates walk speed, wander chance, and rest length.
 * - Energy modulates bed affinity: low-energy pets wander to bed more.
 * - Phase modulates wander chance: night is calmer, morning is buzzier.
 *
 * Action overlay (eating/playing): walks to the target anchor, pauses there,
 * then resumes wandering once the overlay timer ends.
 */
export function usePetBehavior({
  mood,
  petType,
  energy,
  actionTarget,
  phase = 'day',
}: UsePetBehaviorArgs): PetBehaviorState {
  const [anchor, setAnchor] = useState<WanderAnchorId>('center');
  const [walkDurationMs, setWalkDurationMs] = useState<number>(() => getWalkDurationMs('happy'));
  const [reactionText, setReactionText] = useState<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const reactionTimerRef = useRef<number | null>(null);
  const yawnTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = null;
    }
  };

  const schedule = (cb: () => void, ms: number) => {
    const id = window.setTimeout(cb, ms);
    timersRef.current.push(id);
    return id;
  };

  const showReaction = (text: string, durationMs = 1800) => {
    setReactionText(text);
    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
    }
    reactionTimerRef.current = window.setTimeout(() => {
      setReactionText(null);
      reactionTimerRef.current = null;
    }, durationMs);
  };

  // Reset everything when mood or petType changes (also on mount).
  useEffect(() => {
    clearTimers();

    const sleepingAnchor = getSleepingAnchor(mood);
    if (sleepingAnchor) {
      setAnchor(sleepingAnchor);
      setWalkDurationMs(getWalkDurationMs(mood));
      stopYawns();
      return clearTimers;
    }

    setWalkDurationMs(getWalkDurationMs(mood));
    startYawns();

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const baseChance = getWanderChance(mood);
      const chance = baseChance * getWanderMultiplier(phase);
      const roll = Math.random();
      const decisionDelay =
        WANDER_DECISION_MIN_MS +
        Math.random() * (WANDER_DECISION_MAX_MS - WANDER_DECISION_MIN_MS);

      if (roll < chance) {
        const bed = getBedAffinity(energy);
        let next: WanderAnchorId;
        if (Math.random() < bed) {
          next = 'bed';
        } else {
          next = pickNextAnchor(anchor, ROOM_ANCHORS);
        }
        const rest = getRestDurationMs(mood);
        setAnchor(next);
        schedule(tick, rest);
      } else {
        schedule(tick, decisionDelay);
      }
    };

    // Start by resting at the current anchor, then start the loop.
    const initialRest = getRestDurationMs(mood);
    schedule(tick, initialRest);

    return () => {
      cancelled = true;
      clearTimers();
      stopYawns();
    };
  }, [mood, petType, energy, phase, anchor]);

  // Yawn loop: every few seconds, check if the pet should yawn.
  function startYawns() {
    stopYawns();
    const yawn = () => {
      if (Math.random() < getYawnChance(energy)) {
        showReaction(getYawnText(petType), 1500);
      }
      const next = 4000 + Math.random() * 4000;
      yawnTimerRef.current = window.setTimeout(yawn, next);
    };
    const first = 3000 + Math.random() * 3000;
    yawnTimerRef.current = window.setTimeout(yawn, first);
  }

  function stopYawns() {
    if (yawnTimerRef.current !== null) {
      window.clearTimeout(yawnTimerRef.current);
      yawnTimerRef.current = null;
    }
  }

  // Action overlay drives a one-shot walk to the target anchor, then resume.
  useEffect(() => {
    if (!actionTarget) return;
    clearTimers();
    setAnchor(actionTarget.anchor);
    setWalkDurationMs(getWalkDurationMs(mood));
    const resumeTimer = window.setTimeout(() => {
      // After the overlay, kick the loop again.
      const rest = getRestDurationMs(mood);
      const tick = () => {
        const baseChance = getWanderChance(mood);
        const chance = baseChance * getWanderMultiplier(phase);
        const roll = Math.random();
        if (roll < chance) {
          const bed = getBedAffinity(energy);
          const next = Math.random() < bed ? 'bed' : pickNextAnchor(actionTarget.anchor, ROOM_ANCHORS);
          setAnchor(next);
        }
        const decisionDelay =
          WANDER_DECISION_MIN_MS +
          Math.random() * (WANDER_DECISION_MAX_MS - WANDER_DECISION_MIN_MS);
        window.setTimeout(tick, decisionDelay);
      };
      window.setTimeout(tick, rest);
    }, actionTarget.overlayMs);
    timersRef.current.push(resumeTimer);
    return () => clearTimers();
  }, [actionTarget, mood, energy, phase]);

  return { anchor, walkDurationMs, reactionText, showReaction };
}
