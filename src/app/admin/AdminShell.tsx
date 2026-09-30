"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Bell, Menu, Moon, Sun} from "lucide-react";
import {AppShell} from "@astryxdesign/core/AppShell";
import {SideNav, SideNavHeading, SideNavItem, SideNavSection} from "@astryxdesign/core/SideNav";
import {TopNav} from "@astryxdesign/core/TopNav";
import {TextInput} from "@astryxdesign/core/TextInput";
import {Button} from "@astryxdesign/core/Button";
import {IconButton} from "@astryxdesign/core/IconButton";
import {Heading} from "@astryxdesign/core/Heading";
import {Theme} from "@astryxdesign/core/theme";
import {neutralTheme} from "@astryxdesign/theme-neutral/built";

type Props={children:React.ReactNode; title:string; subtitle?:string; actions?:React.ReactNode};

type NavItem={href:string;label:string};
const operation:NavItem[]=[
  {href:"/control",label:"Dashboard"},
  {href:"/crm",label:"CRM"},
  {href:"/crm/pipeline",label:"Pipeline"},
  {href:"/crm/mensajes",label:"Mensajes"},
  {href:"/catalogo",label:"Viajes"},
  {href:"/reservas",label:"Reservas"},
  {href:"/pagos",label:"Pagos"},
  {href:"/tareas",label:"Tareas"},
  {href:"/automatizaciones",label:"Automatizaciones"},
];
const system:NavItem[]=[
  {href:"/datos",label:"Datos"},
  {href:"/configuracion",label:"Configuración"},
];

export default function AdminShell({children,title,subtitle,actions}:Props){
  const pathname=usePathname();
  const router=useRouter();
  const [search,setSearch]=useState("");
  const [theme,setTheme]=useState<"light"|"dark">("light");
  const [mobileOpen,setMobileOpen]=useState(false);
  useEffect(()=>{const saved=window.localStorage.getItem("locas-admin-theme");if(saved==="dark"||saved==="light")setTheme(saved)},[]);
  const toggleTheme=()=>setTheme(current=>{const next=current==="dark"?"light":"dark";window.localStorage.setItem("locas-admin-theme",next);return next});
  const isSelected=(href:string)=>pathname===href;
  const submitSearch=()=>{if(search.trim())router.push(`/crm?search=${encodeURIComponent(search.trim())}`)};

  const sideNav=(
    <SideNav
      header={<SideNavHeading heading="Locas" subheading="por la aventura" headingHref="/control" icon={<span className="astryxBrandMark">L</span>}/>} 
      collapsible={{defaultIsCollapsed:false,buttonLabel:"Contraer navegación"}}
      resizable={{defaultWidth:244,minWidth:208,maxWidth:320,autoSaveId:"locas-admin-nav"}}
      footer={<div className="astryxSideFooter"><Button label="Ver sitio público" variant="ghost" size="sm" href="/" as={Link}/><div className="astryxAdminIdentity"><span>GG</span><div><b>Administración</b><small>Operaciones</small></div></div></div>}
    >
      <SideNavSection title="Operación">
        {operation.map(item=><SideNavItem key={item.href} label={item.label} href={item.href} as={Link} isSelected={isSelected(item.href)}/>) }
      </SideNavSection>
      <SideNavSection title="Sistema">
        {system.map(item=><SideNavItem key={item.href} label={item.label} href={item.href} as={Link} isSelected={isSelected(item.href)}/>) }
      </SideNavSection>
    </SideNav>
  );

  const topNav=(
    <TopNav
      label="Barra superior"
      heading={<div className="astryxTopBrand">Locas</div>}
      centerContent={<div className="astryxGlobalSearch"><TextInput label="Buscar" isLabelHidden value={search} onChange={value=>setSearch(value)} onEnter={submitSearch} placeholder="Buscar contacto, viaje o reserva..." hasClear width="100%"/></div>}
      endContent={<div className="astryxTopActions"><span className="astryxMobileMenu"><IconButton label="Abrir navegación" tooltip="Menú" variant="ghost" icon={<Menu size={18}/>} onClick={()=>setMobileOpen(true)}/></span><IconButton label={theme==="dark"?"Cambiar a tema claro":"Cambiar a tema oscuro"} tooltip={theme==="dark"?"Tema claro":"Tema oscuro"} variant="ghost" icon={theme==="dark"?<Sun size={18}/>:<Moon size={18}/>} onClick={toggleTheme}/><IconButton label="Notificaciones" tooltip="Notificaciones" variant="ghost" icon={<Bell size={18}/>}/></div>}
    />
  );

  return <Theme theme={neutralTheme} mode={theme}>
    <div className={`astryxAdmin theme-${theme}`} data-theme={theme}>
      <AppShell sideNav={sideNav} topNav={topNav} mobileNav={{breakpoint:"lg",hasToggle:false,isOpen:mobileOpen,onOpenChange:setMobileOpen,content:sideNav}} variant="section" height="fill" contentPadding={0}>
        <div className="astryxAdminContent">
          <div className="astryxPageHeader">
            <div><Heading level={1}>{title}</Heading>{subtitle&&<p>{subtitle}</p>}</div>
            {actions&&<div className="astryxPageActions">{actions}</div>}
          </div>
          {children}
        </div>
      </AppShell>
    </div>
  </Theme>;
}
