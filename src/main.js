import './styles/base.css';
import { initRouter } from './lib/router.js';
import { initBackground, setBackgroundMode } from './lib/background.js';
import { getThemeForDate } from './lib/time.js';

// Initialize core systems
document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Graphics
    initBackground();

    // 2. Apply Dynamic Theme
    applySeasonalTheme();

    // 3. Router
    initRouter();

    // 4. Dev Handle
    if (import.meta.env.DEV) {
        import('./lib/backgroundManager.js').then(m => {
            window.__BG = m.bgManager;
            console.log("Background Manager active: window.__BG");
        });
    }
});

// Simple Theme Applicator
function applySeasonalTheme() {
    const themeData = getThemeForDate();

    // Set CSS Theme attribute
    document.documentElement.setAttribute('data-theme', themeData.key);

    // Set Background Mode
    setBackgroundMode(themeData.bgMode);

    console.log(`[ThemeEngine] Applied: ${themeData.key} (${themeData.bgMode})`);
}
