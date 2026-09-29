import Link from "next/link";
import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Database, Activity, UsersRound, MessageSquareText, PlaneTakeoff, CalendarCheck2, CreditCard, ListTodo, Megaphone, Globe2, CheckCircle2, ArrowUpRight, Clock3 } from "lucide-react";

export const dynamic = "force-dynamic";

const modules = [
  { key:"contacts", label:"Contactos", href:"/crm", icon:UsersRound },
  { key:"campaigns", label:"Campañas", href:"/crm", icon:Megaphone },
  { key:"conversations", label:"Conversaciones", href:"/crm/mensajes", icon:MessageSquareText },
  { key:"trips", label:"Viajes", href:"/catalogo", icon:PlaneTakeoff },
  { key:"reservations", label:"Reservas", href:"/reservas", icon:CalendarCheck2 },
  { key:"payments", label:"Pagos", href:"/pagos", icon:CreditCard },
  { key:"tasks", label:"Tareas", href:"/tareas", icon:ListTodo },
  { key:"web_events", label:"Eventos web", href:"/datos", icon:Activity },
];

export default async function Page(){
  const supabase=createSupabaseClient();
  const count = async (table:string) => {
    const { count, error } = await supabase.from(table).select("*",{count:"exact",head:true});
    return { count: count || 0, ok: !error, error: error?.message || "" };
  };
  const [contacts,campaigns,conversations,trips,reservations,payments,tasks,events,sessions,lastEvents] = await Promise.all([
    count("contacts"), count("campaigns"), count("conversations"), count("trips"), count("reservations"), count("payments"), count("tasks"), count("web_events"),
    supabase.from("web_sessions").select("session_id,contact_id,utm_source,utm_campaign,last_page,event_count,last_seen_at").order("last_seen_at",{ascending:false}).limit(8),
    supabase.from("web_events").select("event_name,page_url,utm_source,utm_campaign,occurred_at,contact_id").order("occurred_at",{ascending:false}).limit(10)
  ]);
  const stats:any = {contacts,campaigns,conversations,trips,reservations,payments,tasks,web_events:events};
  const allOk = Object.values(stats).every((x:any)=>x.ok);
  const identified = (sessions.data||[]).filter((s:any)=>s.contact_id).length;
  const sessionCount = (sessions.data||[]).length;

  return <AdminShell title="Datos" subtitle="Fuentes, tracking y estructura de información del sistema.">
    <section className="dataHealthBar">
      <div className={allOk?"ok":"warn"}><CheckCircle2 size={18}/><span><b>{allOk?"Supabase conectado":"Revisar conexión"}</b><small>{allOk?"Base operativa y accesible":"Hay módulos con error de lectura"}</small></span></div>
      <div><Database size={18}/><span><b>{Object.values(stats).reduce((a:any,x:any)=>a+Number(x.count||0),0)}</b><small>registros principales</small></span></div>
      <div><Globe2 size={18}/><span><b>{sessionCount}</b><small>sesiones recientes</small></span></div>
      <div><UsersRound size={18}/><span><b>{identified}</b><small>sesiones identificadas</small></span></div>
    </section>

    <section className="dataModuleGrid">
      {modules.map(({key,label,href,icon:Icon})=>{const s=stats[key];return <Link href={href} className="dataModuleCard" key={key}>
        <div className="dataModuleTop"><span><Icon size={18}/></span><em className={s.ok?"ok":"error"}>{s.ok?"Activo":"Error"}</em></div>
        <strong>{s.count}</strong><b>{label}</b><small>{s.ok?"Leyendo desde Supabase":s.error}</small><ArrowUpRight size={15}/>
      </Link>})}
    </section>

    <section className="dataTwoCols">
      <article className="opsCard dataPanel">
        <div className="opsSectionHead"><div><span>TRACKING</span><h2>Sesiones recientes</h2></div><b>{sessionCount} visibles</b></div>
        <div className="dataTable"><div className="head"><span>Origen</span><span>Campaña</span><span>Última página</span><span>Eventos</span><span>Identidad</span></div>
          {(sessions.data||[]).map((s:any)=><div key={s.session_id}><span><b>{s.utm_source||"Directo"}</b></span><span>{s.utm_campaign||"—"}</span><span title={s.last_page||""}>{s.last_page||"—"}</span><span>{s.event_count||0}</span><span>{s.contact_id?<em className="dataStatus ok">Identificada</em>:<em className="dataStatus">Anónima</em>}</span></div>)}
          {!sessionCount&&<p className="opsEmptyRow">Todavía no hay sesiones registradas.</p>}
        </div>
      </article>

      <article className="opsCard dataPanel">
        <div className="opsSectionHead"><div><span>ACTIVIDAD</span><h2>Últimos eventos web</h2></div><Clock3 size={17}/></div>
        <div className="dataEventList">{(lastEvents.data||[]).map((e:any,i:number)=><div key={`${e.occurred_at}-${i}`}><i/><span><b>{String(e.event_name||"evento").replaceAll("_"," ")}</b><small>{e.page_url||"Sin URL"}</small></span><time>{e.occurred_at?new Date(e.occurred_at).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"—"}</time></div>)}{!(lastEvents.data||[]).length&&<p className="opsEmptyRow">Todavía no hay eventos web.</p>}</div>
      </article>
    </section>

    <section className="opsCard dataSourcePanel">
      <div className="opsSectionHead"><div><span>ARQUITECTURA</span><h2>Una sola base para toda la operación</h2></div></div>
      <div className="dataFlow"><span>Web / campañas / canales</span><b>→</b><span>Tracking + contactos</span><b>→</b><span>CRM + mensajes</span><b>→</b><span>Reservas + pagos</span><b>→</b><span>Dashboard y automatizaciones</span></div>
    </section>
  </AdminShell>
}
