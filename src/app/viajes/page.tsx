import Image from "next/image";
import Link from "next/link";
import { getPublishedTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function ViajesPage() {
  const trips=await getPublishedTrips(false);
  return (
    <main className="subPage">
      <header className="subNav shell">
        <Link className="logo darkLogo" href="/">LOCAS <span>POR LA AVENTURA</span></Link>
        <nav><Link href="/">Inicio</Link><Link href="/mi-locas">Mi Locas</Link><Link href="/mi-viaje">Mi Viaje</Link></nav>
      </header>

      <section className="catalogHero shell">
        <p className="eyebrow">PRÓXIMAS AVENTURAS</p>
        <h1>Encontrá el viaje que te está esperando.</h1>
        <p>Filtrá por destino, fecha, duración, presupuesto, actividad, temporada y disponibilidad.</p>
      </section>

      <section className="filterBar shell">
        <button>Destino ▾</button><button>Fecha ▾</button><button>Duración ▾</button><button>Presupuesto ▾</button><button>Actividad ▾</button><button>Disponibilidad ▾</button>
      </section>

      <section className="tripCatalog shell">
        {trips.map((trip) => (
          <Link className="tripCatalogCard" href={`/viajes/${trip.slug}`} key={trip.id}>
            <div className="tripCatalogImage"><Image src={trip.heroImage} alt={trip.title} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
            <div className="tripCatalogCopy">
              <div><span>{trip.destination}</span><b>{trip.status}</b></div>
              <h2>{trip.title}</h2>
              <p>{trip.duration} · {trip.spots} lugares disponibles</p>
              <strong>{trip.price}</strong>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
