// The interactive, status-colored per-table element that sits on top of a shared
// BenchStrip: a marker box showing the capacity number plus one small chair mark,
// matching the pub's own floor-plan diagram (bench = fixed furniture, marker = booking).
export const MARKER_LIGHT = {
  available: '#4BAB8B',
  occupied: '#AB4B4B',
  selected: '#ABAB49',
  tooSmall: '#9CA3AF',
};

export default function TableMarker({ state, capacity, className }) {
  const fill = MARKER_LIGHT[state];
  const isSelected = state === 'selected';
  const stroke = isSelected ? '#8B6414' : 'rgba(0,0,0,0.2)';
  const strokeWidth = isSelected ? 5 : 1.5;

  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* chair mark, open side */}
      <rect x="78" y="36" width="18" height="28" rx="7" fill={fill} opacity="0.85" />
      {/* table marker */}
      <rect x="6" y="14" width="70" height="72" rx="14" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <text
        x="41"
        y="58"
        textAnchor="middle"
        fontSize="34"
        fontWeight="800"
        fill="white"
        style={{ fontFamily: 'sans-serif' }}
      >
        {capacity}
      </text>
    </svg>
  );
}
