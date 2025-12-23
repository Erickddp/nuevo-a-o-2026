/**
 * Time Utilities
 * Target: 2026-01-01T00:00:00 (Local)
 */

const TARGET_DATE = new Date('2026-01-01T00:00:00');

export function getCountdown() {
  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isArrived: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isArrived: false };
}

export function getCurrentMessage() {
  // Mock Logic for dynamic messages
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // Special Days
  if (now.getFullYear() === 2025 && month === 11 && day === 24) return "¡Feliz Nochebuena! La magia está cerca.";
  if (now.getFullYear() === 2025 && month === 11 && day === 31) return "El último adiós al 2025. ¿Listo?";
  if (now.getFullYear() >= 2026) return "¡Bienvenido al 2026! El futuro es hoy.";

  // Monthly 2025 countdown messages (Generic placeholders)
  const messages = [
    "Enero: Un inicio tranquilo.",
    "Febrero: El amor está en el aire.",
    "Marzo: La primavera se acerca.",
    "Abril: Lluvias y flores.",
    "Mayo: El sol brilla más.",
    "Junio: Mitad de año.",
    "Julio: Calor y energía.",
    "Agosto: Vacaciones soñadas.",
    "Septiembre: Nuevos comienzos.",
    "Octubre: Hojas de otoño.",
    "Noviembre: La cuenta regresiva final.",
    "Diciembre: Casi estamos ahí."
  ];

  return messages[month] || "Cada segundo cuenta hacia el 2026.";
}
