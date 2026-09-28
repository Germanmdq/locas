"use client";

import { useRef, useState } from "react";
import { identifyContact, trackEvent, tripSlugFromPath } from "@/lib/tracking";

type Props = { title: string; departures: string[]; alternatives: string[] };

export default function LeadCapture({ title, departures, alternatives }: Props) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", timing: departures[0] || "Próxima salida",
    interest: "Quiero conocer esta salida", otherDestination: alternatives[0] || "",
    dream: "Compartir el viaje y conocer gente", traveledBefore: "No todavía",
    stories: "Sí, quiero ver experiencias", consent: true
  });
  const [saved, setSaved] = useState(false);
  const started = useRef(false);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    void trackEvent("lead_form_start", { trip: title });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const payload = { ...form, trip: title, source: "trip-page-rich-lead", createdAt: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem("locas.leads") || "[]");
    localStorage.setItem("locas.leads", JSON.stringify([payload, ...current]));
    localStorage.setItem("locas.lastLead", JSON.stringify(payload));
    await identifyContact({
      fullName: form.name, email: form.email, phone: form.phone,
      whatsappOptIn: form.consent && Boolean(form.phone), emailOptIn: form.consent,
      tripSlug: tripSlugFromPath(), interest: form.interest,
      properties: { timing: form.timing, other_destination: form.otherDestination, dream: form.dream, traveled_before: form.traveledBefore, stories: form.stories }
    });
    await trackEvent("lead_form_submit", { trip: title, timing: form.timing, interest: form.interest, other_destination: form.otherDestination, traveled_before: form.traveledBefore });
    if (form.interest.includes("lista de espera") || form.interest.includes("queda un lugar")) await trackEvent("waitlist_join", { trip: title, timing: form.timing });
    if (form.interest.includes("nueva fecha")) await trackEvent("alert_create", { trip: title, alert_type: "new_departure" });
    setSaved(true);
  }

  return (
    <section className="trip-lead-capture" aria-label="Quiero ser parte">
      <div className="trip-lead-copy">
        <span>MI LOCAS</span>
        <h2>Contanos qué viaje estás imaginando.</h2>
        <p>No queremos guardar sólo un email. Queremos entender qué te interesa para avisarte de la salida correcta, un lugar liberado, una nueva fecha o un viaje parecido.</p>
        <div className="trip-lead-benefits">
          <div><b>Interés real</b><small>Destino, fecha, tipo de experiencia y qué te gustaría vivir.</small></div>
          <div><b>Recomendaciones mejores</b><small>Si esta salida no encaja, podemos acercarte otra que sí.</small></div>
          <div><b>Comunidad desde antes</b><small>También sabemos si ya viajaste con Locas y si querés conocer historias del grupo.</small></div>
        </div>
      </div>
      <form className="trip-lead-form" onSubmit={submit} onFocus={markStarted}>
        {saved ? <div className="trip-lead-success"><b>Listo. Ya sabemos qué te interesa.</b><p>Guardamos tu interés en {title} y tus preferencias para alertas, lista de espera y recomendaciones compatibles.</p></div> : <>
          <label><span>Nombre y apellido</span><input value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))} placeholder="Tu nombre" /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e)=>setForm(v=>({...v,email:e.target.value}))} placeholder="tu@email.com" /></label>
          <label><span>WhatsApp</span><input value={form.phone} onChange={(e)=>setForm(v=>({...v,phone:e.target.value}))} placeholder="Código de país + número" /></label>
          <label><span>¿Qué salida te interesa más?</span><select value={form.timing} onChange={(e)=>setForm(v=>({...v,timing:e.target.value}))}>{departures.map(d=><option key={d}>{d}</option>)}</select></label>
          <label><span>¿Hay otro destino que también te interese?</span><select value={form.otherDestination} onChange={(e)=>setForm(v=>({...v,otherDestination:e.target.value}))}>{alternatives.map(d=><option key={d}>{d}</option>)}<option>Aún no sé</option></select></label>
          <label><span>¿Qué te gustaría vivir en este viaje?</span><select value={form.dream} onChange={(e)=>setForm(v=>({...v,dream:e.target.value}))}><option>Compartir el viaje y conocer gente</option><option>Naturaleza y paisajes</option><option>Gastronomía y cultura</option><option>Aventura y actividades</option><option>Descansar y desconectar</option><option>Un poco de todo</option></select></label>
          <label><span>¿Ya viajaste con Locas?</span><select value={form.traveledBefore} onChange={(e)=>setForm(v=>({...v,traveledBefore:e.target.value}))}><option>No todavía</option><option>Sí, una vez</option><option>Sí, varias veces</option></select></label>
          <label><span>¿Querés conocer experiencias de otras chicas de este viaje?</span><select value={form.stories} onChange={(e)=>setForm(v=>({...v,stories:e.target.value}))}><option>Sí, quiero ver experiencias</option><option>Prefiero mirar el itinerario</option></select></label>
          <label><span>¿Qué querés que hagamos?</span><select value={form.interest} onChange={(e)=>setForm(v=>({...v,interest:e.target.value}))}><option>Quiero conocer esta salida</option><option>Avisame si queda un lugar</option><option>Sumame a lista de espera</option><option>Avisame de una nueva fecha</option><option>Recomendame viajes parecidos</option></select></label>
          <label className="trip-lead-consent"><input type="checkbox" checked={form.consent} onChange={(e)=>setForm(v=>({...v,consent:e.target.checked}))} /><span>Quiero recibir novedades relacionadas con mis intereses.</span></label>
          <button type="submit">Guardar mis preferencias <span>→</span></button>
        </>}
      </form>
    </section>
  );
}
