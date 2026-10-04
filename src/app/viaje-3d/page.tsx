"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import "./viaje-3d.css";

declare global {
  interface Window {
    Cesium?: any;
  }
}

const OBELISCO = { lon: -58.381592, lat: -34.603738, height: 1800 };
const USHUAIA = { lon: -68.303, lat: -54.8019, height: 3000 };

export default function Viaje3DPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<any>(null);
  const cesiumRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Cargando motor 3D…");
  const [cesiumLoaded, setCesiumLoaded] = useState(false);

  useEffect(() => {
    if (!cesiumLoaded) return;
    let disposed = false;

    async function init() {
      const key = process.env.NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY;
      if (!key) {
        setMessage("Falta NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY");
        return;
      }

      const Cesium = window.Cesium;
      if (!Cesium) {
        setMessage("No se pudo cargar CesiumJS");
        return;
      }
      if (disposed || !mountRef.current) return;
      cesiumRef.current = Cesium;

      const widget = new Cesium.CesiumWidget(mountRef.current, {
        baseLayer: false,
        globe: false,
        skyBox: false,
        requestRenderMode: false,
      });
      widgetRef.current = widget;

      try {
        const tileset = await Cesium.createGooglePhotorealistic3DTileset({ key });
        widget.scene.primitives.add(tileset);
      } catch (error) {
        console.error(error);
        setMessage("No se pudieron cargar los tiles 3D de Google. Revisá la API key y Map Tiles API.");
        return;
      }

      widget.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(OBELISCO.lon, OBELISCO.lat, OBELISCO.height),
        orientation: {
          heading: Cesium.Math.toRadians(10),
          pitch: Cesium.Math.toRadians(-48),
          roll: 0,
        },
      });

      setReady(true);
      setMessage("Obelisco → Ushuaia listo para probar");
    }

    init();
    return () => {
      disposed = true;
      widgetRef.current?.destroy();
      widgetRef.current = null;
    };
  }, [cesiumLoaded]);

  async function volarAUshuaia() {
    const widget = widgetRef.current;
    const Cesium = cesiumRef.current;
    if (!widget || !Cesium) return;

    setMessage("Despegando de Buenos Aires…");

    await new Promise<void>((resolve) => {
      widget.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-61.2, -41.7, 900000),
        orientation: {
          heading: Cesium.Math.toRadians(175),
          pitch: Cesium.Math.toRadians(-72),
          roll: 0,
        },
        duration: 2.4,
        complete: resolve,
      });
    });

    setMessage("Cruzando Patagonia…");

    await new Promise<void>((resolve) => {
      widget.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(USHUAIA.lon, USHUAIA.lat, USHUAIA.height),
        orientation: {
          heading: Cesium.Math.toRadians(205),
          pitch: Cesium.Math.toRadians(-42),
          roll: 0,
        },
        duration: 4.8,
        complete: resolve,
      });
    });

    setMessage("Llegamos a Ushuaia");
  }

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cesium@1.133.0/Build/Cesium/Widgets/widgets.css" />
      <Script
        src="https://cdn.jsdelivr.net/npm/cesium@1.133.0/Build/Cesium/Cesium.js"
        strategy="afterInteractive"
        onLoad={() => setCesiumLoaded(true)}
      />
      <main className="travel3d">
        <div ref={mountRef} className="travel3d-map" />
        <div className="travel3d-shade" />
        <div className="travel3d-ui">
          <div>
            <p className="travel3d-kicker">LOCAS POR LA AVENTURA · PRUEBA 3D</p>
            <h1>Buenos Aires <span>→</span> Ushuaia</h1>
            <p className="travel3d-status">{message}</p>
          </div>
          <button onClick={volarAUshuaia} disabled={!ready}>Iniciar viaje</button>
        </div>
      </main>
    </>
  );
}
