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
  // Film Grain
  const noiseOverlay = document.createElement('div');
  noiseOverlay.className = 'film-grain';
  document.body.appendChild(noiseOverlay);

  // Focus Overlay
  const focusOverlay = document.createElement('div');
  focusOverlay.className = 'focus-overlay';
  document.body.appendChild(focusOverlay);

  // --- Elements ---
  const contentArea = document.createElement('div');
  contentArea.id = 'narrative-area';
  contentArea.className = 'breathe'; // Global breathe
  contentArea.style.textAlign = 'center';
  contentArea.style.position = 'relative'; // For ripple

  const timerArea = document.createElement('div');
  timerArea.className = 'timer-fade'; // Initially hidden

  container.appendChild(contentArea);
  container.appendChild(timerArea);

  // --- Tap Ripple Logic ---
  const handleTap = (e) => {
    // Create Ripple
    const rect = contentArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    contentArea.appendChild(ripple);

    setTimeout(() => ripple.remove(), 700);

    // Micro Vibration (if applicable device support existed, but here visual only)
    // Visual feedback via minimal glow boost
    /* We can trigger a quick class on current active line if exists */
    const currentLine = contentArea.querySelector('.narrative-line.active');
    if (currentLine) {
      // Reset animation trick
      currentLine.classList.remove('line-highlight');
      void currentLine.offsetWidth; // trigger reflow
      currentLine.classList.add('line-highlight');
    }
  };

  // Attach tap listener (only active during Act 2 really, but harmless elsewhere)
  container.addEventListener('touchstart', handleTap, { passive: true });
  container.addEventListener('mousedown', handleTap);

  // --- Parallax Logic (Desktop) ---
  const handleParallax = (e) => {
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

  // --- Clean Up Function ---
  // We need to remove body overlays when leaving this view
  // Since we don't have a full component unmount lifecycle in this simple router,
  // we can rely on next navigation clearing body or ...
  // ideally, router should handle this, but for now we append to body, 
  // so let's stick them to container if possible? 
  // Focus overlay needs to cover screen fixed. 
  // Let's attach a MutationObserver or just let router clear 'app'.
  // But these are on body. We must clean them up manually if we navigate away.
  // PRO-TIP: We'll modify router to clear View specific body appends? 
  // For simplicity here: we attach them to body, but we can't easily clean up on vanilla router.
  // ALTERNATIVE: Attach to #app and make #app fit screen? 
  // Let's attach to #app actually to ensure they get destroyed on view change.
  // But #app has padding. Let's start overlays inside container then use fixed positioning.
  container.appendChild(noiseOverlay);
  container.appendChild(focusOverlay);


  // --- Logic Chain ---
  let messageData = null;
  const fetchPromise = fetchSecretMessage({ id: giftId, token })
    .then(data => { messageData = data; })
    .catch(err => { messageData = { error: err }; });

  // 2. State 1: Intro (Hypnosis)
  playIntro();

  async function playIntro() {
    focusOverlay.classList.remove('active'); // Start clear

    // Texto sutil
    const introEl = document.createElement('div');
    introEl.className = 'intro-text';
    introEl.innerText = 'Este mensaje es solo para ti';
    contentArea.appendChild(introEl);

    // Fade In
    await wait(100);
    introEl.style.opacity = '1';

    // Hold 2.5s (Visual silence)
    await wait(2500);

    // Wait for data
    await fetchPromise;

    // Fade Out Intro
    introEl.style.opacity = '0';
    await wait(1000);
    contentArea.innerHTML = '';

    if (messageData && messageData.error) {
      showError(messageData.error);
    } else {
      // Start Act 2
      focusOverlay.classList.add('active'); // Blur background for reading focus
      playMessage(messageData.message);
    }
  }

  async function playMessage(fullText) {
    let lines = fullText.split(/(?:\r\n|\r|\n)/g).map(l => l.trim()).filter(l => l);
    if (lines.length === 1) {
      lines = lines[0].split(/\. (?=[A-Z¡¿])/).map(l => l.trim() + (l.endsWith('.') ? '' : '.'));
    }

    // State 2: Guided Reading
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];

      const lineEl = document.createElement('h2');
      lineEl.className = 'narrative-line';
      lineEl.innerText = lineText;
      contentArea.appendChild(lineEl);

      await wait(50);

      lineEl.classList.add('active');
      // Initial flash
      lineEl.classList.add('line-highlight');


      const readTime = Math.max(1500, lineText.length * 40);
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
    // Act 3: Closure
    focusOverlay.classList.remove('active'); // Return to reality (clear blur)
    contentArea.classList.remove('breathe'); // Stop heavy breathing

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

    // Remove listeners
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
         <small style="color: var(--text-muted); text-transform:uppercase; letter-spacing:1px;">Tiempo restante</small>
         <div class="time-display" style="font-size:2rem; color:var(--accent-gold); margin-top:0.5rem; font-weight:700;"></div>
      </div>
      <div style="margin-top:2rem;">
        <a href="/" style="color: var(--text-muted); text-decoration:none; font-size: 0.9rem; border-bottom:1px solid currentColor;">Volver al inicio</a>
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
