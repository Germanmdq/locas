import { createSupabaseClient } from "@/lib/supabase/client";
import InboxClient from "./InboxClient";

export const dynamic = "force-dynamic";

export default async function InboxPage(){
  const supabase=createSupabaseClient();
  const [{data:threads},{data:messages}] = await Promise.all([
    supabase.from("crm_inbox_summary").select("*").order("last_message_at",{ascending:false}),
    supabase.from("messages").select("id,conversation_id,channel,direction,sender_name,body,subject,status,sent_at,message_type").order("sent_at",{ascending:true})
  ]);
  return <InboxClient threads={threads||[]} messages={messages||[]}/>;
}
