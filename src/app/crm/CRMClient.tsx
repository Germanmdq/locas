"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

export type Lead = {
  id:string; name:string; channel:string; campaign:string; trip:string; stage:string;
  value:string; last:string; next:string; owner:string; hot:boolean; email:string; phone:string;
  score:number; notes:string; interactions:{subject:string;body:string;channel:string;occurred_at:string}[];
};
export type ChannelStat={source:string;channel:string;leads:number;customers:number;revenue:number;conversion_rate:number};

const sourceClass=(name:string)=>({Instagram:"ig",Facebook:"fb",WhatsApp:"wa",Google:"gg","Web orgánica":"web",Web:"web",Referido:"ref"}[name]||"web");

export default function CRMClient({leads,channelStats}:{leads:Lead[];channelStats:ChannelStat[]}){
  const [query,setQuery]=useState(""); const [channel,setChannel]=useState("Todos"); const [selected,setSelected]=useState(leads[0]?.id||"");
  const current=leads.find(l=>l.id===selected)||leads[0];
  const filtered=useMemo(()=>leads.filter(l=>(channel==="Todos"||l.channel===channel)&&(`${l.name} ${l.trip} ${l.campaign}`.toLowerCase().includes(query.toLowerCase()))),[query,channel,leads]);
  const total=channelStats.reduce((a,c)=>a+Number(c.leads||0),0); const customers=channelStats.reduce((a,c)=>a+Number(c.customers||0),0);
  const conversion=total?((customers/total)*100).toFixed(1):"0.0"; const revenue=channelStats.reduce((a,c)=>a+Number(c.revenue||0),0);
  const hot=leads.filter(l=>l.hot).length;
  if(!current) return <main className="crmPage"><section className="crmShell"><h1>CRM sin datos</h1></section></main>;
  return <main className="crmPage">
    <header className="crmTopbar"><Link href="/" className="crmBrand">Locas por la aventura</Link><nav><Link href="/">Sitio</Link><Link href="/catalogo">Catálogo</Link><Link href="/crm" className="isActive">CRM</Link><Link href="/control">Control</Link></nav><div className="crmUser"><span>GG</span><div><b>Administración</b><small>Supabase conectado</small></div></div></header>
    <section className="crmShell">
      <div className="crmTitleRow"><div><span>CRM / ATRIBUCIÓN REAL</span><h1>De dónde viene cada persona y qué hacemos después.</h1><p>Origen, campaña, viaje, etapa, valor, historial y próxima acción, leyendo la base de datos.</p></div><button>＋ Nuevo contacto</button></div>
      <div className="crmKpis"><article><span>Leads cargados</span><strong>{total}</strong><small>base demo Supabase</small></article><article><span>Oportunidades calientes</span><strong>{hot}</strong><small>score y pipeline</small></article><article><span>Conversión</span><strong>{conversion}%</strong><small>lead → cliente</small></article><article><span>Ventas atribuidas</span><strong>ARS {Math.round(revenue).toLocaleString("es-AR")}</strong><small>reservas vinculadas a origen</small></article></div>
      <div className="crmAttribution"><section className="crmPanel"><div className="crmPanelHead"><div><span>ORIGEN DE LEADS</span><h2>Canales</h2></div><b>{total} total</b></div><div className="crmChannels">{channelStats.map(c=>{const pct=total?Math.round(Number(c.leads)*100/total):0;return <div key={c.source}><span className={`crmDot ${sourceClass(c.source)}`}/><b>{c.source}</b><div><i style={{width:`${pct}%`}}/></div><strong>{c.leads}</strong><small>{pct}%</small></div>})}</div></section>
        <section className="crmPanel"><div className="crmPanelHead"><div><span>ATRIBUCIÓN</span><h2>Ventas por canal</h2></div><b>Supabase</b></div><div className="crmFunnel">{channelStats.filter(c=>Number(c.leads)>0).map(c=><div key={c.source}><span>{c.source}</span><b>{Number(c.conversion_rate).toFixed(1)}%</b></div>)}</div></section></div>
      <div className="crmToolbar"><label>⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por persona, viaje o campaña"/></label><div>{["Todos",...Array.from(new Set(leads.map(l=>l.channel)))].map(c=><button key={c} className={channel===c?"active":""} onClick={()=>setChannel(c)}>{c}</button>)}</div></div>
      <div className="crmWorkspace"><section className="crmListPanel"><div className="crmTableHead"><span>Persona</span><span>Origen</span><span>Viaje</span><span>Etapa</span><span>Próxima acción</span></div>{filtered.map(l=><button className={`crmLeadRow ${selected===l.id?"selected":""}`} key={l.id} onClick={()=>setSelected(l.id)}><span className="crmPerson"><i>{l.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</i><span><b>{l.name}</b><small>{l.last}</small></span>{l.hot&&<em>HOT</em>}</span><span><span className={`crmSource ${sourceClass(l.channel)}`}>{l.channel}</span><small>{l.campaign}</small></span><span><b>{l.trip}</b><small>{l.value}</small></span><span><span className="crmStage">{l.stage}</span></span><span><b>{l.next}</b><small>{l.owner}</small></span></button>)}</section>
        <aside className="crmDetail"><div className="crmDetailTop"><div className="crmAvatar">{current.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><span>CONTACTO · SCORE {current.score}</span><h2>{current.name}</h2><p>{current.email}<br/>{current.phone}</p></div></div><div className="crmDetailGrid"><div><span>Origen</span><b>{current.channel}</b><small>{current.campaign}</small></div><div><span>Viaje</span><b>{current.trip}</b><small>{current.value}</small></div><div><span>Etapa</span><b>{current.stage}</b></div><div><span>Responsable</span><b>{current.owner}</b></div></div><div className="crmNext"><span>PRÓXIMA ACCIÓN</span><h3>{current.next}</h3><button>Marcar como realizada</button></div><div className="crmTimeline"><h3>Historial real</h3>{current.interactions.length?current.interactions.map((i,idx)=><div key={idx}><i/><p><b>{i.subject||i.channel}</b><small>{i.body}</small></p><time>{new Date(i.occurred_at).toLocaleDateString("es-AR")}</time></div>):<div><i/><p><b>Sin interacciones todavía</b><small>El contacto ya existe en el CRM.</small></p></div>}</div><div className="crmTags"><span>Notas</span><div><b>{current.notes||"Sin notas"}</b></div></div></aside>
      </div>
    </section>
  </main>
}
