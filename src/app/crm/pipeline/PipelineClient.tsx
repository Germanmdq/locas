"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { CircleDollarSign, Flame, Search, UsersRound } from "lucide-react";

export type PipelineOpportunity={
  id:string; contactId:string; name:string; email:string; phone:string; score:number;
  trip:string; stage:string; temperature:string; value:number; currency:string;
  nextAction:string; nextActionAt:string|null;
};

const stages=[
  {id:"new",label:"Nuevo"},
  {id:"contacted",label:"Contactado"},
  {id:"qualified",label:"Interesado"},
  {id:"proposal",label:"Propuesta"},
  {id:"reserved",label:"Reserva"},
  {id:"deposit",label:"Seña"},
  {id:"won",label:"Confirmado"},
  {id:"lost",label:"Perdido"},
];

const stageAlias:Record<string,string>={lead:"new",interested:"qualified",reservation:"reserved",booked:"reserved",confirmed:"won"};
const normalized=(stage:string)=>stageAlias[stage]||stage||"new";
const money=(currency:string,value:number)=>value?`${currency} ${Math.round(value).toLocaleString("es-AR")}`:"Sin valor";

export default function PipelineClient({initial}:{initial:PipelineOpportunity[]}){
  const [rows,setRows]=useState(initial.map(r=>({...r,stage:normalized(r.stage)})));
  const [query,setQuery]=useState("");
  const [dragging,setDragging]=useState<string|null>(null);
  const [over,setOver]=useState<string|null>(null);
  const [saving,setSaving]=useState<string|null>(null);
  const supabase=createSupabaseClient();

  const filtered=useMemo(()=>rows.filter(r=>`${r.name} ${r.trip} ${r.nextAction}`.toLowerCase().includes(query.toLowerCase())),[rows,query]);
  const openRows=rows.filter(r=>!["won","lost"].includes(r.stage));
  const pipelineValue=openRows.reduce((sum,r)=>sum+(r.currency==="ARS"?r.value:0),0);
  const hot=rows.filter(r=>r.temperature==="hot").length;

  async function move(id:string,stage:string){
    if(!id)return;
    const current=rows.find(r=>r.id===id);
    if(!current||current.stage===stage)return;
    setSaving(id);
    setRows(list=>list.map(r=>r.id===id?{...r,stage}:r));
    const {error}=await supabase.from("opportunities").update({stage}).eq("id",id);
    if(error) setRows(list=>list.map(r=>r.id===id?{...r,stage:current.stage}:r));
    setSaving(null);
  }

  return <>
    <section className="pipelineSummaryGrid">
      <article className="pipelineSummaryCard"><UsersRound size={19}/><div><span>Oportunidades</span><strong>{rows.length}</strong><small>{openRows.length} abiertas</small></div></article>
      <article className="pipelineSummaryCard"><Flame size={19}/><div><span>Calientes</span><strong>{hot}</strong><small>requieren prioridad</small></div></article>
      <article className="pipelineSummaryCard"><CircleDollarSign size={19}/><div><span>Pipeline ARS</span><strong>ARS {Math.round(pipelineValue).toLocaleString("es-AR")}</strong><small>valor abierto</small></div></article>
      <article className="pipelineSummaryCard"><div className="pipelineWinRate">%</div><div><span>Conversión</span><strong>{rows.length?Math.round(rows.filter(r=>r.stage==="won").length*100/rows.length):0}%</strong><small>oportunidad → confirmado</small></div></article>
    </section>

    <section className="pipelineToolbar opsCard">
      <div className="opsInlineSearch"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar persona, viaje o próxima acción..."/></div>
      <div><b>Arrastrá una oportunidad</b><span>y soltala en la etapa correspondiente.</span></div>
    </section>

    <section className="pipelineBoard" aria-label="Pipeline comercial">
      {stages.map(stage=>{
        const list=filtered.filter(r=>r.stage===stage.id);
        const total=list.reduce((sum,r)=>sum+(r.currency==="ARS"?r.value:0),0);
        return <div key={stage.id} className={`pipelineColumn ${over===stage.id?"pipelineDropActive":""}`} onDragOver={e=>{e.preventDefault();setOver(stage.id)}} onDragLeave={()=>setOver(null)} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData("text/plain")||dragging||"";setOver(null);setDragging(null);void move(id,stage.id)}}>
          <header className="pipelineColumnHead"><div><span>{stage.label}</span><em>{list.length}</em></div><small>{total?`ARS ${Math.round(total).toLocaleString("es-AR")}`:"Sin valor"}</small></header>
          <div className="pipelineColumnBody">
            {list.length?list.map(item=><article key={item.id} className={`pipelineCard ${saving===item.id?"saving":""}`} draggable onDragStart={e=>{setDragging(item.id);e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",item.id)}} onDragEnd={()=>{setDragging(null);setOver(null)}}>
              <div className="pipelineCardTop"><Link href={`/crm/contacto/${item.contactId}`}><b>{item.name}</b></Link><span className={`pipelineTemp ${item.temperature}`}>{item.temperature==="hot"?"Caliente":item.temperature==="cold"?"Frío":"Tibio"}</span></div>
              <p>{item.trip}</p>
              <strong>{money(item.currency,item.value)}</strong>
              <div className="pipelineCardMeta"><span>Score {item.score}</span><span>{item.nextAction}</span></div>
              {item.nextActionAt&&<time>{new Date(item.nextActionAt).toLocaleDateString("es-AR",{day:"2-digit",month:"short"})}</time>}
            </article>):<div className="pipelineEmpty">Sin oportunidades</div>}
          </div>
        </div>;
      })}
    </section>
  </>;
}
