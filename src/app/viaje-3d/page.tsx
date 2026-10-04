"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./viaje-3d.css";

const OBELISCO = { center: [-58.381592, -34.603738] as [number, number], zoom: 13.8, pitch: 62, bearing: 18 };
const PATAGONIA = { center: [-67.2, -45.8] as [number, number], zoom: 3.9, pitch: 42, bearing: 178 };
const USHUAIA = { center: [-68.303, -54.8019] as [number, number], zoom: 12.8, pitch: 72, bearing: 208 };

export default function Viaje3DPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Cargando imagen satelital…");

  useEffect(() => {
    if (!mountRef.current) return;

    const map = new maplibregl.Map({
      container: mountRef.current,
      center: OBELISCO.center,
      zoom: OBELISCO.zoom,
      pitch: OBELISCO.pitch,
      bearing: OBELISCO.bearing,
      maxPitch: 85,
      attributionControl: {},
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            maxzoom: 19,
            attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics"
          },
          terrain: {
            type: "raster-dem",
            tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
            tileSize: 256,
            maxzoom: 15,
            encoding: "terrarium"
          }
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm"
          }
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.45
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
  }, []);

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
      <main className="travel3d">
        <div ref={mountRef} className="travel3d-map" />
        <div className="travel3d-shade" />

        <div className="travel3d-top">
          <span>LOCAS POR LA AVENTURA</span>
          <span className="travel3d-badge">IMAGEN SATELITAL · SIN GOOGLE</span>
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
