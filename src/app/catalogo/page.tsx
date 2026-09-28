"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Save, Eye, Plus, Upload, Image as ImageIcon, Globe2, CircleOff, Loader2 } from "lucide-react";
import AdminShell from "@/app/admin/AdminShell";
import { createSupabaseClient } from "@/lib/supabase/client";

type Departure={id?:string;starts_on:string;ends_on:string;capacity:number;sold:number;waitlist:number;price:number|null;currency:string;status:string};
type Day={id?:string;day_order:number;day_label:string;title:string;description:string;image_url:string|null;note?:string|null};
type ListItem={id?:string;item_type:"included"|"not_included"|"document";label:string;sort_order:number};
type Season={id?:string;period:string;description:string;image_url?:string|null;sort_order:number};
type Trip={
  id:string;slug:string;name:string;destination:string;country:string;base_price:number|null;currency:string;status:string;
  location:string;duration:string;hero_image:string;lead:string;intro:string;deposit_text:string;sales_status:string;blog_enabled:boolean;
  departures:Departure[];trip_itinerary:Day[];trip_list_items:ListItem[];trip_seasons:Season[];
};

const supabase=createSupabaseClient();
const sortTrip=(t:Trip):Trip=>({...t,
  departures:[...(t.departures||[])].sort((a,b)=>String(a.starts_on).localeCompare(String(b.starts_on))),
  trip_itinerary:[...(t.trip_itinerary||[])].sort((a,b)=>a.day_order-b.day_order),
  trip_list_items:[...(t.trip_list_items||[])].sort((a,b)=>a.sort_order-b.sort_order),
  trip_seasons:[...(t.trip_seasons||[])].sort((a,b)=>a.sort_order-b.sort_order),
});
const lines=(items:ListItem[],type:ListItem["item_type"])=>items.filter(i=>i.item_type===type).sort((a,b)=>a.sort_order-b.sort_order).map(i=>i.label).join("\n");
const safeFileName=(name:string)=>name.toLowerCase().replace(/[^a-z0-9.]+/g,"-").replace(/^-|-$/g,"");

export default function CatalogoPage(){
  const [trips,setTrips]=useState<Trip[]>([]);
  const [selected,setSelected]=useState("");
  const [query,setQuery]=useState("");
  const [tab,setTab]=useState<"contenido"|"itinerario"|"operacion">("contenido");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState("");
  const heroInput=useRef<HTMLInputElement>(null);

  async function load(){
    setLoading(true);
    const {data,error}=await supabase.from("trips").select(`
      id,slug,name,destination,country,base_price,currency,status,location,duration,hero_image,lead,intro,deposit_text,sales_status,blog_enabled,
      departures(id,starts_on,ends_on,capacity,sold,waitlist,price,currency,status),
      trip_itinerary(id,day_order,day_label,title,description,image_url,note),
      trip_list_items(id,item_type,label,sort_order),
      trip_seasons(id,period,description,image_url,sort_order)
    `).order("created_at",{ascending:true});
    if(error){setNotice(error.message);setLoading(false);return;}
    const next=(data||[]).map((x:any)=>sortTrip(x as Trip));
    setTrips(next); if(!selected&&next[0]) setSelected(next[0].id); setLoading(false);
  }
  useEffect(()=>{void load()},[]);

  const current=trips.find(t=>t.id===selected)||trips[0];
  const visible=useMemo(()=>trips.filter(t=>`${t.name} ${t.destination}`.toLowerCase().includes(query.toLowerCase())),[trips,query]);
  const update=(patch:Partial<Trip>)=>current&&setTrips(v=>v.map(t=>t.id===current.id?{...t,...patch}:t));
  const updateDay=(idx:number,patch:Partial<Day>)=>current&&update({trip_itinerary:current.trip_itinerary.map((d,i)=>i===idx?{...d,...patch}:d)});
  const activeDeparture=current?.departures?.[0];
  const occupancy=activeDeparture?.capacity?Math.round((activeDeparture.sold||0)*100/activeDeparture.capacity):0;

  async function upload(file:File,role:"hero"|"day",dayIndex?:number){
    if(!current) return;
    setNotice("Subiendo imagen…");
    const path=`${current.slug}/${Date.now()}-${safeFileName(file.name)}`;
    const {error}=await supabase.storage.from("trip-media").upload(path,file,{upsert:false});
    if(error){setNotice(`Error al subir: ${error.message}`);return;}
    const {data}=supabase.storage.from("trip-media").getPublicUrl(path);
    const url=data.publicUrl;
    if(role==="hero") update({hero_image:url});
    if(role==="day"&&dayIndex!==undefined) updateDay(dayIndex,{image_url:url});
    setNotice("Imagen subida. Guardá los cambios para publicarla.");
  }

  function setList(type:ListItem["item_type"],text:string){
    if(!current) return;
    const keep=current.trip_list_items.filter(x=>x.item_type!==type);
    const add=text.split("\n").map(x=>x.trim()).filter(Boolean).map((label,i)=>({item_type:type,label,sort_order:i} as ListItem));
    update({trip_list_items:[...keep,...add]});
  }

  async function save(){
    if(!current) return;
    setSaving(true); setNotice("Guardando…");
    const {error:tripError}=await supabase.from("trips").update({
      name:current.name,destination:current.destination,country:current.country,base_price:current.base_price,currency:current.currency,status:current.status,
      location:current.location,duration:current.duration,hero_image:current.hero_image,lead:current.lead,intro:current.intro,deposit_text:current.deposit_text,
      sales_status:current.sales_status,blog_enabled:current.blog_enabled,updated_at:new Date().toISOString()
    }).eq("id",current.id);
    if(tripError){setNotice(tripError.message);setSaving(false);return;}

    if(activeDeparture){
      const depPayload={trip_id:current.id,starts_on:activeDeparture.starts_on,ends_on:activeDeparture.ends_on,capacity:Number(activeDeparture.capacity)||0,sold:Number(activeDeparture.sold)||0,waitlist:Number(activeDeparture.waitlist)||0,price:activeDeparture.price==null?null:Number(activeDeparture.price),currency:activeDeparture.currency,status:activeDeparture.status};
      const depRes=activeDeparture.id?await supabase.from("departures").update(depPayload).eq("id",activeDeparture.id):await supabase.from("departures").insert(depPayload);
      if(depRes.error){setNotice(depRes.error.message);setSaving(false);return;}
    }

    for(const day of current.trip_itinerary){
      const payload={trip_id:current.id,day_order:day.day_order,day_label:day.day_label,title:day.title,description:day.description,image_url:day.image_url||current.hero_image,note:day.note||null,updated_at:new Date().toISOString()};
      const res=day.id?await supabase.from("trip_itinerary").update(payload).eq("id",day.id):await supabase.from("trip_itinerary").insert(payload);
      if(res.error){setNotice(res.error.message);setSaving(false);return;}
    }

    const del=await supabase.from("trip_list_items").delete().eq("trip_id",current.id);
    if(del.error){setNotice(del.error.message);setSaving(false);return;}
    if(current.trip_list_items.length){
      const ins=await supabase.from("trip_list_items").insert(current.trip_list_items.map((x,i)=>({trip_id:current.id,item_type:x.item_type,label:x.label,sort_order:x.sort_order??i})));
      if(ins.error){setNotice(ins.error.message);setSaving(false);return;}
    }
    setNotice("Guardado. El frontend ya lee estos datos desde Supabase.");
    setSaving(false); await load();
  }

  function addDay(){
    if(!current) return;
    const n=current.trip_itinerary.length+1;
    update({trip_itinerary:[...current.trip_itinerary,{day_order:n,day_label:`Día ${n}`,title:"Nuevo día",description:"Descripción de la jornada",image_url:current.hero_image}]});
  }

  async function togglePublish(){ if(!current)return; const next=current.status==="published"?"draft":"published"; setSaving(true); const {error}=await supabase.from("trips").update({status:next,updated_at:new Date().toISOString()}).eq("id",current.id); if(error){setNotice(error.message)}else{update({status:next});setNotice(next==="published"?"Publicado. Ya está visible en la web.":"Despublicado. Ya no aparece en el catálogo público.")} setSaving(false); }

  const actions=current?<><Link className="opsButton secondary" href={`/viajes/${current.slug}`} target="_blank"><Eye size={16}/>Vista pública</Link><button className="opsButton" onClick={save} disabled={saving}>{saving?<Loader2 className="spin" size={16}/>:<Save size={16}/>} Guardar cambios</button></>:null;

  return <AdminShell title="Viajes y contenido" subtitle="Lo que se edita acá alimenta directamente el catálogo público y la página individual de cada viaje." actions={actions}>
    {loading?<div className="cmsLiveEmpty"><Loader2 className="spin"/> Cargando viajes desde Supabase…</div>:!current?<div className="cmsLiveEmpty">No hay viajes cargados.</div>:<div className="cmsLiveLayout">
      <aside className="cmsLiveSidebar">
        <div className="cmsLiveSideTop"><button className="opsButton full"><Plus size={16}/>Nuevo viaje</button><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar viaje…"/></div>
        <div className="cmsLiveTripList">{visible.map(t=>{const d=t.departures?.[0];return <button key={t.id} className={t.id===current.id?"active":""} onClick={()=>setSelected(t.id)}><img src={t.hero_image||"/destinations/ushuaia.jpg"} alt=""/><span><b>{t.name}</b><small>{t.destination}</small></span><i className={t.status==="published"?"on":"off"}/>{d&&<em>{Math.max(d.capacity-d.sold,0)} libres</em>}</button>})}</div>
      </aside>

      <section className="cmsLiveMain">
        <div className="cmsLiveHead"><div><div className="cmsLiveStatus"><span className={current.status==="published"?"published":"draft"}>{current.status==="published"?"Publicado":"Borrador"}</span><button onClick={togglePublish}>{current.status==="published"?<><CircleOff size={14}/>Despublicar</>:<><Globe2 size={14}/>Publicar</>}</button></div><h2>{current.name}</h2><p>{current.location} · {current.duration}</p></div><div className="cmsLiveStats"><div><span>Precio</span><b>{current.base_price==null?"Consultar":`${current.currency} ${Number(current.base_price).toLocaleString("es-AR")}`}</b></div><div><span>Ocupación</span><b>{activeDeparture?`${activeDeparture.sold}/${activeDeparture.capacity}`:"—"}</b><small>{occupancy}%</small></div><div><span>Disponibles</span><b>{activeDeparture?Math.max(activeDeparture.capacity-activeDeparture.sold,0):"—"}</b></div></div></div>
        {notice&&<div className="cmsLiveNotice">{notice}</div>}
        <div className="cmsLiveTabs"><button className={tab==="contenido"?"active":""} onClick={()=>setTab("contenido")}>Contenido público</button><button className={tab==="itinerario"?"active":""} onClick={()=>setTab("itinerario")}>Itinerario y fotos</button><button className={tab==="operacion"?"active":""} onClick={()=>setTab("operacion")}>Salida, precio y cupos</button></div>

        {tab==="contenido"&&<div className="cmsLiveGrid">
          <section className="cmsLiveCard wide"><div className="cmsLiveCardHead"><div><span>PORTADA</span><h3>Imagen principal</h3></div><button onClick={()=>heroInput.current?.click()}><Upload size={15}/>Subir foto</button><input ref={heroInput} type="file" accept="image/*" hidden onChange={e=>e.target.files?.[0]&&void upload(e.target.files[0],"hero")}/></div><div className="cmsHeroPreview"><img src={current.hero_image||"/destinations/ushuaia.jpg"} alt=""/><div><ImageIcon size={18}/><p>Esta misma imagen aparece en el catálogo y en el hero de la página individual.</p></div></div></section>
          <section className="cmsLiveCard"><h3>Información principal</h3><label>Título<input value={current.name} onChange={e=>update({name:e.target.value})}/></label><label>Ubicación visible<input value={current.location||""} onChange={e=>update({location:e.target.value})}/></label><div className="cmsLiveFields"><label>Destino<input value={current.destination||""} onChange={e=>update({destination:e.target.value})}/></label><label>País<input value={current.country||""} onChange={e=>update({country:e.target.value})}/></label></div><label>Duración<input value={current.duration||""} onChange={e=>update({duration:e.target.value})}/></label></section>
          <section className="cmsLiveCard"><h3>Texto comercial</h3><label>Bajada<textarea value={current.lead||""} onChange={e=>update({lead:e.target.value})}/></label><label>Introducción<textarea className="tall" value={current.intro||""} onChange={e=>update({intro:e.target.value})}/></label></section>
          <section className="cmsLiveCard"><h3>Incluye</h3><textarea className="list" value={lines(current.trip_list_items,"included")} onChange={e=>setList("included",e.target.value)}/></section>
          <section className="cmsLiveCard"><h3>No incluye</h3><textarea className="list" value={lines(current.trip_list_items,"not_included")} onChange={e=>setList("not_included",e.target.value)}/></section>
          <section className="cmsLiveCard wide"><h3>Documentación</h3><textarea className="list" value={lines(current.trip_list_items,"document")} onChange={e=>setList("document",e.target.value)}/></section>
        </div>}

        {tab==="itinerario"&&<div className="cmsLiveItinerary"><div className="cmsLiveItineraryHead"><div><h3>Días del viaje</h3><p>Cada jornada puede tener su propia foto. Esa foto aparece directamente en la página individual.</p></div><button className="opsButton secondary" onClick={addDay}><Plus size={16}/>Agregar día</button></div>{current.trip_itinerary.map((day,i)=><article key={day.id||i} className="cmsDayEditor"><div className="cmsDayNumber">{String(i+1).padStart(2,"0")}</div><div className="cmsDayPhoto"><img src={day.image_url||current.hero_image} alt=""/><label><Upload size={15}/>Cambiar foto<input type="file" accept="image/*" hidden onChange={e=>e.target.files?.[0]&&void upload(e.target.files[0],"day",i)}/></label></div><div className="cmsDayFields"><div className="cmsLiveFields"><label>Etiqueta<input value={day.day_label} onChange={e=>updateDay(i,{day_label:e.target.value})}/></label><label>Título<input value={day.title} onChange={e=>updateDay(i,{title:e.target.value})}/></label></div><label>Descripción<textarea value={day.description} onChange={e=>updateDay(i,{description:e.target.value})}/></label></div></article>)}</div>}

        {tab==="operacion"&&<div className="cmsLiveGrid">
          <section className="cmsLiveCard"><h3>Precio público</h3><div className="cmsLiveFields"><label>Moneda<select value={current.currency} onChange={e=>update({currency:e.target.value})}><option>ARS</option><option>USD</option><option>EUR</option></select></label><label>Precio<input type="number" value={current.base_price??""} onChange={e=>update({base_price:e.target.value?Number(e.target.value):null})}/></label></div><label>Texto de seña<input value={current.deposit_text||""} onChange={e=>update({deposit_text:e.target.value})}/></label><label>Estado comercial<input value={current.sales_status||""} onChange={e=>update({sales_status:e.target.value})}/></label></section>
          <section className="cmsLiveCard"><h3>Salida activa</h3>{activeDeparture?<><div className="cmsLiveFields"><label>Inicio<input type="date" value={activeDeparture.starts_on} onChange={e=>update({departures:current.departures.map((d,i)=>i===0?{...d,starts_on:e.target.value}:d)})}/></label><label>Fin<input type="date" value={activeDeparture.ends_on} onChange={e=>update({departures:current.departures.map((d,i)=>i===0?{...d,ends_on:e.target.value}:d)})}/></label></div><div className="cmsLiveFields"><label>Cupo total<input type="number" value={activeDeparture.capacity} onChange={e=>update({departures:current.departures.map((d,i)=>i===0?{...d,capacity:Number(e.target.value)}:d)})}/></label><label>Vendidos<input type="number" value={activeDeparture.sold} onChange={e=>update({departures:current.departures.map((d,i)=>i===0?{...d,sold:Number(e.target.value)}:d)})}/></label></div><div className="cmsCapacity"><div><span style={{width:`${Math.min(occupancy,100)}%`}}/></div><p>{occupancy}% ocupado · {Math.max(activeDeparture.capacity-activeDeparture.sold,0)} disponibles</p></div></>:<p>No hay salida activa todavía.</p>}</section>
          <section className="cmsLiveCard wide"><div className="cmsLiveCardHead"><div><span>PUBLICACIÓN</span><h3>Lo que ocurre al guardar</h3></div></div><div className="cmsPublishFlow"><div><b>1</b><span>Catálogo</span><p>Actualiza portada, título, duración, precio y disponibilidad.</p></div><div><b>2</b><span>Página individual</span><p>Actualiza hero, textos, itinerario, fotos, incluidos y documentación.</p></div><div><b>3</b><span>CRM y reservas</span><p>Usa el mismo viaje y la misma salida para leads, cupos y reservas.</p></div></div></section>
        </div>}
      </section>
    </div>}
  </AdminShell>;
}
