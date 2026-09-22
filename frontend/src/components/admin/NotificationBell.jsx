import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

const BELL_ICON = 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
const SPEAKER_ICON = 'M11 5L6 9H2v6h4l5 4V5z';
const MUTE_LINE = 'M23 9l-6 6M17 9l6 6';
const WAVE_ICON = 'M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07';
const PERSON_ICON = 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z';
const PHONE_ICON = 'M3 5a2 2 0 012-2h1.586a1 1 0 01.707.293l2 2a1 1 0 010 1.414L8.414 8.586a13.05 13.05 0 006 6l1.879-1.879a1 1 0 011.414 0l2 2a1 1 0 01.293.707V17a2 2 0 01-2 2h-1C7.163 19 3 14.837 3 9V5z';

function formatDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const time = (timeStr || '').slice(0, 5);
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y} kl. ${time}`;
}

function NotificationItem({ reservation, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(reservation)}
      className="w-full text-left flex gap-2.5 px-3.5 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
    >
      <div className="shrink-0 w-2 pt-1.5">
        {!reservation.viewed && (
          <span className="block w-2 h-2 rounded-full bg-dickens-gold" aria-label="Ulest" />
        )}
      </div>

      <div className="flex-grow min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-dickens-green truncate">{reservation.name}</span>
          <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d={PERSON_ICON} clipRule="evenodd" /></svg>
            {reservation.guests}
          </span>
        </div>

        <div className="text-xs text-gray-500">{formatDateTime(reservation.date, reservation.time)}</div>

        {reservation.phone && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d={PHONE_ICON} /></svg>
            <span className="truncate">{reservation.phone}</span>
          </div>
        )}

        {reservation.additionalInfo && (
          <div className="text-xs text-gray-500 italic truncate" title={reservation.additionalInfo}>
            {reservation.additionalInfo}
          </div>
        )}
      </div>
    </button>
  );
}

export default function NotificationBell({
  items,
  unreadCount,
  muted,
  open,
  onToggleMute,
  onToggleOpen,
  onRequestClose,
  onItemClick,
}) {
  const [pulse, setPulse] = useState(false);
  const [entered, setEntered] = useState(false);
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef(null);
  const prevLengthRef = useRef(items.length);

  useEffect(() => {
    if (items.length > prevLengthRef.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 500);
      prevLengthRef.current = items.length;
      return () => clearTimeout(t);
    }
    prevLengthRef.current = items.length;
  }, [items.length]);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onRequestClose();
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') onRequestClose();
    }
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onRequestClose]);

  return (
    <div className="justify-self-end flex items-center gap-3" ref={wrapperRef}>
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

      <div className="relative">
        <button
          type="button"
          onClick={onToggleOpen}
          title="Varsler"
          aria-label={`Varsler${unreadCount > 0 ? `, ${unreadCount} uleste` : ''}`}
          aria-expanded={open}
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

        {open && (
          <div
            className="absolute top-full right-0 mt-2 w-[340px] max-h-[420px] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 z-[999] text-gray-900"
            style={{
              transformOrigin: 'top right',
              opacity: reducedMotion || entered ? 1 : 0,
              transform: reducedMotion || entered ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 150ms var(--ease-out), transform 150ms var(--ease-out)',
            }}
          >
            <div className="px-3.5 py-2.5 border-b border-gray-100 font-gothic text-dickens-green text-sm">
              Nye reservasjoner
            </div>

            {items.length === 0 ? (
              <div className="px-3.5 py-8 text-center text-sm text-gray-400">Ingen nye reservasjoner.</div>
            ) : (
              items.map((r) => (
                <NotificationItem key={r.id} reservation={r} onClick={onItemClick} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
