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

/**
 * Returns the offset in milliseconds relative to UTC for a given timezone and date.
 * (e.g., if it's -06:00, returns -21600000)
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

  // Construct ISO-like string as if it were UTC to get "zoned" numeric value
  // Note: we use this solely to extract the numeric value of time in that zone
  const year = getPart('year');
  const month = getPart('month').padStart(2, '0');
  const day = getPart('day').padStart(2, '0');
  const hour = getPart('hour').padStart(2, '0');
  const minute = getPart('minute').padStart(2, '0');
  const second = getPart('second').padStart(2, '0');

  // Treat components as UTC to get raw numeric value
  const zonedTimeAsUTC = Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

  return zonedTimeAsUTC - date.getTime();
}

// 1. Calculate Target 2026-01-01 00:00:00 in CDMX milliseconds
// We use a reference date close to target to get correct offset (DST or Standard) if needed.
// However, Jan 1 is Standard Time usually. We'll dynamic check just to be safe.
const _targetBase = new Date(Date.UTC(2026, 0, 1, 6, 0, 0)); // Approx UTC guess
// But better: Find offset for Jan 1 2026 specifically
// Offset = (CDMX_Time - UTC_Time). CDMX is behind, so Zoned < UTC generally?
// Actually simpler:
// We want the EXACT UTC timestamp that corresponds to 2026-01-01 00:00:00 America/Mexico_City
function getTargetTimestamp() {
  // 2026-01-01 00:00:00 CDMX
  // In UTC, this is likely 2026-01-01 06:00:00 UTC (GMT-6) 
  // We can verify by reversing:
  const guessUTC = Date.UTC(2026, 0, 1, 6, 0, 0);
  // Let's rely on standard offset logic for robustness:
  // We want T such that getTZOffsetMs('America/Mexico_City', T) + T = Date.UTC(2026,0,1,0,0,0)? No...

  // Alternative robust approach:
  // "2026-01-01T00:00:00" in CDMX needs to be converted to global ms.
  // We can't parse directly with TZ in standard JS without libs easily.
  // But we can approximate and correct.
  // Mexico City on Jan 1 is CST (UTC-6).
  return Date.UTC(2026, 0, 1, 6, 0, 0);
}

const TARGET_MS_UTC = getTargetTimestamp();

/**
 * Returns current time in ms, adjusted so that numeric value matches CDMX wall clock.
 * Useful for day/year calcs pretending to be local.
 * BUT for precise diff, we should compare UTC to UTC.
 */
function getNowMsInCDMX() {
  const now = new Date();
  const offset = getTZOffsetMs('America/Mexico_City', now);
  // This value represents "Wall Clock Milliseconds" logic
  // e.g. if it is 10:00 AM CDMX, this partial ms will reflect 10:00 AM UTC numeric
  return now.getTime() + offset;
}

function getDayOfYear(cDate) {
  // cDate is a Date object constructed from CDMX parts (so "local" logic applies)
  const start = new Date(cDate.getFullYear(), 0, 1);
  const diff = cDate - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

/**
 * Helper to get CDMX "Date" object for property access (year, month, day)
 * This object is "faked" to Local time but holds CDMX values.
 */
function getCDMXDate() {
  const ms = getNowMsInCDMX();
  return new Date(ms); // This date object, when accessed via .getUTCHours(), gives CDMX hours?
  // No. new Date(ms) treats ms as UTC epoch.
  // If ms was shifted by offset, then new Date(ms).getUTCHours() returns CDMX hours.
  // We should use UTC methods on this object to be safe from browser local TZ.
}

export function getClockData() {
  const now = new Date();
  const nowMs = now.getTime();
  const offsetCurrent = getTZOffsetMs('America/Mexico_City', now);

  // 1. COUNTDOWN (Precise UTC Diff)
  // Target is UTC 2026-01-01 06:00:00
  // Now is Date.now()
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
  // We need "Current CDMX Year/Day"
  // Since we are "past" target, let's look at wall clock
  // Wall clock MS = UTC + Offset
  const cdmxWallMs = nowMs + offsetCurrent;
  const cdmxDate = new Date(cdmxWallMs);

  // Use UTC methods to extract "Wall" values because cdmxWallMs is shifted
  const year = cdmxDate.getUTCFullYear();
  const monthIndex = cdmxDate.getUTCMonth();
  const dayIndex = cdmxDate.getUTCDate(); // Day of month

  // Day of Year Calc
  const startOfYearMs = Date.UTC(year, 0, 1, 0, 0, 0);
  const diffYear = cdmxWallMs - startOfYearMs; // ms since start of CDMX year
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

export function getCurrentMessage() {
  const now = new Date();
  const offset = getTZOffsetMs('America/Mexico_City', now);
  const cdmxDate = new Date(now.getTime() + offset);

  const year = cdmxDate.getUTCFullYear();
  const month = cdmxDate.getUTCMonth();
  const day = cdmxDate.getUTCDate();

  // Special Holiday Messages (Pre-2026)
  if (year < 2026) {
    if (month === 11 && day === 24) return "¡Feliz Nochebuena! La magia está cerca.";
    if (month === 11 && day === 31) return "El último adiós al 2025. ¿Listo?";
    return "Cada segundo cuenta hacia el 2026.";
  }

  // Post-2026 default message
  return "¡Bienvenido al 2026! El futuro es hoy.";
}
