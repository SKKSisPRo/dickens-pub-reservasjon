import { useEffect, useState } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

const BELL_ICON = 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
const SPEAKER_ICON = 'M11 5L6 9H2v6h4l5 4V5z';
const MUTE_LINE = 'M23 9l-6 6M17 9l6 6';
const WAVE_ICON = 'M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07';

export default function NotificationBell({ unreadCount, muted, onToggleMute, onClick }) {
  const [pulse, setPulse] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (unreadCount === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(t);
  }, [unreadCount]);

  return (
    <div className="justify-self-end flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleMute}
        title={muted ? 'Slå på varsellyd' : 'Slå av varsellyd'}
        aria-label={muted ? 'Slå på varsellyd' : 'Slå av varsellyd'}
        className="w-8 h-8 flex items-center justify-center rounded-full text-dickens-cream/70 hover:text-dickens-cream hover:bg-white/10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d={SPEAKER_ICON} />
          {muted ? (
            <path strokeLinecap="round" strokeLinejoin="round" d={MUTE_LINE} />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d={WAVE_ICON} />
          )}
        </svg>
      </button>

      <button
        type="button"
        onClick={onClick}
        title="Varsler"
        aria-label={`Varsler${unreadCount > 0 ? `, ${unreadCount} uleste` : ''}`}
        className="relative w-10 h-10 flex items-center justify-center rounded-full text-dickens-cream hover:bg-white/10 transition-colors"
        style={{
          transform: !reducedMotion && pulse ? 'rotate(-8deg)' : 'rotate(0deg)',
          transition: 'transform 500ms var(--ease-out)',
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d={BELL_ICON} />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-dickens-red text-white text-[10px] font-bold leading-none shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
