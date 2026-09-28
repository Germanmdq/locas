import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import AdminShell from "@/app/admin/AdminShell";
import { MessageSquareText, ListTodo, CalendarCheck2, CreditCard, ArrowUpRight, Clock3, CircleDollarSign, UsersRound, PlaneTakeoff, ChevronRight } from "lucide-react";
import { IconBrandWhatsapp, IconBrandInstagram, IconBrandMessenger, IconBrandTelegram } from "@tabler/icons-react";

export const dynamic="force-dynamic";

const fmt=(n:number,c="ARS")=>c==="USD"?`USD ${Math.round(n).toLocaleString("es-AR")}`:`$ ${Math.round(n).toLocaleString("es-AR")}`;
const channelIcon=(c:string)=>c==="whatsapp"?<IconBrandWhatsapp size={20}/>:c==="instagram"?<IconBrandInstagram size={20}/>:c==="messenger"?<IconBrandMessenger size={20}/>:c==="telegram"?<IconBrandTelegram size={20}/>:<MessageSquareText size={20}/>;

export default async function ControlPage(){
 const supabase=createSupabaseClient();
 const [{data:conversations},{data:tasks},{data:reservations},{data:payments},{data:departures},{count:contactCount}] = await Promise.all([
  supabase.from("conversations").select("id,channel,status,unread_count,last_message_at,intent,response_due_at"),
  supabase.from("tasks").select("id,title,due_at,priority,status,contacts(first_name,last_name)").eq("status","open").order("due_at",{ascending:true}).limit(8),
  supabase.from("reservations").select("id,status,total_amount,paid_amount,currency,reserved_at,contacts(first_name,last_name),departures(starts_on,trips(name))").order("reserved_at",{ascending:false}).limit(8),
  supabase.from("payments").select("id,status,amount,currency,due_at,paid_at,payment_type,provider").order("due_at",{ascending:true}).limit(20),
  supabase.from("departures").select("id,capacity,sold,waitlist,starts_on,status,trips(name)").order("starts_on",{ascending:true}).limit(8),
  supabase.from("contacts").select("*",{count:"exact",head:true})
 ]);
 const conv=conversations||[], t=tasks||[], r=reservations||[], p=payments||[], d=departures||[];
 const unread=conv.reduce((a:any,x:any)=>a+Number(x.unread_count||0),0);
 const openTasks=t.length;
 const confirmed=r.filter((x:any)=>["confirmed","deposit_paid","reserved"].includes(String(x.status))).length;
 const pendingPayments=p.filter((x:any)=>["pending","due","overdue"].includes(String(x.status))).length;
 const pendingAmount=p.filter((x:any)=>["pending","due","overdue"].includes(String(x.status))&&x.currency!=="USD").reduce((a:any,x:any)=>a+Number(x.amount||0),0);
 const channels=["whatsapp","instagram","messenger","telegram","email"].map(channel=>({channel,count:conv.filter((x:any)=>x.channel===channel).length,unread:conv.filter((x:any)=>x.channel===channel).reduce((a:any,x:any)=>a+Number(x.unread_count||0),0)}));
 return <AdminShell title="Dashboard operativo" subtitle="Lo que el equipo necesita resolver hoy: mensajes, tareas, reservas, cobros y salidas." actions={<><Link className="opsSecondaryBtn" href="/crm/mensajes"><MessageSquareText size={16}/> Abrir mensajes</Link><Link className="opsPrimaryBtn" href="/catalogo"><PlaneTakeoff size={16}/> Gestionar viajes</Link></>}>
   <section className="opsMetricGrid dashboardMetrics">
    <article><div className="opsMetricIcon"><MessageSquareText size={19}/></div><div><span>Mensajes sin leer</span><strong>{unread}</strong><small>{conv.filter((x:any)=>x.status==="open").length} conversaciones abiertas</small></div></article>
    <article><div className="opsMetricIcon warn"><ListTodo size={19}/></div><div><span>Tareas abiertas</span><strong>{openTasks}</strong><small>seguimientos y pendientes</small></div></article>
    <article><div className="opsMetricIcon good"><CalendarCheck2 size={19}/></div><div><span>Reservas recientes</span><strong>{confirmed}</strong><small>{contactCount||0} contactos en CRM</small></div></article>
    <article><div className="opsMetricIcon warn"><CreditCard size={19}/></div><div><span>Cobros pendientes</span><strong>{pendingPayments}</strong><small>{fmt(pendingAmount)} por cobrar</small></div></article>
   </section>

   <section className="opsDashboardGrid">
    <article className="opsCard opsDashWide">
      <div className="opsSectionHead"><div><span>COMUNICACIONES</span><h2>Canales activos</h2></div><Link href="/crm/mensajes">Ver bandeja <ArrowUpRight size={14}/></Link></div>
      <div className="opsDashChannels">{channels.map(c=><div key={c.channel}><span className={`opsDashChannelIcon ${c.channel}`}>{channelIcon(c.channel)}</span><div><b>{c.channel==="email"?"Email":c.channel.charAt(0).toUpperCase()+c.channel.slice(1)}</b><small>{c.count} conversaciones</small></div><strong>{c.unread}</strong><em>sin leer</em></div>)}</div>
    </article>
    <article className="opsCard opsDashNarrow">
      <div className="opsSectionHead"><div><span>HOY</span><h2>Prioridades</h2></div></div>
      <div className="opsPriorityList"><div><Clock3 size={17}/><span><b>Responder conversaciones</b><small>{unread} mensajes esperan respuesta</small></span><ChevronRight size={16}/></div><div><ListTodo size={17}/><span><b>Resolver tareas</b><small>{openTasks} seguimientos abiertos</small></span><ChevronRight size={16}/></div><div><CircleDollarSign size={17}/><span><b>Revisar cobros</b><small>{pendingPayments} pagos pendientes</small></span><ChevronRight size={16}/></div></div>
    </article>
   </section>

   <section className="opsDashboardGrid lower">
    <article className="opsCard opsDashWide" id="reservas">
      <div className="opsSectionHead"><div><span>VIAJES</span><h2>Salidas y ocupación</h2></div><Link href="/catalogo">Catálogo <ArrowUpRight size={14}/></Link></div>
      <div className="opsDataTable"><div className="head"><span>Salida</span><span>Fecha</span><span>Ocupación</span><span>Lista espera</span><span>Estado</span></div>{d.length?d.map((x:any)=>{const trip=Array.isArray(x.trips)?x.trips[0]:x.trips;const pct=x.capacity?Math.round(Number(x.sold||0)*100/Number(x.capacity)):0;return <div key={x.id}><span><b>{trip?.name||"Viaje"}</b></span><span>{x.starts_on?new Date(`${x.starts_on}T12:00:00`).toLocaleDateString("es-AR"):"—"}</span><span><div className="opsMiniProgress"><i style={{width:`${Math.min(pct,100)}%`}}/></div><small>{x.sold||0}/{x.capacity||0} · {pct}%</small></span><span>{x.waitlist||0}</span><span><em className="opsStatusBadge">{x.status||"active"}</em></span></div>}):<p className="opsEmptyRow">No hay salidas cargadas todavía.</p>}</div>
    </article>
    <article className="opsCard opsDashNarrow" id="tareas">
      <div className="opsSectionHead"><div><span>SEGUIMIENTOS</span><h2>Próximas tareas</h2></div></div>
      <div className="opsTaskList">{t.length?t.slice(0,6).map((x:any)=>{const c=Array.isArray(x.contacts)?x.contacts[0]:x.contacts;return <div key={x.id}><i className={x.priority==="high"?"high":""}/><span><b>{x.title}</b><small>{c?`${c.first_name||""} ${c.last_name||""}`.trim():"Sin contacto"} · {x.due_at?new Date(x.due_at).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"Sin fecha"}</small></span></div>}):<p className="opsEmptyRow">No hay tareas abiertas.</p>}</div>
    </article>
   </section>

   <section className="opsDashboardGrid lower" id="pagos">
    <article className="opsCard opsDashWide"><div className="opsSectionHead"><div><span>FINANZAS</span><h2>Reservas recientes</h2></div></div><div className="opsDataTable compact"><div className="head"><span>Pasajera</span><span>Viaje</span><span>Total</span><span>Pagado</span><span>Estado</span></div>{r.length?r.slice(0,6).map((x:any)=>{const c=Array.isArray(x.contacts)?x.contacts[0]:x.contacts;const dep=Array.isArray(x.departures)?x.departures[0]:x.departures;const trip=dep?(Array.isArray(dep.trips)?dep.trips[0]:dep.trips):null;return <div key={x.id}><span><b>{c?`${c.first_name||""} ${c.last_name||""}`.trim():"Pasajera"}</b></span><span>{trip?.name||"—"}</span><span>{fmt(Number(x.total_amount||0),x.currency)}</span><span>{fmt(Number(x.paid_amount||0),x.currency)}</span><span><em className="opsStatusBadge">{x.status}</em></span></div>}):<p className="opsEmptyRow">No hay reservas recientes.</p>}</div></article>
    <article className="opsCard opsDashNarrow"><div className="opsSectionHead"><div><span>CLIENTES</span><h2>Base comercial</h2></div></div><div className="opsBigStat"><UsersRound size={24}/><strong>{contactCount||0}</strong><span>contactos identificados</span><p>Web, Instagram, Facebook, WhatsApp, referidos y canales conectados terminan en una ficha única de CRM.</p></div></article>
   </section>
 </AdminShell>
}
