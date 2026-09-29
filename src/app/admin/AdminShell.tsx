"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, UsersRound, MessageSquareText, Map, CreditCard,
  ListTodo, Workflow, Settings, Search, Bell, CalendarDays, PanelLeft,
  PlaneTakeoff, Database, ChevronDown, Sun, Moon
} from "lucide-react";

type Props={children:React.ReactNode; title:string; subtitle?:string; actions?:React.ReactNode};

const adminDarkThemeCss = `
html body .opsApp.theme-dark{background:#0f1115!important;color:#f4f6f8!important;color-scheme:dark}
html body .opsApp.theme-dark .opsMain,html body .opsApp.theme-dark .opsContent{background:#0f1115!important}
html body .opsApp.theme-dark .opsSidebar,html body .opsApp.theme-dark .opsTopbar{background:#12151a!important;border-color:#272c34!important}
html body .opsApp.theme-dark .opsContent h1,html body .opsApp.theme-dark .opsPageHead h1{color:#f5f7fa!important;-webkit-text-fill-color:#f5f7fa!important}
html body .opsApp.theme-dark .opsPageHead p,html body .opsApp.theme-dark .opsNavGroup,html body .opsApp.theme-dark .opsMetricGrid span,html body .opsApp.theme-dark .opsMetricGrid small{color:#929bab!important}
html body .opsApp.theme-dark .opsNav a{color:#b8c0cc!important}html body .opsApp.theme-dark .opsNav a:hover{background:#1c2129!important;color:#fff!important}html body .opsApp.theme-dark .opsNav a.active{background:#eef2f6!important;color:#12151a!important}
html body .opsApp.theme-dark .opsLogo b,html body .opsApp.theme-dark .opsProfile b,html body .opsApp.theme-dark .opsSectionHead h2,html body .opsApp.theme-dark .settingsOpsCard h2{color:#f5f7fa!important}
html body .opsApp.theme-dark .opsLogo span,html body .opsApp.theme-dark .opsProfile small,html body .opsApp.theme-dark .settingsOpsCard p{color:#929bab!important}
html body .opsApp.theme-dark .opsLogoMark{background:#f4f6f8!important;color:#111318!important}html body .opsApp.theme-dark .opsSidebarBottom{border-color:#272c34!important}html body .opsApp.theme-dark .opsSiteLink{color:#b8c0cc!important}
html body .opsApp.theme-dark .opsSearch,html body .opsApp.theme-dark .opsIconBtn,html body .opsApp.theme-dark .opsToday,html body .opsApp.theme-dark .opsSecondaryBtn{background:#171b21!important;border-color:#303640!important;color:#e6eaf0!important}
html body .opsApp.theme-dark .opsSearch input{color:#e6eaf0!important}html body .opsApp.theme-dark .opsSearch input::placeholder{color:#707887!important}html body .opsApp.theme-dark .opsSearch kbd{background:#11151a!important;border-color:#303640!important;color:#9ba4b3!important}
html body .opsApp.theme-dark .opsPrimaryBtn{background:#eef2f6!important;border-color:#eef2f6!important;color:#12151a!important;-webkit-text-fill-color:#12151a!important}
html body .opsApp.theme-dark .opsCard,html body .opsApp.theme-dark .opsMetricGrid article,html body .opsApp.theme-dark .crmKpis article,html body .opsApp.theme-dark .crmPanel,html body .opsApp.theme-dark .crmListPanel,html body .opsApp.theme-dark .dataModuleCard,html body .opsApp.theme-dark .dataHealthBar>div,html body .opsApp.theme-dark .settingsOpsCard,html body .opsApp.theme-dark .cmsLiveSidebar,html body .opsApp.theme-dark .cmsLiveCard,html body .opsApp.theme-dark .cmsDayEditor{background:#171b21!important;border-color:#2b313a!important;box-shadow:none!important}
html body .opsApp.theme-dark .opsMetricGrid strong,html body .opsApp.theme-dark .opsCard b,html body .opsApp.theme-dark .opsCard h2,html body .opsApp.theme-dark .opsCard h3,html body .opsApp.theme-dark .taskOpsRow b,html body .opsApp.theme-dark .taskOpsRow span{color:#f4f6f8!important}
html body .opsApp.theme-dark .opsDataTable>div,html body .opsApp.theme-dark .dataTable>div,html body .opsApp.theme-dark .taskOpsRow,html body .opsApp.theme-dark .opsThreadList>button,html body .opsApp.theme-dark .crmLeadRow{background:#171b21!important;border-color:#2b313a!important;color:#dce1e8!important}
html body .opsApp.theme-dark .opsDataTable>div.head,html body .opsApp.theme-dark .dataTable>div.head,html body .opsApp.theme-dark .taskOpsHeader,html body .opsApp.theme-dark .crmTableHead{background:#11151a!important;border-color:#2b313a!important;color:#8f98a7!important}
html body .opsApp.theme-dark .opsStatusBadge,html body .opsApp.theme-dark .crmStage,html body .opsApp.theme-dark .crmSource{background:#242a32!important;color:#cdd4de!important}
html body .opsApp.theme-dark .opsPopover{background:#1a1f26!important;border-color:#303640!important;color:#eef2f6!important;box-shadow:0 16px 36px rgba(0,0,0,.35)!important}
html body .opsApp.theme-dark .opsDashChannels>div,html body .opsApp.theme-dark .opsChannelGrid button{background:#171b21!important;border-color:#2b313a!important;color:#eef2f6!important}
html body .opsApp.theme-dark .inboxOpsCard,html body .opsApp.theme-dark .opsThreadList,html body .opsApp.theme-dark .opsConversation,html body .opsApp.theme-dark .opsConversationContext{background:#14181e!important;border-color:#2b313a!important}
html body .opsApp.theme-dark .opsConversation>header,html body .opsApp.theme-dark .opsConversation>footer{background:#171b21!important;border-color:#2b313a!important}html body .opsApp.theme-dark .opsMessageStream{background:#11151a!important}
html body .opsApp.theme-dark .opsMessageStream article.inbound{background:#1d222a!important;border-color:#2d343e!important;color:#eef2f6!important}html body .opsApp.theme-dark .opsMessageStream article.outbound{background:#e9edf2!important;color:#12151a!important}
html body .opsApp.theme-dark .opsReplyBox,html body .opsApp.theme-dark .opsReplyBox textarea,html body .opsApp.theme-dark .opsAttach{background:#11151a!important;border-color:#303640!important;color:#e2e7ee!important}
html body .opsApp.theme-dark .cmsLiveSideTop input,html body .opsApp.theme-dark .cmsLiveCard input,html body .opsApp.theme-dark .cmsLiveCard textarea,html body .opsApp.theme-dark .cmsLiveCard select,html body .opsApp.theme-dark .cmsDayFields input,html body .opsApp.theme-dark .cmsDayFields textarea,html body .opsApp.theme-dark .taskDrawer input,html body .opsApp.theme-dark .taskDrawer select,html body .opsApp.theme-dark .opsDrawerForm input{background:#11151a!important;border-color:#303640!important;color:#eef2f6!important}
html body .opsApp.theme-dark .crmTrackingStrip article{background:#090c10!important;border-color:#2a3038!important}html body .opsApp.theme-dark .crmSearch{background:#171b21!important;border-color:#303640!important}html body .opsApp.theme-dark .crmSearch input{color:#eef2f6!important}
html body .opsApp.theme-dark .crmDetail{background:#090c10!important;border:1px solid #2b313a!important}html body .opsApp.theme-dark .crmDetailGrid>div{background:#171b21!important}html body .opsApp.theme-dark .crmNext{background:#f4f6f8!important;color:#12151a!important}html body .opsApp.theme-dark .crmNext h3,html body .opsApp.theme-dark .crmNext span{color:#12151a!important}
html body .opsApp.theme-dark .opsDrawer,html body .opsApp.theme-dark .taskDrawer{background:#171b21!important;color:#eef2f6!important}
html body .opsApp.theme-dark .opsSecondaryBtn,html body .opsApp.theme-dark a.opsSecondaryBtn{color:#e6eaf0!important;-webkit-text-fill-color:#e6eaf0!important}
html body .opsApp.theme-dark .crmEventList span,html body .opsApp.theme-dark .crmEventList b,html body .opsApp.theme-dark .crmPanelHead b,html body .opsApp.theme-dark .crmChannels b,html body .opsApp.theme-dark .crmChannels strong,html body .opsApp.theme-dark .crmChannels small{color:#eef2f6!important}
html body .opsApp.theme-dark .crmEventList>div{border-color:#2b313a!important}
html body .opsApp.theme-dark .crmFunnel>div{background:#11151a!important;color:#eef2f6!important;border:1px solid #303640!important}
html body .opsApp.theme-dark .crmFunnel>div span,html body .opsApp.theme-dark .crmFunnel>div b{color:#eef2f6!important}
html body .opsApp.theme-dark .crmChannels>div>div>i{background:#7c6cff!important}
`;

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
 const [theme,setTheme]=useState<"light"|"dark">("light");
 useEffect(()=>{ const saved=window.localStorage.getItem("locas-admin-theme"); if(saved==="dark"||saved==="light") setTheme(saved); },[]);
 const toggleTheme=()=>setTheme(current=>{ const next=current==="dark"?"light":"dark"; window.localStorage.setItem("locas-admin-theme",next); return next; });
 const today=new Intl.DateTimeFormat("es-AR",{day:"2-digit",month:"short"}).format(new Date()).replace(".","");
 return <><style>{adminDarkThemeCss}</style><div className={`opsApp theme-${theme} ${mobileOpen?"mobileOpen":""}`} data-theme={theme}>
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
       <div className="opsTopActions"><button className="opsIconBtn opsThemeToggle" onClick={toggleTheme} aria-label={theme==="dark"?"Cambiar a tema claro":"Cambiar a tema oscuro"} title={theme==="dark"?"Tema claro":"Tema oscuro"}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button><div className="opsBellWrap"><button className="opsIconBtn" onClick={()=>setNotifs(v=>!v)} aria-label="Notificaciones"><Bell size={18}/></button>{notifs&&<div className="opsPopover opsNotifications"><b>Centro de actividad</b><span>Revisá mensajes pendientes</span><span>Revisá tareas y seguimientos</span><span>Revisá pagos y vencimientos</span></div>}</div><button className="opsToday" onClick={()=>router.push("/tareas")}>Hoy · {today}</button></div>
     </header>
     <main className="opsContent">
       <div className="opsPageHead"><div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{actions&&<div className="opsPageActions">{actions}</div>}</div>
       {children}
     </main>
   </section>
 </div></>
}
