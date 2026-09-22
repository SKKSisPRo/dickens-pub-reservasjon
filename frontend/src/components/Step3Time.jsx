import { getAvailableTimes } from '../constants';

export default function Step3Time({ date, time, onSelect, onBack }) {
  const times = getAvailableTimes(date);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-4">
      <div className="w-full max-w-lg flex justify-start mb-2">
        <button onClick={onBack} className="text-dickens-green hover:underline">&larr; Tilbake</button>
      </div>

      <h1 className="font-gothic text-4xl md:text-5xl text-dickens-green mb-6 text-center drop-shadow-sm">
        Velg tidspunkt
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-96 overflow-y-auto pr-1">
          {times.map((t) => {
            const isSelected = time === t;
            return (
              <button
                key={t}
                onClick={() => onSelect(t)}
                className={`py-2.5 rounded-lg text-sm font-semibold border shadow-sm transition-[color,background-color,border-color,transform] duration-150 active:scale-95 ${
                  isSelected
                    ? 'bg-dickens-gold text-white border-dickens-gold shadow-[0_0_10px_rgba(184,134,44,0.5)]'
                    : 'bg-gray-50 text-dickens-green border-gray-200 hover:bg-dickens-green hover:text-white'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
