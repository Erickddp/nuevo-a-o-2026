import { getClockData, getCurrentMessage } from '../lib/time.js';

export default async function renderHome() {
  // Check for Personalization
  const recipientName = localStorage.getItem('gift_recipient');

  const container = document.createElement('div');
  container.className = 'home-container';

  // Title Area
  const title = document.createElement('h1');
  title.style.marginBottom = recipientName ? '0.5rem' : '1rem';

  if (recipientName) {
    title.innerHTML = `<span style="display:block; font-size: 0.6em; opacity:0.8; font-weight:400; letter-spacing:1px; margin-bottom:5px;">HOLA, ${recipientName.toUpperCase()}</span>RUMBO AL 2026`;
  } else {
    title.innerText = 'RUMBO AL 2026';
  }

  // Dynamic Message
  const dynamicMsg = document.createElement('p');
  dynamicMsg.className = 'home-subtitle';
  dynamicMsg.innerText = getCurrentMessage();

  // Clock Card
  const countdownCard = document.createElement('div');
  countdownCard.className = 'card clock-card';

  // NEW: Split Structure
  const daysRow = document.createElement('div');
  daysRow.style.marginBottom = '1rem';
  const daysVal = document.createElement('span');
  daysVal.className = 'clock-text-large';
  daysVal.style.fontSize = '2.8rem'; // Bigger days
  const daysLabel = document.createElement('span');
  daysLabel.innerText = ' DÍAS ';
  daysLabel.className = 'clock-label';
  daysLabel.style.display = 'block';

  daysRow.appendChild(daysVal);
  daysRow.appendChild(daysLabel);

  const timeRow = document.createElement('div');
  timeRow.className = 'clock-label';
  timeRow.style.fontSize = '1.1rem';
  timeRow.style.letterSpacing = '2px';
  timeRow.style.fontVariantNumeric = 'tabular-nums'; // Mono spacing for numbers
  const timeVal = document.createElement('span');
  timeVal.className = 'time-val'; // Target for animation
  timeRow.appendChild(timeVal);

  countdownCard.appendChild(daysRow);
  countdownCard.appendChild(timeRow);

  // Clock logic
  let lastSec = -1;
  const updateVisuals = () => {
    const data = getClockData();

    if (data.mode === 'COUNTDOWN') {
      daysVal.innerText = data.days;
      timeVal.innerText = `${data.hours}h ${data.minutes}m ${data.seconds}s`;
      daysLabel.innerText = 'DÍAS RESTANTES';

      // Tick Animation
      if (data.seconds !== lastSec) {
        timeVal.animate([
          { transform: 'scale(1)', opacity: 0.8 },
          { transform: 'scale(1.05)', opacity: 1 },
          { transform: 'scale(1)', opacity: 0.8 }
        ], { duration: 200, easing: 'ease-out' });
        lastSec = data.seconds;
      }

    } else {
      // PROGRESO
      daysVal.innerText = `DÍA ${data.day}`;
      daysLabel.innerText = `DE ${data.totalDays}`;
      timeVal.innerText = data.monthPhase.toUpperCase();
    }
  };

  // Initial Paint
  updateVisuals();

  // Optimised Interval
  const intervalId = setInterval(updateVisuals, 1000);

  // Register cleanup
  if (window.__viewCleanup) window.__viewCleanup();
  window.__viewCleanup = () => {
    clearInterval(intervalId);
  };

  // Spacer and CTA
  const spacer = document.createElement('div');
  spacer.className = 'home-spacer';

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'home-cta';

  const startBtn = document.createElement('a');
  startBtn.className = 'btn-whisper';
  startBtn.innerText = 'Descubrir mi mensaje';
  startBtn.href = '/mensaje';

  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    import('../lib/router.js').then(m => m.navigateTo('/mensaje'));
  });

  ctaContainer.appendChild(startBtn);

  container.appendChild(title);
  container.appendChild(dynamicMsg);
  container.appendChild(countdownCard);
  container.appendChild(spacer);
  container.appendChild(ctaContainer);

  return container;
}
