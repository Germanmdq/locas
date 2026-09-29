import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";
import PipelineClient, { type PipelineOpportunity } from "./PipelineClient";

export const dynamic = "force-dynamic";

export default async function PipelinePage(){
  const supabase=createSupabaseClient();
  const {data}=await supabase
    .from("opportunities")
    .select("id,contact_id,trip_id,stage,temperature,value,currency,next_action,next_action_at,created_at,contacts(first_name,last_name,email,phone,lead_score),trips(name)")
    .order("created_at",{ascending:false});

  const opportunities:PipelineOpportunity[]=(data||[]).map((row:any)=>{
    const contact=Array.isArray(row.contacts)?row.contacts[0]:row.contacts;
    const trip=Array.isArray(row.trips)?row.trips[0]:row.trips;
    return {
      id:row.id,
      contactId:row.contact_id,
      name:`${contact?.first_name||""} ${contact?.last_name||""}`.trim()||"Sin nombre",
      email:contact?.email||"",
      phone:contact?.phone||"",
      score:Number(contact?.lead_score||0),
      trip:trip?.name||"Interés general",
      stage:row.stage||"new",
      temperature:row.temperature||"warm",
      value:Number(row.value||0),
      currency:row.currency||"ARS",
      nextAction:row.next_action||"Sin próxima acción",
      nextActionAt:row.next_action_at||null,
    };
  });

  return <AdminShell title="Pipeline comercial" subtitle="Oportunidades por etapa, valor y próxima acción.">
    <PipelineClient initial={opportunities}/>
  </AdminShell>;
}
