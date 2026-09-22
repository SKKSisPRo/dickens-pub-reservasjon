import { useState } from 'react';
import ReservationCard from './ReservationCard';
import MiniCalendar from './MiniCalendar';

const CALENDAR_ICON = "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z";

const WEEKDAY = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const MONTH = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAY[date.getDay()]} ${d}. ${MONTH[m - 1]}`;
}

function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function groupByTime(reservations) {
  const groups = new Map();
  for (const r of reservations) {
    const key = (r.time || '').slice(0, 5);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export default function ReservationList({
  date,
  onDateChange,
  reservations,
  selectedReservationId,
  onSelectReservation,
  onHoverReservation,
  onAccept,
  onDecline,
  onEdit,
  onDelete,
}) {
  const forDate = reservations.filter(r => r.date === date);
  const groups = groupByTime(forDate);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Mini date nav */}
      <div className="relative flex items-center gap-2 p-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => setCalendarOpen((v) => !v)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
            calendarOpen ? 'bg-dickens-green text-white border-dickens-green' : 'border-gray-200 text-dickens-green hover:bg-gray-50'
          }`}
          aria-label="Åpne kalender"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={CALENDAR_ICON} />
          </svg>
        </button>

        <button
          onClick={() => onDateChange(shiftDate(date, -1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-dickens-green hover:bg-gray-50"
          aria-label="Forrige dag"
        >
          &larr;
        </button>

        <div className="flex-grow flex flex-col items-center leading-tight">
          <span className="font-gothic text-lg text-dickens-green">{formatDateLabel(date)}</span>
        </div>

        <button
          onClick={() => onDateChange(shiftDate(date, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-dickens-green hover:bg-gray-50"
          aria-label="Neste dag"
        >
          &rarr;
        </button>

        {calendarOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setCalendarOpen(false)} />
            <div className="absolute top-full left-4 mt-2 z-50">
              <MiniCalendar
                date={date}
                onDateChange={(d) => { onDateChange(d); setCalendarOpen(false); }}
              />
            </div>
          </>
        )}
      </div>

      {/* Time-grouped list */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-5 bg-gray-50">
        {groups.length === 0 && (
          <div className="text-center text-gray-400 py-12">Ingen reservasjoner denne dagen.</div>
        )}

        {groups.map(([time, group]) => (
          <div key={time} className="flex flex-col gap-2">
            <div className="text-sm font-bold text-dickens-green sticky top-0">{time}</div>
            <div className="flex flex-col gap-2">
              {group.map((r) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  isSelected={selectedReservationId === r.id}
                  onSelect={onSelectReservation}
                  onHoverStart={onHoverReservation ? () => onHoverReservation(r) : undefined}
                  onHoverEnd={onHoverReservation ? () => onHoverReservation(null) : undefined}
                  onAccept={onAccept}
                  onDecline={onDecline}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
