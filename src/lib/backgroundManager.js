/**
 * Background Manager
 * Centralized configuration and runtime API for background effects.
 */

function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

const DEFAULT_CONFIG = {
    mode: "float",
    quality: {
        targetFpsDesktop: 60,
        targetFpsMobile: 30,
        adaptive: true
    },
    density: {
        floatCountDesktop: 120,
        floatCountMobile: 90,
        bokehCountDesktop: 120,
        bokehCountMobile: 90,
        sparklesCountDesktop: 35,
        sparklesCountMobile: 90,
        maxParticles: 100
    },
    visuals: {
        alphaMultiplierDesktop: 0.65,
        alphaMultiplierMobile: 9.95,
        sizeRanges: {
            float: { min: 1, max: 2.5 },
            bokeh: { min: 15, max: 25 },
            sparkles: { min: 0.5, max: 1.8 }
        },
        backgroundOpacityGlobal: 0.1
    },
    motion: {
        baseSpeed: {
            float: 0.3,
            bokeh: 0.15,
            sparkles: 2.5
        },
        driftStrength: 0.95,
        friction: 0.96,
        wrapBehavior: "reset" // wrap vs reset
    },
    interaction: {
        pointerRadiusDesktop: 260,
        pointerRadiusMobile: 60,
        pointerForceDesktop: 0.08,
        pointerForceMobile: 0.07,
        swirlStrength: 0.6,
        safeZoneEnabled: false
    },
    beat: {
        secondBeatEnabled: true,
        beatStrength: 0.30,
        beatDecay: 0.95
    }
};

const PRESETS = {
    calm: {
        motion: { driftStrength: 0.1, baseSpeed: { float: 0.2, bokeh: 0.05, sparkles: 1.5 } },
        beat: { beatStrength: 0.1 },
        density: { floatCountDesktop: 40, bokehCountDesktop: 15 }
    },
    vivid: {
        motion: { driftStrength: 0.5, baseSpeed: { float: 0.6, bokeh: 0.25, sparkles: 3.5 } },
        beat: { beatStrength: 0.5 },
        density: { floatCountDesktop: 100, bokehCountDesktop: 45 }
    },
    ultra: {
        density: { floatCountDesktop: 150, bokehCountDesktop: 60, sparklesCountDesktop: 100 },
        visuals: { alphaMultiplierDesktop: 0.85 },
        interaction: { pointerRadiusDesktop: 280, pointerForceDesktop: 0.12 }
    },
    mobileSafe: {
        quality: { targetFpsMobile: 24 },
        density: { floatCountMobile: 20, bokehCountMobile: 10, sparklesCountMobile: 15 },
        visuals: { alphaMultiplierMobile: 0.4 }
    }
};

function createBackgroundManager() {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection ? navigator.connection.saveData : false;

    let config = deepClone(DEFAULT_CONFIG);
    let listeners = [];

    // State
    const state = {
        isRunning: false,
        pointer: { x: -9999, y: -9999, active: false },
        deviceProfile: {
            isMobile,
            dpr: window.devicePixelRatio || 1,
            prefersReducedMotion,
            saveData
        }
    };

    // Apply hardware-based overrides
    if (prefersReducedMotion || saveData) {
        config.motion.driftStrength = 0;
        config.density.floatCountMobile = 10;
        config.density.bokehCountMobile = 5;
    }

    const manager = {
        config,
        state,

        getConfig() {
            return deepClone(this.config);
        },

        setConfig(partial) {
            let reinitNeeded = false;

            const merge = (target, source) => {
                for (const key in source) {
                    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        if (!target[key]) target[key] = {};
                        merge(target[key], source[key]);
                    } else {
                        // Check if change requires re-init
                        if (['density', 'sizeRanges', 'floatCount', 'bokehCount', 'sparklesCount'].some(k => key.includes(k))) {
                            if (target[key] !== source[key]) reinitNeeded = true;
                        }

                        target[key] = source[key];
                    }
                }
            };

            merge(this.config, partial);

            // Notify listeners
            listeners.forEach(cb => cb({ config: this.config, reinitNeeded }));
            return { reinitNeeded };
        },

        setMode(mode) {
            this.setConfig({ mode });
        },

        applyPreset(name) {
            if (PRESETS[name]) {
                return this.setConfig(PRESETS[name]);
            }
            return { reinitNeeded: false };
        },

        computeCounts() {
            const { density, mode } = this.config;
            const { isMobile } = this.state.deviceProfile;

            let countKey = `${mode}Count${isMobile ? 'Mobile' : 'Desktop'}`;
            let count = density[countKey] || 0;

            return Math.min(count, density.maxParticles);
        },

        onChange(cb) {
            listeners.push(cb);
            return () => {
                listeners = listeners.filter(l => l !== cb);
            };
        },

        snapshot() {
            return {
                config: this.getConfig(),
                state: deepClone(this.state),
                resolvedCount: this.computeCounts()
            };
        },

        reset() {
            this.config = deepClone(DEFAULT_CONFIG);
            listeners.forEach(cb => cb({ config: this.config, reinitNeeded: true }));
        },

        // Helpers for console
        ultra() { return this.applyPreset("ultra"); },
        calm() { return this.applyPreset("calm"); },
        vivid() { return this.applyPreset("vivid"); },
        mobileSafe() { return this.applyPreset("mobileSafe"); }
    };

    return manager;
}

export const bgManager = createBackgroundManager();

/**
 * Dev Usage:
 * window.__BG.setMode("bokeh")
 * window.__BG.setConfig({ interaction: { pointerRadiusDesktop: 260 } })
 * window.__BG.applyPreset("ultra")
 * window.__BG.snapshot()
 */
