import { createSupabaseClient } from "@/lib/supabase/client";
import CRMClient, { type Lead, type ChannelStat } from "./CRMClient";

export const dynamic = "force-dynamic";

export default async function CRMPage(){
  const supabase=createSupabaseClient();
  const [{data:contacts},{data:opps},{data:interactions},{data:tasks},{data:channels},{data:tracking},{data:sessions}] = await Promise.all([
    supabase.from("contacts").select("id,first_name,last_name,email,phone,lifecycle_stage,lead_score,estimated_value,currency,notes,lead_sources(name),campaigns(name),crm_users(name)").order("created_at",{ascending:false}),
    supabase.from("opportunities").select("contact_id,stage,temperature,value,currency,next_action,next_action_at,trips(name)"),
    supabase.from("interactions").select("contact_id,subject,body,channel,occurred_at").order("occurred_at",{ascending:false}),
    supabase.from("tasks").select("contact_id,title,due_at,status").eq("status","open").order("due_at",{ascending:true}),
    supabase.from("crm_channel_performance").select("source,channel,leads,customers,revenue,conversion_rate"),
    supabase.from("web_tracking_summary").select("day,source,event_name,events,sessions,identified_contacts").order("day",{ascending:false}).limit(200),
    supabase.from("web_sessions").select("session_id,anonymous_id,contact_id,utm_source,utm_campaign,landing_page,last_page,event_count,last_seen_at").order("last_seen_at",{ascending:false}).limit(100)
  ]);
  const leads:Lead[]=(contacts||[]).map((c:any)=>{
    const o=(opps||[]).find((x:any)=>x.contact_id===c.id); const task=(tasks||[]).find((x:any)=>x.contact_id===c.id);
    const ints=(interactions||[]).filter((x:any)=>x.contact_id===c.id);
    const value=Number(o?.value??c.estimated_value??0); const currency=o?.currency??c.currency??"ARS";
    const src=Array.isArray(c.lead_sources)?c.lead_sources[0]:c.lead_sources;
    const camp=Array.isArray(c.campaigns)?c.campaigns[0]:c.campaigns;
    const owner=Array.isArray(c.crm_users)?c.crm_users[0]:c.crm_users;
    const trip=Array.isArray(o?.trips)?o.trips[0]:o?.trips;
    return {id:c.id,name:`${c.first_name||""} ${c.last_name||""}`.trim(),channel:src?.name||"Sin origen",campaign:camp?.name||"Orgánico / directo",trip:trip?.name||"Interés general",stage:o?.stage||c.lifecycle_stage,value:value?`${currency} ${value.toLocaleString("es-AR")}`:"Sin valor",last:ints[0]?new Date(ints[0].occurred_at).toLocaleString("es-AR"):"Sin contacto",next:task?.title||o?.next_action||"Sin próxima acción",owner:owner?.name||"Sin asignar",hot:o?.temperature==="hot"||Number(c.lead_score)>=85,email:c.email||"",phone:c.phone||"",score:Number(c.lead_score||0),notes:c.notes||"",interactions:ints.map((i:any)=>({subject:i.subject||"",body:i.body||"",channel:i.channel||"",occurred_at:i.occurred_at}))};
  });
  const trackingStats=(tracking||[]).map((r:any)=>({source:r.source||"Directo",event_name:r.event_name||"",events:Number(r.events||0),sessions:Number(r.sessions||0),identified_contacts:Number(r.identified_contacts||0)}));
  const webSessions=(sessions||[]).map((r:any)=>({session_id:r.session_id,anonymous_id:r.anonymous_id,identified:Boolean(r.contact_id),source:r.utm_source||"Directo",campaign:r.utm_campaign||"",landing_page:r.landing_page||"",last_page:r.last_page||"",event_count:Number(r.event_count||0),last_seen_at:r.last_seen_at}));
  return <CRMClient leads={leads} channelStats={(channels||[]) as ChannelStat[]} trackingStats={trackingStats} webSessions={webSessions}/>;
}
