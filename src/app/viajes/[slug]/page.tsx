import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TripEffects from "./TripEffects";
import CommercialPanel from "./CommercialPanel";
import LeadCapture from "./LeadCapture";
import TripAssistant from "./TripAssistant";

const trips = {
  ushuaia: {
    title: "Ushuaia", location: "Tierra del Fuego, Argentina", duration: "5 días / 4 noches", image: "/destinations/ushuaia.jpg",
    lead: "El fin del mundo, vivido en grupo, con paisajes australes, experiencias compartidas y una organización pensada para disfrutar sin apuro.",
    intro: "Ushuaia combina montaña, bosque, mar y esa sensación única de estar llegando al extremo sur. Locas por la aventura diseña la experiencia para que cada día tenga su propio ritmo, con momentos para descubrir, compartir y simplemente mirar alrededor.",
    itinerary: [["Día 1", "Llegada y encuentro", "Recepción en Ushuaia, traslado, check-in y primera salida grupal para empezar a conocernos."],["Día 2", "Parque Nacional", "Día completo entre bosques, bahías y senderos del Parque Nacional Tierra del Fuego."],["Día 3", "Canal Beagle", "Navegación por el canal, fauna austral y vistas abiertas de la ciudad y la cordillera."],["Día 4", "Montaña y experiencia local", "Jornada de paisaje fueguino, gastronomía y una experiencia especial preparada para el grupo."],["Día 5", "Última mañana y regreso", "Desayuno, tiempo libre, cierre del viaje y traslado de salida."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Experiencias incluidas según itinerario"],
    seasons: [["Octubre — marzo", "Días más largos y mejores condiciones para recorrer al aire libre."],["Abril — junio", "Paisajes otoñales, clima frío y una experiencia más tranquila."],["Julio — septiembre", "Temporada invernal y escenarios completamente nevados."]],
    price: "$3.690.000", deposit: "Seña para confirmar el cupo", status: "Últimos cupos", spots: 6, departures: ["12–16 octubre", "Consultar próxima salida"],
    notIncluded: ["Vuelos hasta Ushuaia", "Comidas no especificadas", "Gastos personales"], docs: ["DNI o pasaporte vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  trevelin: {
    title: "Trevelin en temporada de Tulipanes", location: "Chubut, Argentina", duration: "5 días / 4 noches", image: "/destinations/trevelin.jpg",
    lead: "Patagonia, tulipanes y una escapada diseñada para vivir la primavera en grupo.",
    intro: "Trevelin reúne paisajes cordilleranos, historia galesa y una de las postales más esperadas de la primavera patagónica. La propuesta combina naturaleza, tiempo compartido y recorridos pensados para disfrutar el destino con calma.",
    itinerary: [["Día 1", "Llegada a la cordillera", "Recepción, alojamiento y encuentro del grupo para presentar el viaje."],["Día 2", "Campo de tulipanes", "Visita al campo en plena temporada, tiempo para recorrerlo y disfrutar del paisaje."],["Día 3", "Trevelin y cultura galesa", "Recorrido por el pueblo, historia local, sabores patagónicos y tarde compartida."],["Día 4", "Naturaleza patagónica", "Salida por los alrededores con lagos, bosque y miradores de la cordillera."],["Día 5", "Despedida", "Desayuno, última recorrida y regreso."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Visitas y experiencias según itinerario"],
    seasons: [["Octubre", "La época protagonista del campo de tulipanes y la primavera cordillerana."],["Noviembre — diciembre", "Temperaturas agradables y días largos para recorrer la zona."],["Marzo — abril", "Colores de otoño y una Patagonia más serena."]],
    price: "$3.390.000", deposit: "Seña para confirmar el cupo", status: "Nueva salida", spots: 9, departures: ["Temporada de tulipanes", "Consultar próxima salida"],
    notIncluded: ["Vuelos o traslados hasta el punto de encuentro", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  catamarca: {
    title: "Catamarca", location: "Catamarca, Argentina", duration: "7 días / 6 noches", image: "/destinations/catamarca.jpg",
    lead: "Puna, volcanes y paisajes inmensos para una aventura que se siente fuera de escala.",
    intro: "Catamarca es territorio de contrastes: alturas, salares, dunas, caminos abiertos y pueblos que aparecen entre montañas. La experiencia se arma alrededor del paisaje y de los tiempos que necesita un viaje por el norte profundo.",
    itinerary: [["Día 1", "Llegada a Catamarca", "Recepción, alojamiento y presentación del recorrido."],["Día 2", "Ruta de paisajes", "Primer contacto con los grandes valles y caminos escénicos de la provincia."],["Día 3", "Puna catamarqueña", "Ascenso progresivo hacia paisajes de altura, volcanes y horizontes abiertos."],["Día 4", "Salares y pueblos", "Jornada entre salares, pequeñas localidades y paradas fotográficas."],["Día 5", "Antofagasta de la Sierra", "Exploración de uno de los escenarios más impactantes de la Puna."],["Día 6", "Regreso por la montaña", "Recorrido de vuelta con nuevas paradas y tarde libre."],["Día 7", "Cierre y regreso", "Desayuno, despedida y traslado de salida."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Excursiones según itinerario"],
    seasons: [["Abril — junio", "Temperaturas más amables y cielos generalmente despejados."],["Agosto — octubre", "Excelente época para rutas de altura y paisajes abiertos."],["Noviembre", "Días largos antes del período de lluvias de verano."]],
    price: "$3.840.000", deposit: "Seña para confirmar el cupo", status: "Disponible", spots: 12, departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Vuelos o transporte hasta Catamarca", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Apto físico si la salida lo requiere", "Seguro de viaje recomendado"]
  },
  "san-martin-de-los-andes": {
    title: "San Martín de los Andes", location: "Neuquén, Argentina", duration: "5 días / 4 noches", image: "/destinations/san-martin.jpg",
    lead: "Lagos, bosque andino y caminos escénicos para bajar el ritmo y mirar alrededor.",
    intro: "San Martín de los Andes combina una ciudad de montaña con lagos, senderos y rutas que atraviesan algunos de los paisajes más reconocibles de la Patagonia. El viaje propone naturaleza, comodidad y experiencias compartidas.",
    itinerary: [["Día 1", "Llegada a San Martín", "Recepción, alojamiento y paseo de bienvenida por la ciudad."],["Día 2", "Ruta de los Siete Lagos", "Día completo de lagos, miradores y paradas en ruta."],["Día 3", "Bosque y senderos", "Experiencia de naturaleza con caminata adaptada al grupo y tiempo libre."],["Día 4", "Lago Lácar", "Jornada junto al lago y actividad especial con el grupo."],["Día 5", "Última mañana y regreso", "Desayuno, paseo final y traslado de salida."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Actividades según itinerario"],
    seasons: [["Diciembre — marzo", "Verano patagónico, días largos y vida al aire libre."],["Abril — mayo", "Bosques de otoño y una atmósfera más tranquila."],["Julio — septiembre", "Nieve, invierno y actividades de montaña."]],
    price: "$2.490.000", deposit: "Seña para confirmar el cupo", status: "Disponible", spots: 8, departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Vuelos o transporte hasta Neuquén", "Comidas no especificadas", "Gastos personales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  "el-calafate-el-chalten": {
    title: "El Calafate & El Chaltén", location: "Santa Cruz, Argentina", duration: "5 días / 4 noches", image: "/packages/el-calafate.jpg",
    lead: "Glaciares, montaña y Patagonia profunda en una salida corta, intensa y pensada para compartir cada paisaje.",
    intro: "El Calafate y El Chaltén combinan hielo, estepa y senderos frente a algunas de las postales más impactantes de la Patagonia. La experiencia une navegación, Perito Moreno, Fitz Roy y momentos de grupo.",
    itinerary: [["Día 1", "Llegada a El Calafate", "Recepción, alojamiento y encuentro del grupo."],["Día 2", "Glaciar Perito Moreno", "Pasarelas, miradores y tiempo para vivir el glaciar sin apuro."],["Día 3", "Navegación de glaciares", "Jornada por el Lago Argentino para conocer los grandes hielos desde el agua."],["Día 4", "El Chaltén", "Ruta escénica, caminata hacia Laguna Capri y vistas al Fitz Roy."],["Día 5", "Última mañana y regreso", "Desayuno, cierre grupal y traslado de salida."]],
    included: ["Aéreos ida y vuelta", "Hotelería 4 estrellas", "Traslados", "Excursiones mencionadas", "Coordinación permanente"],
    seasons: [["Marzo", "Colores patagónicos y buena temporada para caminar."],["Octubre", "Primavera austral y regreso de los días más largos."],["Noviembre — diciembre", "Más horas de luz para aprovechar las jornadas."]],
    price: "$3.190.000", deposit: "Seña para confirmar el cupo", status: "Disponible", spots: 10, departures: ["Próxima salida", "Consultar nueva fecha"],
    notIncluded: ["Comidas no especificadas", "Gastos personales", "Actividades opcionales"], docs: ["DNI vigente", "Datos de contacto de emergencia", "Seguro de viaje recomendado"]
  },
  "norte-argentino": {
    title: "Norte Argentino", location: "Salta & Jujuy, Argentina", duration: "7 días / 6 noches", image: "/packages/norte.jpg",
    lead: "Cerros, quebradas, pueblos y sabores para conocer un norte argentino que cambia de paisaje a cada curva.",
    intro: "El Norte Argentino mezcla historia, cultura andina, gastronomía y una geografía que parece cambiar todo el tiempo. Es un viaje de ruta, conversaciones, mercados, pueblos y colores.",
    itinerary: [["Día 1", "Llegada a Salta", "Recepción y primera recorrida por la ciudad."],["Día 2", "Quebrada de Humahuaca", "Ruta de pueblos, cerros y mercados del norte jujeño."],["Día 3", "Purmamarca", "Cerro de los Siete Colores, paseo y sabores locales."],["Día 4", "Salinas y altura", "Jornada de paisajes abiertos y caminos de montaña."],["Día 5", "Cafayate", "Quebrada de las Conchas, viñedos y gastronomía."],["Día 6", "Día de grupo", "Experiencia local, compras y cena compartida."],["Día 7", "Regreso", "Desayuno, despedida y traslado."]],
    included: ["Alojamiento", "Traslados", "Excursiones mencionadas", "Coordinación permanente"],
    seasons: [["Abril — junio", "Clima seco y temperaturas agradables."],["Agosto — noviembre", "Días despejados y grandes contrastes de paisaje."],["Marzo", "Fin del verano y rutas con menos movimiento."]],
    price: "$2.960.000", deposit: "Seña para confirmar el cupo", status: "Disponible", spots: 11, departures: ["04 al 10 de noviembre", "Consultar nueva fecha"],
    notIncluded: ["Comidas no especificadas", "Gastos personales", "Actividades opcionales"], docs: ["DNI vigente", "Seguro de viaje recomendado", "Apto físico si alguna excursión lo requiere"]
  },
  "new-york": {
    title: "New York", location: "Nueva York, Estados Unidos", duration: "9 días / 8 noches", image: "/packages/new-york.jpeg",
    lead: "La Gran Manzana caminada, vivida y compartida en grupo, con clásicos y rincones que hacen que cada día sea distinto.",
    intro: "Nueva York se camina. La experiencia está pensada para conocer los puntos esenciales, recorrer barrios, tener tiempo propio y volver a encontrarse con el grupo para seguir descubriendo la ciudad juntas.",
    itinerary: [["Día 1", "Llegada a Manhattan", "Traslado, check-in y primera caminata grupal."],["Día 2", "Midtown", "Times Square, Bryant Park, Grand Central y Rockefeller Center."],["Día 3", "Downtown", "Wall Street, memorial, Battery Park y ferry."],["Día 4", "Brooklyn", "Puente, DUMBO y barrios con tiempo para fotos y paseo."],["Día 5", "Central Park y museos", "Jornada flexible según intereses del grupo."],["Día 6", "Barrios de Nueva York", "SoHo, Village, Chelsea y High Line."],["Día 7", "Día libre acompañado", "Compras, experiencias opcionales o recorridos especiales."],["Día 8", "Último día completo", "Experiencia final y cena grupal."],["Día 9", "Regreso", "Desayuno y traslado al aeropuerto."]],
    included: ["Alojamiento", "Traslados previstos", "Recorridos mencionados", "Coordinación permanente"],
    seasons: [["Mayo — junio", "Primavera y días largos para caminar."],["Septiembre — octubre", "Temperaturas agradables y otoño temprano."],["Diciembre", "Ciudad iluminada y temporada festiva."]],
    price: "USD 4.950", deposit: "Seña para confirmar el cupo", status: "Disponible", spots: 7, departures: ["11 al 20 de mayo", "Consultar nueva fecha"],
    notIncluded: ["Comidas no especificadas", "Gastos personales", "Entradas opcionales"], docs: ["Pasaporte vigente", "Visa o autorización migratoria correspondiente", "Seguro de viaje"]
  },
  "puerto-rico": {
    title: "Puerto Rico", location: "Caribe", duration: "Aventura internacional", image: "/destinations/puerto-rico.jpg",
    lead: "Caribe, naturaleza y cultura para una aventura internacional con mucha energía.",
    intro: "Puerto Rico mezcla playas, ciudades históricas, música, gastronomía y naturaleza tropical. La experiencia está pensada para viajar acompañadas y descubrir distintas caras de la isla dentro de un mismo recorrido.",
    itinerary: [["Día 1", "Llegada a San Juan", "Recepción, traslado y primera noche para empezar a vivir la isla."],["Día 2", "Viejo San Juan", "Recorrido histórico, plazas, fortalezas y sabores locales."],["Día 3", "Naturaleza tropical", "Excursión de día completo entre selva, cascadas y paisaje tropical."],["Día 4", "Costa y playa", "Día de mar con tiempo para descansar y disfrutar en grupo."],["Día 5", "Experiencia local", "Gastronomía, música y recorrido por una zona diferente de la isla."],["Día 6", "Día libre acompañado", "Tiempo para elegir actividades, compras o playa con asistencia del equipo."],["Día 7", "Última experiencia", "Salida especial de cierre y cena grupal."],["Día 8", "Regreso", "Desayuno, despedida y traslado al aeropuerto."]],
    included: ["Alojamiento seleccionado", "Traslados previstos", "Coordinación durante el viaje", "Experiencias según itinerario"],
    seasons: [["Diciembre — abril", "Temporada seca y clima especialmente agradable."],["Mayo — junio", "Menos movimiento y temperaturas cálidas."],["Noviembre", "Buen momento para viajar antes de la temporada alta."]],
    price: "Consultar", deposit: "Consultá valor y forma de reserva", status: "Disponible", spots: 10, departures: ["Próxima salida internacional", "Consultar nueva fecha"],
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
  const visualImages = slug === "ushuaia" ? [
    "/destinations/ushuaia/arrival-group.jpg",
    "/destinations/ushuaia/park.jpg",
    "/destinations/ushuaia.jpg",
    "/destinations/ushuaia/laguna-esmeralda.jpg",
    "/destinations/ushuaia/community.webp"
  ] : slug === "trevelin" ? [
    "/destinations/trevelin/dia-1.jpg",
    "/destinations/trevelin/dia-2.jpg",
    "/destinations/trevelin/dia-3.jpg",
    "/destinations/trevelin/dia-4.jpg",
    "/destinations/trevelin/dia-5.jpg"
  ] : trip.itinerary.map(() => trip.image);
  const blogCardImage = slug === "ushuaia" ? "/destinations/ushuaia/community.webp" : slug === "trevelin" ? "/destinations/trevelin/dia-2.jpg" : trip.image;
  const editorialImage = slug === "ushuaia" ? "/destinations/ushuaia/park.jpg" : slug === "trevelin" ? "/destinations/trevelin/dia-4.jpg" : trip.image;
  const communityImage = slug === "ushuaia" ? "/destinations/ushuaia/community.webp" : slug === "trevelin" ? "/destinations/trevelin/dia-1.jpg" : trip.image;
  const closingImage = slug === "ushuaia" ? "/destinations/ushuaia/laguna-esmeralda.jpg" : slug === "trevelin" ? "/destinations/trevelin/dia-3.jpg" : trip.image;

  return (
    <main className="locas-trip-page">
      <TripEffects />
      <section className="locas-trip-hero" style={{ backgroundImage: `url(${trip.image})` }}>
        <div className="locas-trip-overlay" />
        <header className="locas-trip-nav">
          <Link href="/" className="locas-trip-brand">Locas por la aventura</Link>
          <nav><Link href="/">Inicio</Link><Link href="/viajes">Viajes</Link><Link href={`/blog/${slug}`}>Revista</Link><Link href="/mi-locas">Mi Locas</Link><Link href="/mi-viaje">Mi Viaje</Link></nav>
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
          <div><span className="locas-trip-fact-icon">◷</span><span><b>Próxima salida</b><small>{trip.departures[0]}</small></span></div>
          <div><span className="locas-trip-fact-icon">◎</span><span><b>{trip.spots} lugares disponibles</b><small>{trip.duration}</small></span></div>
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
                  <figure><Image src={visualImages[index % visualImages.length]} alt={`${trip.title} · ${day}`} fill sizes="(max-width: 700px) 92vw, 300px" style={{objectPosition: `${50 + (index % 3) * 10}% center`}} /></figure>
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
            {[
              ['¿Cómo se vive el grupo?','Cada salida se arma como una experiencia compartida entre mujeres. Hay momentos de encuentro, actividades en grupo, coordinación y espacios para que la comunidad se forme naturalmente durante el viaje.'],
              ['¿Qué edades tiene el grupo?','Los grupos pueden ser diversos en edad. Lo importante es la afinidad, las ganas de compartir y la dinámica de la experiencia, no formar grupos idénticos entre sí.'],
              ['¿Cómo se confirma mi lugar?',`Elegís la salida y habitación, cargás tus datos y avanzás con la ${trip.deposit.toLowerCase()}. La reserva queda registrada y podés continuar el proceso desde Mi Viaje.`],
              ['¿Puedo pagar en cuotas?', trip.price === 'Consultar' ? 'Cuando el precio esté cargado, el sistema mostrará las opciones habilitadas para esa salida: seña, pago total, pagos parciales o cuotas según proveedor y política comercial.' : 'Sí, cuando la salida lo habilita podés elegir seña, pago total o pagos parciales/cuotas. La opción disponible se muestra antes de confirmar.'],
              ['¿Qué pasa si se completa el cupo?','Podés entrar en lista de espera. Tu interés queda registrado y el sistema puede avisarte automáticamente si se libera un lugar o aparece una nueva salida compatible.'],
              ['¿Dónde veo mi documentación y saldo?','Después de reservar, Mi Viaje concentra estado de reserva, señas y pagos, saldo, vencimientos, documentación pendiente, itinerario, archivos y novedades.']
            ].map(([q,a]) => <details key={q}><summary>{q}<b>+</b></summary><p>{a}</p></details>)}
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
          <LeadCapture title={trip.title} departures={[...trip.departures]} alternatives={tripEntries.filter(([key]) => key !== slug).map(([,item]) => item.title)} />
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
