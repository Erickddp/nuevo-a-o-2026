
import { navigateTo } from '../lib/router.js';
import { checkManualAccess } from '../lib/api.js';

export default async function renderAcceso() {
    // Declare variables in outer scope of function to ensure availability
    let pinInput;
    let btn;
    let nameInput;

    const container = document.createElement('div');
    container.className = 'container fade-in';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.padding = '2rem 1rem';
    container.style.maxWidth = '400px';
    container.style.margin = '0 auto';

    // Title
    const title = document.createElement('h1');
    title.innerText = 'Acceso Manual';
    title.style.marginBottom = '0.5rem';
    title.style.fontSize = '2rem';
    container.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.innerText = 'Si no funciona el NFC, ingresa tus datos.';
    subtitle.style.textAlign = 'center';
    subtitle.style.marginBottom = '2rem';
    subtitle.style.opacity = '0.8';
    container.appendChild(subtitle);

    // Form Container
    const form = document.createElement('form');
    form.style.width = '100%';
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '1.5rem';
    form.onsubmit = (e) => e.preventDefault();
    container.appendChild(form);

    // Input Styles
    const inputStyle = `
        width: 100%;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s ease;
    `;

    // State Elements
    let state = 'NAME'; // NAME | PIN | LOADING
    let currentName = '';

    // Step 1: Name Input
    const nameGroup = document.createElement('div');
    nameGroup.style.display = 'flex';
    nameGroup.style.flexDirection = 'column';
    nameGroup.style.gap = '0.5rem';

    const nameLabel = document.createElement('label');
    nameLabel.innerText = 'Tu Nombre (o apodo familiar)';
    nameLabel.style.fontSize = '0.9rem';
    nameLabel.style.marginLeft = '4px';

    nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Ej. tu nombre';
    nameInput.style.cssText = inputStyle;

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    form.appendChild(nameGroup);

    // Step 2: PIN Input (Hidden initially)
    const pinGroup = document.createElement('div');
    pinGroup.style.display = 'none';
    pinGroup.style.flexDirection = 'column';
    pinGroup.style.gap = '0.5rem';

    const pinLabel = document.createElement('label');
    pinLabel.innerText = 'PIN de 4 dígitos';
    pinLabel.style.fontSize = '0.9rem';
    pinLabel.style.marginLeft = '4px';

    pinInput = document.createElement('input');
    pinInput.type = 'password';
    pinInput.placeholder = '****';
    pinInput.maxLength = 4;
    pinInput.inputMode = 'numeric';
    pinInput.style.cssText = inputStyle;
    pinInput.style.letterSpacing = '4px';
    pinInput.style.textAlign = 'center';
    pinInput.style.fontSize = '1.2rem';

    pinGroup.appendChild(pinLabel);
    pinGroup.appendChild(pinInput);
    form.appendChild(pinGroup);

    // Error Message
    const errorMsg = document.createElement('div');
    errorMsg.style.color = '#ff6b6b';
    errorMsg.style.fontSize = '0.9rem';
    errorMsg.style.textAlign = 'center';
    errorMsg.style.minHeight = '1.2em';
    form.appendChild(errorMsg);

    // Actions
    btn = document.createElement('button');
    btn.className = 'btn';
    btn.innerText = 'Continuar';
    btn.style.width = '100%';
    btn.style.marginTop = '0.5rem';
    form.appendChild(btn);

    const backLink = document.createElement('button');
    backLink.className = 'btn-whisper';
    backLink.innerText = 'Cancelar';
    backLink.style.margin = '2rem auto 0';
    backLink.onclick = () => navigateTo('/mensaje');
    container.appendChild(backLink);

    // Logic
    btn.onclick = async () => {
        errorMsg.innerText = '';

        if (state === 'NAME') {
            const val = nameInput.value.trim();
            if (val.length < 2) {
                errorMsg.innerText = 'Lo siento creo que no te conozco.';
                return;
            }
            currentName = val;

            // Transition to PIN
            state = 'PIN';
            nameInput.disabled = true;
            nameGroup.style.opacity = '0.5';
            nameGroup.style.display = 'none';

            const greeting = document.createElement('div');
            greeting.innerText = `Hola, ${currentName}`;
            greeting.style.fontSize = '1.5rem';
            greeting.style.fontWeight = 'bold';
            greeting.style.textAlign = 'center';
            greeting.style.marginBottom = '1rem';
            greeting.style.color = 'var(--accent)';
            form.insertBefore(greeting, pinGroup);

            pinGroup.style.display = 'flex';
            btn.innerText = 'Abrir Mensaje';
            pinInput.focus();
            return;
        }

        if (state === 'PIN') {
            const pinVal = pinInput.value.trim();
            if (pinVal.length !== 4) {
                errorMsg.innerText = 'El PIN debe ser de 4 dígitos.';
                return;
            }

            state = 'LOADING';
            btn.innerText = 'Validando...';
            btn.disabled = true;
            pinInput.style.opacity = '0.5';

            try {
                const data = await checkManualAccess({ name: currentName, pin: pinVal });

                if (data.authorized && data.url) {
                    // Navigate only on full success
                    window.location.href = data.url;
                } else {
                    const err = data.error || 'Acceso denegado';
                    if (err === 'NAME_NOT_FOUND') errorMsg.innerText = 'No encontramos un mensaje para ese nombre.';
                    else if (err === 'WRONG_PIN') errorMsg.innerText = 'PIN incorrecto. Intenta de nuevo.';
                    else errorMsg.innerText = 'Error: ' + err;

                    // Restore UI State
                    state = 'PIN';
                    btn.innerText = 'Abrir Mensaje';
                    btn.disabled = false;
                    pinInput.style.opacity = '1';
                    pinInput.value = '';
                    pinInput.focus();
                }

            } catch (e) {
                errorMsg.innerText = 'Error de conexión. Intenta de nuevo.';
                // Restore UI State
                state = 'PIN';
                btn.innerText = 'Abrir Mensaje';
                btn.disabled = false;
                pinInput.style.opacity = '1';
            }
        }
    };

    return container;
}
