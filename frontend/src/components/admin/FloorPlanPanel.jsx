import { MAP_TABLES } from '../../constants';

export default function FloorPlanPanel({ reservationsForDate, highlightedTableName, previewTableName, loading }) {
  return (
    <div className="relative w-full h-full bg-gray-300 rounded-xl border-4 border-gray-400 shadow-inner p-4 overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">Laster kart...</div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-3 text-xs font-semibold z-20 bg-white/90 px-3 py-2 rounded shadow-sm border border-gray-200">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-dickens-green rounded-sm"></div> Ledig</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-dickens-red rounded-sm"></div> Opptatt</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-dickens-gold rounded-sm"></div> Valgt</div>
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

      {/* Tables */}
      {MAP_TABLES.map((pos) => {
        const tableRes = reservationsForDate.filter(r => r.table_name === pos.name || `Table ${r.table_id}` === pos.name);
        const isOccupied = tableRes.some(r => r.status === 'accepted');

        const isHighlighted = highlightedTableName === pos.name;
        const isPreview = !isHighlighted && previewTableName === pos.name;

        let bgClass = "bg-dickens-green";
        if (isOccupied) bgClass = "bg-dickens-red shadow-md";

        let ringClass = "border border-black/20";
        if (isHighlighted) ringClass = "border-4 border-dickens-gold shadow-[0_0_15px_rgba(184,134,44,0.9)] scale-110 z-10";
        else if (isPreview) ringClass = "border-2 border-dickens-gold/60 scale-105 z-10";

        return (
          <div
            key={pos.name}
            className={`absolute w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex flex-col items-center justify-center rounded text-white transition-all duration-200 ${bgClass} ${ringClass}`}
            style={{ top: pos.top, left: pos.left }}
          >
            <span className="font-bold text-sm md:text-base">{pos.name}</span>
          </div>
        );
      })}
    </div>
  );
}
