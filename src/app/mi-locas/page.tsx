import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Bell, BookOpen, Heart, Map, MessageCircle, UsersRound } from "lucide-react";

export const dynamic="force-dynamic";

export default async function MiLocasPage() {
  const supabase=createSupabaseClient();
  const [{data:posts},{count:memberCount}] = await Promise.all([
    supabase.from("community_posts").select("id,title,body,reply_count,like_count,created_at,community_members(display_name),community_categories(name,slug)").order("is_pinned",{ascending:false}).order("created_at",{ascending:false}).limit(3),
    supabase.from("community_members").select("id",{count:"exact",head:true})
  ]);
  return (
    <main className="memberHub">
      <header className="memberNav shell">
        <Link className="memberBrand" href="/">LOCAS <span>POR LA AVENTURA</span></Link>
        <nav><Link href="/viajes">Viajes</Link><Link className="active" href="/mi-locas">Mi Locas</Link><Link href="/mi-locas/comunidad">Comunidad</Link><Link href="/mi-viaje">Mi Viaje</Link></nav>
      </header>

      <section className="memberHero shell">
        <div><span>MI LOCAS</span><h1>Tu espacio dentro de la comunidad.</h1><p>Guardá viajes, seguí alertas y conectate con otras mujeres antes, durante y después de cada aventura.</p></div>
        <Link className="memberCommunityCta" href="/mi-locas/comunidad"><UsersRound size={22}/><span><b>Entrar a la comunidad</b><small>{memberCount||0} integrantes · conversaciones activas</small></span><strong>→</strong></Link>
      </section>

      <section className="memberOverview shell">
        <article><span><Heart size={18}/> FAVORITOS</span><strong>4</strong><p>Ushuaia, Italia, Turquía y Puerto Rico</p><Link href="/viajes">Ver viajes →</Link></article>
        <article><span><Bell size={18}/> ALERTAS</span><strong>3</strong><p>Salidas nuevas y avisos de cupos</p><button>Administrar alertas</button></article>
        <article><span><Map size={18}/> LISTA DE ESPERA</span><strong>1</strong><p>Turquía · próxima salida</p><button>Ver estado</button></article>
        <article><span><BookOpen size={18}/> PERFIL VIAJERO</span><strong>Lucía P.</strong><p>Argentina · Aventura · Patagonia</p><button>Editar perfil</button></article>
      </section>

      <section className="memberCommunityPreview shell">
        <div className="memberSectionHead"><div><span>COMUNIDAD</span><h2>Lo que están hablando ahora.</h2></div><Link href="/mi-locas/comunidad">Ver todo el foro →</Link></div>
        <div className="memberFeedPreview">
          {(posts||[]).map((post:any)=>{
            const member=Array.isArray(post.community_members)?post.community_members[0]:post.community_members;
            const category=Array.isArray(post.community_categories)?post.community_categories[0]:post.community_categories;
            return <Link href={`/mi-locas/comunidad?post=${post.id}`} key={post.id} className="memberFeedCard">
              <div><span>{category?.name||"General"}</span><time>{new Date(post.created_at).toLocaleDateString("es-AR",{day:"2-digit",month:"short"})}</time></div>
              <h3>{post.title}</h3><p>{post.body}</p>
              <footer><b>{member?.display_name||"Comunidad Locas"}</b><span><MessageCircle size={15}/>{post.reply_count||0} respuestas · ♡ {post.like_count||0}</span></footer>
            </Link>
          })}
        </div>
      </section>
    </main>
  );
}
