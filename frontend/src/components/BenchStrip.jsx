// Static, non-interactive shared bench background. Always the same neutral tone —
// it's structural furniture, not a per-table status indicator.
const BENCH_COLOR = '#1E4538';

export default function BenchStrip({ top, left, width, height }) {
  return (
    <div
      className="absolute rounded-2xl shadow-inner pointer-events-none"
      style={{
        top,
        left,
        width,
        height,
        background: BENCH_COLOR,
        border: '1px solid rgba(0,0,0,0.15)',
      }}
      aria-hidden="true"
    />
  );
}
