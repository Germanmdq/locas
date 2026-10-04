"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import "./viaje-3d.css";

declare global {
  interface Window {
    maplibregl?: any;
  }
}

const OBELISCO = { center: [-58.381592, -34.603738] as [number, number], zoom: 13.8, pitch: 62, bearing: 18 };
const PATAGONIA = { center: [-67.2, -45.8] as [number, number], zoom: 3.9, pitch: 42, bearing: 178 };
const USHUAIA = { center: [-68.303, -54.8019] as [number, number], zoom: 11.8, pitch: 67, bearing: 205 };

export default function Viaje3DPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [maplibreLoaded, setMaplibreLoaded] = useState(false);
  const [message, setMessage] = useState("Cargando mapa satelital…");

  useEffect(() => {
    if (!maplibreLoaded || !mountRef.current || !window.maplibregl) return;

    const maplibregl = window.maplibregl;
    const map = new maplibregl.Map({
      container: mountRef.current,
      center: OBELISCO.center,
      zoom: OBELISCO.zoom,
      pitch: OBELISCO.pitch,
      bearing: OBELISCO.bearing,
      maxPitch: 85,
      attributionControl: true,
      style: {
        version: 8,
        projection: { type: "globe" },
        sources: {
          satellite: {
            type: "raster",
            tiles: [
              "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"
            ],
            tileSize: 256,
            attribution: "Sentinel-2 cloudless · EOX"
          },
          terrain: {
            type: "raster-dem",
            url: "https://tiles.mapterhorn.com/tilejson.json",
            tileSize: 512,
            maxzoom: 12
          }
        },
        layers: [
          {
            id: "satellite",
            type: "raster",
            source: "satellite"
          },
          {
            id: "hillshade",
            type: "hillshade",
            source: "terrain",
            paint: {
              "hillshade-exaggeration": 0.28
            }
          }
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.35
        },
        sky: {
          "sky-color": "#07111f",
          "horizon-color": "#56718f",
          "fog-color": "#0d1420",
          "sky-horizon-blend": 0.08,
          "fog-ground-blend": 0.65
        }
      }
    });

    mapRef.current = map;

    map.on("load", () => {
      setReady(true);
      setMessage("Obelisco → Ushuaia listo para probar");
    });

    map.on("error", (event: any) => {
      console.error("MapLibre error", event?.error || event);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [maplibreLoaded]);

  function fly(map: any, options: any) {
    return new Promise<void>((resolve) => {
      map.once("moveend", () => resolve());
      map.flyTo({ ...options, essential: true });
    });
  }

  async function volarAUshuaia() {
    const map = mapRef.current;
    if (!map) return;

    setReady(false);
    setMessage("Despegando del Obelisco…");

    await fly(map, {
      center: [-59.5, -36.6],
      zoom: 7.3,
      pitch: 70,
      bearing: 175,
      duration: 2200,
      curve: 1.55
    });

    setMessage("Cruzando Patagonia…");

    await fly(map, {
      ...PATAGONIA,
      duration: 2600,
      curve: 1.25
    });

    setMessage("Descendiendo hacia Ushuaia…");

    await fly(map, {
      ...USHUAIA,
      duration: 4200,
      curve: 1.45
    });

    setMessage("Llegamos a Ushuaia");
    setReady(true);
  }

  function volver() {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ ...OBELISCO, duration: 3200, essential: true });
    setMessage("Volviendo al Obelisco…");
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.css" />
      <Script
        src="https://unpkg.com/maplibre-gl@6.11.2/dist/maplibre-gl.js"
        strategy="afterInteractive"
        onLoad={() => setMaplibreLoaded(true)}
      />

      <main className="travel3d">
        <div ref={mountRef} className="travel3d-map" />
        <div className="travel3d-shade" />

        <div className="travel3d-top">
          <span>LOCAS POR LA AVENTURA</span>
          <span className="travel3d-badge">SATÉLITE + RELIEVE 3D · SIN GOOGLE</span>
        </div>

        <div className="travel3d-ui">
          <div>
            <p className="travel3d-kicker">VUELO AUTOMÁTICO</p>
            <h1>Buenos Aires <span>→</span> Ushuaia</h1>
            <p className="travel3d-status">{message}</p>
          </div>

          <div className="travel3d-actions">
            <button className="travel3d-secondary" onClick={volver}>Reiniciar</button>
            <button onClick={volarAUshuaia} disabled={!ready}>Iniciar viaje</button>
          </div>
        </div>
      </main>
    </>
  );
}
