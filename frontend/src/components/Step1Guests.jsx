import { GUEST_OPTIONS } from '../constants';

export default function Step1Guests({ guests, onSelect }) {
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-4">
      <h1 className="font-gothic text-4xl md:text-5xl text-dickens-green mb-6 text-center drop-shadow-sm">
        Hvor mange er dere?
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {GUEST_OPTIONS.map((opt) => {
            const isSelected = guests === opt;
            return (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-lg font-semibold border shadow-sm transition-colors ${
                  isSelected
                    ? 'bg-dickens-gold text-white border-dickens-gold shadow-[0_0_10px_rgba(184,134,44,0.5)]'
                    : 'bg-gray-50 text-dickens-green border-gray-200 hover:bg-dickens-green hover:text-white'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">Flere enn 7 personer? Ring oss på 32 83 80 15.</p>
      </div>
    </div>
  );
}
