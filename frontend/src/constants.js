export const COUNTRIES = [
  { code: '+47', name: 'Norge', flag: '🇳🇴', minLength: 8, maxLength: 8 },
  { code: '+46', name: 'Sverige', flag: '🇸🇪', minLength: 9, maxLength: 9 },
  { code: '+45', name: 'Danmark', flag: '🇩🇰', minLength: 8, maxLength: 8 },
  { code: '+44', name: 'UK', flag: '🇬🇧', minLength: 10, maxLength: 10 },
  { code: '+49', name: 'Tyskland', flag: '🇩🇪', minLength: 10, maxLength: 11 },
  { code: '+33', name: 'Frankrike', flag: '🇫🇷', minLength: 9, maxLength: 9 },
  { code: '+39', name: 'Italia', flag: '🇮🇹', minLength: 9, maxLength: 10 },
  { code: '+34', name: 'Spania', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: '+48', name: 'Polen', flag: '🇵🇱', minLength: 9, maxLength: 9 },
  { code: '+31', name: 'Nederland', flag: '🇳🇱', minLength: 9, maxLength: 9 },
  { code: '+358', name: 'Finland', flag: '🇫🇮', minLength: 5, maxLength: 12 },
];

export const MAP_TABLES = [
  { name: 'T1', top: '4%', left: '4%' },
  { name: 'T2', top: '4%', left: '12%' },
  { name: 'T3', top: '4%', left: '20%' },
  { name: 'T4', top: '4%', left: '28%' },
  { name: 'T5', top: '4%', left: '36%' },
  { name: 'T6', top: '4%', left: '44%' },
  { name: 'T7', top: '4%', left: '52%' },
  { name: 'T8', top: '4%', left: '60%' },
  { name: 'T9', top: '4%', left: '68%' },
  { name: 'V1', top: '80%', left: '4%' },
  { name: 'V2', top: '80%', left: '16%' },
  { name: 'V3', top: '65%', left: '4%' },
  { name: 'V4', top: '65%', left: '16%' },
  { name: 'V5', top: '50%', left: '4%' },
  { name: 'V6', top: '50%', left: '16%' },
  { name: 'V7', top: '35%', left: '4%' },
  { name: 'V8', top: '20%', left: '4%' },
  { name: 'H1', top: '35%', left: '72%' },
  { name: 'H2', top: '50%', left: '72%' },
  { name: 'H3', top: '65%', left: '84%' },
];

export const RESERVATION_DURATION_MIN = 90;

export const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export function getAvailableTimes(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const isWeekend = day === 0 || day === 5 || day === 6; // Fri, Sat, Sun
  const startHour = isWeekend ? 11 : 12;
  const endHour = 21;

  const times = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endHour && m > 0) break;
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      times.push(timeStr);
    }
  }
  return times;
}
