import { useState, useEffect, useRef } from 'react';
import { getAvailableTimes } from '../constants';
import useReducedMotion from '../hooks/useReducedMotion';

export default function TimeDropdown({ value, onChange, date }) {
  const [isOpen, setIsOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const dropdownRef = useRef(null);
  const times = getAvailableTimes(date);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-1 relative w-full" ref={dropdownRef}>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tid</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 border border-dickens-gold rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-dickens-gold text-center bg-dickens-green text-white font-normal flex items-center justify-between hover:bg-dickens-green/90 transition-colors"
      >
        <span>{value ? value.substring(0, 5) : ''}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 w-full max-h-60 overflow-y-auto bg-dickens-green border border-dickens-gold rounded-md shadow-lg z-[999]"
          style={{
            transformOrigin: 'top',
            opacity: reducedMotion || entered ? 1 : 0,
            transform: reducedMotion || entered ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 150ms var(--ease-out), transform 150ms var(--ease-out)',
          }}
        >
          {times.map((t) => (
            <div
              key={t}
              onClick={() => {
                onChange(t);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-xs text-white cursor-pointer hover:bg-dickens-gold hover:text-dickens-green transition-colors font-medium text-center ${value === t ? 'bg-dickens-gold text-dickens-green' : ''}`}
            >
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
