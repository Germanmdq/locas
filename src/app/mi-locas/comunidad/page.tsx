import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import CommunityClient from "./CommunityClient";

export const dynamic="force-dynamic";

export default async function CommunityPage(){
 const s=createSupabaseClient();
 const [{data:categories},{data:posts},{data:members}] = await Promise.all([
  s.from("community_categories").select("*").order("sort_order"),
  s.from("community_posts").select("*,community_categories(id,name,slug),community_members(id,display_name,city,country)").order("is_pinned",{ascending:false}).order("created_at",{ascending:false}),
  s.from("community_members").select("*").order("created_at")
 ]);
 return <main className="communityPage">
  <header className="memberNav shell"><Link className="memberBrand" href="/">LOCAS <span>POR LA AVENTURA</span></Link><nav><Link href="/viajes">Viajes</Link><Link href="/mi-locas">Mi Locas</Link><Link className="active" href="/mi-locas/comunidad">Comunidad</Link><Link href="/mi-viaje">Mi Viaje</Link></nav></header>
  <CommunityClient initialCategories={categories||[]} initialPosts={posts||[]} members={members||[]}/>
 </main>
}
