import './styles/base.css';
import { initRouter } from './lib/router.js';
import { initBackground } from './lib/background.js';

// Initialize core systems
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initRouter();
});
