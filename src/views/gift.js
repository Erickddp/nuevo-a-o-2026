import { fetchSecretMessage } from '../lib/api.js';
import { getCountdown } from '../lib/time.js';

export default async function renderGift(params) {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    container.style.textAlign = 'center';
    container.style.maxWidth = '600px';

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('k');
    const giftId = params.id;

    const header = document.createElement('h1');
    header.innerText = `Regalo #${giftId}`;

    const statusCard = document.createElement('div');
    statusCard.className = 'card';
    statusCard.innerHTML = '<p>Verificando tu regalo...</p>';

    container.appendChild(header);
    container.appendChild(statusCard);

    // Fetch logic
    try {
        const data = await fetchSecretMessage({ id: giftId, token });

        // Success render
        statusCard.innerHTML = `
      <div style="margin-bottom: 2rem;">
        <span style="display:inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(76, 217, 100, 0.2); color: var(--success); font-size: 0.8rem;">
          VERIFICADO
        </span>
      </div>
      <p style="font-style: italic; font-size: 1.2rem; color: var(--text-main); margin-bottom: 2rem;">
        "${data.message}"
      </p>
      <div id="mini-countdown" style="border-top: 1px solid var(--glass-border); padding-top: 1rem;">
        <!-- Filled by JS -->
      </div>
    `;

        // Mini countdown inside card
        const updateTimer = () => {
            const t = getCountdown();
            const el = statusCard.querySelector('#mini-countdown');
            if (el) {
                el.innerHTML = `
          <small style="color: var(--text-muted);">Nos vemos en:</small>
          <div style="font-weight: 700; color: var(--accent-silver); margin-top: 0.25rem;">
            ${t.days}d ${t.hours}h ${t.minutes}m ${t.seconds}s
          </div>
        `;
                if (!t.isArrived) requestAnimationFrame(updateTimer);
            }
        };
        requestAnimationFrame(updateTimer);

    } catch (err) {
        // Error render
        statusCard.innerHTML = `
      <div style="color: var(--error); font-size: 3rem; margin-bottom: 1rem;">&times;</div>
      <h3 style="margin-bottom: 0.5rem;">Acceso Denegado</h3>
      <p style="color: var(--text-muted);">${err.message}</p>
      <a href="/" class="btn" style="margin-top: 1rem;">Volver al inicio</a>
    `;
    }

    return container;
}
