import ReservationCard from './ReservationCard';

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

  return (
    <div className="flex flex-col h-full">
      {/* Mini date nav */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => onDateChange(shiftDate(date, -1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-dickens-green hover:bg-gray-50"
          aria-label="Forrige dag"
        >
          &larr;
        </button>

        <div className="flex-grow flex flex-col items-center leading-tight">
          <span className="font-gothic text-lg text-dickens-green">{formatDateLabel(date)}</span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-xs text-gray-400 border-none focus:outline-none focus:ring-0 bg-transparent text-center"
          />
        </div>

        <button
          onClick={() => onDateChange(shiftDate(date, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-dickens-green hover:bg-gray-50"
          aria-label="Neste dag"
        >
          &rarr;
        </button>
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
