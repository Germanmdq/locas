"use client";

import { useMemo, useState } from "react";
import { identifyContact, trackEvent, tripSlugFromPath } from "@/lib/tracking";

type Props = {
  title: string;
  price: string;
  deposit: string;
  status: string;
  spots: number;
  departures: string[];
  whatsapp?: string;
};

type Step = "options" | "traveler";

export default function CommercialPanel({ title, price, deposit, status, spots, departures, whatsapp = "" }: Props) {
  const [departure, setDeparture] = useState(departures[0] || "Próxima salida");
  const [room, setRoom] = useState("Doble compartida");
  const [payment, setPayment] = useState("Seña para reservar");
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<Step>("options");
  const [traveler, setTraveler] = useState({ name: "", email: "", phone: "" });

  const message = useMemo(() => {
    return `Hola, necesito ayuda con mi reserva de ${title}. Salida: ${departure}. Habitación: ${room}. Forma de pago: ${payment}.`;
  }, [title, departure, room, payment]);

  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  async function shareTrip() {
    void trackEvent("share_click", { trip: title, method: typeof navigator.share === "function" ? "native" : "clipboard" });
    const data = { title: `Locas por la aventura · ${title}`, text: `Mirá este viaje: ${title}`, url: window.location.href };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(window.location.href);
  }

  async function continueReservation() {
    if (step === "options") {
      await trackEvent("checkout_start", { trip: title, departure, room, payment });
      await trackEvent("reservation_start", { trip: title, departure, room, payment });
      setStep("traveler");
      return;
    }

    if (!traveler.name.trim() || !traveler.email.trim()) return;

    await identifyContact({ fullName: traveler.name, email: traveler.email, phone: traveler.phone, whatsappOptIn: Boolean(traveler.phone), tripSlug: tripSlugFromPath(), interest: `Reserva iniciada: ${title}`, properties: { departure, room, payment } });
    await trackEvent("checkout_step", { trip: title, step: "traveler_identified", departure, room, payment });
    localStorage.setItem("locas.reservationDraft", JSON.stringify({
      title,
      departure,
      room,
      payment,
      traveler,
      createdAt: new Date().toISOString(),
    }));
    await trackEvent("reservation_complete", { trip: title, mode: "demo_draft", departure, room, payment });
    window.location.href = "/mi-viaje";
  }

  return (
    <aside className="trip-commerce-card">
      <div className="trip-commerce-status"><i /> {status} · {spots} lugares disponibles</div>
      <div className="trip-commerce-price"><span>DESDE</span><strong>{price}</strong></div>
      <p className="trip-commerce-deposit">{deposit}</p>

      <div className="trip-commerce-separator" />

      {step === "options" ? <>
        <label>
          <span>Salida</span>
          <select value={departure} onChange={(e) => setDeparture(e.target.value)}>
            {departures.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>

        <label>
          <span>Habitación</span>
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option>Doble compartida</option>
            <option>Single</option>
            <option>Triple</option>
          </select>
        </label>

        <label>
          <span>Forma de pago</span>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option>Seña para reservar</option>
            <option>Pago total</option>
            <option>Pagos parciales / cuotas habilitadas</option>
          </select>
        </label>

        <div className="trip-commerce-help trip-commerce-auto">
          <b>Reserva online, sin esperar una respuesta</b>
          <p>Elegís salida, habitación y forma de pago. El sistema conserva tu selección y te lleva al siguiente paso.</p>
        </div>
      </> : <>
        <div className="trip-commerce-help trip-commerce-auto">
          <b>Datos de la pasajera</b>
          <p>Quedan asociados a la reserva para no volver a pedirlos por mensaje.</p>
        </div>
        <label>
          <span>Nombre y apellido</span>
          <input value={traveler.name} onChange={(e) => setTraveler((v) => ({ ...v, name: e.target.value }))} placeholder="Tu nombre" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={traveler.email} onChange={(e) => setTraveler((v) => ({ ...v, email: e.target.value }))} placeholder="tu@email.com" />
        </label>
        <label>
          <span>Teléfono</span>
          <input value={traveler.phone} onChange={(e) => setTraveler((v) => ({ ...v, phone: e.target.value }))} placeholder="Código de país + número" />
        </label>
      </>}

      <button className="trip-commerce-primary" type="button" onClick={continueReservation}>
        {step === "options" ? "Continuar reserva" : "Crear reserva y seguir"} <span>→</span>
      </button>

      {step === "traveler" && <button className="trip-commerce-secondary" type="button" onClick={() => setStep("options")}>← Cambiar opciones</button>}

      <button className="trip-commerce-secondary" type="button" onClick={() => setSaved((v) => { const next=!v; void trackEvent(next ? "favorite_add" : "favorite_remove", { trip: title }); return next; })}>
        {saved ? "♥ Guardado en favoritos" : "♡ Guardar viaje"}
      </button>
      <button className="trip-commerce-secondary" type="button" onClick={shareTrip}>↗ Compartir</button>

      <div className="trip-commerce-help">
        <b>Después de reservar</b>
        <p>Mi Viaje centraliza estado, pagos, saldo, vencimientos, documentación, itinerario y novedades.</p>
      </div>

      {whatsapp && <a className="trip-commerce-secondary" href={waHref} target="_blank" rel="noreferrer" data-track="whatsapp_click">Necesito ayuda humana</a>}
    </aside>
  );
}
