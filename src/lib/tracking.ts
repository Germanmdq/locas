"use client";

import { createSupabaseClient } from "@/lib/supabase/client";

const ANON_KEY = "locas.tracking.anonymousId";
const SESSION_KEY = "locas.tracking.sessionId";
const ATTR_KEY = "locas.tracking.firstAttribution";
let client: ReturnType<typeof createSupabaseClient> | null = null;

function supabase(){
  if(!client) client=createSupabaseClient();
  return client;
}

function uuid(){
  if(typeof crypto!=="undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export function getTrackingIds(){
  if(typeof window==="undefined") return {anonymousId:"",sessionId:""};
  let anonymousId=localStorage.getItem(ANON_KEY);
  if(!anonymousId){anonymousId=uuid();localStorage.setItem(ANON_KEY,anonymousId)}
  let sessionId=sessionStorage.getItem(SESSION_KEY);
  if(!sessionId){sessionId=uuid();sessionStorage.setItem(SESSION_KEY,sessionId)}
  return {anonymousId,sessionId};
}

function inferDevice(){
  if(typeof window==="undefined") return "unknown";
  const w=window.innerWidth;
  return w<768?"mobile":w<1100?"tablet":"desktop";
}

export function getAttribution(){
  if(typeof window==="undefined") return {} as Record<string,string>;
  const q=new URLSearchParams(window.location.search);
  const current={
    utm_source:q.get("utm_source")||"",
    utm_medium:q.get("utm_medium")||"",
    utm_campaign:q.get("utm_campaign")||"",
    utm_content:q.get("utm_content")||"",
    utm_term:q.get("utm_term")||"",
    gclid:q.get("gclid")||"",
    fbclid:q.get("fbclid")||"",
    referrer:document.referrer||"",
    landing_page:window.location.href,
  };
  let first:Record<string,string>|null=null;
  try{first=JSON.parse(localStorage.getItem(ATTR_KEY)||"null")}catch{}
  const hasPaid=Object.entries(current).some(([k,v])=>k!=="referrer"&&k!=="landing_page"&&Boolean(v));
  if(!first || hasPaid){
    first=current;
    if(!localStorage.getItem(ATTR_KEY)) localStorage.setItem(ATTR_KEY,JSON.stringify(first));
  }
  return {...first,...Object.fromEntries(Object.entries(current).filter(([,v])=>v))};
}

export function tripSlugFromPath(pathname?:string){
  const path=pathname || (typeof window!=="undefined"?window.location.pathname:"");
  const m=path.match(/^\/(?:viajes|blog)\/([^/?#]+)/);
  return m?.[1]||null;
}

export async function trackEvent(eventName:string, properties:Record<string,unknown>={}, tripSlug?:string|null){
  if(typeof window==="undefined") return null;
  const {anonymousId,sessionId}=getTrackingIds();
  const a=getAttribution();
  const slug=tripSlug ?? tripSlugFromPath();
  try{
    const {data,error}=await supabase().rpc("track_web_event",{
      p_anonymous_id:anonymousId,
      p_session_id:sessionId,
      p_event_name:eventName,
      p_page_url:window.location.href,
      p_page_title:document.title,
      p_referrer:a.referrer||document.referrer||null,
      p_utm_source:a.utm_source||null,
      p_utm_medium:a.utm_medium||null,
      p_utm_campaign:a.utm_campaign||null,
      p_utm_content:a.utm_content||null,
      p_utm_term:a.utm_term||null,
      p_gclid:a.gclid||null,
      p_fbclid:a.fbclid||null,
      p_trip_slug:slug,
      p_user_agent:navigator.userAgent,
      p_language:navigator.language,
      p_timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
      p_device_type:inferDevice(),
      p_properties:{...properties,screen:`${window.screen.width}x${window.screen.height}`,viewport:`${window.innerWidth}x${window.innerHeight}`},
    });
    if(error) console.warn("Locas tracking",error.message);
    return data;
  }catch(e){console.warn("Locas tracking unavailable",e);return null}
}

export async function identifyContact(input:{
  fullName:string; email?:string; phone?:string; whatsappOptIn?:boolean; emailOptIn?:boolean;
  tripSlug?:string|null; interest?:string; properties?:Record<string,unknown>;
}){
  if(typeof window==="undefined") return null;
  const {anonymousId,sessionId}=getTrackingIds();
  try{
    const {data,error}=await supabase().rpc("identify_web_contact",{
      p_anonymous_id:anonymousId,
      p_session_id:sessionId,
      p_full_name:input.fullName,
      p_email:input.email||null,
      p_phone:input.phone||null,
      p_whatsapp_opt_in:Boolean(input.whatsappOptIn),
      p_email_opt_in:Boolean(input.emailOptIn),
      p_trip_slug:input.tripSlug||tripSlugFromPath(),
      p_interest:input.interest||null,
      p_properties:input.properties||{},
    });
    if(error){console.warn("Locas identify",error.message);return null}
    if(data) localStorage.setItem("locas.tracking.contactId",String(data));
    return data;
  }catch(e){console.warn("Locas identify unavailable",e);return null}
}
