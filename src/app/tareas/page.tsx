import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";
import TasksClient from "./TasksClient";

export const dynamic = "force-dynamic";

export default async function Page(){
  const s = createSupabaseClient();
  const [{data:tasks},{data:contacts},{data:owners},{data:opps},{data:trips}] = await Promise.all([
    s.from("tasks").select("id,title,due_at,priority,status,task_type,contact_id,owner_id,opportunity_id").order("due_at",{ascending:true}),
    s.from("contacts").select("id,first_name,last_name").order("first_name",{ascending:true}),
    s.from("crm_users").select("id,name").eq("active",true).order("name",{ascending:true}),
    s.from("opportunities").select("id,trip_id"),
    s.from("trips").select("id,name")
  ]);

  const contactMap = new Map((contacts||[]).map((c:any)=>[c.id, `${c.first_name||""} ${c.last_name||""}`.trim() || "Sin nombre"]));
  const ownerMap = new Map((owners||[]).map((o:any)=>[o.id, o.name]));
  const oppMap = new Map((opps||[]).map((o:any)=>[o.id, o.trip_id]));
  const tripMap = new Map((trips||[]).map((t:any)=>[t.id, t.name]));

  const rows=(tasks||[]).map((t:any)=>({
    id:t.id,
    title:t.title,
    due_at:t.due_at,
    priority:t.priority,
    status:t.status,
    task_type:t.task_type,
    contact_id:t.contact_id,
    owner_id:t.owner_id,
    opportunity_id:t.opportunity_id,
    contact_name:t.contact_id ? (contactMap.get(t.contact_id) || "Sin contacto") : "Sin contacto",
    owner_name:t.owner_id ? (ownerMap.get(t.owner_id) || "Sin asignar") : "Sin asignar",
    trip_name:t.opportunity_id ? (tripMap.get(oppMap.get(t.opportunity_id)) || "—") : "—"
  }));

  const contactOptions=(contacts||[]).map((c:any)=>({id:c.id,name:`${c.first_name||""} ${c.last_name||""}`.trim()||"Sin nombre"}));
  const ownerOptions=(owners||[]).map((o:any)=>({id:o.id,name:o.name}));

  return <AdminShell title="Tareas" subtitle="Seguimientos, vencimientos y próximas acciones del equipo.">
    <TasksClient initial={rows} contacts={contactOptions} owners={ownerOptions}/>
  </AdminShell>;
}
