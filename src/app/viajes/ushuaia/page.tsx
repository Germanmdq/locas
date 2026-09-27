import Image from "next/image";
import Link from "next/link";

export default function UshuaiaPage() {
  return (
    <main className="tripPage">
      <section className="tripHero">
        <Image src="/images/ushuaia.jpg" alt="Ushuaia" fill priority sizes="100vw" />
        <div className="heroShade" />
        <header className="subNav tripNav shell"><Link className="logo" href="/">LOCAS <span>POR LA AVENTURA</span></Link><nav><Link href="/viajes">Viajes</Link><Link href="/mi-locas">Mi Locas</Link></nav></header>
        <div className="tripHeroCopy shell">
          <p className="eyebrow light">PATAGONIA · ARGENTINA</p>
          <h1>Ushuaia</h1>
          <div className="tripMeta"><span>5 días / 4 noches</span><span>12–16 octubre</span><span>Últimos cupos</span></div>
        </div>
      </section>

      <section className="tripBody shell sectionPad">
        <div className="tripMain">
          <p className="eyebrow">EL VIAJE</p>
          <h2>El fin del mundo, vivido en grupo.</h2>
          <p className="tripLead">Una salida acompañada de principio a fin, con experiencias seleccionadas, tiempos cuidados y todo lo necesario para que sólo tengas que disfrutar.</p>

          <div className="tripBlocks">
            <article><span>01</span><h3>Itinerario</h3><p>Día 1 · Llegada y bienvenida<br/>Día 2 · Parque Nacional<br/>Día 3 · Navegación Canal Beagle<br/>Día 4 · Experiencia de montaña<br/>Día 5 · Despedida y regreso</p></article>
            <article><span>02</span><h3>Hotel</h3><p>4 noches con desayuno. Información de hotel y habitación disponible desde Mi Viaje una vez confirmada la reserva.</p></article>
            <article><span>03</span><h3>Incluye</h3><p>Alojamiento, traslados previstos, coordinación permanente, experiencias indicadas e información pre-viaje.</p></article>
            <article><span>04</span><h3>Documentación</h3><p>DNI vigente para pasajeras argentinas. La plataforma avisa faltantes y vencimientos automáticamente.</p></article>
          </div>

          <section className="tripGallery">
            <div className="galleryBig"><Image src="/images/ushuaia.jpg" alt="Paisaje de Ushuaia" fill sizes="70vw" /></div>
            <div className="gallerySmall"><Image src="/images/trevelin.jpg" alt="Patagonia" fill sizes="30vw" /></div>
          </section>

          <section className="faqBlock">
            <p className="eyebrow">PREGUNTAS FRECUENTES</p>
            {['¿Puedo viajar sola?','¿Cómo se confirma la reserva?','¿Qué pasa si se completa el cupo?','¿Puedo pagar en cuotas?'].map((q)=><div key={q}><span>{q}</span><b>+</b></div>)}
          </section>
        </div>

        <aside className="bookingCard">
          <span>DESDE</span><strong>USD 1.290</strong><p>Seña para confirmar cupo</p>
          <div className="availability"><i /> Últimos cupos disponibles</div>
          <label>Fecha<select defaultValue="oct"><option value="oct">12–16 octubre</option></select></label>
          <label>Habitación<select defaultValue="doble"><option value="doble">Doble compartida</option><option value="single">Single</option></select></label>
          <button>Iniciar reserva</button>
          <Link href="/mi-viaje">Ver cómo funciona Mi Viaje →</Link>
        </aside>
      </section>
    </main>
  );
}
