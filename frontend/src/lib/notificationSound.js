let ctx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

// Soft two-tone "ding" — short bell-like sine with a quick attack and
// exponential decay, kept quiet so it doesn't feel like an alarm.
export function playNotificationDing() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});

  const now = audioCtx.currentTime;
  const notes = [
    { freq: 1046.5, start: 0, gain: 0.16 },
    { freq: 1568, start: 0.09, gain: 0.1 },
  ];

  notes.forEach(({ freq, start, gain }) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const t0 = now + start;
    gainNode.gain.setValueAtTime(0, t0);
    gainNode.gain.linearRampToValueAtTime(gain, t0 + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + 0.55);
  });
}
