/**
 * Time Utilities
 * Target: 2026-01-01T00:00:00 (Local)
 */

const TARGET_DATE = new Date(2026, 0, 1, 0, 0, 0);

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

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function getClockData() {
  const now = new Date();

  // PRE-2026: Countdown
  if (now < TARGET_DATE) {
    const diff = TARGET_DATE - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return {
      mode: 'COUNTDOWN',
      days,
      hours,
      minutes,
      seconds
    };
  }

  // POST-2026: Year Progress
  const year = now.getFullYear();
  const day = getDayOfYear(now);
  const totalDays = isLeapYear(year) ? 366 : 365;
  const monthIndex = now.getMonth();

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

  // Special Holiday Messages (Pre-2026)
  if (now.getFullYear() < 2026) {
    const month = now.getMonth();
    const day = now.getDate();
    if (month === 11 && day === 24) return "¡Feliz Nochebuena! La magia está cerca.";
    if (month === 11 && day === 31) return "El último adiós al 2025. ¿Listo?";
    return "Cada segundo cuenta hacia el 2026.";
  }

  // Post-2026 default message
  return "¡Bienvenido al 2026! El futuro es hoy.";
}
