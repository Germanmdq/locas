import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase/client";
export async function POST(req:NextRequest){
 const body=await req.json(); const token=req.headers.get("x-crm-webhook-token")||req.nextUrl.searchParams.get("token");
 const expected=process.env.CRM_WEBHOOK_TOKEN || "locas-demo-email"; if(token!==expected) return NextResponse.json({error:"unauthorized"},{status:401});
 const from=body.from?.email||body.from||body.sender||"unknown@example.com"; const name=body.from?.name||body.sender_name||from; const messageId=body.message_id||body.id||`email-${Date.now()}`; const thread=body.thread_id||body.references?.[0]||body.subject||from;
 const supabase=createSupabaseClient(); const {error}=await supabase.rpc("ingest_crm_message",{p_channel:"email",p_external_thread_id:String(thread),p_external_message_id:String(messageId),p_direction:"inbound",p_external_user_id:String(from),p_sender_name:String(name),p_address:String(from),p_body:String(body.text||body.body||body.html||""),p_subject:String(body.subject||"Email entrante"),p_message_type:"email",p_sent_at:body.date||new Date().toISOString(),p_metadata:{provider:body.provider||"email-webhook"}});
 return NextResponse.json({ok:!error,error:error?.message||null},{status:error?500:200});
}
