import { useEffect, useRef } from 'react';
import { RESERVATION_DURATION_MIN } from '../../constants';

const STATUS_STYLES = {
  pending: { accent: 'bg-dickens-gold', badge: 'bg-dickens-gold/10 text-dickens-gold', label: 'Venter' },
  accepted: { accent: 'bg-dickens-green', badge: 'bg-dickens-green/10 text-dickens-green', label: 'Bekreftet' },
  declined: { accent: 'bg-dickens-red', badge: 'bg-dickens-red/10 text-dickens-red', label: 'Avslått' },
};

const PERSON_ICON = "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z";
const PHONE_ICON = "M3 5a2 2 0 012-2h1.586a1 1 0 01.707.293l2 2a1 1 0 010 1.414L8.414 8.586a13.05 13.05 0 006 6l1.879-1.879a1 1 0 011.414 0l2 2a1 1 0 01.293.707V17a2 2 0 01-2 2h-1C7.163 19 3 14.837 3 9V5z";
const CLOCK_ICON = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";

function formatBookingWindow(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const start = h * 60 + (m || 0);
  const end = start + RESERVATION_DURATION_MIN;
  const fmt = (mins) => `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  return `${fmt(start)} – ${fmt(end)}`;
}
const CHECK_ICON = "M5 13l4 4L19 7";
const X_ICON = "M6 18L18 6M6 6l12 12";
const EDIT_ICON = "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
const TRASH_ICON = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";

function IconButton({ onClick, title, path, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </button>
  );
}

export default function ReservationCard({
  reservation,
  isSelected,
  onSelect,
  onHoverStart,
  onHoverEnd,
  onAccept,
  onDecline,
  onEdit,
  onDelete,
}) {
  const status = STATUS_STYLES[reservation.status] || STATUS_STYLES.pending;
  const cardRef = useRef(null);

  useEffect(() => {
    if (isSelected) cardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect?.(reservation)}
      onMouseEnter={() => onHoverStart?.(reservation)}
      onMouseLeave={() => onHoverEnd?.(reservation)}
      className={`flex rounded-lg bg-white border overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'border-dickens-gold ring-2 ring-dickens-gold/50' : 'border-gray-200'
      }`}
    >
      <div className={`w-1.5 shrink-0 ${status.accent}`} />

      <div className="flex-grow p-3 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-dickens-green truncate">{reservation.name}</span>
          <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d={PERSON_ICON} clipRule="evenodd" /></svg>
            {reservation.guests}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={CLOCK_ICON} />
          </svg>
          <span>{formatBookingWindow(reservation.time)}</span>
        </div>

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

        <div className="flex items-center justify-between gap-2 mt-1">
          <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${status.badge}`}>
            {status.label}
          </span>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {reservation.status !== 'accepted' && (
              <IconButton
                onClick={() => onAccept?.(reservation)}
                title="Godta"
                path={CHECK_ICON}
                className="border-dickens-green/30 text-dickens-green hover:bg-dickens-green hover:text-white"
              />
            )}
            {reservation.status !== 'declined' && (
              <IconButton
                onClick={() => onDecline?.(reservation)}
                title="Avslå"
                path={X_ICON}
                className="border-dickens-red/30 text-dickens-red hover:bg-dickens-red hover:text-white"
              />
            )}
            <IconButton
              onClick={() => onEdit?.(reservation)}
              title="Rediger"
              path={EDIT_ICON}
              className="border-gray-200 text-gray-500 hover:bg-dickens-gold hover:text-white hover:border-dickens-gold"
            />
            <IconButton
              onClick={() => onDelete?.(reservation)}
              title="Slett"
              path={TRASH_ICON}
              className="border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
