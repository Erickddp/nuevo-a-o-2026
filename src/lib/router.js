/**
 * Router SPA (Vanilla)
 * Handles navigation without page reloads.
 */

const routes = {
    '/': () => import('../views/home.js').then(m => m.default),
    '/g/:id': () => import('../views/gift.js').then(m => m.default),
    '/404': () => import('../views/notfound.js').then(m => m.default)
};

export async function initRouter() {
    window.addEventListener('popstate', handleLocation);
    handleLocation(); // process initial URL
}

async function handleLocation() {
    const path = window.location.pathname;
    const match = matchRoute(path);

    const app = document.getElementById('app');
    app.innerHTML = ''; // Clean previous view

    try {
        const viewRender = await match.loader();
        // match.params contains { id: '...' } etc if needed
        const content = await viewRender(match.params);
        app.appendChild(content);
    } catch (err) {
        console.error("Route error", err);
        window.history.pushState({}, "", "/404");
        handleLocation();
    }
}

function matchRoute(path) {
    // Simple regex matcher
    // Check exact match first
    if (routes[path]) {
        return { loader: routes[path], params: {} };
    }

    // Check pattern match /g/:id
    const giftMatch = path.match(/^\/g\/([^/]+)$/);
    if (giftMatch) {
        return {
            loader: routes['/g/:id'],
            params: { id: giftMatch[1] }
        };
    }

    // Fallback
    return { loader: routes['/404'], params: {} };
}
