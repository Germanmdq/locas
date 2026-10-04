"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Clock3, MapPin, Menu, Plane, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import styles from "./home-premium.module.css";

const destinations = [
  {
    name: "Ushuaia",
    eyebrow: "Fin del mundo",
    image: "/destinations/ushuaia.jpg",
    href: "/viajes/ushuaia",
    meta: "Patagonia · Argentina",
  },
  {
    name: "Trevelin",
    eyebrow: "Ruta de los tulipanes",
    image: "/destinations/trevelin.jpg",
    href: "/viajes/trevelin",
    meta: "Chubut · Argentina",
  },
  {
    name: "Puerto Rico",
    eyebrow: "Caribe entre amigas",
    image: "/destinations/puerto-rico.jpg",
    href: "/viajes/puerto-rico",
    meta: "Caribe",
  },
];

const benefits = [
  ["Viajes pensados para mujeres", "Grupos cuidados, acompañamiento y experiencias que se disfrutan desde el primer día."],
  ["Todo resuelto", "Nos ocupamos de la organización para que vos te dediques a vivir el viaje."],
  ["Comunidad real", "Viajás con mujeres que también eligieron animarse. Muchas vuelven a viajar juntas."],
  ["Experiencias con identidad", "No coleccionamos destinos: diseñamos momentos que vas a seguir contando después de volver."],
];

export default function HomePremium() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Locas por la aventura">
          <span className={styles.brandMark}>L</span>
          <span>Locas por la aventura</span>
        </Link>

        <nav className={styles.nav}>
          <a href="#nosotras">Nosotras</a>
          <a href="#viajes">Viajes</a>
          <a href="#ventajas">Por qué Locas</a>
          <a href="#comunidad">Comunidad</a>
        </nav>

        <button className={styles.contactButton} onClick={() => setOpen(true)}>
          <Plane size={15} strokeWidth={1.6} />
          Quiero viajar
        </button>

        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          {menuOpen ? <X /> : <Menu />}
        </button>

        {menuOpen && (
          <div className={styles.mobileNav}>
            <a href="#nosotras" onClick={() => setMenuOpen(false)}>Nosotras</a>
            <a href="#viajes" onClick={() => setMenuOpen(false)}>Viajes</a>
            <a href="#ventajas" onClick={() => setMenuOpen(false)}>Por qué Locas</a>
            <a href="#comunidad" onClick={() => setMenuOpen(false)}>Comunidad</a>
            <button onClick={() => { setMenuOpen(false); setOpen(true); }}>Quiero viajar</button>
          </div>
        )}
      </header>

      <section className={styles.hero} id="inicio">
        <div className={styles.heroMedia}>
          <video autoPlay muted loop playsInline poster="/hero-airport-locas.png">
            <source src="/locas_video_loop.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroShade} />
          <div className={styles.heroWindow} />
        </div>

        <div className={styles.heroCopy}>
          <div className={styles.heroLine}>
            <h1>Somos movimiento</h1>
            <h2>Somos aventura</h2>
          </div>

          <div className={styles.heroBottom}>
            <div className={styles.heroIntro}>
              <p className={styles.kicker}>Tu libertad de vivir el mundo</p>
              <div className={styles.rule} />
              <p className={styles.heroText}>
                Viajes para mujeres que quieren conocer lugares increíbles,
                compartir experiencias y volver con historias nuevas.
              </p>
            </div>

            <a href="#nosotras" className={styles.scrollCue}>
              <span className={styles.scrollIcon}><ArrowDown size={18} /></span>
              <span><strong>Descubrí Locas</strong><small>Empezá el viaje</small></span>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.about} id="nosotras">
        <p className={styles.sectionLabel}>01 — Nosotras</p>
        <h3>
          No vendemos solamente viajes.
          <span> Creamos la excusa perfecta para animarte a ir.</span>
        </h3>

        <div className={styles.stats}>
          <div><strong>1.4M</strong><span>comunidad en redes</span></div>
          <div><strong>+60</strong><span>viajeras por mes</span></div>
          <div><strong>100%</strong><span>experiencias acompañadas</span></div>
        </div>
      </section>

      <section className={styles.skyBridge} aria-hidden="true">
        <div className={`${styles.cloud} ${styles.cloudOne}`} />
        <div className={`${styles.cloud} ${styles.cloudTwo}`} />
        <span>El mundo se ve distinto cuando viajás acompañada</span>
      </section>

      <section className={styles.destinations} id="viajes">
        <div className={styles.sectionTop}>
          <div>
            <p className={styles.sectionLabelDark}>02 — Próximos viajes</p>
            <h3>Elegí dónde empieza<br />tu próxima historia.</h3>
          </div>
          <p>
            Cada destino está armado de punta a punta: itinerario, acompañamiento,
            momentos libres y una comunidad con ganas de vivirlo.
          </p>
        </div>

        <div className={styles.destinationStage}>
          <div className={styles.destinationImageWrap}>
            {destinations.map((destination, index) => (
              <img
                key={destination.name}
                src={destination.image}
                alt={destination.name}
                className={index === active ? styles.destinationImageActive : styles.destinationImage}
              />
            ))}
            <div className={styles.destinationOverlay} />
            <div className={styles.destinationName}>
              <span>{destinations[active].eyebrow}</span>
              <strong>{destinations[active].name}</strong>
              <small>{destinations[active].meta}</small>
            </div>
          </div>

          <div className={styles.destinationRail}>
            {destinations.map((destination, index) => (
              <button
                key={destination.name}
                className={index === active ? styles.destinationTabActive : styles.destinationTab}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span>0{index + 1}</span>
                <strong>{destination.name}</strong>
                <ArrowRight size={18} />
              </button>
            ))}
            <Link href={destinations[active].href} className={styles.tripLink}>
              Ver viaje <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.specs}>
        <div className={styles.specsLead}>
          <p className={styles.sectionLabelDark}>Viaje destacado</p>
          <h3>Ushuaia</h3>
          <p>Una experiencia en el fin del mundo, pensada para vivir Patagonia sin apuro y entre amigas.</p>
          <Link href="/viajes/ushuaia">Conocer el viaje <ArrowRight size={16} /></Link>
        </div>

        <div className={styles.specGrid}>
          <div><CalendarDays /><span>Próxima salida</span><strong>Consultar fecha</strong></div>
          <div><Clock3 /><span>Duración</span><strong>Experiencia completa</strong></div>
          <div><Users /><span>Grupo</span><strong>Cupos limitados</strong></div>
          <div><MapPin /><span>Destino</span><strong>Ushuaia, Argentina</strong></div>
        </div>
      </section>

      <section className={styles.benefits} id="ventajas">
        <div className={styles.sectionTopLight}>
          <div>
            <p className={styles.sectionLabel}>03 — La experiencia</p>
            <h3>Viajar con Locas<br />se siente diferente.</h3>
          </div>
          <Sparkles size={40} strokeWidth={1.1} />
        </div>

        <div className={styles.benefitGrid}>
          {benefits.map(([title, description], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div className={styles.rule} />
              <h4>{title}</h4>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.community} id="comunidad">
        <div className={styles.communityMedia}>
          <img src="/hero-airport-locas.png" alt="Mujeres viajando juntas" />
        </div>
        <div className={styles.communityCopy}>
          <p className={styles.sectionLabelDark}>04 — Comunidad</p>
          <h3>Primero desconocidas.<br />Después compañeras de viaje.</h3>
          <p>
            Hay destinos que se recuerdan por el paisaje. Otros, por las personas con
            las que los viviste. En Locas pasan las dos cosas.
          </p>
          <button onClick={() => setOpen(true)}>Quiero ser parte <ArrowRight size={16} /></button>
        </div>
      </section>

      <section className={styles.cta}>
        <span>Tu próximo viaje puede empezar hoy.</span>
        <button onClick={() => setOpen(true)}>
          <Plane size={26} strokeWidth={1.2} />
          <strong>Contanos adónde querés ir</strong>
          <ArrowRight size={20} />
        </button>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>Locas por la aventura</div>
        <div className={styles.footerLinks}>
          <a href="#viajes">Viajes</a>
          <a href="#nosotras">Nosotras</a>
          <button onClick={() => setOpen(true)}>Contacto</button>
        </div>
        <small>Viajar diferente empieza por animarte.</small>
      </footer>

      <button className={styles.floatingPlane} onClick={() => setOpen(true)} aria-label="Abrir consulta">
        <Plane size={23} strokeWidth={1.4} />
        <span>Quiero viajar</span>
      </button>

      {open && (
        <div className={styles.modalBackdrop} onMouseDown={() => setOpen(false)}>
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Cerrar"><X /></button>
            <div className={styles.modalIcon}><Plane size={34} strokeWidth={1.2} /></div>
            <p className={styles.sectionLabelDark}>Empezá por acá</p>
            <h3>¿Qué viaje tenés ganas de vivir?</h3>
            <p className={styles.modalLead}>Dejanos tus datos y te contamos las próximas salidas que mejor encajan con vos.</p>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <label>Nombre<input type="text" placeholder="Tu nombre" /></label>
              <label>WhatsApp<input type="tel" placeholder="+54..." /></label>
              <label>Email<input type="email" placeholder="vos@email.com" /></label>
              <label>Destino que te interesa
                <select defaultValue="">
                  <option value="" disabled>Elegí un destino</option>
                  <option>Ushuaia</option>
                  <option>Trevelin</option>
                  <option>Puerto Rico</option>
                  <option>Quiero que me recomienden</option>
                </select>
              </label>
              <button type="submit">Quiero recibir información <ArrowRight size={16} /></button>
            </form>
            <div className={styles.trust}><ShieldCheck size={16} /> Tus datos se usan solo para responder tu consulta.</div>
          </div>
        </div>
      )}
    </main>
  );
}
