"use client";

import Link from "next/link";
import { useMemo,useRef,useState } from "react";
import { Mail, Clock3, CheckCircle2, Search, SlidersHorizontal, UserPlus, MoreHorizontal, Send, Paperclip, CircleAlert } from "lucide-react";
import { IconBrandWhatsapp, IconBrandInstagram, IconBrandMessenger } from "@tabler/icons-react";
import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";

type Thread={id:string;contact_id:string|null;channel:string;subject:string|null;status:string;unread_count:number;last_message_at:string;contact_name:string|null;email:string|null;phone:string|null;last_message:string|null;intent:string|null;sentiment:string|null;assigned_to?:string|null};
type Message={id:string;conversation_id:string;channel:string;direction:string;sender_name:string|null;body:string|null;subject:string|null;status:string|null;sent_at:string;message_type:string};
type Owner={id:string;name:string};
type ChannelKey="whatsapp"|"instagram"|"messenger"|"email";
const channelLabel:Record<string,string>={whatsapp:"WhatsApp",instagram:"Instagram",messenger:"Messenger",email:"Email"};
const channelIcon=(channel:string,size=20)=>{
  if(channel==="whatsapp") return <IconBrandWhatsapp size={size}/>;
  if(channel==="instagram") return <IconBrandInstagram size={size}/>;
  if(channel==="messenger") return <IconBrandMessenger size={size}/>;
  return <Mail size={size}/>;
};

export default function InboxClient({threads:initialThreads,messages:initialMessages,owners}:{threads:Thread[];messages:Message[];owners:Owner[]}){
 const supabase=createSupabaseClient();
 const [threads,setThreads]=useState(initialThreads),[messages,setMessages]=useState(initialMessages);
 const [channel,setChannel]=useState("Todos"),[query,setQuery]=useState(""),[selected,setSelected]=useState(initialThreads[0]?.id||"");
 const [reply,setReply]=useState(""),[notice,setNotice]=useState(""),[assignOpen,setAssignOpen]=useState(false),[moreOpen,setMoreOpen]=useState(false),[attachment,setAttachment]=useState<File|null>(null);
 const fileRef=useRef<HTMLInputElement>(null);
 const list=useMemo(()=>threads.filter(t=>(channel==="Todos"||t.channel===channel)&&(`${t.contact_name||""} ${t.last_message||""} ${t.subject||""}`.toLowerCase().includes(query.toLowerCase()))),[threads,channel,query]);
 const current=threads.find(t=>t.id===selected)||list[0];
 const conversation=current?messages.filter(m=>m.conversation_id===current.id):[];
 const counts=threads.reduce((a,t)=>{a[t.channel]=(a[t.channel]||0)+1;return a},{} as Record<string,number>);
 const unreadByChannel=threads.reduce((a,t)=>{a[t.channel]=(a[t.channel]||0)+Number(t.unread_count||0);return a},{} as Record<string,number>);
 const unread=threads.reduce((a,t)=>a+Number(t.unread_count||0),0);
 const open=threads.filter(t=>t.status==="open").length;
 const classified=threads.filter(t=>Boolean(t.intent)).length;
 const responseDue=threads.filter(t=>t.status==="open"&&t.unread_count>0).length;
 const channels:[ChannelKey,string][]=[["whatsapp","WhatsApp"],["instagram","Instagram"],["messenger","Messenger"],["email","Email"]];

 async function chooseThread(id:string){setSelected(id);const t=threads.find(x=>x.id===id);if(t&&t.unread_count>0){await supabase.from("conversations").update({unread_count:0,updated_at:new Date().toISOString()}).eq("id",id);setThreads(v=>v.map(x=>x.id===id?{...x,unread_count:0}:x));}}
 async function sendReply(){if(!current||(!reply.trim()&&!attachment))return;setNotice("Enviando...");const now=new Date().toISOString();const body=reply.trim()||(attachment?`Adjunto: ${attachment.name}`:"");const {data,error}=await supabase.from("messages").insert({conversation_id:current.id,contact_id:current.contact_id,channel:current.channel,direction:"outbound",sender_name:"Administración",message_type:attachment?"file":"text",body,status:"queued",sent_at:now,metadata:attachment?{filename:attachment.name,size:attachment.size,type:attachment.type}:{} }).select("id,conversation_id,channel,direction,sender_name,body,subject,status,sent_at,message_type").single();if(error){setNotice(error.message);return;}await supabase.from("conversations").update({last_message_at:now,last_outbound_at:now,updated_at:now,status:"open"}).eq("id",current.id);setMessages(v=>[...v,data as Message]);setThreads(v=>v.map(x=>x.id===current.id?{...x,last_message:body,last_message_at:now,status:"open"}:x));setReply("");setAttachment(null);setNotice("Mensaje encolado. Se enviará por el canal conectado.");}
 async function createTask(){if(!current)return;const due=new Date(Date.now()+24*60*60*1000).toISOString();const {error}=await supabase.from("tasks").insert({contact_id:current.contact_id,title:`Responder ${channelLabel[current.channel]||current.channel}: ${current.contact_name||"contacto"}`,task_type:"follow_up",due_at:due,priority:"high",status:"open"});setNotice(error?error.message:"Tarea creada para mañana.");}
 async function assign(owner:Owner){if(!current)return;const {error}=await supabase.from("conversations").update({assigned_to:owner.id,updated_at:new Date().toISOString()}).eq("id",current.id);if(!error){setThreads(v=>v.map(x=>x.id===current.id?{...x,assigned_to:owner.id}:x));setNotice(`Conversación asignada a ${owner.name}.`);setAssignOpen(false)}else setNotice(error.message)}
 async function closeConversation(){if(!current)return;const {error}=await supabase.from("conversations").update({status:"closed",updated_at:new Date().toISOString()}).eq("id",current.id);if(!error){setThreads(v=>v.map(x=>x.id===current.id?{...x,status:"closed"}:x));setNotice("Conversación cerrada.");setMoreOpen(false)}else setNotice(error.message)}

 return <AdminShell title="Centro de mensajes" subtitle="Operación diaria de WhatsApp, Instagram, Messenger y email desde una sola bandeja." actions={<><Link className="opsSecondaryBtn" href="/automatizaciones"><SlidersHorizontal size={16}/> Reglas</Link><div className="opsActionWrap"><button className="opsPrimaryBtn" onClick={()=>setAssignOpen(v=>!v)}><UserPlus size={16}/> Asignar</button>{assignOpen&&<div className="opsPopover opsAssignMenu">{owners.map(o=><button key={o.id} onClick={()=>assign(o)}>{o.name}</button>)}</div>}</div></>}>
   {notice&&<div className="opsNotice" onClick={()=>setNotice("")}>{notice}</div>}
   <section className="opsMetricGrid inboxOpsMetrics">
     <article><div className="opsMetricIcon"><Mail size={19}/></div><div><span>Sin leer</span><strong>{unread}</strong><small>{open} conversaciones abiertas</small></div></article>
     <article><div className="opsMetricIcon warn"><Clock3 size={19}/></div><div><span>Requieren respuesta</span><strong>{responseDue}</strong><small>prioridad operativa</small></div></article>
     <article><div className="opsMetricIcon good"><CheckCircle2 size={19}/></div><div><span>Clasificadas</span><strong>{classified}</strong><small>con intención detectada</small></div></article>
     <article><div className="opsMetricIcon"><CircleAlert size={19}/></div><div><span>Conversaciones</span><strong>{threads.length}</strong><small>todos los canales</small></div></article>
   </section>

   <section className="opsChannelGrid">
     {channels.map(([key,label])=><button key={key} onClick={()=>setChannel(key)} className={channel===key?`active ${key}`:key}>
       <span className="opsChannelIcon">{channelIcon(key,22)}</span><span><b>{label}</b><small>{counts[key]||0} conversaciones</small></span><strong>{unreadByChannel[key]||0}</strong>
     </button>)}
   </section>

   <section className="opsCard inboxOpsCard">
     <div className="opsCardToolbar">
       <div className="opsInlineSearch"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contacto, asunto o mensaje..."/></div>
       <div className="opsFilterTabs">{["Todos","whatsapp","instagram","messenger","email"].map(c=><button key={c} onClick={()=>setChannel(c)} className={channel===c?"active":""}>{c==="Todos"?"Todos":channelLabel[c]}</button>)}</div>
     </div>
     <div className="opsInboxGrid">
       <aside className="opsThreadList">
         <div className="opsListHead"><b>Bandeja</b><span>{list.length} conversaciones</span></div>
         {list.map(t=><button key={t.id} className={selected===t.id?"selected":""} onClick={()=>chooseThread(t.id)}>
           <span className={`opsThreadIcon ${t.channel}`}>{channelIcon(t.channel,18)}</span>
           <div className="opsThreadCopy"><div><b>{t.contact_name||"Contacto sin identificar"}</b><time>{new Date(t.last_message_at).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}</time></div><p>{t.last_message||t.subject||"Sin mensaje"}</p><div className="opsThreadMeta"><span>{channelLabel[t.channel]||t.channel}</span>{t.intent&&<em>{t.intent}</em>}</div></div>
           {t.unread_count>0&&<i>{t.unread_count}</i>}
         </button>)}
       </aside>

       <section className="opsConversation">
         {current?<>
           <header><div className={`opsCurrentChannel ${current.channel}`}>{channelIcon(current.channel,19)}</div><div className="opsConversationPerson"><h2>{current.contact_name||"Contacto"}</h2><p>{channelLabel[current.channel]||current.channel} · {current.email||current.phone||"Sin dato de contacto"}</p></div><div className="opsConversationActions"><Link href={`/crm?contact=${current.contact_id||""}`}>Abrir CRM</Link><div className="opsMoreWrap"><button onClick={()=>setMoreOpen(v=>!v)}><MoreHorizontal size={18}/></button>{moreOpen&&<div className="opsPopover opsMoreMenu"><button onClick={closeConversation}>Cerrar conversación</button><button onClick={createTask}>Crear seguimiento</button></div>}</div></div></header>
           <div className="opsMessageStream">{conversation.length?conversation.map(m=><article key={m.id} className={m.direction==="outbound"?"outbound":"inbound"}><span>{m.sender_name||channelLabel[m.channel]||m.channel}</span>{m.subject&&<b>{m.subject}</b>}<p>{m.body}</p><small>{new Date(m.sent_at).toLocaleString("es-AR")} · {m.status||""}</small></article>):<div className="opsNoMessages">No hay mensajes cargados en este hilo.</div>}</div>
           <footer><input ref={fileRef} type="file" hidden onChange={e=>setAttachment(e.target.files?.[0]||null)}/><button className="opsAttach" onClick={()=>fileRef.current?.click()} title="Adjuntar archivo"><Paperclip size={18}/></button><div className="opsReplyBox">{attachment&&<small>Adjunto: {attachment.name}</small>}<textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder={`Responder por ${channelLabel[current.channel]||current.channel}...`}/></div><button className="opsSend" onClick={sendReply}><Send size={17}/> Enviar</button></footer>
         </>:<div className="opsNoMessages">Seleccioná una conversación.</div>}
       </section>

       <aside className="opsConversationContext">
         {current&&<>
           <div className="opsContextTitle"><span>CONTEXTO OPERATIVO</span><h3>{current.contact_name}</h3></div>
           <dl><div><dt>Canal</dt><dd>{channelLabel[current.channel]||current.channel}</dd></div><div><dt>Estado</dt><dd><span className="opsStatusDot"/> {current.status}</dd></div><div><dt>Intención</dt><dd>{current.intent||"Pendiente"}</dd></div><div><dt>Sentimiento</dt><dd>{current.sentiment||"Sin clasificar"}</dd></div><div><dt>Sin leer</dt><dd>{current.unread_count}</dd></div></dl>
           <div className="opsContextActions"><button onClick={createTask}>Crear tarea</button><button className="secondary" onClick={()=>setAssignOpen(v=>!v)}>Asignar responsable</button></div>
         </>}
       </aside>
     </div>
   </section>
 </AdminShell>
}
