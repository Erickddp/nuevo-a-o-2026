/**
 * Background Animation
 * Seasonal support: float (default), bokeh (holiday), sparkles (newyear)
 * Logic driven by Background Manager
 */

import { bgManager } from './backgroundManager.js';

let particles = [];
let ctx, width, height;

// FPS Control
let lastTime = 0;

export function initBackground() {
    if (bgManager.state.isRunning) return; // Prevent duplicate loops

    const canvas = document.getElementById('bg-canvas');
    if (!canvas || bgManager.state.deviceProfile.prefersReducedMotion) return;

    ctx = canvas.getContext('2d');
    bgManager.state.isRunning = true;

    // Initial Resize
    resize();
    window.addEventListener('resize', resize);

    // Interaction Listeners - Update Manager State
    window.addEventListener('mousemove', (e) => {
        bgManager.state.pointer.x = e.clientX;
        bgManager.state.pointer.y = e.clientY;
        bgManager.state.pointer.active = true;
    });

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            bgManager.state.pointer.x = e.touches[0].clientX;
            bgManager.state.pointer.y = e.touches[0].clientY;
            bgManager.state.pointer.active = true;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            bgManager.state.pointer.x = e.touches[0].clientX;
            bgManager.state.pointer.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => { bgManager.state.pointer.active = false; });
    window.addEventListener('mouseout', () => { bgManager.state.pointer.active = false; });

    // Listen for config changes
    bgManager.onChange(({ reinitNeeded }) => {
        if (reinitNeeded) {
            initParticles();
        }
    });

    // Start Loop
    draw(0);
}

export function setBackgroundMode(mode) {
    bgManager.setMode(mode);
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
    const count = bgManager.computeCounts();

    for (let i = 0; i < count; i++) {
        particles.push(createParticle());
    }
}

function createParticle() {
    const { mode, visuals, motion } = bgManager.config;
    const { isMobile } = bgManager.state.deviceProfile;

    // Size Range
    const range = visuals.sizeRanges[mode];
    const size = Math.random() * (range.max - range.min) + range.min;

    const p = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: size,
        alpha: 0,
        color: '255, 255, 255',
        baseVx: 0,
        baseVy: 0
    };

    if (mode === 'float') {
        p.baseVy = -(Math.random() * motion.baseSpeed.float + 0.1);
        p.baseVx = (Math.random() - 0.5) * motion.driftStrength;
        p.alpha = Math.random() * 0.4 + 0.1;
        p.color = Math.random() > 0.8 ? '255, 215, 0' : '255, 255, 255';
    }
    else if (mode === 'bokeh') {
        p.baseVx = (Math.random() - 0.5) * motion.baseSpeed.bokeh;
        p.baseVy = (Math.random() - 0.5) * motion.baseSpeed.bokeh;
        p.alpha = Math.random() * 0.12 + 0.05;
        const roll = Math.random();
        if (roll > 0.7) p.color = '255, 50, 50';
        else if (roll > 0.4) p.color = '255, 215, 0';
        else p.color = '255, 255, 240';
    }
    else if (mode === 'sparkles') {
        p.baseVy = -(Math.random() * motion.baseSpeed.sparkles + 0.8);
        p.baseVx = (Math.random() - 0.5) * 0.5;
        p.alpha = Math.random();
        p.color = Math.random() > 0.5 ? '255, 255, 255' : '200, 200, 255';
    }

    p.vx = p.baseVx;
    p.vy = p.baseVy;

    // Apply Global Alpha Multipliers
    const alphaMult = isMobile ? visuals.alphaMultiplierMobile : visuals.alphaMultiplierDesktop;
    p.alpha *= alphaMult;

    return p;
}

// Internal timing for beat
let lastPulseSec = -1;
let driftPulse = 0;

function draw(timestamp) {
    if (!ctx) return;

    const { config, state } = bgManager;
    const { quality, interaction, motion, beat } = config;
    const { deviceProfile, pointer } = state;

    // FPS Throttling
    const targetFps = deviceProfile.isMobile ? quality.targetFpsMobile : quality.targetFpsDesktop;
    const frameInterval = 1000 / targetFps;

    const deltaTime = timestamp - lastTime;
    if (deltaTime < frameInterval) {
        requestAnimationFrame(draw);
        return;
    }
    lastTime = timestamp - (deltaTime % frameInterval);

    ctx.clearRect(0, 0, width, height);

    // Beat Sync
    if (beat.secondBeatEnabled) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (nowSec !== lastPulseSec) {
            lastPulseSec = nowSec;
            driftPulse = 1.0;
        }
        driftPulse *= beat.beatDecay;
    } else {
        driftPulse = 0;
    }

    // Interaction Parameters
    const interactRadius = deviceProfile.isMobile ? interaction.pointerRadiusMobile : interaction.pointerRadiusDesktop;
    const forceStrength = deviceProfile.isMobile ? interaction.pointerForceMobile : interaction.pointerForceDesktop;

    particles.forEach(p => {
        // Pulse affects velocity
        let speedMult = 1.0 + (driftPulse * beat.beatStrength);

        // 1. Interaction
        if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < interactRadius) {
                const force = (1 - dist / interactRadius) * forceStrength;
                p.vx -= (dx / dist) * force * 5;
                p.vy -= (dy / dist) * force * 5;

                if (interaction.swirlStrength && config.mode === 'sparkles') {
                    p.vx += -(dy / dist) * force * interaction.swirlStrength;
                    p.vy += (dx / dist) * force * interaction.swirlStrength;
                }
            }
        }

        // 2. Physics Update
        p.vx *= motion.friction;
        if (config.mode !== 'float' && config.mode !== 'sparkles') p.vy *= motion.friction;

        p.x += (p.baseVx * speedMult) + p.vx;
        p.y += (p.baseVy * speedMult) + p.vy;

        // 3. Wrap Around
        if (config.mode === 'float' || config.mode === 'sparkles') {
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
        if (config.mode === 'bokeh') {
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
