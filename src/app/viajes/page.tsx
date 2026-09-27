import Image from "next/image";
import Link from "next/link";

const trips = [
  { name: "Ushuaia", region: "Patagonia", days: "5 días / 4 noches", price: "Desde USD 1.290", image: "/destinations/ushuaia.jpg", href: "/viajes/ushuaia", status: "Últimos cupos" },
  { name: "Catamarca", region: "Norte argentino", days: "7 días / 6 noches", price: "Consultar", image: "/destinations/catamarca.jpg", href: "/viajes/catamarca", status: "Disponible" },
  { name: "Trevelin", region: "Patagonia", days: "5 días / 4 noches", price: "Consultar", image: "/destinations/trevelin.jpg", href: "/viajes/trevelin", status: "Nueva salida" },
  { name: "Puerto Rico", region: "Caribe", days: "8 días / 7 noches", price: "Consultar", image: "/destinations/puerto-rico.jpg", href: "/viajes/puerto-rico", status: "Disponible" },
  { name: "San Martín de los Andes", region: "Patagonia", days: "5 días / 4 noches", price: "Consultar", image: "/destinations/san-martin.jpg", href: "/viajes/san-martin-de-los-andes", status: "Disponible" },
];

export default function ViajesPage() {
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
          <Link className="tripCatalogCard" href={trip.href} key={trip.name}>
            <div className="tripCatalogImage"><Image src={trip.image} alt={trip.name} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
            <div className="tripCatalogCopy">
              <div><span>{trip.region}</span><b>{trip.status}</b></div>
              <h2>{trip.name}</h2>
              <p>{trip.days}</p>
              <strong>{trip.price}</strong>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
