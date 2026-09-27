import Link from "next/link";

export default function MiViajePage() {
  return (
    <main className="accountPage darkAccount">
      <header className="subNav shell darkSubNav"><Link className="logo" href="/">LOCAS <span>POR LA AVENTURA</span></Link><nav><Link href="/viajes">Viajes</Link><Link href="/mi-locas">Mi Locas</Link></nav></header>
      <section className="accountHero shell"><span>MI VIAJE</span><h1>Ushuaia en 16 días.</h1><p>Todo lo que necesitás antes de salir, ordenado en un único lugar.</p></section>
      <section className="travelDashboard shell">
        <div className="travelStatus"><span>RESERVA #LP-4821</span><strong>Confirmada</strong><p>Saldo pendiente: USD 640</p><button>Completar pago</button></div>
        <div className="travelTimeline">
          <div className="done"><b>✓</b><span>Reserva confirmada</span></div><div className="done"><b>✓</b><span>Seña acreditada</span></div><div><b>3</b><span>Documentación pendiente</span></div><div><b>4</b><span>Check-in y vouchers</span></div>
        </div>
        <div className="travelModules">
          {['Itinerario','Vuelos','Hotel','Documentos','Coordinadora','Grupo privado','Novedades','Soporte 24/7'].map((x)=><article key={x}><span>{x}</span><b>→</b></article>)}
        </div>
      </section>
    </main>
  );
}
