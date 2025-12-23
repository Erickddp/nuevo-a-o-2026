export default async function renderNotFound() {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    container.style.textAlign = 'center';

    container.innerHTML = `
    <h1 style="font-size: 4rem; margin-bottom: 0;">404</h1>
    <p>Lo que buscas no está aquí.</p>
    <a href="/" class="btn">Regresar</a>
  `;

    return container;
}
