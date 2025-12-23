/**
 * Background Animation
 * Seasonal support: float (default), bokeh (holiday), sparkles (newyear)
 * Interaction: Pointer repulsion/attraction
 * Sync: Breathe speed with Seconds
 */

let currentMode = 'float';
let particles = [];
let ctx, width, height;

// Pointer Tracking
let pointer = { x: -9999, y: -9999, active: false };

// FPS Control
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

// Pulse State
let lastPulseSec = -1;
let driftPulse = 0;

// Single-loop Guard
let isRunning = false;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initBackground() {
    if (isRunning) return; // Prevent duplicate loops

    const canvas = document.getElementById('bg-canvas');
    if (!canvas || prefersReducedMotion) return;

    ctx = canvas.getContext('2d');
    isRunning = true;

    // Initial Resize
    resize();
    window.addEventListener('resize', resize);

    // Interaction Listeners
    window.addEventListener('mousemove', (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
    });

    // Touch
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            pointer.x = e.touches[0].clientX;
            pointer.y = e.touches[0].clientY;
            pointer.active = true;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            pointer.x = e.touches[0].clientX;
            pointer.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => { pointer.active = false; });
    window.addEventListener('mouseout', () => { pointer.active = false; });

    // Start Loop
    draw(0);
}

export function setBackgroundMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    initParticles();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
    initParticles();
}

function initParticles() {
    particles = [];
    const isMobile = width < 768;

    // Richer count (reduced compared to previous 65/35 to help performance)
    let count = isMobile ? 30 : 55;

    if (currentMode === 'bokeh') count = isMobile ? 18 : 30;
    if (currentMode === 'sparkles') count = isMobile ? 25 : 50;

    for (let i = 0; i < count; i++) {
        particles.push(createParticle());
    }
}

function createParticle() {
    const p = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 0,
        color: '255, 255, 255',
        originalSize: 0,
        baseVx: 0,
        baseVy: 0
    };

    if (currentMode === 'float') {
        p.baseVy = -(Math.random() * 0.4 + 0.1);
        p.baseVx = (Math.random() - 0.5) * 0.3;
        p.size = Math.random() * 2.5 + 1;
        p.alpha = Math.random() * 0.4 + 0.1;
        p.color = Math.random() > 0.8 ? '255, 215, 0' : '255, 255, 255';
    }
    else if (currentMode === 'bokeh') {
        p.baseVx = (Math.random() - 0.5) * 0.15;
        p.baseVy = (Math.random() - 0.5) * 0.15;
        p.size = Math.random() * 25 + 15;
        p.alpha = Math.random() * 0.12 + 0.05;
        const roll = Math.random();
        if (roll > 0.7) p.color = '255, 50, 50';
        else if (roll > 0.4) p.color = '255, 215, 0';
        else p.color = '255, 255, 240';
    }
    else if (currentMode === 'sparkles') {
        p.baseVy = -(Math.random() * 2.5 + 0.8);
        p.baseVx = (Math.random() - 0.5) * 0.5;
        p.size = Math.random() * 1.8;
        p.alpha = Math.random();
        p.color = Math.random() > 0.5 ? '255, 255, 255' : '200, 200, 255';
    }

    p.vx = p.baseVx;
    p.vy = p.baseVy;
    p.originalSize = p.size;

    // Lower opacity globally for readability
    p.alpha *= 0.65;

    return p;
}

function draw(timestamp) {
    if (!ctx) return;

    // FPS Throttling
    const deltaTime = timestamp - lastTime;
    if (deltaTime < frameInterval) {
        requestAnimationFrame(draw);
        return;
    }
    lastTime = timestamp - (deltaTime % frameInterval);

    ctx.clearRect(0, 0, width, height);

    // Beat Sync (Pulse every second)
    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec !== lastPulseSec) {
        lastPulseSec = nowSec;
        driftPulse = 1.0; // Trigger pulse strength
    }
    // Decay pulse
    driftPulse *= 0.95;

    // Interaction Parameters
    const interactRadius = width < 768 ? 140 : 200;
    const forceStrength = 0.08;

    particles.forEach(p => {
        // Base Motion + Pulse
        // Pulse affects velocity slightly to create "breathing" or "chase"
        let speedMult = 1.0 + (driftPulse * 0.3); // +30% speed at beat peak

        // 1. Logic
        if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < interactRadius) {
                const force = (1 - dist / interactRadius) * forceStrength;
                p.vx -= (dx / dist) * force * 5;
                p.vy -= (dy / dist) * force * 5;
            }
        }

        // 2. Physics Update
        // Mix base velocity with dynamic velocity (interactions)
        // We add base velocity freshly scaled by pulse, but keep accumulated interaction momentum

        // First dampen existing momentum (friction)
        p.vx *= 0.96;
        if (currentMode !== 'float' && currentMode !== 'sparkles') p.vy *= 0.96;

        // Apply Base Motion (with pulse)
        // Note: We add it to position directly, or add to velocity?
        // Adding to pos ensures constant drift.
        p.x += (p.baseVx * speedMult) + p.vx;
        p.y += (p.baseVy * speedMult) + p.vy;


        // 3. Wrap Around / Reset
        if (currentMode === 'float' || currentMode === 'sparkles') {
            if (p.y < -50) {
                p.y = height + 50;
                p.x = Math.random() * width;
                p.vx = 0;
            }
            if (p.x > width + 50) p.x = -50;
            if (p.x < -50) p.x = width + 50;
        } else {
            if (p.x < -50) p.vx += 0.05;
            if (p.x > width + 50) p.vx -= 0.05;
            if (p.y < -50) p.vy += 0.05;
            if (p.y > height + 50) p.vy -= 0.05;
        }

        // 4. Render
        ctx.beginPath();
        if (currentMode === 'bokeh') {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            g.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
            g.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = g;
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    requestAnimationFrame(draw);
}
