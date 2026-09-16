/**
 * Generates a soft, soothing, non-intrusive harmonic chime using Web Audio API.
 * Designed to sound like a gentle glass waterdrop / warm premium notification.
 * Soft attack and warm decay without any harsh or irritating frequencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playPayoutChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master subtle gain node to ensure low, pleasant volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.12, now); // Gentle volume (non-irritating)
    masterGain.connect(ctx.destination);

    // Warm Lowpass Filter for soft, rounded tone (cuts sharp highs)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(masterGain);

    // Note 1: E5 (659.25 Hz) - Warm first note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.4, now + 0.03); // Soft attack
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.5); // Smooth decay

    osc1.connect(gain1);
    gain1.connect(filter);
    osc1.start(now);
    osc1.stop(now + 0.52);

    // Note 2: B5 (987.77 Hz) - Sweet harmonic fifth
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.08);

    gain2.gain.setValueAtTime(0.0001, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.5, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    osc2.connect(gain2);
    gain2.connect(filter);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.72);

    // Note 3: E6 (1318.5 Hz) - Gentle sparkle
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1318.5, now + 0.16);

    gain3.gain.setValueAtTime(0.0001, now + 0.16);
    gain3.gain.linearRampToValueAtTime(0.35, now + 0.19);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    osc3.connect(gain3);
    gain3.connect(filter);
    osc3.start(now + 0.16);
    osc3.stop(now + 0.88);
  } catch (e) {
    console.debug('Audio chime unable to play without user interaction yet', e);
  }
}
