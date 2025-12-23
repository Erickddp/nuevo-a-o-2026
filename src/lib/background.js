/**
 * Background Animation
 * Seasonal support: float (default), bokeh (holiday), sparkles (newyear)
 * Interaction: Pointer repulsion/attraction
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

// Mobile/Performance detection (Simple heuristic)
// If devicePixelRatio is high or weak GPU, we might want to cap at 30? 
// For now, let's stick to 60 unless throttled by browser.
// But we DO respect reduced motion.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || prefersReducedMotion) return;

    ctx = canvas.getContext('2d');

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
    window.addEventListener('mouseout', () => { pointer.active = false; }); // Mouse leaves window

    // Start Loop
    draw(0);
}

export function setBackgroundMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    // Re-init particles for new mode
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

    // Config based on mode
    let count = isMobile ? 35 : 65; // Slightly richer count

    if (currentMode === 'bokeh') count = isMobile ? 18 : 30;
    if (currentMode === 'sparkles') count = isMobile ? 25 : 50;

    for (let i = 0; i < count; i++) {
        particles.push(createParticle());
    }
}

function createParticle() {
    // Shared defaults
    const p = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 0,
        color: '255, 255, 255', // default rgb
        originalSize: 0
    };

    if (currentMode === 'float') {
        // Gentle "Snow/Embers"
        p.vy = -(Math.random() * 0.4 + 0.1); // float up slowly
        p.vx = (Math.random() - 0.5) * 0.3; // slight drift
        p.size = Math.random() * 2.5 + 1;
        p.alpha = Math.random() * 0.4 + 0.1;
        // Warm white / soft gold
        p.color = Math.random() > 0.8 ? '255, 215, 0' : '255, 255, 255';
    }
    else if (currentMode === 'bokeh') {
        // Big soft holiday lights
        p.vx = (Math.random() - 0.5) * 0.15;
        p.vy = (Math.random() - 0.5) * 0.15;
        p.size = Math.random() * 25 + 15; // Large
        p.alpha = Math.random() * 0.12 + 0.05; // Very subtle
        // Red, Gold, Warm White
        const roll = Math.random();
        if (roll > 0.7) p.color = '255, 50, 50'; // Red
        else if (roll > 0.4) p.color = '255, 215, 0'; // Gold
        else p.color = '255, 255, 240'; // Warm cream
    }
    else if (currentMode === 'sparkles') {
        // New Year rising sparkles
        p.vy = -(Math.random() * 2.5 + 0.8); // float up fast
        p.vx = (Math.random() - 0.5) * 0.5;
        p.size = Math.random() * 1.8; // Tiny
        p.alpha = Math.random();
        p.color = Math.random() > 0.5 ? '255, 255, 255' : '200, 200, 255'; // Blue-white
    }

    p.originalSize = p.size;
    return p;
}

function draw(timestamp) {
    if (!ctx) return;

    // FPS Throttling
    const deltaTime = timestamp - lastTime;
    if (deltaTime < frameInterval) {
        // Skip frame if we are too fast
        requestAnimationFrame(draw);
        return;
    }
    lastTime = timestamp - (deltaTime % frameInterval);

    ctx.clearRect(0, 0, width, height);

    // Interaction Parameters
    const interactRadius = width < 768 ? 140 : 200; // Larger interaction zone
    const forceStrength = 0.08;

    particles.forEach(p => {
        // 1. Interaction Logic
        if (pointer.active) {
            const dx = pointer.x - p.x;
            const dy = pointer.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < interactRadius) {
                // Calculate force (closer = stronger)
                const force = (1 - dist / interactRadius) * forceStrength;

                // Repulsion
                p.vx -= (dx / dist) * force * 5;
                p.vy -= (dy / dist) * force * 5;

                // Slight "swirl" (optional magic feel)
                if (currentMode === 'sparkles') {
                    p.vx += -(dy / dist) * force * 2;
                    p.vy += (dx / dist) * force * 2;
                }
            }
        }

        // 2. Physics Update
        p.x += p.vx;
        p.y += p.vy;

        // Damping (Friction)
        p.vx *= 0.96;
        if (currentMode !== 'float' && currentMode !== 'sparkles') p.vy *= 0.96; // float/sparkles have constant vy up

        // Re-apply constant motion bias if slowed too much? 
        // No, let them drift naturally.

        // 3. Wrap Around / Reset
        if (currentMode === 'float' || currentMode === 'sparkles') {
            // Constant Upward motion needs reset at top
            if (p.y < -50) {
                p.y = height + 50;
                p.x = Math.random() * width;
                p.vx = 0; // Reset accumulated velocity
            }
            // X Wrap
            if (p.x > width + 50) p.x = -50;
            if (p.x < -50) p.x = width + 50;
        } else {
            // Bokeh containment (bounce gently)
            if (p.x < -50) p.vx += 0.05;
            if (p.x > width + 50) p.vx -= 0.05;
            if (p.y < -50) p.vy += 0.05;
            if (p.y > height + 50) p.vy -= 0.05;
        }

        // 4. Render
        ctx.beginPath();
        // Blur for bokeh
        if (currentMode === 'bokeh') {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            g.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
            g.addColorStop(1, `rgba(${p.color}, 0)`);
            ctx.fillStyle = g;
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Standard crisp circle
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    requestAnimationFrame(draw);
}
