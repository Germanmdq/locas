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
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Experiencias incluidas según itinerario"],
    seasons: [["Octubre — marzo", "Días más largos y mejores condiciones para recorrer al aire libre."],["Abril — junio", "Paisajes otoñales, clima frío y una experiencia más tranquila."],["Julio — septiembre", "Temporada invernal y escenarios completamente nevados."]],
    price: "USD 1.290", deposit: "Seña para confirmar el cupo", status: "Últimos cupos", departures: ["12–16 octubre", "Consultar próxima salida"],
    notIncluded: ["Vuelos hasta Ushuaia", "Comidas no especificadas", "Gastos personales"], docs: ["DNI o pasaporte vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  trevelin: {
    title: "Trevelin en temporada de Tulipanes", location: "Chubut, Argentina", duration: "5 días / 4 noches", image: "/destinations/trevelin.jpg",
    lead: "Patagonia, tulipanes y una escapada diseñada para vivir la primavera en grupo.",
    intro: "Trevelin reúne paisajes cordilleranos, historia galesa y una de las postales más esperadas de la primavera patagónica. La propuesta combina naturaleza, tiempo compartido y recorridos pensados para disfrutar el destino con calma.",
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Visitas y experiencias según itinerario"],
    seasons: [["Octubre", "La época protagonista del campo de tulipanes y la primavera cordillerana."],["Noviembre — diciembre", "Temperaturas agradables y días largos para recorrer la zona."],["Marzo — abril", "Colores de otoño y una Patagonia más serena."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Nueva salida", departures: ["Temporada de tulipanes", "Consultar próxima salida"],
    notIncluded: ["Vuelos o traslados hasta el punto de encuentro", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  catamarca: {
    title: "Catamarca", location: "Catamarca, Argentina", duration: "7 días / 6 noches", image: "/destinations/catamarca.jpg",
    lead: "Puna, volcanes y paisajes inmensos para una aventura que se siente fuera de escala.",
    intro: "Catamarca es territorio de contrastes: alturas, salares, dunas, caminos abiertos y pueblos que aparecen entre montañas. La experiencia se arma alrededor del paisaje y de los tiempos que necesita un viaje por el norte profundo.",
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Excursiones según itinerario"],
    seasons: [["Abril — junio", "Temperaturas más amables y cielos generalmente despejados."],["Agosto — octubre", "Excelente época para rutas de altura y paisajes abiertos."],["Noviembre", "Días largos antes del período de lluvias de verano."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Disponible", departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Vuelos o transporte hasta Catamarca", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Apto físico si la salida lo requiere", "Seguro de viaje recomendado"]
  },
  "san-martin-de-los-andes": {
    title: "San Martín de los Andes", location: "Neuquén, Argentina", duration: "5 días / 4 noches", image: "/destinations/san-martin.jpg",
    lead: "Lagos, bosque andino y caminos escénicos para bajar el ritmo y mirar alrededor.",
    intro: "San Martín de los Andes combina una ciudad de montaña con lagos, senderos y rutas que atraviesan algunos de los paisajes más reconocibles de la Patagonia. El viaje propone naturaleza, comodidad y experiencias compartidas.",
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Actividades según itinerario"],
    seasons: [["Diciembre — marzo", "Verano patagónico, días largos y vida al aire libre."],["Abril — mayo", "Bosques de otoño y una atmósfera más tranquila."],["Julio — septiembre", "Nieve, invierno y actividades de montaña."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Disponible", departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Vuelos o transporte hasta Neuquén", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  "puerto-rico": {
    title: "Puerto Rico", location: "Caribe", duration: "Aventura internacional", image: "/destinations/puerto-rico.jpg",
    lead: "Caribe, naturaleza y cultura para una aventura internacional con mucha energía.",
    intro: "Puerto Rico mezcla playas, ciudades históricas, música, gastronomía y naturaleza tropical. La experiencia está pensada para viajar acompañadas y descubrir distintas caras de la isla dentro de un mismo recorrido.",
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

      <section className="trip-commerce-shell">
        <div className="trip-commerce-layout">
          <div className="trip-commerce-intro">
            <span className="trip-commerce-kicker">RESERVA TU VIAJE</span>
            <h2>Todo lo que necesitás para decidir y reservar, en un solo lugar.</h2>
            <p>Elegí salida, habitación y forma de pago. Si necesitás ayuda, la consulta sale con todos los datos del viaje ya cargados.</p>
          </div>
          <CommercialPanel title={trip.title} price={trip.price} deposit={trip.deposit} status={trip.status} departures={[...trip.departures]} />
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
            <span className="trip-commerce-kicker">PREGUNTAS FRECUENTES</span>
            {['¿Puedo viajar sola?','¿Cómo se confirma mi lugar?','¿Puedo pagar en cuotas?','¿Qué pasa si se completa el cupo?','¿Dónde veo mi documentación y saldo?'].map((q) => <details key={q}><summary>{q}<b>+</b></summary><p>Escribinos desde el botón de reserva y te respondemos con la información específica de esta salida.</p></details>)}
          </div>
          <figure data-trip-reveal className="locas-trip-reveal locas-trip-wide-image locas-trip-wide-image-second"><Image src={trip.image} alt={`${trip.title} - viaje`} fill sizes="(max-width: 900px) 94vw, 72vw" /></figure>
        </article>
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
