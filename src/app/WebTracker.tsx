"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent, tripSlugFromPath } from "@/lib/tracking";

export default function WebTracker(){
  const pathname=usePathname();
  const search=useSearchParams();
  const seen=useRef(new Set<string>());

  useEffect(()=>{
    const slug=tripSlugFromPath(pathname);
    seen.current=new Set();
    void trackEvent("page_view",{pathname,search:search.toString()},slug);
    if(pathname.startsWith("/viajes/") && slug) void trackEvent("trip_view",{trip_slug:slug},slug);
    if(pathname.startsWith("/blog/") && slug) void trackEvent("blog_view",{trip_slug:slug},slug);

    const timers:number[]=[];
    if(pathname.startsWith("/viajes/") && slug){
      timers.push(window.setTimeout(()=>void trackEvent("trip_view_30s",{seconds:30},slug),30000));
      timers.push(window.setTimeout(()=>void trackEvent("trip_view_60s",{seconds:60},slug),60000));
    }

    let maxScroll=0;
    const onScroll=()=>{
      const root=document.documentElement;
      const total=Math.max(root.scrollHeight-window.innerHeight,1);
      const pct=Math.round((window.scrollY/total)*100);
      maxScroll=Math.max(maxScroll,pct);
      if(pathname.startsWith("/blog/") && pct>=50 && !seen.current.has("blog_scroll_50")){
        seen.current.add("blog_scroll_50"); void trackEvent("blog_scroll_50",{scroll_percent:pct},slug);
      }
      if(pathname.startsWith("/blog/") && pct>=90 && !seen.current.has("blog_complete")){
        seen.current.add("blog_complete"); void trackEvent("blog_complete",{scroll_percent:pct},slug);
      }
    };
    window.addEventListener("scroll",onScroll,{passive:true});

    const observed=[
      [".trip-itinerary","itinerary_view"],
      [".trip-commerce-card","price_view"],
      [".trip-commerce-card","availability_view"],
      [".trip-blog-card","blog_card_view"],
      [".trip-community-story","community_view"],
    ] as const;
    const io=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting) continue;
        const event=(entry.target as HTMLElement).dataset.trackView;
        if(event && !seen.current.has(event)){seen.current.add(event);void trackEvent(event,{section:(entry.target as HTMLElement).className},slug)}
      }
    },{threshold:.35});
    observed.forEach(([selector,event])=>document.querySelectorAll<HTMLElement>(selector).forEach(el=>{el.dataset.trackView=event;io.observe(el)}));

    const click=(e:MouseEvent)=>{
      const target=(e.target as Element|null)?.closest<HTMLElement>("a,button,[data-track]");
      if(!target) return;
      const anchor=target.closest("a") as HTMLAnchorElement|null;
      const href=anchor?.href||"";
      const explicit=target.dataset.track;
      if(explicit) void trackEvent(explicit,{label:target.textContent?.trim().slice(0,120),href},slug);
      else if(/wa\.me|whatsapp/i.test(href)) void trackEvent("whatsapp_click",{href},slug);
      else if(href.startsWith("mailto:")) void trackEvent("email_click",{href},slug);
    };
    document.addEventListener("click",click,true);

    return ()=>{
      timers.forEach(clearTimeout); window.removeEventListener("scroll",onScroll); document.removeEventListener("click",click,true); io.disconnect();
      if(maxScroll>0) void trackEvent("page_exit",{max_scroll_percent:maxScroll},slug);
    };
  },[pathname,search]);

  return null;
}
