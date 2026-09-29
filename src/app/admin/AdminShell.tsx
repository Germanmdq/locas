"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, UsersRound, MessageSquareText, Map, CreditCard,
  ListTodo, Workflow, Settings, Search, Bell, CalendarDays, PanelLeft,
  PlaneTakeoff, Database, ChevronDown
} from "lucide-react";

type Props={children:React.ReactNode; title:string; subtitle?:string; actions?:React.ReactNode};

const items=[
  {href:"/control",label:"Dashboard",icon:LayoutDashboard},
  {href:"/crm",label:"CRM",icon:UsersRound},
  {href:"/crm/mensajes",label:"Mensajes",icon:MessageSquareText},
  {href:"/catalogo",label:"Viajes",icon:Map},
  {href:"/reservas",label:"Reservas",icon:CalendarDays},
  {href:"/pagos",label:"Pagos",icon:CreditCard},
  {href:"/tareas",label:"Tareas",icon:ListTodo},
  {href:"/automatizaciones",label:"Automatizaciones",icon:Workflow},
];

export default function AdminShell({children,title,subtitle,actions}:Props){
 const pathname=usePathname(); const router=useRouter();
 const [search,setSearch]=useState(""); const [notifs,setNotifs]=useState(false); const [profile,setProfile]=useState(false); const [mobileOpen,setMobileOpen]=useState(false);
 const today=new Intl.DateTimeFormat("es-AR",{day:"2-digit",month:"short"}).format(new Date()).replace(".","");
 return <div className={`opsApp ${mobileOpen?"mobileOpen":""}`}>
   <aside className="opsSidebar">
     <div className="opsLogo"><div className="opsLogoMark">L</div><div><b>Locas</b><span>por la aventura</span></div></div>
     <nav className="opsNav">
       <span className="opsNavGroup">Operación</span>
       {items.map(({href,label,icon:Icon})=>{
         const clean=href.split("#")[0];
         const active=pathname===clean || (clean==="/crm"&&pathname==="/crm");
         return <Link key={label} href={href} className={active?"active":""}><Icon size={18}/><span>{label}</span></Link>
       })}
       <span className="opsNavGroup secondary">Sistema</span>
       <Link href="/datos" className={pathname==="/datos"?"active":""}><Database size={18}/><span>Datos</span></Link>
       <Link href="/configuracion" className={pathname==="/configuracion"?"active":""}><Settings size={18}/><span>Configuración</span></Link>
     </nav>
     <div className="opsSidebarBottom">
       <Link href="/" className="opsSiteLink"><PlaneTakeoff size={17}/><span>Ver sitio público</span></Link>
       <div className="opsProfileWrap"><button className="opsProfile" onClick={()=>setProfile(v=>!v)}><span>GG</span><div><b>Administración</b><small>Operaciones</small></div><ChevronDown size={15}/></button>{profile&&<div className="opsPopover opsProfileMenu"><Link href="/configuracion">Configuración</Link><Link href="/">Ver sitio público</Link></div>}</div>
     </div>
   </aside>
   <section className="opsMain">
     <header className="opsTopbar">
       <button className="opsIconBtn opsMobileTrigger" onClick={()=>setMobileOpen(v=>!v)} aria-label="Abrir menú"><PanelLeft size={18}/></button>
       <form className="opsSearch" onSubmit={e=>{e.preventDefault(); if(search.trim()) router.push(`/crm?search=${encodeURIComponent(search.trim())}`)}}><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar contacto, viaje, reserva..."/><kbd>↵</kbd></form>
       <div className="opsTopActions"><div className="opsBellWrap"><button className="opsIconBtn" onClick={()=>setNotifs(v=>!v)} aria-label="Notificaciones"><Bell size={18}/></button>{notifs&&<div className="opsPopover opsNotifications"><b>Centro de actividad</b><span>Revisá mensajes pendientes</span><span>Revisá tareas y seguimientos</span><span>Revisá pagos y vencimientos</span></div>}</div><button className="opsToday" onClick={()=>router.push("/tareas")}>Hoy · {today}</button></div>
     </header>
     <main className="opsContent">
       <div className="opsPageHead"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{actions&&<div className="opsPageActions">{actions}</div>}</div>
       {children}
     </main>
   </section>
 </div>
}
