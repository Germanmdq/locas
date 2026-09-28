import { createSupabaseClient } from '@/lib/supabase/client';

export type PublicTrip = {
  id: string;
  slug: string;
  publicationStatus: string;
  title: string;
  location: string;
  destination: string;
  country: string;
  duration: string;
  image: string;
  lead: string;
  intro: string;
  itinerary: [string,string,string][];
  itineraryImages: string[];
  included: string[];
  notIncluded: string[];
  docs: string[];
  seasons: [string,string,string?][];
  faqs: [string,string][];
  price: string;
  numericPrice: number | null;
  currency: string;
  deposit: string;
  status: string;
  spots: number;
  departures: string[];
  heroImage: string;
  editorialImage: string;
  communityImage: string;
  closingImage: string;
  blogEnabled: boolean;
};

function money(value:number|null,currency:string){
  if(value==null) return 'Consultar';
  if(currency==='USD') return `USD ${value.toLocaleString('es-AR')}`;
  if(currency==='EUR') return `EUR ${value.toLocaleString('es-AR')}`;
  return `$${value.toLocaleString('es-AR')}`;
}
function dateLabel(start:string,end?:string|null){
  const s=new Date(`${start}T12:00:00`);
  const e=end?new Date(`${end}T12:00:00`):null;
  const fmt=new Intl.DateTimeFormat('es-AR',{day:'2-digit',month:'long'});
  return e?`${fmt.format(s)} — ${fmt.format(e)}`:fmt.format(s);
}

export async function getPublishedTrips(includeDrafts=false):Promise<PublicTrip[]> {
  const supabase=createSupabaseClient();
  let query=supabase.from('trips').select(`
    id,slug,name,destination,country,base_price,currency,status,location,duration,hero_image,lead,intro,deposit_text,sales_status,blog_enabled,
    departures(id,starts_on,ends_on,capacity,sold,waitlist,price,currency,status),
    trip_itinerary(id,day_order,day_label,title,description,image_url,note),
    trip_images(id,image_url,image_role,caption,sort_order),
    trip_list_items(id,item_type,label,sort_order),
    trip_seasons(id,period,description,image_url,sort_order),
    trip_faqs(id,question,answer,sort_order)
  `).order('created_at',{ascending:true});
  if(!includeDrafts) query=query.eq('status','published');
  const {data,error}=await query;
  if(error){ console.error('getPublishedTrips',error); return []; }
  return (data||[]).map((row:any)=>mapTrip(row));
}

export async function getTripBySlug(slug:string):Promise<PublicTrip|null>{
  const supabase=createSupabaseClient();
  const {data,error}=await supabase.from('trips').select(`
    id,slug,name,destination,country,base_price,currency,status,location,duration,hero_image,lead,intro,deposit_text,sales_status,blog_enabled,
    departures(id,starts_on,ends_on,capacity,sold,waitlist,price,currency,status),
    trip_itinerary(id,day_order,day_label,title,description,image_url,note),
    trip_images(id,image_url,image_role,caption,sort_order),
    trip_list_items(id,item_type,label,sort_order),
    trip_seasons(id,period,description,image_url,sort_order),
    trip_faqs(id,question,answer,sort_order)
  `).eq('slug',slug).maybeSingle();
  if(error||!data){ if(error) console.error('getTripBySlug',error); return null; }
  return mapTrip(data as any);
}

function mapTrip(row:any):PublicTrip{
  const departures=[...(row.departures||[])].sort((a:any,b:any)=>String(a.starts_on).localeCompare(String(b.starts_on)));
  const active=departures.find((d:any)=>d.status!=='closed')||departures[0];
  const itinerary=[...(row.trip_itinerary||[])].sort((a:any,b:any)=>a.day_order-b.day_order);
  const images=[...(row.trip_images||[])].sort((a:any,b:any)=>a.sort_order-b.sort_order);
  const items=[...(row.trip_list_items||[])].sort((a:any,b:any)=>a.sort_order-b.sort_order);
  const seasons=[...(row.trip_seasons||[])].sort((a:any,b:any)=>a.sort_order-b.sort_order);
  const faqs=[...(row.trip_faqs||[])].sort((a:any,b:any)=>a.sort_order-b.sort_order);
  const imageFor=(role:string,fallback:string)=>images.find((x:any)=>x.image_role===role)?.image_url||fallback;
  const hero=row.hero_image||imageFor('hero','/destinations/ushuaia.jpg');
  const amount=active?.price!=null?Number(active.price):(row.base_price!=null?Number(row.base_price):null);
  const currency=active?.currency||row.currency||'ARS';
  return {
    id:row.id,slug:row.slug,publicationStatus:row.status||'draft',title:row.name,location:row.location||[row.destination,row.country].filter(Boolean).join(', '),destination:row.destination||'',country:row.country||'',duration:row.duration||'',image:hero,
    lead:row.lead||'',intro:row.intro||'',
    itinerary:itinerary.map((x:any)=>[x.day_label,x.title,x.description]),
    itineraryImages:itinerary.map((x:any)=>x.image_url||hero),
    included:items.filter((x:any)=>x.item_type==='included').map((x:any)=>x.label),
    notIncluded:items.filter((x:any)=>x.item_type==='not_included').map((x:any)=>x.label),
    docs:items.filter((x:any)=>x.item_type==='document').map((x:any)=>x.label),
    seasons:seasons.map((x:any)=>[x.period,x.description,x.image_url||hero]),
    faqs:faqs.map((x:any)=>[x.question,x.answer]),
    price:money(amount,currency),numericPrice:amount,currency,deposit:row.deposit_text||'Seña para confirmar el cupo',status:row.sales_status||'Disponible',
    spots:active?Math.max(Number(active.capacity||0)-Number(active.sold||0),0):0,
    departures:departures.length?departures.map((d:any)=>dateLabel(d.starts_on,d.ends_on)):['Consultar próxima salida'],
    heroImage:hero,editorialImage:imageFor('editorial',hero),communityImage:imageFor('community',hero),closingImage:imageFor('closing',hero),blogEnabled:Boolean(row.blog_enabled)
  };
}
