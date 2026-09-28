import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase/client";

export async function GET(req:NextRequest){
  const q=req.nextUrl.searchParams;
  const verify=process.env.META_VERIFY_TOKEN || "locas-demo-verify";
  if(q.get("hub.mode")==="subscribe" && q.get("hub.verify_token")===verify) return new NextResponse(q.get("hub.challenge")||"",{status:200});
  return new NextResponse("Forbidden",{status:403});
}

export async function POST(req:NextRequest){
  const payload=await req.json();
  const supabase=createSupabaseClient();
  let processed=0;
  for(const entry of payload.entry||[]){
    for(const change of entry.changes||[]){
      const value=change.value||{};
      if(change.field==="messages" && value.messages){
        for(const m of value.messages){
          const from=m.from||"unknown"; const profile=(value.contacts||[]).find((c:any)=>c.wa_id===from)?.profile?.name||from;
          const body=m.text?.body||m.button?.text||m.interactive?.button_reply?.title||`[${m.type||"mensaje"}]`;
          await supabase.rpc("ingest_crm_message",{p_channel:"whatsapp",p_external_thread_id:`wa:${from}`,p_external_message_id:m.id||`${from}:${m.timestamp}`,p_direction:"inbound",p_external_user_id:from,p_sender_name:profile,p_address:from,p_body:body,p_subject:null,p_message_type:m.type||"text",p_sent_at:new Date(Number(m.timestamp||Date.now()/1000)*1000).toISOString(),p_metadata:{provider:"meta",raw_type:m.type}}); processed++;
        }
      }
    }
    for(const messaging of entry.messaging||[]){
      const sender=messaging.sender?.id||"unknown"; const isInstagram=payload.object==="instagram"; const channel=isInstagram?"instagram":"messenger"; const m=messaging.message||{};
      if(m.mid){await supabase.rpc("ingest_crm_message",{p_channel:channel,p_external_thread_id:`${channel}:${sender}`,p_external_message_id:m.mid,p_direction:"inbound",p_external_user_id:sender,p_sender_name:sender,p_address:null,p_body:m.text||`[${m.attachments?.[0]?.type||"mensaje"}]`,p_subject:isInstagram?"Instagram DM":"Facebook Messenger",p_message_type:m.attachments?.length?"attachment":"text",p_sent_at:new Date(Number(messaging.timestamp||Date.now())).toISOString(),p_metadata:{provider:"meta"}});processed++;}
    }
  }
  return NextResponse.json({ok:true,processed});
}
