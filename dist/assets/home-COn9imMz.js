import{g as i,a as s}from"./time-CYFlcgut.js";async function c(){const e=document.createElement("div");e.className="container fade-in",e.style.textAlign="center";const r=document.createElement("h1");r.innerText="Rumbo al 2026";const a=document.createElement("p");a.innerText=i();const t=document.createElement("div");t.className="card",t.style.marginTop="2rem",t.style.minWidth="300px";const o=()=>{const n=s();t.innerHTML=`
      <div style="font-size: 2rem; font-weight: bold; color: var(--accent-gold);">
        ${n.days}d ${n.hours}h ${n.minutes}m ${n.seconds}s
      </div>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 2px;">
        TIEMPO RESTANTE
      </div>
    `,n.isArrived||requestAnimationFrame(o)};return requestAnimationFrame(o),e.appendChild(r),e.appendChild(a),e.appendChild(t),e}export{c as default};
