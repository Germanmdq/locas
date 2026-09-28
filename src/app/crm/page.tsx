"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Lead = {
  id:number; name:string; channel:"Instagram"|"Facebook"|"WhatsApp"|"Google"|"Web"|"Referido";
  campaign:string; trip:string; stage:"Nuevo lead"|"Contactado"|"Propuesta"|"Reserva iniciada"|"Pagó seña"|"Confirmado";
  value:string; last:string; next:string; owner:string; hot:boolean; email:string; phone:string;
};

const leads:Lead[] = [
  {id:1,name:"Mariana López",channel:"Instagram",campaign:"Reel Ushuaia · Septiembre",trip:"Ushuaia",stage:"Reserva iniciada",value:"ARS 3.690.000",last:"Hoy · 10:42",next:"Enviar recordatorio de seña",owner:"Flor",hot:true,email:"mariana@email.com",phone:"+54 9 11 5555 0142"},
  {id:2,name:"Carolina Méndez",channel:"WhatsApp",campaign:"Consulta directa",trip:"Trevelin",stage:"Pagó seña",value:"ARS 3.390.000",last:"Hoy · 09:18",next:"Pedir documentación",owner:"Vale",hot:true,email:"caro@email.com",phone:"+54 9 223 555 1920"},
  {id:3,name:"Lucía Ferraro",channel:"Facebook",campaign:"Meta · Norte Noviembre",trip:"Norte Argentino",stage:"Propuesta",value:"ARS 2.960.000",last:"Ayer · 18:31",next:"Seguimiento hoy 17:00",owner:"Flor",hot:true,email:"lucia@email.com",phone:"+54 9 341 555 6671"},
  {id:4,name:"Sofía Rivas",channel:"Google",campaign:"Búsqueda · viajes mujeres",trip:"Catamarca",stage:"Contactado",value:"ARS 3.840.000",last:"Ayer · 15:04",next:"Enviar fechas disponibles",owner:"Mica",hot:false,email:"sofia@email.com",phone:"+54 9 261 555 9021"},
  {id:5,name:"Andrea Suárez",channel:"Instagram",campaign:"Historia · Tulipanes",trip:"Trevelin",stage:"Nuevo lead",value:"ARS 3.390.000",last:"Hace 2 h",next:"Responder hoy",owner:"Sin asignar",hot:true,email:"andrea@email.com",phone:"+54 9 11 5555 8830"},
  {id:6,name:"Paula Gómez",channel:"Web",campaign:"Formulario Trevelin",trip:"Trevelin",stage:"Propuesta",value:"ARS 3.390.000",last:"Hace 1 día",next:"Llamar 16:30",owner:"Vale",hot:false,email:"paula@email.com",phone:"+54 9 351 555 7810"},
  {id:7,name:"Gabriela Ortiz",channel:"Referido",campaign:"Referida por Marcela",trip:"Puerto Rico",stage:"Confirmado",value:"USD 4.100",last:"Hace 2 días",next:"Agregar al grupo de salida",owner:"Flor",hot:false,email:"gabi@email.com",phone:"+54 9 11 5555 2291"},
  {id:8,name:"Natalia Pérez",channel:"Facebook",campaign:"Meta · Ushuaia Octubre",trip:"Ushuaia",stage:"Contactado",value:"ARS 3.690.000",last:"Hace 3 h",next:"Enviar propuesta",owner:"Mica",hot:true,email:"natalia@email.com",phone:"+54 9 223 555 4488"},
];

const channelClass:Record<Lead["channel"],string>={Instagram:"ig",Facebook:"fb",WhatsApp:"wa",Google:"gg",Web:"web",Referido:"ref"};

export default function CRMPage(){
  const [query,setQuery]=useState("");
  const [channel,setChannel]=useState("Todos");
  const [selected,setSelected]=useState(leads[0].id);
  const current=leads.find(l=>l.id===selected)!;
  const filtered=useMemo(()=>leads.filter(l=>(channel==="Todos"||l.channel===channel)&&(`${l.name} ${l.trip} ${l.campaign}`.toLowerCase().includes(query.toLowerCase()))),[query,channel]);
  return <main className="crmPage">
    <header className="crmTopbar">
      <Link href="/" className="crmBrand">Locas por la aventura</Link>
      <nav><Link href="/">Sitio</Link><Link href="/catalogo">Catálogo</Link><Link href="/crm" className="isActive">CRM</Link><Link href="/control">Control</Link></nav>
      <div className="crmUser"><span>GG</span><div><b>Administración</b><small>Modo demo</small></div></div>
    </header>

    <section className="crmShell">
      <div className="crmTitleRow"><div><span>CRM / ATRIBUCIÓN</span><h1>De dónde viene cada persona y qué hacemos después.</h1><p>Origen, campaña, viaje de interés, etapa comercial y próxima acción en un solo lugar.</p></div><button>＋ Nuevo contacto</button></div>

      <div className="crmKpis">
        <article><span>Leads este mes</span><strong>143</strong><small>+24% vs. mes anterior</small></article>
        <article><span>Oportunidades calientes</span><strong>17</strong><small>requieren seguimiento hoy</small></article>
        <article><span>Conversión a reserva</span><strong>18,4%</strong><small>Instagram lidera con 22,1%</small></article>
        <article><span>Ventas atribuidas</span><strong>ARS 96,8M</strong><small>últimos 30 días</small></article>
      </div>

      <div className="crmAttribution">
        <section className="crmPanel"><div className="crmPanelHead"><div><span>ORIGEN DE LEADS</span><h2>Canales</h2></div><b>143 total</b></div>
          <div className="crmChannels">
            {[['Instagram',54,'38%'],['WhatsApp',31,'22%'],['Facebook',24,'17%'],['Google',16,'11%'],['Web',11,'8%'],['Referido',7,'5%']].map(([n,v,p])=><div key={String(n)}><span className={`crmDot ${channelClass[n as Lead['channel']]}`}/><b>{n}</b><div><i style={{width:String(p)}}/></div><strong>{v}</strong><small>{p}</small></div>)}
          </div>
        </section>
        <section className="crmPanel"><div className="crmPanelHead"><div><span>EMBUDO</span><h2>Conversión</h2></div><b>30 días</b></div>
          <div className="crmFunnel"><div><span>Leads</span><b>143</b></div><div><span>Contactados</span><b>109</b></div><div><span>Propuestas</span><b>62</b></div><div><span>Reservas</span><b>26</b></div><div><span>Señas</span><b>21</b></div></div>
        </section>
      </div>

      <div className="crmToolbar"><label>⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por persona, viaje o campaña"/></label><div>{["Todos","Instagram","Facebook","WhatsApp","Google","Web","Referido"].map(c=><button key={c} className={channel===c?"active":""} onClick={()=>setChannel(c)}>{c}</button>)}</div></div>

      <div className="crmWorkspace">
        <section className="crmListPanel"><div className="crmTableHead"><span>Persona</span><span>Origen</span><span>Viaje</span><span>Etapa</span><span>Próxima acción</span></div>
          {filtered.map(l=><button className={`crmLeadRow ${selected===l.id?"selected":""}`} key={l.id} onClick={()=>setSelected(l.id)}>
            <span className="crmPerson"><i>{l.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</i><span><b>{l.name}</b><small>{l.last}</small></span>{l.hot&&<em>HOT</em>}</span>
            <span><span className={`crmSource ${channelClass[l.channel]}`}>{l.channel}</span><small>{l.campaign}</small></span>
            <span><b>{l.trip}</b><small>{l.value}</small></span>
            <span><span className="crmStage">{l.stage}</span></span>
            <span><b>{l.next}</b><small>{l.owner}</small></span>
          </button>)}
        </section>

        <aside className="crmDetail">
          <div className="crmDetailTop"><div className="crmAvatar">{current.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><span>CONTACTO</span><h2>{current.name}</h2><p>{current.email}<br/>{current.phone}</p></div></div>
          <div className="crmDetailGrid"><div><span>Origen</span><b>{current.channel}</b><small>{current.campaign}</small></div><div><span>Viaje</span><b>{current.trip}</b><small>{current.value}</small></div><div><span>Etapa</span><b>{current.stage}</b></div><div><span>Responsable</span><b>{current.owner}</b></div></div>
          <div className="crmNext"><span>PRÓXIMA ACCIÓN</span><h3>{current.next}</h3><button>Marcar como realizada</button></div>
          <div className="crmTimeline"><h3>Historial</h3><div><i/><p><b>Lead capturado</b><small>{current.channel} · {current.campaign}</small></p><time>09:12</time></div><div><i/><p><b>Visitó {current.trip}</b><small>Vio itinerario, precio y disponibilidad</small></p><time>09:18</time></div><div><i/><p><b>Interacción registrada</b><small>Formulario / mensaje / seguimiento comercial</small></p><time>10:02</time></div><div><i/><p><b>Último contacto</b><small>{current.last}</small></p><time>Hoy</time></div></div>
          <div className="crmTags"><span>Etiquetas</span><div><b>Alta intención</b><b>Viaje grupal</b><b>{current.trip}</b></div></div>
        </aside>
      </div>
    </section>
  </main>
}
