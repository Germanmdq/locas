import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  ushuaia: { title:"Ushuaia", image:"/destinations/ushuaia/laguna-esmeralda.jpg", dayImages:["/destinations/ushuaia/arrival-group.jpg","/destinations/ushuaia/park.jpg","/destinations/ushuaia.jpg","/destinations/ushuaia/community.webp"], intro:"El fin del mundo tiene una mezcla difícil de explicar hasta que la vivís: montaña, mar, bosque, aire frío y un grupo que empieza siendo desconocido y termina compartiendo recuerdos.", days:["Llegar y reconocerse en el grupo","Caminar entre bosques y bahías","Navegar el Beagle juntas","Cerrar el viaje con una historia compartida"] },
  trevelin: { title:"Trevelin", image:"/destinations/trevelin.jpg", dayImages:["/destinations/trevelin.jpg","/destinations/trevelin.jpg","/destinations/trevelin.jpg","/destinations/trevelin.jpg"], intro:"Primavera patagónica, tulipanes, historia galesa y esos días en que la conversación del grupo termina siendo tan importante como el paisaje.", days:["La llegada a la cordillera","El campo de tulipanes","Sabores e historia galesa","Lagos, bosque y despedida"] },
  catamarca: { title:"Catamarca", image:"/destinations/catamarca.jpg", dayImages:["/destinations/catamarca.jpg","/destinations/catamarca.jpg","/destinations/catamarca.jpg","/destinations/catamarca.jpg"], intro:"Catamarca se vive a escala enorme: caminos abiertos, puna, salares y pueblos pequeños. Es un viaje que pide tiempo, curiosidad y muchas conversaciones en ruta.", days:["Primer encuentro con los valles","La ruta hacia la puna","Salares y horizontes infinitos","Historias de camino y regreso"] },
  "san-martin-de-los-andes": { title:"San Martín de los Andes", image:"/destinations/san-martin.jpg", dayImages:["/destinations/san-martin.jpg","/destinations/san-martin.jpg","/destinations/san-martin.jpg","/destinations/san-martin.jpg"], intro:"Bosque, lagos y caminos que invitan a bajar el ritmo. Un destino ideal para compartir sobremesas, miradores y días enteros en movimiento con el grupo.", days:["Llegar a la ciudad de montaña","Ruta de los Siete Lagos","Senderos y bosque","Lácar, charla y cierre"] },
  "puerto-rico": { title:"Puerto Rico", image:"/destinations/puerto-rico.jpg", dayImages:["/destinations/puerto-rico.jpg","/destinations/puerto-rico.jpg","/destinations/puerto-rico.jpg","/destinations/puerto-rico.jpg"], intro:"Caribe, música, playas, historia y una energía que cambia mucho cuando se vive en grupo. Puerto Rico combina descubrimiento y momentos compartidos todo el día.", days:["Primeras horas en San Juan","Historia y color en el Viejo San Juan","Naturaleza tropical","Mar, música y despedida"] }
} as const;

type Slug = keyof typeof articles;
export function generateStaticParams(){ return Object.keys(articles).map(slug=>({slug})); }

export default async function BlogArticle({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const article=articles[slug as Slug]; if(!article) notFound();
  return <main className="locas-blog-page">
    <header className="locas-blog-nav"><Link href="/">Locas por la aventura</Link><Link href={`/viajes/${slug}`}>← Volver al viaje</Link></header>
    <section className="locas-blog-hero">
      <div className="locas-blog-kicker">REVISTA LOCAS · DESTINOS</div>
      <h1>Qué nos enamora de {article.title}</h1>
      <p>{article.intro}</p>
      <figure><Image src={article.image} alt={article.title} fill priority sizes="100vw" /></figure>
    </section>
    <article className="locas-blog-article">
      <section><h2>No es sólo el lugar. Es lo que pasa mientras lo vivimos juntas.</h2><p>Hay destinos hermosos en fotos. Y hay viajes que se vuelven importantes por las conversaciones, las risas, los silencios compartidos, las fotos improvisadas y las personas con las que los recorrés. Esa es la mirada con la que armamos cada salida.</p></section>
      <section className="locas-blog-likes"><h2>Lo que más nos gusta de {article.title}</h2><div><article><b>El paisaje</b><p>Escenarios que justifican el viaje por sí solos, pero que se disfrutan todavía más cuando alguien al lado está viendo lo mismo.</p></article><article><b>Los momentos</b><p>Comidas, caminatas, esperas, charlas y pequeñas escenas que después son las que más se recuerdan.</p></article><article><b>El grupo</b><p>La experiencia cambia cuando cada día se comparte con mujeres que están ahí por las mismas ganas de viajar y vivir algo distinto.</p></article></div></section>
      <section className="locas-blog-days"><h2>Una historia por día</h2>{article.days.map((day,i)=><article key={day}><div><span>Día {i+1}</span><h3>{day}</h3><p>Una jornada para conocer el destino sin correr, con tiempo para la experiencia, el grupo y esos momentos que después terminan siendo la historia que contás al volver.</p></div><figure><Image src={article.dayImages[i % article.dayImages.length]} alt={`${article.title} día ${i+1}`} fill sizes="(max-width:800px) 92vw, 420px" style={{objectPosition:`${45+i*8}% center`}} /></figure></article>)}</section>
      <section className="locas-blog-quote"><p>“Los mejores viajes no terminan cuando volvés. Siguen en las fotos, en el grupo y en los próximos planes.”</p></section>
    </article>
    <div className="locas-blog-return"><div><b>¿Te imaginaste ahí?</b><span>Volvé a la salida, mirá los lugares disponibles y seguí desde donde estabas.</span></div><Link href={`/viajes/${slug}`}>Volver al viaje <span>→</span></Link></div>
  </main>
}
