import { getClockData, getCurrentMessage } from '../lib/time.js';

export default async function renderHome() {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.width = '100%';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.textAlign = 'center';

  const title = document.createElement('h1');
  title.innerText = 'RUMBO AL 2026';

  const dynamicMsg = document.createElement('p');
  dynamicMsg.innerText = getCurrentMessage();

  const countdownCard = document.createElement('div');
  countdownCard.className = 'card';
  countdownCard.style.marginTop = '2rem';
  countdownCard.style.minWidth = '300px';

  // Clock update loop
  const updateTimer = () => {
    const data = getClockData();

    if (data.mode === 'COUNTDOWN') {
      countdownCard.innerHTML = `
        <div class="clock-text-large">
          ${data.days}d ${data.hours}h ${data.minutes}m ${data.seconds}s
        </div>
        <div class="clock-label">
          TIEMPO RESTANTE
        </div>
      `;
    } else {
      // PROGRESS mode (Post-2026)
      // data: { mode, year, day, totalDays, monthPhase }
      countdownCard.innerHTML = `
        <div class="clock-text-large">
          Día ${data.day} / ${data.totalDays}
        </div>
        <div class="clock-label">
          ${data.monthPhase}
        </div>
      `;
    }

    requestAnimationFrame(updateTimer);
  };
  requestAnimationFrame(updateTimer);

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'cta-container';

  const startBtn = document.createElement('a');
  startBtn.className = 'btn-premium-glass';
  startBtn.innerText = 'ABRIR MI MENSAJE';
  startBtn.href = '/mensaje';
  // Styles handled by CSS class .btn-premium-glass and .cta-container

  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    import('../lib/router.js').then(m => m.navigateTo('/mensaje'));
  });

  ctaContainer.appendChild(startBtn);

  container.appendChild(title);
  container.appendChild(dynamicMsg);
  container.appendChild(countdownCard);
  container.appendChild(ctaContainer);

  return container;
}
