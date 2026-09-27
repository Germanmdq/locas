import Link from "next/link";

export default function MiLocasPage() {
  return (
    <main className="accountPage">
      <header className="subNav shell"><Link className="logo darkLogo" href="/">LOCAS <span>POR LA AVENTURA</span></Link><nav><Link href="/viajes">Viajes</Link><Link href="/mi-viaje">Mi Viaje</Link></nav></header>
      <section className="accountHero shell"><span>MI LOCAS</span><h1>Hola, Lucía.</h1><p>Tu espacio antes de reservar: intereses, favoritos, alertas y comunidad.</p></section>
      <section className="accountGrid shell">
        <article className="accountCard lime"><span>PERFIL</span><h2>Lucía P.</h2><p>Argentina · Español</p><div className="tagRow"><i>Aventura</i><i>Europa</i><i>Patagonia</i></div></article>
        <article className="accountCard"><span>FAVORITOS</span><h2>4 viajes guardados</h2><p>Ushuaia · Italia · Turquía · Puerto Rico</p><Link href="/viajes">Ver favoritos →</Link></article>
        <article className="accountCard"><span>ALERTAS</span><h2>3 activas</h2><p>Italia en septiembre · Caribe hasta USD 2.500 · Viajes de 7–10 días</p></article>
        <article className="accountCard"><span>LISTAS DE ESPERA</span><h2>1 viaje</h2><p>Turquía · Próxima salida</p></article>
        <article className="accountCard wide"><span>COMUNIDAD</span><h2>Conversaciones que ya empezaron.</h2><div className="communityPreview"><b>Italia 2027</b><span>126 mujeres interesadas</span><p>“¿Alguien viaja desde Córdoba?”</p><p>“Yo también estoy mirando septiembre.”</p></div></article>
        <article className="accountCard wide"><span>PREFERENCIAS</span><h2>Qué querés recibir</h2><div className="prefRow"><span>✓ Nuevas salidas</span><span>✓ Alertas de cupos</span><span>✓ Contenido editorial</span><span>✓ WhatsApp</span><span>✓ Email</span></div></article>
      </section>
    </main>
  );
}
