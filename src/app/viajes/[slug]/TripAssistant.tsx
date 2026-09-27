"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  status: string;
  price: string;
  deposit: string;
  departures: string[];
  docs: readonly string[];
  included: readonly string[];
};

type Topic = "cupos" | "pagos" | "documentacion" | "incluye" | "sola";

export default function TripAssistant({ title, status, price, deposit, departures, docs, included }: Props) {
  const [topic, setTopic] = useState<Topic>("cupos");

  const answers = useMemo(() => ({
    cupos: `${status}. La salida visible es ${departures[0] || "la próxima disponible"}. Si se completa, el sistema puede pasar tu interés a lista de espera y avisarte automáticamente si se libera un lugar.`,
    pagos: price === "Consultar"
      ? `El precio de ${title} todavía figura como “Consultar”. Cuando el valor esté cargado, la misma reserva mostrará seña, pago total, pagos parciales o cuotas habilitadas sin cambiar de página.`
      : `${title} figura desde ${price}. ${deposit}. La reserva permite elegir seña, pago total o pagos parciales/cuotas cuando estén habilitados.`,
    documentacion: `Para esta salida se solicita: ${docs.join(", ")}. Después de reservar, Mi Viaje muestra qué documentación está completa, qué falta y cualquier vencimiento pendiente.`,
    incluye: `La experiencia contempla: ${included.join(", ")}. La página separa además lo que no está incluido antes de que confirmes la reserva.`,
    sola: `Sí. La propuesta está pensada también para mujeres que viajan solas: te incorporás al grupo de la salida y la coordinación acompaña antes y durante el viaje.`
  }), [title, status, price, deposit, departures, docs, included]);

  const labels: Array<[Topic, string]> = [
    ["cupos", "¿Hay cupo?"],
    ["pagos", "¿Cómo pago?"],
    ["documentacion", "¿Qué documentación necesito?"],
    ["incluye", "¿Qué incluye?"],
    ["sola", "¿Puedo viajar sola?"]
  ];

  return (
    <section className="trip-assistant" aria-label="Asistente 24/7 del viaje">
      <div className="trip-assistant-head">
        <div>
          <span>ASISTENTE 24/7</span>
          <h3>Resolvé lo básico ahora, sin esperar.</h3>
        </div>
        <i>● En línea</i>
      </div>
      <div className="trip-assistant-chips">
        {labels.map(([key, label]) => (
          <button key={key} className={topic === key ? "is-active" : ""} onClick={() => setTopic(key)} type="button">{label}</button>
        ))}
      </div>
      <div className="trip-assistant-answer">
        <b>Locas</b>
        <p>{answers[topic]}</p>
      </div>
      <p className="trip-assistant-note">Las respuestas usan la información cargada para esta salida. Los casos excepcionales se derivan al equipo con el contexto ya registrado.</p>
    </section>
  );
}
