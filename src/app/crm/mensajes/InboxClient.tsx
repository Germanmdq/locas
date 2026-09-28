"use client";

import Link from "next/link";
import { useMemo,useState } from "react";
import { Mail, Clock3, CheckCircle2, Search, SlidersHorizontal, UserPlus, MoreHorizontal, Send, Paperclip, CircleAlert } from "lucide-react";
import { IconBrandWhatsapp, IconBrandInstagram, IconBrandMessenger, IconBrandTelegram } from "@tabler/icons-react";
import AdminShell from "@/app/admin/AdminShell";

type Thread={id:string;contact_id:string|null;channel:string;subject:string|null;status:string;unread_count:number;last_message_at:string;contact_name:string|null;email:string|null;phone:string|null;last_message:string|null;intent:string|null;sentiment:string|null};
type Message={id:string;conversation_id:string;channel:string;direction:string;sender_name:string|null;body:string|null;subject:string|null;status:string|null;sent_at:string;message_type:string};

type ChannelKey="whatsapp"|"instagram"|"messenger"|"telegram"|"email";
const channelLabel:Record<string,string>={whatsapp:"WhatsApp",instagram:"Instagram",messenger:"Messenger",telegram:"Telegram",email:"Email"};
const channelIcon=(channel:string,size=20)=>{
  if(channel==="whatsapp") return <IconBrandWhatsapp size={size}/>;
  if(channel==="instagram") return <IconBrandInstagram size={size}/>;
  if(channel==="messenger") return <IconBrandMessenger size={size}/>;
  if(channel==="telegram") return <IconBrandTelegram size={size}/>;
  return <Mail size={size}/>;
};

export default function InboxClient({threads,messages}:{threads:Thread[];messages:Message[]}){
 const [channel,setChannel]=useState("Todos"),[query,setQuery]=useState(""),[selected,setSelected]=useState(threads[0]?.id||"");
 const list=useMemo(()=>threads.filter(t=>(channel==="Todos"||t.channel===channel)&&(`${t.contact_name||""} ${t.last_message||""} ${t.subject||""}`.toLowerCase().includes(query.toLowerCase()))),[threads,channel,query]);
 const current=threads.find(t=>t.id===selected)||list[0];
 const conversation=current?messages.filter(m=>m.conversation_id===current.id):[];
 const counts=threads.reduce((a,t)=>{a[t.channel]=(a[t.channel]||0)+1;return a},{} as Record<string,number>);
 const unreadByChannel=threads.reduce((a,t)=>{a[t.channel]=(a[t.channel]||0)+Number(t.unread_count||0);return a},{} as Record<string,number>);
 const unread=threads.reduce((a,t)=>a+Number(t.unread_count||0),0);
 const open=threads.filter(t=>t.status==="open").length;
 const classified=threads.filter(t=>Boolean(t.intent)).length;
 const responseDue=threads.filter(t=>t.status==="open"&&t.unread_count>0).length;
 const channels:[ChannelKey,string][]=[["whatsapp","WhatsApp"],["instagram","Instagram"],["messenger","Messenger"],["telegram","Telegram"],["email","Email"]];
 return <AdminShell title="Centro de mensajes" subtitle="Operación diaria de WhatsApp, Instagram, Messenger, Telegram y email desde una sola bandeja." actions={<><button className="opsSecondaryBtn"><SlidersHorizontal size={16}/> Reglas</button><button className="opsPrimaryBtn"><UserPlus size={16}/> Asignar</button></>}>
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
       <div className="opsFilterTabs">{["Todos","whatsapp","instagram","messenger","telegram","email"].map(c=><button key={c} onClick={()=>setChannel(c)} className={channel===c?"active":""}>{c==="Todos"?"Todos":channelLabel[c]}</button>)}</div>
     </div>
     <div className="opsInboxGrid">
       <aside className="opsThreadList">
         <div className="opsListHead"><b>Bandeja</b><span>{list.length} conversaciones</span></div>
         {list.map(t=><button key={t.id} className={selected===t.id?"selected":""} onClick={()=>setSelected(t.id)}>
           <span className={`opsThreadIcon ${t.channel}`}>{channelIcon(t.channel,18)}</span>
           <div className="opsThreadCopy"><div><b>{t.contact_name||"Contacto sin identificar"}</b><time>{new Date(t.last_message_at).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}</time></div><p>{t.last_message||t.subject||"Sin mensaje"}</p><div className="opsThreadMeta"><span>{channelLabel[t.channel]||t.channel}</span>{t.intent&&<em>{t.intent}</em>}</div></div>
           {t.unread_count>0&&<i>{t.unread_count}</i>}
         </button>)}
       </aside>

       <section className="opsConversation">
         {current?<>
           <header><div className={`opsCurrentChannel ${current.channel}`}>{channelIcon(current.channel,19)}</div><div className="opsConversationPerson"><h2>{current.contact_name||"Contacto"}</h2><p>{channelLabel[current.channel]||current.channel} · {current.email||current.phone||"Sin dato de contacto"}</p></div><div className="opsConversationActions"><Link href={`/crm?contact=${current.contact_id||""}`}>Abrir CRM</Link><button><MoreHorizontal size={18}/></button></div></header>
           <div className="opsMessageStream">{conversation.length?conversation.map(m=><article key={m.id} className={m.direction==="outbound"?"outbound":"inbound"}><span>{m.sender_name||channelLabel[m.channel]||m.channel}</span>{m.subject&&<b>{m.subject}</b>}<p>{m.body}</p><small>{new Date(m.sent_at).toLocaleString("es-AR")}</small></article>):<div className="opsNoMessages">No hay mensajes cargados en este hilo.</div>}</div>
           <footer><button className="opsAttach"><Paperclip size={18}/></button><textarea placeholder={`Responder por ${channelLabel[current.channel]||current.channel}...`}/><button className="opsSend"><Send size={17}/> Enviar</button></footer>
         </>:<div className="opsNoMessages">Seleccioná una conversación.</div>}
       </section>

       <aside className="opsConversationContext">
         {current&&<>
           <div className="opsContextTitle"><span>CONTEXTO OPERATIVO</span><h3>{current.contact_name}</h3></div>
           <dl><div><dt>Canal</dt><dd>{channelLabel[current.channel]||current.channel}</dd></div><div><dt>Estado</dt><dd><span className="opsStatusDot"/> {current.status}</dd></div><div><dt>Intención</dt><dd>{current.intent||"Pendiente"}</dd></div><div><dt>Sentimiento</dt><dd>{current.sentiment||"Sin clasificar"}</dd></div><div><dt>Sin leer</dt><dd>{current.unread_count}</dd></div></dl>
           <div className="opsContextActions"><button>Crear tarea</button><button className="secondary">Asignar responsable</button></div>
         </>}
       </aside>
     </div>
   </section>
 </AdminShell>
}
