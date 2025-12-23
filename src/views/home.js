import { getClockData, getCurrentMessage } from '../lib/time.js';

export default async function renderHome() {
  const container = document.createElement('div');
  container.className = 'container fade-in';
  container.style.textAlign = 'center';

  const title = document.createElement('h1');
  title.innerText = 'FELIZ 2026';

  const dynamicMsg = document.createElement('p');
  dynamicMsg.innerText = getCurrentMessage();

  const countdownEl = document.createElement('div');
  countdownEl.className = 'card';
  countdownEl.style.marginTop = '2rem';
  countdownEl.style.minWidth = '300px';

  // Clock update loop
  const updateTimer = () => {
    const data = getClockData();

    if (data.mode === 'COUNTDOWN') {
      countdownEl.innerHTML = `
        <div style="font-size: 2rem; font-weight: bold; color: var(--accent-gold);">
          ${data.days}d ${data.hours}h ${data.minutes}m ${data.seconds}s
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 2px;">
          TIEMPO RESTANTE
        </div>
      `;
    } else {
      // PROGRESS mode (Post-2026)
      // data: { mode, year, day, totalDays, monthPhase }
      countdownEl.innerHTML = `
        <div style="font-size: 2rem; font-weight: bold; color: var(--accent-gold);">
          Día ${data.day} / ${data.totalDays}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 2px;">
          ${data.monthPhase}
        </div>
      `;
    }

    requestAnimationFrame(updateTimer);
  };
  requestAnimationFrame(updateTimer);

  container.appendChild(title);
  container.appendChild(dynamicMsg);
  container.appendChild(countdownEl);

  return container;
}
