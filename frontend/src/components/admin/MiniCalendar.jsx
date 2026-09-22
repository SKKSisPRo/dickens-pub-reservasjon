import { useState, useEffect } from 'react';

const WEEKDAY_SHORT = ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'];
const MONTH = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];

function toDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function MiniCalendar({ date, onDateChange }) {
  const [y, m] = date.split('-').map(Number);
  const [viewYear, setViewYear] = useState(y);
  const [viewMonth, setViewMonth] = useState(m - 1);

  // Keep the visible month in sync if `date` changes from outside (e.g. prev/next-day arrows).
  useEffect(() => {
    setViewYear(y);
    setViewMonth(m - 1);
  }, [y, m]);

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  const goMonth = (delta) => {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-3 w-64">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => goMonth(-1)}
          className="w-7 h-7 flex items-center justify-center rounded text-dickens-green hover:bg-gray-100"
          aria-label="Forrige måned"
        >
          &larr;
        </button>
        <span className="text-sm font-semibold text-dickens-green">{MONTH[viewMonth]} {viewYear}</span>
        <button
          onClick={() => goMonth(1)}
          className="w-7 h-7 flex items-center justify-center rounded text-dickens-green hover:bg-gray-100"
          aria-label="Neste måned"
        >
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1 text-center text-[10px] font-semibold text-gray-400">
        {WEEKDAY_SHORT.map((w) => <div key={w}>{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-8" />;
          const cellStr = toDateStr(viewYear, viewMonth, d);
          const isSelected = cellStr === date;
          const isToday = cellStr === todayStr;

          return (
            <button
              key={i}
              onClick={() => onDateChange(cellStr)}
              className={`h-8 rounded text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-dickens-green text-white'
                  : isToday
                  ? 'border border-dickens-gold text-dickens-green'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
