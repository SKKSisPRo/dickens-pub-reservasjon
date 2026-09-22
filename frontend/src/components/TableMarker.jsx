// The approved T6 composite icon (table + chairs), minus the one chair that
// would face the shared BenchStrip behind it. Chairs are drawn on the top,
// left and right sides in the icon's own coordinate space; `rotation` turns
// that open cluster to face away from whichever wall the table backs onto
// (180 = wall above/T-series, 90 = wall to the left/V-series, 270 = wall to
// the right/H-series).
export const MARKER_LIGHT = {
  available: '#4BAB8B',
  occupied: '#AB4B4B',
  selected: '#ABAB49',
  tooSmall: '#9CA3AF',
};

const MARKER_DARK = {
  available: '#1E4538',
  occupied: '#451E20',
  selected: '#46401D',
  tooSmall: '#6B7280',
};

export default function TableMarker({ state, rotation = 0, className }) {
  const light = MARKER_LIGHT[state];
  const dark = MARKER_DARK[state];
  const isSelected = state === 'selected';
  const stroke = isSelected ? '#8B6414' : 'rgba(0,0,0,0.13)';
  const strokeWidth = isSelected ? 5 : 1.5;

  return (
    <svg viewBox="0 0 100 100" className={className} style={isSelected ? { filter: 'drop-shadow(0 0 6px rgba(184,134,44,0.8))' } : undefined}>
      <g transform={`rotate(${rotation} 50 50)`}>
        {/* chairs: top, left, right (bottom omitted — that side sits on the shared bench) */}
        <rect x="38" y="4" width="24" height="16" rx="6" fill={dark} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <rect x="4" y="38" width="16" height="24" rx="6" fill={dark} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <rect x="80" y="38" width="16" height="24" rx="6" fill={dark} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />

        {/* table */}
        <rect x="26" y="26" width="48" height="48" rx="12" fill={light} stroke={stroke} strokeWidth={strokeWidth} />
      </g>
    </svg>
  );
}
