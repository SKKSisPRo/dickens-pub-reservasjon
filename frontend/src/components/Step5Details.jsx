import { useState, useEffect } from 'react';
import { COUNTRIES } from '../constants';

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

export default function Step5Details({
  date,
  time,
  guests,
  selectedTable,
  firstName,
  lastName,
  phone,
  countryCode,
  additionalInfo,
  onFieldChange,
  onBack,
  onSuccess,
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Dynamic phone validation
  useEffect(() => {
    if (!phone) {
      setPhoneError('');
      return;
    }
    const country = COUNTRIES.find(c => c.code === countryCode);
    const numOnly = phone.replace(/\D/g, '');

    if (numOnly.length > 0) {
      if (numOnly.length < country.minLength || numOnly.length > country.maxLength) {
        if (country.minLength === country.maxLength) {
          setPhoneError(`${country.name} krever nøyaktig ${country.minLength} siffer.`);
        } else {
          setPhoneError(`${country.name} krever mellom ${country.minLength} og ${country.maxLength} siffer.`);
        }
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  }, [phone, countryCode]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    setError('');
    if (phoneError) return;

    const numOnly = phone.replace(/\D/g, '');
    const internationalPhone = `${countryCode} ${numOnly}`;

    const payload = {
      tableId: selectedTable.id,
      name: `${firstName} ${lastName}`,
      phone: internationalPhone,
      date,
      time,
      guests: Number(guests),
      additionalInfo,
    };

    try {
      const res = await fetch('http://localhost:5001/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Kunne ikke reservere');
      }
    } catch (err) {
      setError('Nettverksfeil. Kunne ikke koble til server.');
    }
  };

  if (submitted) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-4xl font-gothic text-dickens-green mb-4">Takk for din reservasjon!</h2>
        <p className="text-lg text-gray-700 mb-2">Vi har mottatt din booking for {date} kl {time}.</p>
        <p className="text-base text-gray-600 mb-8 text-center">For spørsmål ring oss på 32 83 80 15</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-dickens-green text-white rounded-lg hover:bg-dickens-gold transition-colors font-semibold shadow-md">Ny reservasjon</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-dickens-green hover:underline">&larr; Tilbake</button>
        <h1 className="font-gothic text-4xl text-dickens-green drop-shadow-sm text-center">Fyll ut informasjon</h1>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full">
        {/* Summary */}
        <div className="bg-dickens-green text-white p-4 rounded-xl mb-6 border-b-4 border-dickens-gold grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Dato</div>
            <div className="font-semibold">{formatDate(date)}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Tid</div>
            <div className="font-semibold">{time}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Antall</div>
            <div className="font-semibold">{guests} pers</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Bord</div>
            <div className="font-semibold">{selectedTable ? selectedTable.name : '-'}</div>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-2 mb-3 rounded border border-red-200 text-sm font-medium text-center">{error}</div>}

        <form onSubmit={handleBook} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Fornavn</label>
              <input
                type="text" required
                value={firstName} onChange={e => onFieldChange('firstName', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-dickens-gold focus:ring-1 focus:ring-dickens-gold h-10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Etternavn</label>
              <input
                type="text" required
                value={lastName} onChange={e => onFieldChange('lastName', e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-dickens-gold focus:ring-1 focus:ring-dickens-gold h-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Telefon</label>
            <div className="flex flex-row w-full gap-3 items-center">
              <select
                value={countryCode}
                onChange={e => onFieldChange('countryCode', e.target.value)}
                className="border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:border-dickens-gold focus:ring-1 focus:ring-dickens-gold bg-white w-[90px] shrink-0 h-10"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="tel" required
                value={phone} onChange={e => onFieldChange('phone', e.target.value)}
                className={`flex-1 min-w-0 border ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-dickens-gold focus:ring-dickens-gold'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 h-10`}
              />
            </div>
            {phoneError && <span className="text-xs font-medium text-red-500 mt-1">{phoneError}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tilleggsinformasjon (Valgfritt)</label>
            <input
              type="text"
              value={additionalInfo} onChange={e => onFieldChange('additionalInfo', e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-dickens-gold focus:ring-1 focus:ring-dickens-gold h-11"
              placeholder="Evt. allergier, spesielle behov..."
            />
          </div>

          <button
            type="submit"
            disabled={!selectedTable || !!phoneError || !phone}
            className={`w-full py-3 mt-2 rounded-lg font-bold text-lg transition-colors shadow-md ${selectedTable && !phoneError && phone
              ? 'bg-dickens-green text-white hover:bg-[#122a24]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Reserver
          </button>
        </form>
      </div>
    </div>
  );
}
