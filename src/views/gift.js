import { fetchSecretMessage } from '../lib/api.js';
import { getCountdown } from '../lib/time.js';

// --- Default Configuration ---
const DEFAULT_CONFIG = {
  introMs: 2500,
  lineEnterMs: 700,
  blurPx: 4,
  grainOpacity: 0.035,
  rippleThrottleMs: 250,
  wowEnabled: true,
  auraTrailStrength: 0.5,
  pulseStrength: 0.8,
  easterEggEnabled: true
};

// Load saved config
let CONFIG = { ...DEFAULT_CONFIG };
try {
  const saved = localStorage.getItem('gift_dev_config');
  if (saved) CONFIG = { ...CONFIG, ...JSON.parse(saved) };
} catch (e) { }

export default async function renderGift(params) {
  const container = document.createElement('div');
  container.className = 'container';
  container.style.width = '100%';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.minHeight = '60vh';

  updateVisuals();

  // --- Overlays ---
  let noiseOverlay = document.querySelector('.film-grain');
  if (!noiseOverlay) {
    noiseOverlay = document.createElement('div');
    noiseOverlay.className = 'film-grain';
    document.body.appendChild(noiseOverlay);
  }

  let focusOverlay = document.querySelector('.focus-overlay');
  if (!focusOverlay) {
    focusOverlay = document.createElement('div');
    focusOverlay.className = 'focus-overlay';
    document.body.appendChild(focusOverlay);
  }

  // Background Flash (New)
  let flashOverlay = document.querySelector('.background-flash');
  if (!flashOverlay) {
    flashOverlay = document.createElement('div');
    flashOverlay.className = 'background-flash';
    document.body.appendChild(flashOverlay);
  }

  // Easter Egg Element
  let easterEl = document.querySelector('.easter-2026');
  if (!easterEl) {
    easterEl = document.createElement('div');
    easterEl.className = 'easter-2026';
    easterEl.innerText = 'FELIZ 2026';
    document.body.appendChild(easterEl);
  }


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

  // --- Mobile Interactions ---
  let lastTap = 0;
  let tapCount = 0; // for triple tap
  let tapResetTimer = null;

  const handleTap = (e) => {
    const now = Date.now();

    // Triple Tap Easter Egg Logic (Only in Act 3 ideally, or always)
    tapCount++;
    if (tapResetTimer) clearTimeout(tapResetTimer);
    tapResetTimer = setTimeout(() => { tapCount = 0; }, 500);

    if (tapCount === 3 && CONFIG.easterEggEnabled) {
      showEasterEgg();
      tapCount = 0;
    }

    // Double Tap Replay Logic
    const isDoubleTap = (now - lastTap < 300);
    if (isDoubleTap) {
      replayAct2();
      lastTap = 0;
      return;
    }

    if (now - lastTap < CONFIG.rippleThrottleMs) return;
    lastTap = now;

    const rect = contentArea.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    contentArea.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    // Trigger Sync Pulse (Rhythm Sync)
    if (isPlaying && CONFIG.auraTrailStrength > 0) {
      contentArea.classList.remove('wow-pulse');
      void contentArea.offsetWidth;
      contentArea.style.animationDuration = '0.3s';
      contentArea.classList.add('wow-pulse');
      setTimeout(() => contentArea.classList.remove('wow-pulse'), 300);
    }
  };

  function showEasterEgg() {
    if (!easterEl) return;
    easterEl.classList.add('show');
    if (document.navigator && navigator.vibrate) navigator.vibrate([30, 50, 30]);
    setTimeout(() => {
      easterEl.classList.remove('show');
    }, 900);
  }

  // Press & Hold
  let holdTimer = null;
  const startHold = (e) => {
    holdTimer = setTimeout(() => {
      document.body.classList.add('focus-mode');
      if (navigator.vibrate) navigator.vibrate(10);
    }, 400);
    handleTap(e);
  };
  const endHold = () => {
    if (holdTimer) clearTimeout(holdTimer);
    document.body.classList.remove('focus-mode');
  };

  // Swipe
  let startY = 0;
  const handleTouchStart = (e) => { startY = e.touches[0].clientY; startHold(e); }
  const handleTouchMove = (e) => {
    if (Math.abs(e.touches[0].clientY - startY) > 10) if (holdTimer) clearTimeout(holdTimer);
  }
  const handleTouchEnd = (e) => {
    endHold();
    const deltaY = e.changedTouches[0].clientY - startY;
    if (deltaY > 150) window.location.href = '/';
  }

  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: true });
  container.addEventListener('touchend', handleTouchEnd);
  container.addEventListener('mousedown', startHold);
  container.addEventListener('mouseup', endHold);
  container.addEventListener('mouseleave', endHold);


  // --- Logic Chain ---
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('k');
  const giftId = params.id;
  let messageData = null;
  let linesToPlay = [];

  const fetchPromise = fetchSecretMessage({ id: giftId, token })
    .then(data => { messageData = data; })
    .catch(err => { messageData = { error: err }; });

  playIntro();

  // --- Acts ---
  async function playIntro() {
    focusOverlay.classList.remove('active');
    const introEl = document.createElement('div');
    introEl.className = 'intro-text';
    introEl.innerText = 'Este mensaje es solo para ti';
    contentArea.appendChild(introEl);

    await wait(100);
    introEl.style.opacity = '1';

    await wait(CONFIG.introMs);
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

  let isPlaying = false;
  async function playMessage(fullText) {
    if (isPlaying) return;
    isPlaying = true;

    if (linesToPlay.length === 0) {
      const cleanText = fullText.replace(/^["']|["']$/g, '');
      linesToPlay = cleanText.split(/(?:\r\n|\r|\n)/g).map(l => l.trim()).filter(l => l);
      if (linesToPlay.length === 1) linesToPlay = linesToPlay[0].split(/\. (?=[A-Z¡¿])/).map(l => l.trim() + (l.endsWith('.') ? '' : '.'));
    }

    for (let i = 0; i < linesToPlay.length; i++) {
      if (!isPlaying) break;
      const lineText = linesToPlay[i];
      const lineEl = document.createElement('div');
      lineEl.className = 'narrative-line';
      lineEl.innerText = lineText;
      contentArea.appendChild(lineEl);

      await wait(50);

      lineEl.classList.add('active');
      lineEl.classList.add('line-highlight');

      // Aura Trail (Premium effect)
      if (CONFIG.auraTrailStrength > 0) {
        const trail = lineEl.cloneNode(true);
        trail.className = 'narrative-line active aura-trail';
        trail.innerHTML = lineText; // Ensure text content
        contentArea.appendChild(trail);

        requestAnimationFrame(() => { trail.classList.add('fade'); });
        setTimeout(() => trail.remove(), 900);
      }

      let readTime = Math.max(1200, lineText.length * 40);
      await wait(readTime + (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? -200 : 0));

      if (i < linesToPlay.length - 1) {
        lineEl.classList.remove('active');
        lineEl.classList.add('exit');
        await wait(600);
        lineEl.remove();
        await wait(200);
      } else {
        await wait(2000);

        // --- Set Piece: Momento 2026 ---
        if (CONFIG.wowEnabled) {
          await runWowSequence();
        }

        startClosure(lineEl);
      }
    }
  }

  // --- Set Piece Logic ---
  async function runWowSequence() {
    // 1. Freeze & Align
    document.body.classList.add('focus-mode'); // Clear distractions
    contentArea.classList.add('aligning');

    await wait(500);

    // 2. Pulse Heartbeat
    const doPulse = () => {
      contentArea.classList.remove('wow-pulse');
      void contentArea.offsetWidth;
      contentArea.style.animationDuration = '0.4s';
      contentArea.classList.add('wow-pulse');

      flashOverlay.classList.add('active');
      setTimeout(() => flashOverlay.classList.remove('active'), 250);

      if (navigator.vibrate) navigator.vibrate(20);
    };

    doPulse(); // BOOM
    await wait(600);
    doPulse(); // BOOM
    await wait(800);

    // Cleanup
    document.body.classList.remove('focus-mode');
    contentArea.classList.remove('aligning');
  }

  async function startClosure(lastLineEl) {
    focusOverlay.classList.remove('active');
    contentArea.classList.remove('breathe');
    if (lastLineEl) {
      lastLineEl.classList.remove('active');
      lastLineEl.classList.add('exit');
    }
    await wait(800);
    if (!isPlaying) return;

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
    isPlaying = false;
  }

  async function replayAct2() {
    isPlaying = false;
    contentArea.innerHTML = '';
    timerArea.classList.remove('visible');
    timerArea.innerHTML = '';
    focusOverlay.classList.add('active');
    contentArea.classList.add('breathe');
    await wait(300);
    if (linesToPlay.length > 0) playMessage(linesToPlay.join('\n'));
  }

  function showError(err) {
    focusOverlay.classList.remove('active');
    contentArea.innerHTML = `<div style="color: var(--error); font-size: 2rem;">&times;</div><p style="margin-top: 1rem;">${err.message}</p><a href="/" class="btn" style="margin-top: 10px">Regresar</a>`;
  }

  function renderMiniCountdown(container) {
    container.innerHTML = `<div id="mini-timer" class="card" style="min-width: 280px; text-align:center;"><div class="time-display" style="font-size: clamp(1.5rem, 5vw, 2rem); color:var(--accent); margin-top:0.5rem; font-weight:700;"></div></div><div style="margin-top:2rem;"><a href="/" style="color: var(--muted); text-decoration:none; text-transform:uppercase; font-size: 0.8rem; letter-spacing:1px; opacity:0.7;">Ir al inicio</a></div>`;
    const display = container.querySelector('.time-display');
    const update = () => {
      const t = getCountdown();
      display.innerText = `${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s`;
      requestAnimationFrame(update);
    };
    update();
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  function isDev() { return (location.hostname === 'localhost' || location.hostname === '127.0.0.1'); }

  function updateVisuals() {
    document.documentElement.style.setProperty('--blur-px', `${CONFIG.blurPx}px`);
    document.documentElement.style.setProperty('--grain-opacity', CONFIG.grainOpacity);
  }

  // Init Dev Panel
  const initDevPanel = () => {
    if (document.getElementById('dev-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'dev-panel';
    const controls = [
      { label: 'WOW Mode', key: 'wowEnabled', type: 'bool' },
      { label: 'Intro (ms)', key: 'introMs', min: 0, max: 5000, step: 100 },
      { label: 'Aura', key: 'auraTrailStrength', min: 0, max: 1, step: 0.1 }
    ];

    controls.forEach(c => {
      const w = document.createElement('div'); w.className = 'dev-control';
      if (c.type === 'bool') {
        w.innerHTML = `<label><input type="checkbox" ${CONFIG[c.key] ? 'checked' : ''} id="chk-${c.key}"> ${c.label}</label>`;
        w.querySelector('input').onchange = (e) => {
          CONFIG[c.key] = e.target.checked;
          localStorage.setItem('gift_dev_config', JSON.stringify(CONFIG));
        };
      } else {
        w.innerHTML = `<label>${c.label}: <span id="val-${c.key}">${CONFIG[c.key]}</span></label>`;
        const input = document.createElement('input');
        input.type = 'range'; input.min = c.min; input.max = c.max; input.step = c.step; input.value = CONFIG[c.key];
        input.oninput = (e) => {
          CONFIG[c.key] = parseFloat(e.target.value);
          document.getElementById(`val-${c.key}`).innerText = CONFIG[c.key];
          localStorage.setItem('gift_dev_config', JSON.stringify(CONFIG));
          updateVisuals();
        };
        w.appendChild(input);
      }
      panel.appendChild(w);
    });
    const replayBtn = document.createElement('button'); replayBtn.className = 'dev-btn'; replayBtn.innerText = 'Replay'; replayBtn.onclick = replayAct2; panel.appendChild(replayBtn);
    document.body.appendChild(panel);
  }

  if (isDev() || new URLSearchParams(window.location.search).has('dev')) initDevPanel();

  return container;
}
