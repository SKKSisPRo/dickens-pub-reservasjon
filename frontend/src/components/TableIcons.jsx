// Furniture-style icons for the floor plan tables, styled after the pub's own map artwork.
// Each icon keeps a dark "frame" (wood/upholstery trim) and a status-tinted cushion so
// availability is still readable at a glance, the way the old flat-color squares were.

export const STATUS_COLORS = {
  available: { frame: '#1E4538', cushion: '#5FA98A' },
  selected: { frame: '#8B6414', cushion: '#B8862C' },
  occupied: { frame: '#5C2323', cushion: '#8A3A3A' },
  tooSmall: { frame: '#6B7280', cushion: '#9CA3AF' },
};

function Frame({ rotation = 0, flip = false, children }) {
  const transforms = [];
  if (flip) transforms.push('scale(-1 1)');
  if (rotation) transforms.push(`rotate(${rotation} 50 50)`);
  return <g transform={transforms.join(' ') || undefined}>{children}</g>;
}

export function StoolIcon({ state = 'available', rotation = 0, flip = false, className }) {
  const { frame, cushion } = STATUS_COLORS[state];
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <Frame rotation={rotation} flip={flip}>
        <path
          d="M32,92 L32,58 Q32,32 50,32 Q68,32 68,58 L68,92"
          fill="none"
          stroke={frame}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="50" cy="34" r="24" fill={cushion} stroke={frame} strokeWidth="4" />
      </Frame>
    </svg>
  );
}

export function LoveseatIcon({ state = 'available', rotation = 0, flip = false, className }) {
  const { frame, cushion } = STATUS_COLORS[state];
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <Frame rotation={rotation} flip={flip}>
        <rect x="4" y="12" width="20" height="76" rx="8" fill={frame} />
        <rect x="10" y="20" width="8" height="60" rx="4" fill={cushion} opacity="0.55" />

        <rect x="20" y="30" width="60" height="40" rx="8" fill={cushion} stroke={frame} strokeWidth="3.5" />

        <rect x="76" y="12" width="20" height="76" rx="8" fill={frame} />
        <rect x="82" y="20" width="8" height="60" rx="4" fill={cushion} opacity="0.55" />
      </Frame>
    </svg>
  );
}

export function CornerBoothIcon({ state = 'available', rotation = 0, flip = false, size = 'small', className }) {
  const { frame, cushion } = STATUS_COLORS[state];
  const armLength = size === 'large' ? 96 : 70;
  const dividers = size === 'large' ? [38, 66] : [];

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <Frame rotation={rotation} flip={flip}>
        <rect x="4" y="4" width={armLength} height="26" rx="10" fill={cushion} stroke={frame} strokeWidth="4" />
        <rect x="4" y="4" width="26" height={armLength} rx="10" fill={cushion} stroke={frame} strokeWidth="4" />
        {dividers.map((d) => (
          <g key={d}>
            <line x1={d} y1="4" x2={d} y2="30" stroke={frame} strokeWidth="2.5" />
            <line x1="4" y1={d} x2="30" y2={d} stroke={frame} strokeWidth="2.5" />
          </g>
        ))}
      </Frame>
    </svg>
  );
}

// Maps a MAP_TABLES `shape` entry to the right icon component + size.
export function TableShapeIcon({ shape, size, state, rotation, flip, className }) {
  switch (shape) {
    case 'stool':
      return <StoolIcon state={state} rotation={rotation} flip={flip} className={className} />;
    case 'loveseat':
      return <LoveseatIcon state={state} rotation={rotation} flip={flip} className={className} />;
    case 'corner':
      return <CornerBoothIcon state={state} rotation={rotation} flip={flip} size={size} className={className} />;
    default:
      return <LoveseatIcon state={state} rotation={rotation} flip={flip} className={className} />;
  }
}
