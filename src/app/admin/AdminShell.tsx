"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, UsersRound, MessageSquareText, Map, CreditCard,
  ListTodo, Workflow, Settings, Search, Bell, CalendarDays, PanelLeft,
  PlaneTakeoff, Database, ChevronDown
} from "lucide-react";

type Props={children:React.ReactNode; title:string; subtitle?:string; actions?:React.ReactNode};

const items=[
  {href:"/control",label:"Dashboard",icon:LayoutDashboard},
  {href:"/crm",label:"CRM",icon:UsersRound},
  {href:"/crm/mensajes",label:"Mensajes",icon:MessageSquareText,badge:"5"},
  {href:"/catalogo",label:"Viajes",icon:Map},
  {href:"/control#reservas",label:"Reservas",icon:CalendarDays},
  {href:"/control#pagos",label:"Pagos",icon:CreditCard},
  {href:"/control#tareas",label:"Tareas",icon:ListTodo,badge:"12"},
  {href:"/control#automatizaciones",label:"Automatizaciones",icon:Workflow},
];

export default function AdminShell({children,title,subtitle,actions}:Props){
 const pathname=usePathname();
 return <div className="opsApp">
   <aside className="opsSidebar">
     <div className="opsLogo"><div className="opsLogoMark">L</div><div><b>Locas</b><span>por la aventura</span></div></div>
     <nav className="opsNav">
       <span className="opsNavGroup">Operación</span>
       {items.map(({href,label,icon:Icon,badge})=>{
         const clean=href.split("#")[0];
         const active=pathname===clean || (clean==="/crm"&&pathname==="/crm");
         return <Link key={label} href={href} className={active?"active":""}><Icon size={18}/><span>{label}</span>{badge&&<em>{badge}</em>}</Link>
       })}
       <span className="opsNavGroup secondary">Sistema</span>
       <Link href="/control#datos"><Database size={18}/><span>Datos</span></Link>
       <Link href="/control#configuracion"><Settings size={18}/><span>Configuración</span></Link>
     </nav>
     <div className="opsSidebarBottom">
       <Link href="/" className="opsSiteLink"><PlaneTakeoff size={17}/><span>Ver sitio público</span></Link>
       <button className="opsProfile"><span>GG</span><div><b>Administración</b><small>Operaciones</small></div><ChevronDown size={15}/></button>
     </div>
   </aside>
   <section className="opsMain">
     <header className="opsTopbar">
       <button className="opsIconBtn opsMobileTrigger"><PanelLeft size={18}/></button>
       <div className="opsSearch"><Search size={17}/><input placeholder="Buscar contacto, viaje, reserva..."/><kbd>⌘ K</kbd></div>
       <div className="opsTopActions"><button className="opsIconBtn"><Bell size={18}/><i/></button><button className="opsToday">Hoy · 28 sep</button></div>
     </header>
     <main className="opsContent">
       <div className="opsPageHead"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{actions&&<div className="opsPageActions">{actions}</div>}</div>
       {children}
     </main>
   </section>
 </div>
}
