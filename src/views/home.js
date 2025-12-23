import { getCountdown, getCurrentMessage } from '../lib/time.js';

export default async function renderHome() {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    container.style.textAlign = 'center';

    const title = document.createElement('h1');
    title.innerText = 'Rumbo al 2026';

    const dynamicMsg = document.createElement('p');
    dynamicMsg.innerText = getCurrentMessage();

    const countdownEl = document.createElement('div');
    countdownEl.className = 'card';
    countdownEl.style.marginTop = '2rem';
    countdownEl.style.minWidth = '300px';

    // Countdown update loop
    const updateTimer = () => {
        const t = getCountdown();
        countdownEl.innerHTML = `
      <div style="font-size: 2rem; font-weight: bold; color: var(--accent-gold);">
        ${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 2px;">
        TIEMPO RESTANTE
      </div>
    `;
        if (!t.isArrived) requestAnimationFrame(updateTimer);
    };
    requestAnimationFrame(updateTimer);

    container.appendChild(title);
    container.appendChild(dynamicMsg);
    container.appendChild(countdownEl);

    return container;
}
