/**
 * Tiny sound-effect layer for BitBuddy.
 *
 * - Web Audio API only (no asset files).
 * - Each SFX is a short generated tone (sine/triangle/square) with
 *   an attack-decay envelope.
 * - AudioContext is created lazily on first user interaction
 *   (respects browser autoplay restrictions).
 * - Mute state is persisted in localStorage.
 *
 * No background music — sound effects only.
 */

export type SfxName =
  | 'feed'
  | 'play'
  | 'clean'
  | 'sleep'
  | 'happy'
  | 'click'
  | 'purr'
  | 'dance'
  | 'ding'
  | 'poof'
  | 'bounce'
  | 'poop'
  | 'sweep';

const MUTED_STORAGE_KEY = 'bitbuddy:muted:v1';

let _ctx: AudioContext | null = null;
let _muted = false;
let _ready = false;

function getAudioCtor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function ensureContext(): AudioContext | null {
  if (_ctx) return _ctx;
  const Ctor = getAudioCtor();
  if (!Ctor) return null;
  try {
    _ctx = new Ctor();
  } catch {
    return null;
  }
  // Load persisted mute on first creation.
  if (!_ready) {
    _ready = true;
    try {
      const raw = localStorage.getItem(MUTED_STORAGE_KEY);
      if (raw === 'true') _muted = true;
    } catch {
      /* ignore */
    }
  }
  return _ctx;
}

/** Returns true if the AudioContext is currently suspended. */
function isSuspended(ctx: AudioContext): boolean {
  return ctx.state === 'suspended';
}

/** Resume the AudioContext after a user gesture. */
async function prime(): Promise<void> {
  const ctx = ensureContext();
  if (!ctx) return;
  if (isSuspended(ctx)) {
    try {
      await ctx.resume();
    } catch {
      /* ignore */
    }
  }
}

interface ToneSpec {
  waveform: OscillatorType;
  startHz: number;
  endHz: number;
  duration: number;
  peakGain: number;
}

const SPECS: Record<SfxName, ToneSpec> = {
  feed: { waveform: 'sine', startHz: 440, endHz: 520, duration: 0.15, peakGain: 0.12 },
  play: { waveform: 'sine', startHz: 520, endHz: 880, duration: 0.18, peakGain: 0.10 },
  clean: { waveform: 'triangle', startHz: 660, endHz: 880, duration: 0.20, peakGain: 0.09 },
  sleep: { waveform: 'sine', startHz: 440, endHz: 220, duration: 0.45, peakGain: 0.10 },
  happy: { waveform: 'sine', startHz: 660, endHz: 660, duration: 0.10, peakGain: 0.10 },
  click: { waveform: 'square', startHz: 220, endHz: 220, duration: 0.04, peakGain: 0.06 },
  purr: { waveform: 'triangle', startHz: 220, endHz: 260, duration: 0.25, peakGain: 0.12 },
  dance: { waveform: 'square', startHz: 520, endHz: 780, duration: 0.22, peakGain: 0.09 },
  ding: { waveform: 'sine', startHz: 880, endHz: 1320, duration: 0.35, peakGain: 0.14 },
  poof: { waveform: 'triangle', startHz: 440, endHz: 220, duration: 0.18, peakGain: 0.08 },
  bounce: { waveform: 'sine', startHz: 260, endHz: 640, duration: 0.16, peakGain: 0.12 },
  poop: { waveform: 'square', startHz: 160, endHz: 90, duration: 0.15, peakGain: 0.11 },
  sweep: { waveform: 'sine', startHz: 440, endHz: 1100, duration: 0.22, peakGain: 0.10 },
};

function playTone(spec: ToneSpec, ctx: AudioContext, when: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = spec.waveform;
  // Frequency ramp.
  const f0 = spec.startHz;
  const f1 = spec.endHz;
  osc.frequency.setValueAtTime(f0, when);
  if (f1 !== f0) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), when + spec.duration);
  }
  // Envelope: short attack, exponential decay.
  const a = Math.max(0.005, spec.duration * 0.1);
  const d = Math.max(0.02, spec.duration - a);
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(spec.peakGain, when + a);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + a + d);
  osc.connect(gain).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + spec.duration + 0.02);
}

/** Play a sound effect. Silent when muted. */
export function playSfx(name: SfxName): void {
  if (_muted) return;
  const ctx = ensureContext();
  if (!ctx) return;
  // Schedule a resume on the next user gesture; if it never comes,
  // the call simply does nothing.
  if (isSuspended(ctx)) {
    void prime();
    return;
  }
  const spec = SPECS[name];
  if (!spec) return;
  playTone(spec, ctx, ctx.currentTime);
}

export function isMuted(): boolean {
  return _muted;
}

export function setMuted(muted: boolean): void {
  _muted = muted;
  try {
    localStorage.setItem(MUTED_STORAGE_KEY, String(muted));
  } catch {
    /* ignore */
  }
}

export function toggleMuted(): boolean {
  setMuted(!_muted);
  // Attempt to prime on the first user gesture so future calls work.
  void prime();
  return _muted;
}
