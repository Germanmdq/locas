"use client";

import { useState } from "react";

type Props = { title: string; departures: string[] };

export default function LeadCapture({ title, departures }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", timing: departures[0] || "Próxima salida", interest: "Quiero conocer esta salida", consent: true });
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const payload = { ...form, trip: title, source: "trip-page", createdAt: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem("locas.leads") || "[]");
    localStorage.setItem("locas.leads", JSON.stringify([payload, ...current]));
    localStorage.setItem("locas.lastLead", JSON.stringify(payload));
    setSaved(true);
  }

  return (
    <section className="trip-lead-capture" aria-label="Quiero ser parte">
      <div className="trip-lead-copy">
        <span>MI LOCAS</span>
        <h2>Quiero ser parte.</h2>
        <p>Dejá tu interés registrado y la plataforma puede avisarte sobre esta salida, una nueva fecha compatible, un lugar liberado o una experiencia parecida.</p>
        <div className="trip-lead-benefits">
          <div><b>Alertas útiles</b><small>Nueva fecha, últimos lugares, lista de espera o viaje compatible.</small></div>
          <div><b>Tu interés queda guardado</b><small>Destino, fecha posible y tipo de experiencia pasan a formar parte de tu perfil.</small></div>
          <div><b>Sin empezar de cero</b><small>Cuando vuelvas, Mi Locas conserva favoritos, intereses y próximos pasos.</small></div>
        </div>
      </div>
      <form className="trip-lead-form" onSubmit={submit}>
        {saved ? <div className="trip-lead-success"><b>Listo, ya sos parte.</b><p>Guardamos tu interés en {title}. A partir de acá el sistema puede usarlo para alertas, lista de espera y recomendaciones compatibles.</p></div> : <>
          <label><span>Nombre y apellido</span><input value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))} placeholder="Tu nombre" /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e)=>setForm(v=>({...v,email:e.target.value}))} placeholder="tu@email.com" /></label>
          <label><span>WhatsApp</span><input value={form.phone} onChange={(e)=>setForm(v=>({...v,phone:e.target.value}))} placeholder="Código de país + número" /></label>
          <label><span>Fecha que te interesa</span><select value={form.timing} onChange={(e)=>setForm(v=>({...v,timing:e.target.value}))}>{departures.map(d=><option key={d}>{d}</option>)}</select></label>
          <label><span>¿Qué querés que hagamos?</span><select value={form.interest} onChange={(e)=>setForm(v=>({...v,interest:e.target.value}))}><option>Quiero conocer esta salida</option><option>Avisame si queda un lugar</option><option>Sumame a lista de espera</option><option>Avisame de una nueva fecha</option><option>Recomendame viajes parecidos</option></select></label>
          <label className="trip-lead-consent"><input type="checkbox" checked={form.consent} onChange={(e)=>setForm(v=>({...v,consent:e.target.checked}))} /><span>Quiero recibir novedades relacionadas con mis intereses.</span></label>
          <button type="submit">Guardar mi interés <span>→</span></button>
        </>}
      </form>
    </section>
  );
}
