import AdminShell from "@/app/admin/AdminShell";
import { MessageSquareText, UsersRound, Tags, BadgeDollarSign, Workflow, ShieldCheck } from "lucide-react";

const groups=[
 {icon:MessageSquareText,title:"Canales",desc:"WhatsApp, Instagram, Messenger y email conectados al centro de mensajes."},
 {icon:UsersRound,title:"Responsables",desc:"Equipo comercial y operativo disponible para asignación de contactos, conversaciones y tareas."},
 {icon:Tags,title:"Etapas y etiquetas",desc:"Pipeline, estados comerciales y clasificación de contactos y oportunidades."},
 {icon:BadgeDollarSign,title:"Monedas y cobros",desc:"ARS, USD y reglas de seguimiento de señas, cuotas, saldos y vencimientos."},
 {icon:Workflow,title:"Automatizaciones",desc:"Disparadores, condiciones y acciones vinculadas al ciclo comercial y operativo."},
 {icon:ShieldCheck,title:"Permisos",desc:"Base preparada para separar administración, ventas, coordinación, finanzas y lectura."},
];
export default function Page(){return <AdminShell title="Configuración" subtitle="Parámetros operativos del CRM, canales, equipo y reglas."><section className="settingsOpsGrid">{groups.map(({icon:Icon,title,desc})=><article className="opsCard settingsOpsCard" key={title}><span><Icon size={18}/></span><div><h2>{title}</h2><p>{desc}</p></div></article>)}</section></AdminShell>}
