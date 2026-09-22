import { useState, useEffect } from 'react';
import TimeDropdown from '../TimeDropdown';
import useReducedMotion from '../../hooks/useReducedMotion';

export default function EditReservationModal({ reservation, tablesData, onClose, onSave }) {
  const [data, setData] = useState(reservation);
  const [entered, setEntered] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const table = tablesData.find(t => t.id === data.tableId);
  const activeTableCapacity = table ? table.capacity : null;
  const isOverCapacity = table ? Number(data.guests) > table.capacity : false;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOverCapacity) return;
    onSave(data);
  };

  const shown = reducedMotion || entered;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
      style={{ opacity: shown ? 1 : 0, transition: 'opacity 200ms var(--ease-out)' }}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-[500px]"
        style={{
          transform: shown ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 200ms var(--ease-out)',
        }}
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-900 font-gothic tracking-wide">Rediger Reservasjon #{data.id}</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Navn</label>
              <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="border border-gray-300 rounded px-3 py-2" required />
            </div>
            <div className="w-48 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Telefon</label>
              <input type="text" value={data.phone || ''} onChange={e => setData({ ...data, phone: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Dato</label>
              <input type="date" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} className="border border-gray-300 rounded px-3 py-2 h-10" required />
            </div>
            <div className="flex-1">
              <TimeDropdown value={data.time} onChange={t => setData({ ...data, time: t })} date={data.date} />
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-20 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Gjester</label>
              <input type="number" min="1" max="20" value={data.guests} onChange={e => setData({ ...data, guests: e.target.value })} className="border border-gray-300 rounded px-3 py-2" required />
            </div>
            <div className="w-20 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Bord</label>
              <input type="text" disabled value={data.table_name || `Bord ${data.tableId}`} className="border border-gray-200 bg-gray-50 text-gray-500 rounded px-3 py-2 cursor-not-allowed" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })} className="border border-gray-300 rounded px-3 py-2">
                <option value="pending">Pending</option>
                <option value="accepted">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Tilleggsinformasjon</label>
            <input type="text" value={data.additionalInfo || ''} onChange={e => setData({ ...data, additionalInfo: e.target.value })} className="border border-gray-300 rounded px-3 py-2" />
          </div>

          {isOverCapacity && (
            <div className="text-red-600 font-semibold text-sm -mt-2 mb-2 bg-red-50 p-2 rounded border border-red-100">
              ⚠️ Dette bordet har kun plass til {activeTableCapacity} personer.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Avbryt</button>
            <button type="submit" disabled={isOverCapacity} className={`px-5 py-2 rounded-lg font-medium transition-colors ${isOverCapacity ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-dickens-green hover:bg-[#122a24] text-white'}`}>Lagre endringer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
