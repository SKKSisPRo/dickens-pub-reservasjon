import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { MAP_TABLES } from '../constants';
import { TableShapeIcon } from './TableIcons';

const PERSON_ICON_PATH = "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z";

export default function Step4Table({ date, time, guests, selectedTable, onSelect, onBack }) {
  const [tables, setTables] = useState([]);
  const [availableIds, setAvailableIds] = useState(new Set());
  const [occupiedTableIds, setOccupiedTableIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch all tables
        const resAll = await fetch('http://localhost:5001/tables?areaId=1');
        const allTables = await resAll.json();
        setTables(allTables);

        // Fetch available tables
        const query = new URLSearchParams({
          date,
          time,
          guests: 1,     // Show all available regardless of size
          level: 1,
          outdoor: 0
        });
        const resAvail = await fetch(`http://localhost:5001/tables/availability?${query}`);
        if (resAvail.ok) {
          const availTables = await resAvail.json();
          setAvailableIds(new Set(availTables.map(t => t.id)));
        } else {
          setAvailableIds(new Set(allTables.map(t => t.id)));
        }

        // Fetch occupied tables for this date/time (public endpoint, no auth needed)
        const resOccupied = await fetch(`http://localhost:5001/api/occupied-tables?date=${date}&time=${time}`);
        if (resOccupied.ok) {
          const occupiedIds = await resOccupied.json();
          setOccupiedTableIds(new Set(occupiedIds));
        } else {
          setOccupiedTableIds(new Set());
        }
      } catch (err) {
        console.error('Fetch error:', err);
        const dummyTables = MAP_TABLES.map((t, i) => ({ id: i + 1, name: t.name, capacity: 4 }));
        setTables(dummyTables);
        setAvailableIds(new Set(dummyTables.map(t => t.id)));
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('public:reservations_floorplan')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date, time]);

  const renderTable = (pos, positionClass = 'relative', style) => {
    const tableData = tables.find(t => t.name === pos.name) || { id: pos.name, name: pos.name, capacity: 4 };
    const isAvailable = availableIds.has(tableData.id);
    const isSelected = selectedTable?.id === tableData.id;
    const isTooSmall = Number(guests) > tableData.capacity;
    const isOccupied = occupiedTableIds.has(tableData.id);
    const isDisabled = isOccupied || !isAvailable || isTooSmall;

    let state = 'available';
    if (isOccupied) state = 'occupied';
    else if (isTooSmall) state = 'tooSmall';
    else if (isSelected) state = 'selected';

    return (
      <button
        key={pos.name}
        disabled={isDisabled}
        title={isTooSmall ? 'For lite for gruppen din' : ''}
        onClick={() => {
          if (isOccupied) return;
          onSelect(tableData);
        }}
        style={style}
        className={`${positionClass} w-14 h-14 md:w-16 md:h-16 lg:w-[4.5rem] lg:h-[4.5rem] transition-transform duration-200 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
          } ${isSelected ? 'scale-110 z-10 drop-shadow-[0_0_8px_rgba(184,134,44,0.7)]' : ''} ${isTooSmall ? 'opacity-60' : ''}`}
      >
        <TableShapeIcon
          shape={pos.shape}
          size={pos.size}
          state={state}
          rotation={pos.rotation || 0}
          flip={pos.flip}
          className="w-full h-full"
        />
        <span className="absolute top-0 right-0 flex items-center gap-0.5 text-[9px] md:text-[10px] font-semibold text-white bg-dickens-green/90 px-1 py-0.5 rounded-full shadow-sm">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d={PERSON_ICON_PATH} clipRule="evenodd" /></svg>
          {tableData.capacity}
        </span>
        <span className="absolute bottom-0 inset-x-0 text-center text-[9px] md:text-[10px] font-bold text-dickens-green bg-white/90 rounded px-0.5">
          {pos.name}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-dickens-green hover:underline">&larr; Tilbake</button>
        <h1 className="font-gothic text-4xl text-dickens-green drop-shadow-sm">Velg bord</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* The Map */}
      <div className="relative w-full aspect-[4/3] bg-gray-300 rounded-xl border-4 border-gray-400 shadow-inner overflow-hidden p-4">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-30">
            <div className="text-dickens-green text-xl font-semibold bg-white px-4 py-2 rounded-lg shadow-md border border-dickens-gold">Laster inn bordkart...</div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-3 text-xs font-semibold z-20 bg-white/90 px-3 py-2 rounded shadow-sm border border-gray-200">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-dickens-green rounded-sm"></div> Ledig</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-dickens-red rounded-sm"></div> Opptatt</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-400 rounded-sm"></div> For lite</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-dickens-gold rounded-sm"></div> Valgt</div>
        </div>

        {/* Bar */}
        <div className="absolute top-[25%] left-[25%] w-[45%] h-[50%] bg-dickens-brown border-b-[30px] border-l-[30px] border-r-[30px] border-dickens-brown bg-opacity-20 flex justify-center shadow-lg rounded-t-sm rounded-b-xl overflow-hidden">
          <div className="bg-dickens-brown w-full h-[60px] flex items-center justify-center text-dickens-cream font-gothic text-3xl shadow-sm">
            Bar
          </div>
        </div>

        {/* Scene */}
        <div className="absolute top-4 right-4 w-[15%] h-[20%] bg-[#4a4a4a] text-dickens-cream flex items-center justify-center font-gothic text-2xl rounded shadow-md border-b-4 border-r-4 border-gray-600">
          Scene
        </div>

        {/* T-Series Tables */}
        <div className="absolute top-[4%] left-[4%] w-[75%] flex flex-row justify-between">
          {MAP_TABLES.filter(pos => pos.name.startsWith('T')).map((pos) => renderTable(pos))}
        </div>

        {/* Other Tables */}
        {MAP_TABLES.filter(pos => !pos.name.startsWith('T')).map((pos) =>
          renderTable(pos, 'absolute', { top: pos.top, left: pos.left })
        )}
      </div>
    </div>
  );
}
