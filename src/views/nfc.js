
import { navigateTo } from '../lib/router.js';

export default async function renderNfc() {
    const container = document.createElement('div');
    container.className = 'container fade-in';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.textAlign = 'center';
    container.style.paddingTop = '2rem';

    const style = document.createElement('style');
    style.textContent = `
    .fade-in {
      animation: fadeIn 0.8s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    .blink {
      animation: blink 2s infinite;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .nfc-stage {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 2rem auto 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .phone-icon {
      width: 80px;
      height: 140px;
      border: 3px solid rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      position: relative;
      background: rgba(255, 255, 255, 0.05);
      z-index: 2;
      animation: floatPhone 3s ease-in-out infinite;
      backdrop-filter: blur(4px);
    }
    .phone-icon::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 4px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 2px;
    }
    .nfc-tag {
      position: absolute;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #d4af37, #f0e68c);
      border-radius: 50%;
      z-index: 1;
      top: 40%;
      left: 60%;
      transform: translate(-20%, -20%);
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nfc-tag svg {
      width: 30px;
      height: 30px;
      fill: #000;
      opacity: 0.7;
    }
    .ripple-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid rgba(212, 175, 55, 0.6);
      opacity: 0;
      animation: rippleExpand 2s infinite;
    }
    .ripple-ring:nth-child(2) {
      animation-delay: 0.6s;
    }
    .ripple-ring:nth-child(3) {
      animation-delay: 1.2s;
    }
    @keyframes floatPhone {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(2deg); }
    }
    @keyframes rippleExpand {
      0% { width: 60px; height: 60px; opacity: 0.8; border-width: 4px; }
      100% { width: 220px; height: 220px; opacity: 0; border-width: 0px; }
    }
    .step-list {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: left;
      display: inline-block;
    }
    .step-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1.2rem;
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      opacity: 0;
      animation: slideIn 0.5s forwards;
    }
    .step-num {
      width: 24px;
      height: 24px;
      background: var(--accent);
      color: #000;
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .step-item:nth-child(1) { animation-delay: 0.2s; }
    .step-item:nth-child(2) { animation-delay: 0.4s; }
    .step-item:nth-child(3) { animation-delay: 0.6s; }
  `;
    container.appendChild(style);

    // HEADER
    const title = document.createElement('h1');
    title.innerText = 'Activar NFC';
    title.style.marginBottom = '0.5rem';
    container.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.innerText = 'Buscando estampa...';
    subtitle.style.color = 'var(--accent)';
    subtitle.style.fontSize = '0.9rem';
    subtitle.style.letterSpacing = '1px';
    subtitle.style.textTransform = 'uppercase';
    subtitle.className = 'blink';
    subtitle.style.width = '100%';
    subtitle.style.textAlign = 'center';
    container.appendChild(subtitle);

    // VISUAL STAGE
    const stage = document.createElement('div');
    stage.className = 'nfc-stage';

    // Tag with ripples
    const tag = document.createElement('div');
    tag.className = 'nfc-tag';
    // Simple NFC/Wave icon inside tag
    tag.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M4 20h16v2H4zM4 2h16v2H4zm9 7h-2v6h2zm5-3.6L16.6 6.8c1.3 1.3 1.3 3.3 0 4.6L18 12.8c2.1-2.1 2.1-5.5 0-7.4zm-10.6 0L8.8 6.8c-1.3 1.3-1.3 3.3 0 4.6L7.4 12.8c-2.1-2.1-2.1-5.5 0-7.4z"/>
    </svg>
    <div class="ripple-ring"></div>
    <div class="ripple-ring"></div>
    <div class="ripple-ring"></div>
  `;

    // Phone
    const phone = document.createElement('div');
    phone.className = 'phone-icon';

    stage.appendChild(tag);
    stage.appendChild(phone);
    container.appendChild(stage);

    // STEPS
    const steps = document.createElement('ul');
    steps.className = 'step-list';

    const stepData = [
        'Activa NFC o Bluetooth',
        'Acerca tu teléfono',
        'Toca la estampa'
    ];

    stepData.forEach((text, idx) => {
        const li = document.createElement('li');
        li.className = 'step-item';
        li.innerHTML = `
      <span class="step-num">${idx + 1}</span>
      <span>${text}</span>
    `;
        steps.appendChild(li);
    });
    container.appendChild(steps);

    // BACK BUTTON
    const backBtn = document.createElement('button');
    backBtn.className = 'btn';
    backBtn.innerText = 'Volver';
    backBtn.style.marginTop = '3rem';
    backBtn.onclick = (e) => {
        e.preventDefault();
        navigateTo('/');
    };
    container.appendChild(backBtn);

    return container;
}
