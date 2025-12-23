import { fetchSecretMessage } from '../lib/api.js';
import { getCountdown } from '../lib/time.js';

// --- Default Configuration ---
const DEFAULT_CONFIG = {
  introMs: 2500,
  lineEnterMs: 700,
  blurPx: 4,
  grainOpacity: 0.035,
  rippleThrottleMs: 220,
  wowEnabled: true,
  auraTrailStrength: 0.5,
  pulseStrength: 0.8,
  easterEggEnabled: true,
  interludeEnabled: true,
  interludeDurationMs: 3000,
  confettiCount: 80,
  showHomeCta: 'off', // No longer used as default
  tapAccelEnabled: true
};

// --- Speed Control Constants ---
const TAP_BOOST = 0.08;
const SPEED_DECAY_PER_SEC = 0.15;
let MAX_SPEED = 1.35;
let speedFactor = 1.0;

// Load saved config
let CONFIG = { ...DEFAULT_CONFIG };
try {
  const saved = localStorage.getItem('gift_dev_config');
  if (saved) CONFIG = { ...CONFIG, ...JSON.parse(saved) };
} catch (e) { }

// --- Global State ---
let ACT = 1;
let inputLocked = false;
let currentRunId = 0;
let exitTimer = null;
let autoExitArmed = false;

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
  startSpeedDecayLoop();

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

  // Background Flash
  let flashOverlay = document.querySelector('.background-flash');
  if (!flashOverlay) {
    flashOverlay = document.createElement('div');
    flashOverlay.className = 'background-flash';
    document.body.appendChild(flashOverlay);
  }

  // Interlude Element
  let interludeEl = document.querySelector('.interlude-2026');
  if (!interludeEl) {
    interludeEl = document.createElement('div');
    interludeEl.className = 'interlude-2026';
    interludeEl.innerHTML = `<canvas class="fx-canvas"></canvas><div class="year-2026">2026</div>`;
    document.body.appendChild(interludeEl);
  }

  // Activity/Exit Overlay
  // Ensure we only have one
  let exitOverlayBtn = document.querySelector('.exit-btn');
  if (exitOverlayBtn) exitOverlayBtn.parentElement.remove(); // Cleanup old if exists reload

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

  // --- Interact Logic (Input Gate) ---
  let lastTap = 0;
  let tapCount = 0;
  let tapResetTimer = null;

  const handleTap = (e) => {
    // Check if tapping exit button
    if (e.target.classList.contains('exit-btn')) return; // Handled by click listener

    const now = Date.now();
    if (inputLocked) return;

    // Triple Tap
    if (ACT === 3) {
      tapCount++;
      if (tapResetTimer) clearTimeout(tapResetTimer);
      tapResetTimer = setTimeout(() => { tapCount = 0; }, 500);
      if (tapCount === 3 && CONFIG.easterEggEnabled) {
        showEasterEgg(); tapCount = 0;
      }
    }

    if (now - lastTap < CONFIG.rippleThrottleMs) return;
    lastTap = now;

    // Read Acceleration
    if (ACT === 2 && CONFIG.tapAccelEnabled) {
      speedFactor = Math.min(speedFactor + TAP_BOOST, MAX_SPEED);
      const narrativeLine = contentArea.querySelector('.narrative-line.active');
      if (narrativeLine) {
        narrativeLine.classList.add('speed-boost');
        setTimeout(() => narrativeLine.classList.remove('speed-boost'), 250);
      }
    }

    // Ripple
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
  };

  function showEasterEgg() {
    if (!easterEl) return;
    easterEl.classList.add('show');
    if (document.navigator && navigator.vibrate) navigator.vibrate([30, 50, 30]);
    setTimeout(() => { easterEl.classList.remove('show'); }, 900);
  }

  let holdTimer = null;
  const startHold = (e) => {
    if (inputLocked) return;
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
  const handleTouchStart = (e) => { startHold(e); }
  const handleTouchEnd = (e) => { endHold(); }

  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchend', handleTouchEnd);
  container.addEventListener('mousedown', startHold);
  container.addEventListener('mouseup', endHold);

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
    ACT = 1;
    speedFactor = 1.0;
    inputLocked = false;
    currentRunId++;
    const myRunId = currentRunId;
    hideExitOverlay();

    focusOverlay.classList.remove('active');
    const introEl = document.createElement('div');
    introEl.className = 'intro-text';
    introEl.innerText = 'Este mensaje es solo para ti';
    contentArea.appendChild(introEl);

    await waitScaled(100, myRunId, false);
    introEl.style.opacity = '1';

    await waitScaled(CONFIG.introMs, myRunId, false);
    await fetchPromise;

    if (myRunId !== currentRunId) return;

    introEl.style.opacity = '0';
    await waitScaled(1000, myRunId, false);
    contentArea.innerHTML = '';

    if (messageData && messageData.error) {
      showError(messageData.error);
    } else {
      focusOverlay.classList.add('active');
      playMessage(messageData.message);
    }
  }

  async function playMessage(fullText) {
    ACT = 2;
    inputLocked = false;
    currentRunId++;
    const myRunId = currentRunId;

    // Ensure clean state
    hideExitOverlay();

    if (linesToPlay.length === 0) {
      const cleanText = fullText.replace(/^["']|["']$/g, '');
      linesToPlay = cleanText.split(/(?:\r\n|\r|\n)/g).map(l => l.trim()).filter(l => l);
      if (linesToPlay.length === 1) linesToPlay = linesToPlay[0].split(/\. (?=[A-Z¡¿])/).map(l => l.trim() + (l.endsWith('.') ? '' : '.'));
    }

    const totalChars = linesToPlay.join('').length;
    MAX_SPEED = Math.min(1.55, Math.max(1.20, 1.20 + (totalChars / 600) * 0.3));

    for (let i = 0; i < linesToPlay.length; i++) {
      if (myRunId !== currentRunId) return;

      const lineText = linesToPlay[i];
      const lineEl = document.createElement('div');
      lineEl.className = 'narrative-line';
      lineEl.innerText = lineText;
      contentArea.appendChild(lineEl);

      await waitScaled(50, myRunId);
      lineEl.classList.add('active');

      if (CONFIG.auraTrailStrength > 0) {
        const trail = lineEl.cloneNode(true);
        trail.className = 'narrative-line active aura-trail';
        trail.innerHTML = lineText;
        contentArea.appendChild(trail);
        requestAnimationFrame(() => { trail.classList.add('fade'); });
        setTimeout(() => trail.remove(), 900);
      }

      let readTime = Math.max(1200, lineText.length * 40);
      await waitScaled(readTime + (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? -200 : 0), myRunId);

      if (i < linesToPlay.length - 1) {
        lineEl.classList.remove('active');
        lineEl.classList.add('exit');
        await waitScaled(600, myRunId);
        lineEl.remove();
        await waitScaled(200, myRunId);
      } else {
        await waitScaled(1200, myRunId); // Short hold

        // --- TRANSITION TO INTERLUDE ---

        // 1. Show Exit Overlay (Replay option before closure)
        if (myRunId !== currentRunId) return;
        showExitOverlay({ final: false });

        await waitScaled(1200, myRunId);
        if (myRunId !== currentRunId) return;

        hideExitOverlay();
        inputLocked = true; // Lock main input not overlay

        if (CONFIG.interludeEnabled) {
          lineEl.classList.remove('active');
          lineEl.classList.add('exit');
          await waitScaled(400, myRunId, false);
          if (myRunId !== currentRunId) return;

          contentArea.innerHTML = '';
          ACT = 'INTERLUDE';
          await runInterludeSequence();

          if (myRunId === currentRunId) startClosure(null);
        } else {
          startClosure(lineEl);
        }
      }
    }
  }

  async function runInterludeSequence() {
    if (!interludeEl) return;
    speedFactor = 1.0;
    const canvas = interludeEl.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interludeEl.classList.add('visible');

    // Ensure overlay is interactable if needed in future, but currently we hide it

    let running = true;
    let particles = [];
    const colors = ['#d4af37', '#ffffff', '#f0f0f0', '#cca01d'];
    const particleCount = window.innerWidth < 480 ? 50 : CONFIG.confettiCount;

    for (let k = 0; k < particleCount; k++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vy: Math.random() * 3 + 2,
        vx: Math.random() * 2 - 1,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * 6
      });
    }

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy;
        p.x += Math.sin(p.angle) * 0.5;
        p.angle += 0.1;
        if (p.y > canvas.height) p.y = -10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(loop);
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) loop();

    await wait(CONFIG.interludeDurationMs);

    running = false;
    interludeEl.classList.remove('visible');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await wait(300);
  }

  async function startClosure(lastLineEl) {
    ACT = 3;
    inputLocked = false;
    currentRunId++; // New run ID

    if (lastLineEl) {
      lastLineEl.classList.remove('active');
      lastLineEl.classList.add('exit');
      await wait(600);
    }

    contentArea.innerHTML = '';

    // Show final overlay and arm auto-exit
    showExitOverlay({ final: true });
    armAutoExit(2800);

    // No redundant clock here, just ambient
    focusOverlay.classList.remove('active');
    // Maybe keep breathe for ambience?
    contentArea.classList.remove('breathe');
  }

  async function replayAct2() {
    disarmAutoExit();
    currentRunId++;
    ACT = 1;
    speedFactor = 1.0;

    contentArea.innerHTML = '';
    timerArea.classList.remove('visible');
    timerArea.innerHTML = '';

    hideExitOverlay();

    focusOverlay.classList.add('active');
    contentArea.classList.add('breathe');

    await wait(300);
    if (linesToPlay.length > 0) playMessage(linesToPlay.join('\n'));
  }

  // --- Overlay Logic ---
  function showExitOverlay({ final = false }) {
    let overlay = document.querySelector('.exit-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'exit-overlay';
      // Label is always "Volver a ver" since that is the action for tap
      overlay.innerHTML = `<button class="exit-btn">Volver a ver</button>`;
      document.body.appendChild(overlay);

      overlay.querySelector('.exit-btn').onclick = (e) => {
        e.stopPropagation(); // prevent body tap
        replayAct2();
      };
    }

    const btn = overlay.querySelector('.exit-btn');
    btn.innerText = final ? "Volver a ver" : "Volver a ver";

    // Force micro delay for transition
    requestAnimationFrame(() => {
      btn.classList.add('is-visible');
      if (final) btn.classList.add('is-final');
      else btn.classList.remove('is-final');
    });
  }

  function hideExitOverlay() {
    const btn = document.querySelector('.exit-btn');
    if (btn) {
      btn.classList.remove('is-visible');
      btn.classList.remove('is-final');
    }
  }

  function armAutoExit(ms) {
    autoExitArmed = true;
    if (exitTimer) clearTimeout(exitTimer);
    exitTimer = setTimeout(() => {
      if (!autoExitArmed) return;
      window.location.href = "/";
    }, ms);
  }

  function disarmAutoExit() {
    autoExitArmed = false;
    if (exitTimer) clearTimeout(exitTimer);
  }

  function showError(err) {
    focusOverlay.classList.remove('active');
    contentArea.innerHTML = `<div style="color: var(--error); font-size: 2rem;">&times;</div><p style="margin-top: 1rem;">${err.message}</p><a href="/" class="btn" style="margin-top: 10px">Regresar</a>`;
  }

  function renderMiniCountdown(container) {
    // Only used if we decide to show clock, but user requested remove redundant clock.
    // Keeping empty or ambient logic.
    container.innerHTML = '';
  }

  // --- Helpers ---
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function waitScaled(ms, myRunId, allowScale = true) {
    const effectiveMs = allowScale && speedFactor > 1.0 ? Math.round(ms / speedFactor) : ms;
    return new Promise(resolve => {
      setTimeout(() => { resolve(); }, effectiveMs);
    });
  }

  function startSpeedDecayLoop() {
    setInterval(() => {
      if (speedFactor > 1.0) {
        speedFactor = Math.max(1.0, speedFactor - (SPEED_DECAY_PER_SEC * 0.2));
      }
    }, 200);
  }

  function isDev() { return (location.hostname === 'localhost' || location.hostname === '127.0.0.1'); }

  function updateVisuals() {
    document.documentElement.style.setProperty('--blur-px', `${CONFIG.blurPx}px`);
    document.documentElement.style.setProperty('--grain-opacity', CONFIG.grainOpacity);
  }

  if (isDev() || new URLSearchParams(window.location.search).has('dev')) {
    // Init Dev panel logic (condensed for brevity as it was perfect before)
    // ... existing dev panel code ...
    const initDevPanel = () => {
      if (document.getElementById('dev-panel')) return;
      const panel = document.createElement('div'); panel.id = 'dev-panel';
      const controls = [
        { label: 'Tap Boost', key: 'tapAccelEnabled', type: 'bool' },
        { label: 'Intro (ms)', key: 'introMs', min: 0, max: 5000, step: 100 },
      ];
      controls.forEach(c => {
        const w = document.createElement('div'); w.className = 'dev-control';
        if (c.type === 'bool') {
          w.innerHTML = `<label><input type="checkbox" ${CONFIG[c.key] ? 'checked' : ''} id="chk-${c.key}"> ${c.label}</label>`;
          w.querySelector('input').onchange = (e) => { CONFIG[c.key] = e.target.checked; localStorage.setItem('gift_dev_config', JSON.stringify(CONFIG)); };
        } else {
          w.innerHTML = `<label>${c.label}: <span id="val-${c.key}">${CONFIG[c.key]}</span></label>`;
          const input = document.createElement('input'); input.type = 'range'; input.min = c.min; input.max = c.max; input.step = c.step; input.value = CONFIG[c.key];
          input.oninput = (e) => { CONFIG[c.key] = parseFloat(e.target.value); document.getElementById(`val-${c.key}`).innerText = CONFIG[c.key]; localStorage.setItem('gift_dev_config', JSON.stringify(CONFIG)); updateVisuals(); };
          w.appendChild(input);
        }
        panel.appendChild(w);
      });
      const replayBtn = document.createElement('button'); replayBtn.className = 'dev-btn'; replayBtn.innerText = 'Replay'; replayBtn.onclick = replayAct2; panel.appendChild(replayBtn);
      document.body.appendChild(panel);
    }
    initDevPanel();
  }

  return container;
}
