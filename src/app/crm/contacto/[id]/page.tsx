import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Mail, Phone, MapPin, CalendarDays, Star, MessageSquareText, ListTodo, CreditCard, FileText, Eye, Heart, ArrowLeft, ExternalLink, CircleDollarSign } from "lucide-react";
import { IconBrandWhatsapp, IconBrandInstagram, IconBrandMessenger } from "@tabler/icons-react";

export const dynamic="force-dynamic";

const fmtMoney=(n:any,c="ARS")=>`${c} ${Number(n||0).toLocaleString("es-AR")}`;
const fmtDate=(d:any)=>d?new Date(d).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"—";
const channelIcon=(c:string)=>c==="whatsapp"?<IconBrandWhatsapp size={16}/>:c==="instagram"?<IconBrandInstagram size={16}/>:c==="messenger"?<IconBrandMessenger size={16}/>:<Mail size={16}/>;

export default async function Contact360Page({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const supabase=createSupabaseClient();
 const {data:contact}=await supabase.from("contacts").select("*,lead_sources(name),campaigns(name),crm_users(name)").eq("id",id).maybeSingle();
 if(!contact) notFound();
 const [{data:opps},{data:events},{data:messages},{data:tasks},{data:reservations},{data:docs},{data:interactions},{data:tags},{data:sessions}] = await Promise.all([
  supabase.from("opportunities").select("*,trips(name,slug),departures(starts_on)").eq("contact_id",id).order("created_at",{ascending:false}),
  supabase.from("web_events").select("id,event_name,page_url,page_title,utm_source,utm_campaign,trip_id,occurred_at,properties,trips(name,slug)").eq("contact_id",id).order("occurred_at",{ascending:false}).limit(200),
  supabase.from("messages").select("id,channel,direction,body,subject,status,sent_at,conversation_id").eq("contact_id",id).in("channel",["whatsapp","instagram","messenger","email"]).order("sent_at",{ascending:false}).limit(100),
  supabase.from("tasks").select("id,title,task_type,due_at,priority,status,completed_at,created_at").eq("contact_id",id).order("created_at",{ascending:false}),
  supabase.from("reservations").select("id,status,travelers,room_type,total_amount,paid_amount,currency,reserved_at,departures(starts_on,trips(name,slug)),payments(id,payment_type,provider,amount,currency,status,due_at,paid_at)").eq("contact_id",id).order("reserved_at",{ascending:false}),
  supabase.from("contact_documents").select("id,document_type,status,expires_on,received_at,notes").eq("contact_id",id),
  supabase.from("interactions").select("id,channel,direction,interaction_type,subject,body,occurred_at").eq("contact_id",id).in("channel",["whatsapp","instagram","messenger","email"]).order("occurred_at",{ascending:false}).limit(100),
  supabase.from("contact_tags").select("tags(name,color)").eq("contact_id",id),
  supabase.from("web_sessions").select("session_id,landing_page,last_page,utm_source,utm_campaign,referrer,event_count,started_at,last_seen_at,device_type").eq("contact_id",id).order("last_seen_at",{ascending:false})
 ]);
 const source=Array.isArray(contact.lead_sources)?contact.lead_sources[0]:contact.lead_sources; const campaign=Array.isArray(contact.campaigns)?contact.campaigns[0]:contact.campaigns; const owner=Array.isArray(contact.crm_users)?contact.crm_users[0]:contact.crm_users;
 const viewedTrips=new Map<string,{name:string;slug:string;count:number,last:string}>();
 (events||[]).forEach((e:any)=>{const t=Array.isArray(e.trips)?e.trips[0]:e.trips;if(t?.name){const k=t.slug||t.name; const prev=viewedTrips.get(k); viewedTrips.set(k,{name:t.name,slug:t.slug||"",count:(prev?.count||0)+1,last:e.occurred_at});}});
 const favorites=(events||[]).filter((e:any)=>String(e.event_name).includes("favorite")||String(e.event_name).includes("favourite"));
 const allPayments=(reservations||[]).flatMap((r:any)=>r.payments||[]); const totalReserved=(reservations||[]).reduce((a:any,r:any)=>a+Number(r.total_amount||0),0); const totalPaid=(reservations||[]).reduce((a:any,r:any)=>a+Number(r.paid_amount||0),0);
 const timeline=[
  ...(interactions||[]).map((x:any)=>({at:x.occurred_at,type:"interaction",title:x.subject||x.interaction_type||x.channel,body:x.body||"",channel:x.channel})),
  ...(messages||[]).map((x:any)=>({at:x.sent_at,type:"message",title:`${x.direction==="inbound"?"Mensaje recibido":"Mensaje enviado"} · ${x.channel}`,body:x.body||x.subject||"",channel:x.channel})),
  ...(events||[]).slice(0,60).map((x:any)=>({at:x.occurred_at,type:"web",title:String(x.event_name).replaceAll("_"," "),body:x.page_title||x.page_url||"",channel:"web"})),
  ...(tasks||[]).map((x:any)=>({at:x.completed_at||x.created_at,type:"task",title:x.status==="completed"?`Tarea completada: ${x.title}`:`Tarea creada: ${x.title}`,body:x.priority||"",channel:"task"})),
  ...(reservations||[]).map((x:any)=>({at:x.reserved_at,type:"reservation",title:`Reserva ${x.status}`,body:fmtMoney(x.total_amount,x.currency),channel:"reservation"}))
 ].filter(x=>x.at).sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime()).slice(0,80);
 const initials=`${contact.first_name?.[0]||""}${contact.last_name?.[0]||""}`.toUpperCase();
 return <AdminShell title="Ficha 360°" subtitle="Toda la relación comercial, digital y operativa de una persona en un solo lugar." actions={<><Link className="opsSecondaryBtn" href="/crm"><ArrowLeft size={16}/> Volver al CRM</Link><Link className="opsPrimaryBtn" href={`/crm/mensajes?contact=${id}`}><MessageSquareText size={16}/> Ver mensajes</Link></>}>
  <div className="contact360Header opsCard"><div className="contact360Identity"><div className="contact360Avatar">{initials||"?"}</div><div><span>CONTACTO · SCORE {contact.lead_score||0}</span><h2>{`${contact.first_name||""} ${contact.last_name||""}`.trim()}</h2><div className="contact360Meta">{contact.email&&<span><Mail size={14}/>{contact.email}</span>}{contact.phone&&<span><Phone size={14}/>{contact.phone}</span>}{(contact.city||contact.country)&&<span><MapPin size={14}/>{[contact.city,contact.country].filter(Boolean).join(", ")}</span>}</div></div></div><div className="contact360Badges"><span>{contact.lifecycle_stage||"lead"}</span><b>{owner?.name||"Sin asignar"}</b></div></div>

  <section className="contact360Metrics">
   <article><span>Score</span><strong>{contact.lead_score||0}</strong><small>temperatura comercial</small></article>
   <article><span>Valor estimado</span><strong>{fmtMoney(contact.estimated_value,contact.currency||"ARS")}</strong><small>potencial</small></article>
   <article><span>Reservado</span><strong>{fmtMoney(totalReserved,(reservations||[])[0]?.currency||contact.currency||"ARS")}</strong><small>{reservations?.length||0} reservas</small></article>
   <article><span>Pagado</span><strong>{fmtMoney(totalPaid,(reservations||[])[0]?.currency||contact.currency||"ARS")}</strong><small>{allPayments.filter((p:any)=>p.status==="paid").length} pagos confirmados</small></article>
  </section>

  <section className="contact360Grid">
   <article className="opsCard contact360Profile"><div className="opsSectionHead"><div><span>DATOS PERSONALES</span><h2>Perfil</h2></div></div><dl><div><dt>Email</dt><dd>{contact.email||"—"}</dd></div><div><dt>Teléfono</dt><dd>{contact.phone||"—"}</dd></div><div><dt>Instagram</dt><dd>{contact.instagram_handle||"—"}</dd></div><div><dt>Nacimiento</dt><dd>{contact.birth_date||"—"}</dd></div><div><dt>Canal preferido</dt><dd>{contact.preferred_channel||"—"}</dd></div><div><dt>WhatsApp opt-in</dt><dd>{contact.whatsapp_opt_in?"Sí":"No"}</dd></div><div><dt>Email opt-in</dt><dd>{contact.email_opt_in?"Sí":"No"}</dd></div><div><dt>Alta</dt><dd>{fmtDate(contact.created_at)}</dd></div></dl></article>
   <article className="opsCard"><div className="opsSectionHead"><div><span>ATRIBUCIÓN</span><h2>Origen y campaña</h2></div></div><div className="contact360Attribution"><div><span>Origen</span><b>{source?.name||sessions?.[0]?.utm_source||"Directo"}</b></div><div><span>Campaña</span><b>{campaign?.name||sessions?.[0]?.utm_campaign||"Sin campaña"}</b></div><div><span>First touch</span><b>{fmtDate(contact.first_touch_at||sessions?.at(-1)?.started_at)}</b></div><div><span>Last touch</span><b>{fmtDate(contact.last_touch_at||sessions?.[0]?.last_seen_at)}</b></div></div>{sessions?.[0]&&<div className="contact360Session"><small>Última sesión</small><p>{sessions[0].landing_page||"—"} → {sessions[0].last_page||"—"}</p><span>{sessions[0].device_type||"dispositivo desconocido"} · {sessions[0].event_count||0} eventos</span></div>}</article>
  </section>

  <section className="contact360Grid">
   <article className="opsCard"><div className="opsSectionHead"><div><span>COMPORTAMIENTO</span><h2>Viajes vistos</h2></div><b>{viewedTrips.size}</b></div><div className="contact360List">{[...viewedTrips.values()].length?[...viewedTrips.values()].map(v=><Link key={v.name} href={v.slug?`/viajes/${v.slug}`:"#"}><Eye size={16}/><span><b>{v.name}</b><small>{v.count} eventos · último {fmtDate(v.last)}</small></span><ExternalLink size={14}/></Link>):<p className="opsEmptyRow">Todavía no hay viajes identificados en su navegación.</p>}</div></article>
   <article className="opsCard"><div className="opsSectionHead"><div><span>INTERÉS</span><h2>Favoritos</h2></div><b>{favorites.length}</b></div><div className="contact360List">{favorites.length?favorites.slice(0,12).map((f:any)=><div key={f.id}><Heart size={16}/><span><b>{(Array.isArray(f.trips)?f.trips[0]:f.trips)?.name||f.page_title||"Viaje"}</b><small>{fmtDate(f.occurred_at)}</small></span></div>):<p className="opsEmptyRow">Todavía no marcó favoritos.</p>}</div></article>
  </section>

  <section className="opsCard contact360Wide"><div className="opsSectionHead"><div><span>COMUNICACIONES</span><h2>Mensajes de todos los canales</h2></div><Link href={`/crm/mensajes?contact=${id}`}>Abrir bandeja <ExternalLink size={14}/></Link></div><div className="contact360Messages">{messages?.length?messages.slice(0,20).map((m:any)=><div key={m.id}><span className={`contact360Channel ${m.channel}`}>{channelIcon(m.channel)}</span><div><b>{m.direction==="inbound"?"Entrante":"Saliente"} · {m.channel}</b><p>{m.body||m.subject||"Sin texto"}</p><small>{fmtDate(m.sent_at)} · {m.status||""}</small></div></div>):<p className="opsEmptyRow">Sin mensajes registrados.</p>}</div></section>

  <section className="contact360Grid thirds">
   <article className="opsCard"><div className="opsSectionHead"><div><span>SEGUIMIENTO</span><h2>Tareas</h2></div><ListTodo size={18}/></div><div className="contact360List">{tasks?.length?tasks.map((t:any)=><div key={t.id}><ListTodo size={15}/><span><b>{t.title}</b><small>{t.status} · {t.priority||"normal"} · {fmtDate(t.due_at)}</small></span></div>):<p className="opsEmptyRow">Sin tareas.</p>}</div></article>
   <article className="opsCard"><div className="opsSectionHead"><div><span>VENTAS</span><h2>Reservas</h2></div><CalendarDays size={18}/></div><div className="contact360List">{reservations?.length?reservations.map((r:any)=>{const d=Array.isArray(r.departures)?r.departures[0]:r.departures;const trip=d?(Array.isArray(d.trips)?d.trips[0]:d.trips):null;return <div key={r.id}><CalendarDays size={15}/><span><b>{trip?.name||"Viaje"}</b><small>{r.status} · {r.travelers} pasajera(s) · {fmtMoney(r.total_amount,r.currency)}</small></span></div>}):<p className="opsEmptyRow">Sin reservas.</p>}</div></article>
   <article className="opsCard"><div className="opsSectionHead"><div><span>FINANZAS</span><h2>Pagos</h2></div><CreditCard size={18}/></div><div className="contact360List">{allPayments.length?allPayments.map((p:any)=><div key={p.id}><CircleDollarSign size={15}/><span><b>{fmtMoney(p.amount,p.currency)}</b><small>{p.status} · {p.provider||p.payment_type||""} · {fmtDate(p.paid_at||p.due_at)}</small></span></div>):<p className="opsEmptyRow">Sin pagos.</p>}</div></article>
  </section>

  <section className="contact360Grid">
   <article className="opsCard"><div className="opsSectionHead"><div><span>DOCUMENTACIÓN</span><h2>Documentos</h2></div><FileText size={18}/></div><div className="contact360List">{docs?.length?docs.map((d:any)=><div key={d.id}><FileText size={15}/><span><b>{d.document_type}</b><small>{d.status} · vence {d.expires_on||"sin vencimiento"}</small>{d.notes&&<small>{d.notes}</small>}</span></div>):<p className="opsEmptyRow">Sin documentación cargada.</p>}</div></article>
   <article className="opsCard"><div className="opsSectionHead"><div><span>NOTAS Y TAGS</span><h2>Contexto interno</h2></div></div><div className="contact360Notes"><p>{contact.notes||"Sin notas internas."}</p><div>{(tags||[]).map((t:any)=>{const tag=Array.isArray(t.tags)?t.tags[0]:t.tags;return tag?<span key={tag.name}>{tag.name}</span>:null})}</div></div></article>
  </section>

  <section className="opsCard contact360Timeline"><div className="opsSectionHead"><div><span>HISTORIAL COMPLETO</span><h2>Timeline</h2></div><b>{timeline.length} eventos</b></div><div className="contact360TimelineList">{timeline.length?timeline.map((x:any,i)=><div key={`${x.type}-${x.at}-${i}`}><i className={x.type}/><time>{fmtDate(x.at)}</time><span><b>{x.title}</b><small>{x.body}</small></span></div>):<p className="opsEmptyRow">Sin actividad todavía.</p>}</div></section>
 </AdminShell>
}
