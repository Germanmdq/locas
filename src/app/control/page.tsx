import Link from "next/link";

export default function ControlPage() {
  return (
    <main className="controlPage">
      <header className="controlHeader"><Link href="/">LOCAS CONTROL</Link><nav><Link href="/catalogo">Catálogo</Link><Link href="/crm">CRM</Link></nav><span>Resumen ejecutivo · Hoy</span></header>
      <section className="controlShell">
        <div className="controlTitle"><div><span>DIRECCIÓN</span><h1>Así está el negocio ahora.</h1></div><button>Preguntar al agente</button></div>
        <div className="kpiGrid">
          <article><span>Ventas mes</span><strong>67</strong><em>+18%</em></article><article><span>Facturación atribuible</span><strong>USD 281K</strong><em>+12%</em></article><article><span>Leads nuevos</span><strong>143</strong><em>+24%</em></article><article><span>Cobros pendientes</span><strong>12</strong><em className="warn">Revisar</em></article>
        </div>
        <div className="controlPanels">
          <section><h2>Salidas</h2><div className="tableRow head"><span>Viaje</span><span>Ocupación</span><span>Ventas</span></div><div className="tableRow"><span>Ushuaia</span><span>90%</span><span>18/20</span></div><div className="tableRow"><span>Puerto Rico</span><span>87%</span><span>21/24</span></div><div className="tableRow"><span>Catamarca</span><span>78%</span><span>14/18</span></div></section>
          <section><h2>Alertas</h2><div className="alertItem"><b>Pago pendiente</b><p>5 saldos vencen en las próximas 48 h.</p></div><div className="alertItem"><b>Demanda emergente</b><p>Suben búsquedas y favoritos para Italia.</p></div><div className="alertItem"><b>Campaña</b><p>Meta “Ushuaia Octubre” convierte mejor que el promedio.</p></div></section>
        </div>
        <section className="agentBox"><span>AGENTE DE NEGOCIO</span><h2>“¿Qué debería mirar hoy?”</h2><p>Ushuaia está a dos lugares de completar cupo. Hay 17 leads de alta intención sin seguimiento en las últimas 24 horas y 5 saldos próximos a vencer.</p><button>Ver oportunidades</button></section>
      </section>
    </main>
  );
}
