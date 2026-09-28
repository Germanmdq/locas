import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  ushuaia: {
    title:"Ushuaia",
    image:"/destinations/ushuaia/laguna-esmeralda.jpg",
    dayImages:["/destinations/ushuaia/arrival-group.jpg","/destinations/ushuaia/park.jpg","/destinations/ushuaia.jpg","/destinations/ushuaia/community.webp"],
    intro:"Ushuaia no es solamente una postal del fin del mundo. Es una ciudad entre el Canal Beagle y la cordillera, con historia fueguina, bosques, glaciares, mar y una identidad que se siente desde que aterrizás.",
    days:["Llegar y empezar a mirar el fin del mundo","Parque Nacional y Tren del Fin del Mundo","Navegar el Canal Beagle","Montaña, 4x4 y cierre compartido"]
  },
  trevelin: { title:"Trevelin", image:"/destinations/trevelin/dia-2.jpg", dayImages:["/destinations/trevelin/dia-1.jpg","/destinations/trevelin/dia-2.jpg","/destinations/trevelin/dia-3.jpg","/destinations/trevelin/dia-4.jpg","/destinations/trevelin/dia-5.jpg"], intro:"Primavera patagónica, tulipanes, historia galesa y esos días en que la conversación del grupo termina siendo tan importante como el paisaje.", days:["La llegada a la cordillera","El campo de tulipanes","Sabores e historia galesa","Lagos, bosque y despedida"] },
  catamarca: { title:"Catamarca", image:"/destinations/catamarca.jpg", dayImages:["/destinations/catamarca.jpg","/destinations/catamarca.jpg","/destinations/catamarca.jpg","/destinations/catamarca.jpg"], intro:"Catamarca se vive a escala enorme: caminos abiertos, puna, salares y pueblos pequeños. Es un viaje que pide tiempo, curiosidad y muchas conversaciones en ruta.", days:["Primer encuentro con los valles","La ruta hacia la puna","Salares y horizontes infinitos","Historias de camino y regreso"] },
  "san-martin-de-los-andes": { title:"San Martín de los Andes", image:"/destinations/san-martin.jpg", dayImages:["/destinations/san-martin.jpg","/destinations/san-martin.jpg","/destinations/san-martin.jpg","/destinations/san-martin.jpg"], intro:"Bosque, lagos y caminos que invitan a bajar el ritmo. Un destino ideal para compartir sobremesas, miradores y días enteros en movimiento con el grupo.", days:["Llegar a la ciudad de montaña","Ruta de los Siete Lagos","Senderos y bosque","Lácar, charla y cierre"] },
  "puerto-rico": { title:"Puerto Rico", image:"/destinations/puerto-rico.jpg", dayImages:["/destinations/puerto-rico.jpg","/destinations/puerto-rico.jpg","/destinations/puerto-rico.jpg","/destinations/puerto-rico.jpg"], intro:"Caribe, música, playas, historia y una energía que cambia mucho cuando se vive en grupo. Puerto Rico combina descubrimiento y momentos compartidos todo el día.", days:["Primeras horas en San Juan","Historia y color en el Viejo San Juan","Naturaleza tropical","Mar, música y despedida"] },
  "el-calafate-el-chalten": { title:"El Calafate & El Chaltén", image:"/packages/el-calafate.jpg", dayImages:["/packages/el-calafate.jpg","/packages/el-calafate.jpg","/packages/el-calafate.jpg","/packages/el-calafate.jpg"], intro:"Glaciares, estepa, Fitz Roy y caminos patagónicos en un viaje que mezcla grandes paisajes con la intimidad de vivirlos en grupo.", days:["Primer día en El Calafate","Perito Moreno","Navegar los glaciares","El Chaltén y Fitz Roy"] },
  "norte-argentino": { title:"Norte Argentino", image:"/packages/norte.jpg", dayImages:["/packages/norte.jpg","/packages/norte.jpg","/packages/norte.jpg","/packages/norte.jpg"], intro:"Quebradas, cerros, mercados, pueblos y sabores. El norte cambia de color a cada curva y obliga a mirar más lento.", days:["Llegar a Salta","Quebrada de Humahuaca","Purmamarca y altura","Cafayate y regreso"] },
  "new-york": { title:"New York", image:"/packages/new-york.jpeg", dayImages:["/packages/new-york.jpeg","/packages/new-york.jpeg","/packages/new-york.jpeg","/packages/new-york.jpeg"], intro:"Nueva York se camina, se escucha y se comparte. Una ciudad que puede ser abrumadora sola y completamente distinta cuando se vive con un grupo que quiere descubrirla.", days:["Llegar a Manhattan","Downtown y skyline","Brooklyn y barrios","Central Park y despedida"] }
} as const;

type Slug = keyof typeof articles;
export function generateStaticParams(){ return Object.keys(articles).map(slug=>({slug})); }

export default async function BlogArticle({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const article=articles[slug as Slug];
  if(!article) notFound();
  const isUshuaia=slug==='ushuaia';

  return <main className="locas-blog-page">
    <header className="locas-blog-nav">
      <Link href="/">Locas por la aventura</Link>
      <nav><Link href="/viajes">Viajes</Link><Link href="/mi-locas">Mi Locas</Link><Link href={`/viajes/${slug}`}>← Volver al viaje</Link></nav>
    </header>

    <section className="locas-blog-hero">
      <div className="locas-blog-kicker">REVISTA LOCAS · DESTINOS</div>
      <h1>{isUshuaia ? 'Ushuaia: historia, clima y qué hacer en el fin del mundo' : `Qué nos enamora de ${article.title}`}</h1>
      <p>{article.intro}</p>
      <figure><Image src={article.image} alt={article.title} fill priority sizes="100vw" /></figure>
    </section>

    <article className="locas-blog-article">
      {isUshuaia ? <>
        <section className="locas-blog-facts">
          <div><span>UBICACIÓN</span><b>Tierra del Fuego</b><p>En la costa norte del Canal Beagle, rodeada por el mar y la cordillera.</p></div>
          <div><span>POBLACIÓN</span><b>82.200</b><p>Habitantes registrados en el departamento Ushuaia en el Censo 2022.</p></div>
          <div><span>CLIMA</span><b>9,6 °C</b><p>Temperatura media de enero; hacia fines de julio y comienzos de agosto la media ronda 1 °C.</p></div>
          <div><span>IDENTIDAD</span><b>Fin del mundo</b><p>Capital de Tierra del Fuego y principal puerta marítima hacia la Antártida.</p></div>
        </section>

        <section>
          <h2>Una ciudad que nació entre pueblos originarios, navegantes y mar.</h2>
          <p>Mucho antes de que existiera la ciudad, Tierra del Fuego estaba habitada por pueblos originarios como los Selknam, Haush, Alakalufes y Yámanas. Los Yámanas recorrían en canoas las aguas del Canal Beagle y las islas del sur. El nombre Tierra del Fuego se asocia a las columnas de humo que los navegantes europeos veían desde el mar.</p>
          <p>El 12 de octubre de 1884 se creó en Ushuaia la Subprefectura del Estado argentino. Después llegaron la expansión institucional, la colonia penal y una infraestructura que fue transformando un asentamiento remoto en la ciudad que conocemos hoy. Esa historia todavía se puede recorrer en el Museo del Fin del Mundo, la Antigua Casa de Gobierno y el Museo Marítimo y ex Presidio.</p>
        </section>

        <section className="locas-blog-story-image">
          <figure><Image src="/destinations/ushuaia/arrival-group.jpg" alt="Ushuaia y el Canal Beagle" fill sizes="(max-width:800px) 94vw, 900px" /></figure>
          <div><span>EL LUGAR</span><h2>Mar adelante. Montaña atrás.</h2><p>La particularidad de Ushuaia es que la naturaleza nunca queda lejos. Desde distintos puntos de la ciudad aparecen el Canal Beagle, las montañas, los bosques y los valles glaciarios. Es ciudad, puerto y paisaje al mismo tiempo.</p></div>
        </section>

        <section>
          <h2>El clima cambia rápido. Y eso también es Ushuaia.</h2>
          <p>El clima fueguino puede cambiar varias veces en un mismo día. En verano, enero tiene una media cercana a 9,6 °C y casi 18 horas de luz. En invierno los días se reducen a unas 7 u 8 horas y las temperaturas más bajas suelen aparecer hacia fines de julio y comienzos de agosto. Primavera es especialmente ventosa e inestable.</p>
          <p>La regla práctica es vestirse en capas: abrigo, impermeable, polar o sweater y calzado cómodo o de trekking. No importa si el pronóstico parece amable por la mañana: en Ushuaia conviene salir preparada para varias estaciones en pocas horas.</p>
        </section>

        <section className="locas-blog-do">
          <h2>Qué hacer en Ushuaia</h2>
          <div>
            <article><b>Navegar el Canal Beagle</b><p>Una de las experiencias clásicas: Isla de los Pájaros, lobos marinos y el Faro Les Éclaireurs.</p></article>
            <article><b>Parque Nacional Tierra del Fuego</b><p>Bosques de lenga, guindo y ñire, bahías, lagos, turberas y ambiente marino en un mismo parque.</p></article>
            <article><b>Tren del Fin del Mundo</b><p>Un recorrido conectado con la historia del antiguo presidio y los bosques fueguinos.</p></article>
            <article><b>Laguna Esmeralda</b><p>Uno de los senderos más conocidos por su paisaje de montaña, bosque y agua de color intenso.</p></article>
            <article><b>Aventura 4x4</b><p>Caminos de montaña, lagos y paisajes a los que se llega mejor saliendo de la ruta tradicional.</p></article>
            <article><b>Recorrer la ciudad</b><p>Costanera, museos, gastronomía fueguina, puerto y la historia urbana del extremo sur.</p></article>
          </div>
        </section>

        <section className="locas-blog-story-image reverse">
          <figure><Image src="/destinations/ushuaia/park.jpg" alt="Parque Nacional Tierra del Fuego" fill sizes="(max-width:800px) 94vw, 900px" /></figure>
          <div><span>PARQUE NACIONAL</span><h2>68.909 hectáreas donde se mezclan bosque, montaña y mar.</h2><p>El Parque Nacional Tierra del Fuego protege uno de los ambientes más singulares de la Argentina. Tiene bosques, turberas, lagos, valles y costa marina, además de huellas de ocupación humana de miles de años.</p></div>
        </section>
      </> : <section><h2>No es sólo el lugar. Es lo que pasa mientras lo vivimos juntas.</h2><p>Hay destinos hermosos en fotos. Y hay viajes que se vuelven importantes por las conversaciones, las risas, los silencios compartidos, las fotos improvisadas y las personas con las que los recorrés. Esa es la mirada con la que armamos cada salida.</p></section>}

      <section className="locas-blog-likes">
        <h2>Lo que más nos gusta de {article.title}</h2>
        <div><article><b>El paisaje</b><p>Escenarios que justifican el viaje por sí solos y se disfrutan todavía más cuando alguien al lado está viendo lo mismo.</p></article><article><b>Los momentos</b><p>Comidas, caminatas, esperas, charlas y pequeñas escenas que después son las que más se recuerdan.</p></article><article><b>El grupo</b><p>La experiencia cambia cuando cada día se comparte con mujeres que tienen las mismas ganas de viajar y vivir algo distinto.</p></article></div>
      </section>

      <section className="locas-blog-days"><h2>Una historia por día</h2>{article.days.map((day,i)=><article key={day}><div><span>Día {i+1}</span><h3>{day}</h3><p>{isUshuaia ? [
        'Llegamos al extremo sur, nos instalamos y empezamos a reconocer la ciudad, el puerto y a las mujeres con las que vamos a compartir los próximos días.',
        'Bosques, bahías y Parque Nacional. Un día para entender la escala del paisaje fueguino y sumar el Tren del Fin del Mundo a la historia del recorrido.',
        'Salimos al Canal Beagle. El faro, las islas, las aves y el mar cambian por completo la perspectiva de la ciudad que queda detrás.',
        'La montaña y la aventura 4x4 cierran el viaje con una última jornada fuerte antes de volver con fotos, anécdotas y un grupo que ya no es el mismo del primer día.'
      ][i] : 'Una jornada para conocer el destino sin correr, con tiempo para la experiencia, el grupo y esos momentos que después terminan siendo la historia que contás al volver.'}</p></div><figure><Image src={article.dayImages[i % article.dayImages.length]} alt={`${article.title} día ${i+1}`} fill sizes="(max-width:800px) 92vw, 420px" /></figure></article>)}</section>

      {isUshuaia && <section className="locas-blog-practical"><h2>Antes de viajar</h2><div><article><b>Qué llevar</b><p>Campera abrigada e impermeable, capas térmicas, polar o sweater y calzado cómodo para caminar.</p></article><article><b>Cuándo ir</b><p>Verano ofrece jornadas larguísimas; otoño suma colores de bosque; invierno transforma el paisaje con nieve.</p></article><article><b>Cómo vivirla</b><p>Dejá margen para el clima. En Ushuaia, cambiar el orden de una excursión puede ser parte normal del viaje.</p></article></div><small>Datos generales: Secretaría de Turismo de Ushuaia e INDEC.</small></section>}

      <section className="locas-blog-quote"><p>“Los mejores viajes no terminan cuando volvés. Siguen en las fotos, en el grupo y en los próximos planes.”</p></section>
    </article>

    <div className="locas-blog-return"><div><b>¿Te imaginaste ahí?</b><span>Volvé a la salida, mirá los lugares disponibles y seguí desde donde estabas.</span></div><Link href={`/viajes/${slug}`}>Volver al viaje <span>→</span></Link></div>
  </main>
}
