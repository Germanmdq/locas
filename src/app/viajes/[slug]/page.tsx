import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import TripEffects from "./TripEffects";
import CommercialPanel from "./CommercialPanel";
import LeadCapture from "./LeadCapture";
import TripAssistant from "./TripAssistant";
import { getTripBySlug, getPublishedTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip || trip.publicationStatus !== "published") notFound();
  const allTrips = await getPublishedTrips(false);
  const related = [...allTrips, ...allTrips];
  const visualImages = trip.itineraryImages.length ? trip.itineraryImages : trip.itinerary.map(() => trip.heroImage);
  const blogCardImage = trip.communityImage || trip.editorialImage || trip.heroImage;
  const editorialImage = trip.editorialImage || trip.heroImage;
  const communityImage = trip.communityImage || trip.heroImage;
  const closingImage = trip.closingImage || trip.heroImage;

  return (
    <main className="locas-trip-page">
      <TripEffects />
      <section className="locas-trip-hero" style={{ backgroundImage: `url(${trip.heroImage})` }}>
        <div className="locas-trip-overlay" />
        <header className="locas-trip-nav">
          <Link href="/" className="locas-trip-brand">Locas por la aventura</Link>
          <nav><Link href="/">Inicio</Link><Link href="/viajes">Viajes</Link><Link href={`/blog/${slug}`}>Revista</Link><Link href="/mi-locas">Mi Locas</Link><Link href="/mi-viaje">Mi Viaje</Link><Link href="/catalogo">Catálogo</Link></nav>
          <Link href="/viajes" className="locas-trip-nav-cta">Comenzá a explorar <span>→</span></Link>
        </header>
        <div className="locas-trip-hero-grid">
          <div data-trip-reveal className="locas-trip-reveal locas-trip-hero-left">
            <h1>{trip.title}</h1>
            <Link href="/viajes" className="locas-trip-primary">Ver todos los viajes <span>→</span></Link>
          </div>
          <p data-trip-reveal className="locas-trip-reveal locas-trip-hero-copy">{trip.lead}</p>
        </div>
      </section>

      <section className="locas-trip-details">
        <div data-trip-reveal className="locas-trip-reveal locas-trip-facts">
          <article className="locas-trip-fact-card">
            <span className="locas-trip-fact-icon"><MapPin size={20} strokeWidth={1.8}/></span>
            <div><small>Destino</small><b>{trip.location}</b><em>{trip.title}</em></div>
          </article>
          <article className="locas-trip-fact-card">
            <span className="locas-trip-fact-icon"><CalendarDays size={20} strokeWidth={1.8}/></span>
            <div><small>Próxima salida</small><b>{trip.departures[0]}</b><em>{trip.duration}</em></div>
          </article>
          <article className="locas-trip-fact-card locas-trip-fact-card-spots">
            <span className="locas-trip-fact-icon"><UsersRound size={20} strokeWidth={1.8}/></span>
            <div><small>Lugares disponibles</small><b>{trip.spots} {trip.spots===1?"cupo":"cupos"}</b><em>Grupo confirmado</em></div>
          </article>
        </div>
        <article className="locas-trip-editorial">
          <div data-trip-reveal className="locas-trip-reveal locas-trip-copy-block">
            <h2>{trip.lead}</h2>
            <p>{trip.intro}</p>
          </div>
          <section data-trip-reveal className="locas-trip-reveal trip-itinerary">
            <div className="trip-itinerary-head"><h2>Así se vive el viaje</h2><p>Una planificación provisoria para mostrarte el ritmo de la experiencia. Los horarios y actividades finales se confirman antes de la salida.</p></div>
            <div className="trip-itinerary-list">
              {trip.itinerary.map(([day, title, text], index) => (
                <article key={day} className="trip-itinerary-day trip-itinerary-day-photo">
                  <span>{day}</span><div className="trip-itinerary-day-copy"><h3>{title}</h3><p>{text}</p><small>Un día pensado para vivir el destino en grupo, compartir el momento y volver con una historia.</small></div>
                  <figure><Image src={visualImages[index % visualImages.length] || trip.heroImage} alt={`${trip.title} · ${day}`} fill sizes="(max-width: 700px) 92vw, 300px" style={{objectPosition: `${50 + (index % 3) * 10}% center`}} /></figure>
                </article>
              ))}
            </div>
          </section>
          <Link href={`/blog/${slug}`} data-trip-reveal className="locas-trip-reveal trip-blog-card">
            <div><span>REVISTA LOCAS</span><h3>Qué nos enamora de {trip.title}</h3><p>Una guía para imaginar el viaje antes de salir: lugares, momentos, sabores, historias y por qué este destino funciona tan bien para vivirlo en grupo.</p><b>Leer la historia completa →</b></div>
            <figure><Image src={blogCardImage} alt={`Guía de ${trip.title}`} fill sizes="(max-width: 800px) 92vw, 420px" /></figure>
          </Link>
          <figure data-trip-reveal className="locas-trip-reveal locas-trip-wide-image"><Image src={editorialImage} alt={trip.title} fill sizes="(max-width: 900px) 94vw, 72vw" /></figure>
          <div data-trip-reveal className="locas-trip-reveal locas-trip-copy-block">
            <h2>Qué incluye la experiencia</h2>
            <ul>{trip.included.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="trip-commercial-grid">
            <div data-trip-reveal className="locas-trip-reveal locas-trip-copy-block trip-commercial-mini">
              <h2>Qué no incluye</h2>
              <ul>{trip.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div data-trip-reveal className="locas-trip-reveal locas-trip-copy-block trip-commercial-mini">
              <h2>Documentación</h2>
              <ul>{trip.docs.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <div data-trip-reveal className="locas-trip-reveal trip-coordinator-card">
            <div className="trip-coordinator-avatar">L</div>
            <div><span>ACOMPAÑAMIENTO</span><h3>Coordinación antes y durante el viaje</h3><p>Una persona del equipo de Locas acompaña la salida y centraliza novedades, documentación, horarios y asistencia.</p></div>
          </div>
          <div data-trip-reveal className="locas-trip-reveal trip-faq-commercial">
            <h2>Preguntas frecuentes</h2>
            {(trip.faqs.length ? trip.faqs : [
              ['¿Cómo reservo?','Elegís la salida, cargás tus datos y avanzás con la seña. La reserva queda registrada en Mi Viaje.'],
              ['¿Qué pasa si se completa el cupo?','Podés entrar en lista de espera y recibir un aviso si se libera un lugar.']
            ]).map(([q,a]) => <details key={q}><summary>{q}<b>+</b></summary><p>{a}</p></details>)}
          </div>
          <section data-trip-reveal className="locas-trip-reveal trip-community-story">
            <figure className="trip-community-photo"><Image src={communityImage} alt={`Comunidad Locas en ${trip.title}`} fill sizes="(max-width: 800px) 92vw, 850px" /></figure>
            <div className="trip-community-copy">
              <span>COMUNIDAD LOCAS</span>
              <h2>El viaje empieza con el grupo.</h2>
              <p>El destino importa, pero la experiencia se construye con las mujeres que lo viven juntas. Compartir, reírse, acompañarse, descubrir lugares y volver con historias y vínculos es parte central del producto.</p>
            </div>
            <div className="trip-community-grid">
              <article><b>Antes del viaje</b><p>Información clara, coordinación y un espacio para empezar a conocerse.</p></article>
              <article><b>Durante la salida</b><p>Momentos compartidos, actividades grupales, acompañamiento y experiencias pensadas para conectar.</p></article>
              <article><b>Después</b><p>Fotos, historias, comunidad postviaje, próximos viajes, referidos y vínculos que continúan.</p></article>
            </div>
          </section>
          <LeadCapture title={trip.title} departures={[...trip.departures]} alternatives={allTrips.filter((item) => item.slug !== slug).map((item) => item.title)} />
          <TripAssistant title={trip.title} status={trip.status} price={trip.price} deposit={trip.deposit} departures={[...trip.departures]} docs={trip.docs} included={trip.included} />
          <figure data-trip-reveal className="locas-trip-reveal locas-trip-wide-image locas-trip-wide-image-second"><Image src={closingImage} alt={`${trip.title} - viaje`} fill sizes="(max-width: 900px) 94vw, 72vw" /></figure>
          <section data-trip-reveal className="locas-trip-reveal trip-service-proof">
            <div className="trip-service-card"><span>HOTEL</span><h3>Alojamiento centralizado en Mi Viaje</h3><p>Nombre del hotel, tipo de habitación, check-in, dirección y archivos de la reserva quedan disponibles en un solo lugar después de confirmar.</p></div>
            <div className="trip-service-card"><span>EXPERIENCIAS</span><h3>Actividades con estado claro</h3><p>Cada experiencia puede mostrar si está incluida, opcional, confirmada o pendiente, evitando preguntas repetidas por WhatsApp.</p></div>
            <div className="trip-service-card"><span>TESTIMONIOS</span><h3>Prueba social asociada al viaje</h3><p>Este espacio mostrará historias y testimonios de pasajeras reales de esta salida o de viajes similares.</p></div>
          </section>
        </article>
      </section>

      <section className="trip-commerce-shell">
        <div className="trip-commerce-layout">
          <div className="trip-commerce-intro">
            <h2>Reservá tu lugar.</h2>
            <p>Elegí salida, habitación y forma de pago desde acá. La idea es que puedas avanzar en la reserva sin depender de una conversación manual.</p>
            <div className="trip-commerce-trust">
              <div><b>Cupos y estado</b><span>La salida informa disponibilidad, últimos lugares o lista de espera.</span></div>
              <div><b>Reserva online</b><span>Selección, datos y próximo paso comercial dentro del mismo recorrido.</span></div>
              <div><b>Mi Viaje</b><span>Pagos, saldo, vencimientos, documentación e itinerario centralizados.</span></div>
              <div><b>Seguimiento automático</b><span>Recordatorios de pago, documentación pendiente y cambios sin perseguir mensajes.</span></div>
            </div>
          </div>
          <CommercialPanel title={trip.title} price={trip.price} deposit={trip.deposit} status={trip.status} spots={trip.spots} departures={[...trip.departures]} />
        </div>
      </section>

      <section className="locas-trip-seasons">
        <div data-trip-reveal className="locas-trip-reveal"><h2>Mejor época para viajar</h2></div>
        <div className="locas-trip-season-grid">
          {trip.seasons.map(([period, text, seasonImage], i) => (
            <article key={period} data-trip-reveal className="locas-trip-reveal locas-trip-season-card" style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="locas-trip-season-info"><h3>{period}</h3><p>⌖ {text}</p></div>
              <div className="locas-trip-season-image" style={{ backgroundImage: `url(${seasonImage || trip.heroImage})` }}><span>Consultar</span><b>♡</b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="locas-related">
        <div data-trip-reveal className="locas-trip-reveal"><h2>Explorá más destinos increíbles</h2></div>
        <div className="locas-related-window">
          <div className="locas-related-track">
            {related.map((item, i) => (
              <Link href={`/viajes/${item.slug}`} className="locas-related-card" key={`${item.slug}-${i}`}>
                <div className="locas-related-image"><Image src={item.heroImage} alt={item.title} fill sizes="360px" /></div>
                <div className="locas-related-rating">★ 4.9</div>
                <div className="locas-related-bottom"><div><h3>{item.title}</h3><p>⌖ {item.location}</p></div><span>↗</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
