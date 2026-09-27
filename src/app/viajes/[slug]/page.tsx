import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TripEffects from "./TripEffects";
import CommercialPanel from "./CommercialPanel";

const trips = {
  ushuaia: {
    title: "Ushuaia", location: "Tierra del Fuego, Argentina", duration: "5 días / 4 noches", image: "/destinations/ushuaia.jpg",
    lead: "El fin del mundo, vivido en grupo, con paisajes australes, experiencias compartidas y una organización pensada para disfrutar sin apuro.",
    intro: "Ushuaia combina montaña, bosque, mar y esa sensación única de estar llegando al extremo sur. Locas por la aventura diseña la experiencia para que cada día tenga su propio ritmo, con momentos para descubrir, compartir y simplemente mirar alrededor.",
    itinerary: [["Día 1", "Llegada y encuentro", "Recepción en Ushuaia, traslado, check-in y primera salida grupal para empezar a conocernos."],["Día 2", "Parque Nacional", "Día completo entre bosques, bahías y senderos del Parque Nacional Tierra del Fuego."],["Día 3", "Canal Beagle", "Navegación por el canal, fauna austral y vistas abiertas de la ciudad y la cordillera."],["Día 4", "Montaña y experiencia local", "Jornada de paisaje fueguino, gastronomía y una experiencia especial preparada para el grupo."],["Día 5", "Última mañana y regreso", "Desayuno, tiempo libre, cierre del viaje y traslado de salida."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Experiencias incluidas según itinerario"],
    seasons: [["Octubre — marzo", "Días más largos y mejores condiciones para recorrer al aire libre."],["Abril — junio", "Paisajes otoñales, clima frío y una experiencia más tranquila."],["Julio — septiembre", "Temporada invernal y escenarios completamente nevados."]],
    price: "USD 1.290", deposit: "Seña para confirmar el cupo", status: "Últimos cupos", departures: ["12–16 octubre", "Consultar próxima salida"],
    notIncluded: ["Vuelos hasta Ushuaia", "Comidas no especificadas", "Gastos personales"], docs: ["DNI o pasaporte vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  trevelin: {
    title: "Trevelin en temporada de Tulipanes", location: "Chubut, Argentina", duration: "5 días / 4 noches", image: "/destinations/trevelin.jpg",
    lead: "Patagonia, tulipanes y una escapada diseñada para vivir la primavera en grupo.",
    intro: "Trevelin reúne paisajes cordilleranos, historia galesa y una de las postales más esperadas de la primavera patagónica. La propuesta combina naturaleza, tiempo compartido y recorridos pensados para disfrutar el destino con calma.",
    itinerary: [["Día 1", "Llegada a la cordillera", "Recepción, alojamiento y encuentro del grupo para presentar el viaje."],["Día 2", "Campo de tulipanes", "Visita al campo en plena temporada, tiempo para recorrerlo y disfrutar del paisaje."],["Día 3", "Trevelin y cultura galesa", "Recorrido por el pueblo, historia local, sabores patagónicos y tarde compartida."],["Día 4", "Naturaleza patagónica", "Salida por los alrededores con lagos, bosque y miradores de la cordillera."],["Día 5", "Despedida", "Desayuno, última recorrida y regreso."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Visitas y experiencias según itinerario"],
    seasons: [["Octubre", "La época protagonista del campo de tulipanes y la primavera cordillerana."],["Noviembre — diciembre", "Temperaturas agradables y días largos para recorrer la zona."],["Marzo — abril", "Colores de otoño y una Patagonia más serena."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Nueva salida", departures: ["Temporada de tulipanes", "Consultar próxima salida"],
    notIncluded: ["Vuelos o traslados hasta el punto de encuentro", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  catamarca: {
    title: "Catamarca", location: "Catamarca, Argentina", duration: "7 días / 6 noches", image: "/destinations/catamarca.jpg",
    lead: "Puna, volcanes y paisajes inmensos para una aventura que se siente fuera de escala.",
    intro: "Catamarca es territorio de contrastes: alturas, salares, dunas, caminos abiertos y pueblos que aparecen entre montañas. La experiencia se arma alrededor del paisaje y de los tiempos que necesita un viaje por el norte profundo.",
    itinerary: [["Día 1", "Llegada a Catamarca", "Recepción, alojamiento y presentación del recorrido."],["Día 2", "Ruta de paisajes", "Primer contacto con los grandes valles y caminos escénicos de la provincia."],["Día 3", "Puna catamarqueña", "Ascenso progresivo hacia paisajes de altura, volcanes y horizontes abiertos."],["Día 4", "Salares y pueblos", "Jornada entre salares, pequeñas localidades y paradas fotográficas."],["Día 5", "Antofagasta de la Sierra", "Exploración de uno de los escenarios más impactantes de la Puna."],["Día 6", "Regreso por la montaña", "Recorrido de vuelta con nuevas paradas y tarde libre."],["Día 7", "Cierre y regreso", "Desayuno, despedida y traslado de salida."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Excursiones según itinerario"],
    seasons: [["Abril — junio", "Temperaturas más amables y cielos generalmente despejados."],["Agosto — octubre", "Excelente época para rutas de altura y paisajes abiertos."],["Noviembre", "Días largos antes del período de lluvias de verano."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Disponible", departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Vuelos o transporte hasta Catamarca", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Apto físico si la salida lo requiere", "Seguro de viaje recomendado"]
  },
  "san-martin-de-los-andes": {
    title: "San Martín de los Andes", location: "Neuquén, Argentina", duration: "5 días / 4 noches", image: "/destinations/san-martin.jpg",
    lead: "Lagos, bosque andino y caminos escénicos para bajar el ritmo y mirar alrededor.",
    intro: "San Martín de los Andes combina una ciudad de montaña con lagos, senderos y rutas que atraviesan algunos de los paisajes más reconocibles de la Patagonia. El viaje propone naturaleza, comodidad y experiencias compartidas.",
    itinerary: [["Día 1", "Llegada a San Martín", "Recepción, alojamiento y paseo de bienvenida por la ciudad."],["Día 2", "Ruta de los Siete Lagos", "Día completo de lagos, miradores y paradas en ruta."],["Día 3", "Bosque y senderos", "Experiencia de naturaleza con caminata adaptada al grupo y tiempo libre."],["Día 4", "Lago Lácar", "Jornada junto al lago y actividad especial con el grupo."],["Día 5", "Última mañana y regreso", "Desayuno, paseo final y traslado de salida."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Actividades según itinerario"],
    seasons: [["Diciembre — marzo", "Verano patagónico, días largos y vida al aire libre."],["Abril — mayo", "Bosques de otoño y una atmósfera más tranquila."],["Julio — septiembre", "Nieve, invierno y actividades de montaña."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Disponible", departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Vuelos o transporte hasta Neuquén", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  "puerto-rico": {
    title: "Puerto Rico", location: "Caribe", duration: "Aventura internacional", image: "/destinations/puerto-rico.jpg",
    lead: "Caribe, naturaleza y cultura para una aventura internacional con mucha energía.",
    intro: "Puerto Rico mezcla playas, ciudades históricas, música, gastronomía y naturaleza tropical. La experiencia está pensada para viajar acompañadas y descubrir distintas caras de la isla dentro de un mismo recorrido.",
    itinerary: [["Día 1", "Llegada a San Juan", "Recepción, traslado y primera noche para empezar a vivir la isla."],["Día 2", "Viejo San Juan", "Recorrido histórico, plazas, fortalezas y sabores locales."],["Día 3", "Naturaleza tropical", "Excursión de día completo entre selva, cascadas y paisaje tropical."],["Día 4", "Costa y playa", "Día de mar con tiempo para descansar y disfrutar en grupo."],["Día 5", "Experiencia local", "Gastronomía, música y recorrido por una zona diferente de la isla."],["Día 6", "Día libre acompañado", "Tiempo para elegir actividades, compras o playa con asistencia del equipo."],["Día 7", "Última experiencia", "Salida especial de cierre y cena grupal."],["Día 8", "Regreso", "Desayuno, despedida y traslado al aeropuerto."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Experiencias según itinerario"],
    seasons: [["Diciembre — abril", "Temporada seca y clima especialmente agradable."],["Mayo — junio", "Menos movimiento y temperaturas cálidas."],["Noviembre", "Buen momento para viajar antes de la temporada alta."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Disponible", departures: ["Próxima salida internacional", "Consultar nueva fecha"],
    notIncluded: ["Vuelos internacionales salvo indicación expresa", "Comidas no especificadas", "Gastos personales"], docs: ["Pasaporte vigente", "Documentación migratoria correspondiente", "Seguro de viaje recomendado"]
  }
} as const;

type TripKey = keyof typeof trips;
const tripEntries = Object.entries(trips) as [TripKey, (typeof trips)[TripKey]][];

export function generateStaticParams() { return tripEntries.map(([slug]) => ({ slug })); }

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = trips[slug as TripKey];
  if (!trip) notFound();
  const related = [...tripEntries, ...tripEntries];

  return (
    <main className="locas-trip-page">
      <TripEffects />
      <section className="locas-trip-hero" style={{ backgroundImage: `url(${trip.image})` }}>
        <div className="locas-trip-overlay" />
        <header className="locas-trip-nav">
          <Link href="/" className="locas-trip-brand">Locas por la aventura</Link>
          <nav><Link href="/">Inicio</Link><Link href="/#destinos">Destinos</Link><Link href="/viajes">Paquetes</Link><Link href="/#Contact">Contacto</Link></nav>
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
          <div><span className="locas-trip-fact-icon">⌖</span><span>{trip.location}</span></div>
          <div><span className="locas-trip-fact-icon">◷</span><span>Próxima salida</span></div>
          <div><span className="locas-trip-fact-icon">◷</span><span>{trip.duration}</span></div>
        </div>
        <article className="locas-trip-editorial">
          <div data-trip-reveal className="locas-trip-reveal locas-trip-copy-block">
            <h2>{trip.lead}</h2>
            <p>{trip.intro}</p>
          </div>
          <section data-trip-reveal className="locas-trip-reveal trip-itinerary">
            <div className="trip-itinerary-head"><h2>Así se vive el viaje</h2><p>Una planificación provisoria para mostrarte el ritmo de la experiencia. Los horarios y actividades finales se confirman antes de la salida.</p></div>
            <div className="trip-itinerary-list">
              {trip.itinerary.map(([day, title, text]) => (
                <article key={day} className="trip-itinerary-day">
                  <span>{day}</span><div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
          </section>
          <figure data-trip-reveal className="locas-trip-reveal locas-trip-wide-image"><Image src={trip.image} alt={trip.title} fill sizes="(max-width: 900px) 94vw, 72vw" /></figure>
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
            {['¿Puedo viajar sola?','¿Cómo se confirma mi lugar?','¿Puedo pagar en cuotas?','¿Qué pasa si se completa el cupo?','¿Dónde veo mi documentación y saldo?'].map((q) => <details key={q}><summary>{q}<b>+</b></summary><p>Escribinos desde el botón de reserva y te respondemos con la información específica de esta salida.</p></details>)}
          </div>
          <figure data-trip-reveal className="locas-trip-reveal locas-trip-wide-image locas-trip-wide-image-second"><Image src={trip.image} alt={`${trip.title} - viaje`} fill sizes="(max-width: 900px) 94vw, 72vw" /></figure>
        </article>
      </section>

      <section className="trip-commerce-shell">
        <div className="trip-commerce-layout">
          <div className="trip-commerce-intro">
            <h2>Reservá tu lugar.</h2>
            <p>Ya viste cómo es la experiencia. Ahora elegí la salida, la habitación y la forma de pago. Si necesitás ayuda, la consulta se abre con todos los datos de este viaje cargados.</p>
            <div className="trip-commerce-trust">
              <div><b>Salida acompañada</b><span>Coordinación antes y durante el viaje.</span></div>
              <div><b>Información centralizada</b><span>Fechas, documentación y pagos en un solo lugar.</span></div>
              <div><b>Asistencia directa</b><span>Podés consultar antes de confirmar tu lugar.</span></div>
            </div>
          </div>
          <CommercialPanel title={trip.title} price={trip.price} deposit={trip.deposit} status={trip.status} departures={[...trip.departures]} />
        </div>
      </section>

      <section className="locas-trip-seasons">
        <div data-trip-reveal className="locas-trip-reveal"><h2>Mejor época para viajar</h2></div>
        <div className="locas-trip-season-grid">
          {trip.seasons.map(([period, text], i) => (
            <article key={period} data-trip-reveal className="locas-trip-reveal locas-trip-season-card" style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="locas-trip-season-info"><h3>{period}</h3><p>⌖ {text}</p></div>
              <div className="locas-trip-season-image" style={{ backgroundImage: `url(${trip.image})` }}><span>Consultar</span><b>♡</b></div>
            </article>
          ))}
        </div>
      </section>

      <section className="locas-related">
        <div data-trip-reveal className="locas-trip-reveal"><h2>Explorá más destinos increíbles</h2></div>
        <div className="locas-related-window">
          <div className="locas-related-track">
            {related.map(([key, item], i) => (
              <Link href={`/viajes/${key}`} className="locas-related-card" key={`${key}-${i}`}>
                <div className="locas-related-image"><Image src={item.image} alt={item.title} fill sizes="360px" /></div>
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
