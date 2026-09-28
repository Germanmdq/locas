import { createSupabaseClient } from "@/lib/supabase/client";
import InboxClient from "./InboxClient";
export const dynamic = "force-dynamic";
export default async function InboxPage(){
  const supabase=createSupabaseClient();
  const [{data:threads},{data:messages},{data:owners}] = await Promise.all([
    supabase.from("crm_inbox_summary").select("*").order("last_message_at",{ascending:false}),
    supabase.from("messages").select("id,conversation_id,channel,direction,sender_name,body,subject,status,sent_at,message_type").order("sent_at",{ascending:true}),
    supabase.from("crm_users").select("id,name").eq("active",true).order("name")
  ]);
  return <InboxClient threads={threads||[]} messages={messages||[]} owners={owners||[]}/>;
}
