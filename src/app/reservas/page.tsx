import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";
import ReservationsClient from "./ReservationsClient";
export const dynamic="force-dynamic";
export default async function Page(){
 const s=createSupabaseClient();
 const [{data:reservations},{data:contacts},{data:departures},{data:owners}] = await Promise.all([
  s.from("reservations").select("id,contact_id,departure_id,status,travelers,room_type,total_amount,paid_amount,currency,reserved_at,contacts(first_name,last_name,email,phone,owner_id),departures(starts_on,trips(name))").order("reserved_at",{ascending:false}),
  s.from("contacts").select("id,first_name,last_name,email,phone,owner_id").order("first_name"),
  s.from("departures").select("id,starts_on,capacity,sold,price,currency,trips(name)").order("starts_on"),
  s.from("crm_users").select("id,name").eq("active",true)
 ]);
 const ownerMap=new Map((owners||[]).map((o:any)=>[o.id,o.name]));
 const contactOptions=(contacts||[]).map((c:any)=>({id:c.id,name:`${c.first_name||""} ${c.last_name||""}`.trim()||"Sin nombre",email:c.email||"",phone:c.phone||"",owner_name:c.owner_id?(ownerMap.get(c.owner_id)||"Sin asignar"):"Sin asignar"}));
 const rows=(reservations||[]).map((r:any)=>{const c=Array.isArray(r.contacts)?r.contacts[0]:r.contacts;const d=Array.isArray(r.departures)?r.departures[0]:r.departures;const t=d?(Array.isArray(d.trips)?d.trips[0]:d.trips):null;return {id:r.id,contact_id:r.contact_id,departure_id:r.departure_id,status:r.status,travelers:r.travelers,room_type:r.room_type,total_amount:Number(r.total_amount||0),paid_amount:Number(r.paid_amount||0),currency:r.currency||"ARS",reserved_at:r.reserved_at,contact_name:c?`${c.first_name||""} ${c.last_name||""}`.trim():"Sin pasajera",email:c?.email||"",phone:c?.phone||"",trip_name:t?.name||"—",starts_on:d?.starts_on||null,owner_name:c?.owner_id?(ownerMap.get(c.owner_id)||"Sin asignar"):"Sin asignar"}});
 const departureOptions=(departures||[]).map((d:any)=>{const t=Array.isArray(d.trips)?d.trips[0]:d.trips;return {id:d.id,trip_name:t?.name||"Viaje",starts_on:d.starts_on||null,currency:d.currency||"ARS",price:Number(d.price||0),capacity:d.capacity,sold:d.sold}});
 return <AdminShell title="Reservas" subtitle="Reservas, pasajeras, saldos y estado operativo en una sola vista."><ReservationsClient initial={rows} contacts={contactOptions} departures={departureOptions}/></AdminShell>
}
