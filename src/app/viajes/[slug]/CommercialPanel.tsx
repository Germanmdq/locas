"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  price: string;
  deposit: string;
  status: string;
  departures: string[];
  whatsapp?: string;
};

export default function CommercialPanel({ title, price, deposit, status, departures, whatsapp = "" }: Props) {
  const [departure, setDeparture] = useState(departures[0] || "Consultar próxima salida");
  const [room, setRoom] = useState("Doble compartida");
  const [payment, setPayment] = useState("Seña para reservar");
  const [saved, setSaved] = useState(false);

  const message = useMemo(() => {
    return `Hola, quiero consultar/reservar el viaje ${title}. Salida: ${departure}. Habitación: ${room}. Forma de pago: ${payment}.`;
  }, [title, departure, room, payment]);

  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  async function shareTrip() {
    const data = { title: `Locas por la aventura · ${title}`, text: `Mirá este viaje: ${title}`, url: window.location.href };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <aside className="trip-commerce-card">
      <div className="trip-commerce-status"><i /> {status}</div>
      <div className="trip-commerce-price"><span>DESDE</span><strong>{price}</strong></div>
      <p className="trip-commerce-deposit">{deposit}</p>

      <div className="trip-commerce-separator" />

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
          <option>Consultar cuotas</option>
        </select>
      </label>

      <a className="trip-commerce-primary" href={waHref} target="_blank" rel="noreferrer">
        Reservar por WhatsApp <span>→</span>
      </a>

      <button className="trip-commerce-secondary" type="button" onClick={() => setSaved((v) => !v)}>
        {saved ? "♥ Guardado en favoritos" : "♡ Guardar viaje"}
      </button>
      <button className="trip-commerce-secondary" type="button" onClick={shareTrip}>↗ Compartir</button>

      <div className="trip-commerce-help">
        <b>¿Tenés dudas antes de reservar?</b>
        <p>Te ayudamos con fechas, habitación, documentación, pagos y disponibilidad.</p>
      </div>
    </aside>
  );
}
