import { fetchSecretMessage } from '../lib/api.js';
import { getCountdown } from '../lib/time.js';

export default async function renderGift(params) {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.width = '100%';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.minHeight = '60vh';

  // --- Effects Overlays ---
  const noiseOverlay = document.createElement('div');
  noiseOverlay.className = 'film-grain';
  document.body.appendChild(noiseOverlay);

  const focusOverlay = document.createElement('div');
  focusOverlay.className = 'focus-overlay';
  document.body.appendChild(focusOverlay);

  // --- Elements ---
  const contentArea = document.createElement('div');
  contentArea.id = 'narrative-area';
  contentArea.className = 'breathe';
  contentArea.style.textAlign = 'center';
  contentArea.style.position = 'relative';

  const timerArea = document.createElement('div');
  timerArea.className = 'timer-fade';

  container.appendChild(contentArea);
  container.appendChild(timerArea);

  // --- Tap Ripple Logic (Throttled) ---
  let lastTap = 0;
  const handleTap = (e) => {
    const now = Date.now();
    // Low power throttle: max 1 per 250ms
    if (now - lastTap < 250) return;
    lastTap = now;

    const rect = contentArea.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Prevent ripple outside nice bounds if needed, but rect is container relative
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    contentArea.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);

    // Micro visual feedback
    const currentLine = contentArea.querySelector('.narrative-line.active');
    if (currentLine) {
      currentLine.classList.remove('line-highlight');
      void currentLine.offsetWidth;
      currentLine.classList.add('line-highlight');
    }
  };

  container.addEventListener('touchstart', handleTap, { passive: true });
  container.addEventListener('mousedown', handleTap);

  // --- Parallax Logic (Desktop Only) ---
  const handleParallax = (e) => {
    // Disable on mobile via touch detection approximation or width
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;

    requestAnimationFrame(() => {
      contentArea.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.05}deg)`;
    });
  };
  document.addEventListener('mousemove', handleParallax);

  // --- Config ---
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('k');
  const giftId = params.id;

  // Append overlays
  container.appendChild(noiseOverlay);
  container.appendChild(focusOverlay);

  // --- Logic Chain ---
  let messageData = null;
  const fetchPromise = fetchSecretMessage({ id: giftId, token })
    .then(data => { messageData = data; })
    .catch(err => { messageData = { error: err }; });

  playIntro();

  async function playIntro() {
    focusOverlay.classList.remove('active');

    const introEl = document.createElement('div');
    introEl.className = 'intro-text';
    introEl.innerText = 'Este mensaje es solo para ti';
    contentArea.appendChild(introEl);

    await wait(100);
    introEl.style.opacity = '1';

    await wait(2500);
    await fetchPromise;

    introEl.style.opacity = '0';
    await wait(1000);
    contentArea.innerHTML = '';

    if (messageData && messageData.error) {
      showError(messageData.error);
    } else {
      focusOverlay.classList.add('active');
      playMessage(messageData.message);
    }
  }

  async function playMessage(fullText) {
    // Clean quotes just in case server sends them inside string
    const cleanText = fullText.replace(/^["']|["']$/g, '');

    let lines = cleanText.split(/(?:\r\n|\r|\n)/g).map(l => l.trim()).filter(l => l);
    if (lines.length === 1) {
      lines = lines[0].split(/\. (?=[A-Z¡¿])/).map(l => l.trim() + (l.endsWith('.') ? '' : '.'));
    }

    // State 2: Guided Reading
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];

      const lineEl = document.createElement('h2');
      lineEl.className = 'narrative-line';
      lineEl.innerText = lineText;
      // Accessibilty
      lineEl.setAttribute('aria-live', 'polite');
      contentArea.appendChild(lineEl);

      await wait(50);

      lineEl.classList.add('active');
      lineEl.classList.add('line-highlight');

      let readTime = Math.max(1500, lineText.length * 40);

      // Speed up for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        readTime *= 0.7;
      }

      await wait(readTime);

      if (i < lines.length - 1) {
        lineEl.classList.remove('active');
        lineEl.classList.add('exit');
        await wait(600);
        lineEl.remove();
        await wait(200);
      } else {
        await wait(2000);
        startClosure(lineEl);
      }
    }
  }

  async function startClosure(lastLineEl) {
    focusOverlay.classList.remove('active');
    contentArea.classList.remove('breathe');

    lastLineEl.classList.remove('active');
    lastLineEl.classList.add('exit');
    await wait(800);
    contentArea.innerHTML = '';

    const caption = document.createElement('div');
    caption.className = 'final-caption warm-glow';
    caption.innerText = 'Guardado para cuando lo necesites.';
    contentArea.appendChild(caption);

    await wait(100);
    caption.style.opacity = '1';

    await wait(2000);

    renderMiniCountdown(timerArea);
    timerArea.classList.add('visible');

    document.removeEventListener('mousemove', handleParallax);
    container.removeEventListener('touchstart', handleTap);
    container.removeEventListener('mousedown', handleTap);
  }

  function showError(err) {
    focusOverlay.classList.remove('active');
    contentArea.innerHTML = `
      <div style="color: var(--error); font-size: 2rem;">&times;</div>
      <p style="margin-top: 1rem;">${err.message || 'Error desconocido'}</p>
      <a href="/" class="btn" style="margin-top: 10px">Regresar</a>
    `;
  }

  function renderMiniCountdown(container) {
    container.innerHTML = `
      <div id="mini-timer" class="card" style="min-width: 280px; text-align:center;">
         <small style="color: var(--muted); text-transform:uppercase; letter-spacing:1px; font-size: 0.75rem;">Tiempo restante</small>
         <div class="time-display" style="font-size: clamp(1.5rem, 5vw, 2rem); color:var(--accent); margin-top:0.5rem; font-weight:700;"></div>
      </div>
      <div style="margin-top:2rem;">
        <a href="/" style="color: var(--muted); text-decoration:none; font-size: 0.9rem; border-bottom:1px solid currentColor;">Volver al inicio</a>
      </div>
    `;

    const display = container.querySelector('.time-display');
    const update = () => {
      const t = getCountdown();
      display.innerText = `${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s`;
      requestAnimationFrame(update);
    };
    update();
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return container;
}
