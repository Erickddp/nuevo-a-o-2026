import{a as m}from"./time-CYFlcgut.js";async function p({id:n,token:e}){try{const t=await fetch(`/api/message?id=${n}&k=${e}`);if(t.status===401)throw new Error("Acceso no autorizado.");if(!t.ok)throw new Error("Error de conexión con el servidor.");return await t.json()}catch(t){throw console.error("API Error:",t),t}}async function g(n){const e=document.createElement("div");e.className="container fade-in",e.style.textAlign="center",e.style.maxWidth="600px";const s=new URLSearchParams(window.location.search).get("k"),i=n.id,c=document.createElement("h1");c.innerText=`Regalo #${i}`;const r=document.createElement("div");r.className="card",r.innerHTML="<p>Verificando tu regalo...</p>",e.appendChild(c),e.appendChild(r);try{const a=await p({id:i,token:s});r.innerHTML=`
      <div style="margin-bottom: 2rem;">
        <span style="display:inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(76, 217, 100, 0.2); color: var(--success); font-size: 0.8rem;">
          VERIFICADO
        </span>
      </div>
      <p style="font-style: italic; font-size: 1.2rem; color: var(--text-main); margin-bottom: 2rem;">
        "${a.message}"
      </p>
      <div id="mini-countdown" style="border-top: 1px solid var(--glass-border); padding-top: 1rem;">
        <!-- Filled by JS -->
      </div>
    `;const d=()=>{const o=m(),l=r.querySelector("#mini-countdown");l&&(l.innerHTML=`
          <small style="color: var(--text-muted);">Nos vemos en:</small>
          <div style="font-weight: 700; color: var(--accent-silver); margin-top: 0.25rem;">
            ${o.days}d ${o.hours}h ${o.minutes}m ${o.seconds}s
          </div>
        `,o.isArrived||requestAnimationFrame(d))};requestAnimationFrame(d)}catch(a){r.innerHTML=`
      <div style="color: var(--error); font-size: 3rem; margin-bottom: 1rem;">&times;</div>
      <h3 style="margin-bottom: 0.5rem;">Acceso Denegado</h3>
      <p style="color: var(--text-muted);">${a.message}</p>
      <a href="/" class="btn" style="margin-top: 1rem;">Volver al inicio</a>
    `}return e}export{g as default};
