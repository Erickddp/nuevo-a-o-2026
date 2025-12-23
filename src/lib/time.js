/**
 * Time Utilities
 * Target: 2026-01-01T00:00:00 (America/Mexico_City)
 */

export const MONTH_PHASES = [
  "Enero: El comienzo del viaje",
  "Febrero: Construyendo inercia",
  "Marzo: La primavera despierta",
  "Abril: Lluvias que nutren",
  "Mayo: Florecimiento pleno",
  "Junio: Mitad de camino",
  "Julio: Revaluando el rumbo",
  "Agosto: Calor y energía",
  "Septiembre: Cosecha de esfuerzos",
  "Octubre: Colores de cambio",
  "Noviembre: La recta final",
  "Diciembre: Reflexión y cierre"
];

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

/**
 * Returns the offset in milliseconds relative to UTC for a given timezone and date.
 * (e.g., if it's -06:00, returns -21600000).
 */
function getTZOffsetMs(timeZone, date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type) => parts.find(p => p.type === type).value;

  const year = getPart('year');
  const month = getPart('month').padStart(2, '0');
  const day = getPart('day').padStart(2, '0');
  const hour = getPart('hour').padStart(2, '0');
  const minute = getPart('minute').padStart(2, '0');
  const second = getPart('second').padStart(2, '0');

  // Treat components as UTC to get numeric value of the "Wall Clock"
  const zonedTimeAsUTC = Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

  return zonedTimeAsUTC - date.getTime();
}

/**
 * Calculates the exact UTC timestamp for a specific "Wall Clock" time in a target timezone.
 */
function makeTargetMsUTC(year, monthIndex, day, hours, minutes, seconds, tz) {
  // 1. Construct the "Wall Clock" timestamp as if it were UTC
  const targetWallTimeAsUTC = Date.UTC(year, monthIndex, day, hours, minutes, seconds);

  // 2. Get the offset at that approximate time. 
  // We use the wall time itself as the query date (simple approx, usually safe for standard dates).
  const offset = getTZOffsetMs(tz, new Date(targetWallTimeAsUTC));

  // 3. UTC = WallTime - Offset
  return targetWallTimeAsUTC - offset;
}

// Target: 2026-01-01 00:00:00 CDMX
const TARGET_MS_UTC = makeTargetMsUTC(2026, 0, 1, 0, 0, 0, 'America/Mexico_City');

function getDayOfYear(cDate) {
  const start = new Date(cDate.getFullYear(), 0, 1);
  const diff = cDate - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

// --- Dev Helpers ---

function isDevMode() {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname;
  return (h === 'localhost' || h === '127.0.0.1' || new URLSearchParams(window.location.search).has('dev'));
}

/**
 * Returns a Mock UTC Date object representing noon CDMX on the requested devDate
 * format: YYYY-MM-DD
 */
function getDevDateOverrideCDMX() {
  if (!isDevMode()) return null;
  const p = new URLSearchParams(window.location.search);
  const devDate = p.get('devDate');
  if (!devDate || !/^\d{4}-\d{2}-\d{2}$/.test(devDate)) return null;

  const [y, m, d] = devDate.split('-').map(Number);
  // Noon to avoid edge cases logic
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

// --- Theme Engine Logic ---
export function getThemeForDate() {
  const nowReal = new Date();
  let month, day;

  const devOverride = getDevDateOverrideCDMX();
  if (devOverride) {
    month = devOverride.getUTCMonth();
    day = devOverride.getUTCDate();
  } else {
    const offset = getTZOffsetMs('America/Mexico_City', nowReal);
    const cdmxWallMsReal = nowReal.getTime() + offset;
    const cdmxDateReal = new Date(cdmxWallMsReal);
    month = cdmxDateReal.getUTCMonth();
    day = cdmxDateReal.getUTCDate();
  }

  // Default: Neutral Warm
  let theme = { key: 'neutral', bgMode: 'float' };

  // Holiday Season (Dec 1 - Jan 6)
  if (month === 11 || (month === 0 && day <= 6)) {
    theme = { key: 'holiday', bgMode: 'bokeh' };
  }

  // New Year Peak (Dec 31 - Jan 2)
  if ((month === 11 && day === 31) || (month === 0 && day <= 2)) {
    theme = { key: 'newyear', bgMode: 'sparkles' };
  }

  return theme;
}

// --- Main Exports ---

export function getClockData() {
  const now = new Date();
  const nowMs = now.getTime();

  // 1. COUNTDOWN (Precise UTC Diff)
  const diff = TARGET_MS_UTC - nowMs;

  if (diff > 0) {
    // Still counting down
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { mode: 'COUNTDOWN', days, hours, minutes, seconds };
  }

  // 2. PROGRESS (Post-2026)
  const offsetCurrent = getTZOffsetMs('America/Mexico_City', now);
  const cdmxWallMs = nowMs + offsetCurrent;
  const cdmxDate = new Date(cdmxWallMs);

  const year = cdmxDate.getUTCFullYear();
  const monthIndex = cdmxDate.getUTCMonth();

  const startOfYearMs = Date.UTC(year, 0, 1, 0, 0, 0);
  const diffYear = cdmxWallMs - startOfYearMs;
  const day = Math.floor(diffYear / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = isLeapYear(year) ? 366 : 365;

  return {
    mode: 'PROGRESS',
    year,
    day,
    totalDays,
    monthPhase: MONTH_PHASES[monthIndex] || "Progreso del año"
  };
}

const MESSAGES_2026 = {
  "2026-01-01": "Hoy empieza. Hazlo real.",
  "2026-02-14": "El amor también se construye.",
  "2026-03-21": "Lo que siembras hoy, te encuentra mañana.",
  "2026-05-10": "Gracias por todo, mamá.",
  "2026-09-16": "La libertad se honra construyendo.",
  "2026-10-31": "No le temas a lo oscuro: entiende tu sombra.",
  "2026-11-02": "Lo que amaste, vive en lo que haces.",
  "2026-12-24": "Hoy también cuenta. Abraza el presente.",
  "2026-12-31": "Cierra fuerte. Mañana empieza otra versión de ti."
};

function toISODate(y, mIndex, d) {
  const mm = String(mIndex + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}

export function getCurrentMessage() {
  const nowReal = new Date();

  // 1. Get Wall Clock Components (CDMX)
  let year, month, day;

  const devOverride = getDevDateOverrideCDMX();

  if (devOverride) {
    // Treat override as pre-calculated UTC representation of wall clock
    year = devOverride.getUTCFullYear();
    month = devOverride.getUTCMonth();
    day = devOverride.getUTCDate();
  } else {
    const offset = getTZOffsetMs('America/Mexico_City', nowReal);
    const cdmxWallMsReal = nowReal.getTime() + offset;
    const cdmxDateReal = new Date(cdmxWallMsReal);

    year = cdmxDateReal.getUTCFullYear();
    month = cdmxDateReal.getUTCMonth();
    day = cdmxDateReal.getUTCDate();
  }

  // 2. Logic based on Year

  // PRE-2026
  if (year < 2026) {
    if (month === 11 && day === 24) return "¡Feliz Nochebuena! La magia está cerca.";
    if (month === 11 && day === 25) return "¡Feliz Navidad! El amor está en el aire.";
    if (month === 11 && day === 31) return "El último adiós al 2025. ¿Listo?";
    if (month === 0 && day === 1) return "¡Feliz Año Nuevo! El futuro es hoy."; // Only if year < 2026 (e.g. 2025 Jan 1)
    return "Es una espera con sentido.";
  }

  // 2026
  if (year === 2026) {
    const iso = toISODate(year, month, day);
    if (MESSAGES_2026[iso]) return MESSAGES_2026[iso];
    return "Este año es tuyo. Hazlo visible.";
  }

  // POST-2026 (2027+)
  return "Sigue. Lo mejor no era 2026: eras tú en movimiento.";
}
