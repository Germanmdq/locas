"use client";

import { useEffect } from "react";
import { jeskoBody } from "./jesko-body";

const scriptSources = [
  "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=68b57ef5ef86011d9b251e8e",
  "https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/js/webflow.schunk.79b71263bda4d666.js",
  "https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/js/webflow.a0aa6ca1.38bff8ac21973156.js",
  "https://unpkg.com/@barba/core",
  "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js",
  "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js",
  "https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.min.js",
  "https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js",
  "https://cdn.jsdelivr.net/npm/globe.gl"
];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-jesko-src="${src}"]`);
    if (existing) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.dataset.jeskoSrc = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.body.appendChild(s);
  });
}

export default function JeskoClone() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("w-mod-js", "w-mod-ix3");
    html.setAttribute("data-wf-domain", "jeskojets.com");
    html.setAttribute("data-wf-page", "68b57ef5ef86011d9b251e8a");
    html.setAttribute("data-wf-site", "68b57ef5ef86011d9b251e8e");
    document.body.className = "body";

    let cancelled = false;
    (async () => {
      try {
        for (const src of scriptSources) {
          if (cancelled) return;
          await loadScript(src);
        }
        if (cancelled) return;
        await loadScript("https://assets.slater.app/slater/16759.js?v=1.0");
      } catch (error) {
        console.error("Jesko clone scripts:", error);
      }
    })();

    return () => {
      cancelled = true;
      document.querySelectorAll("script[data-jesko-src]").forEach(el => el.remove());
      html.removeAttribute("data-wf-domain");
      html.removeAttribute("data-wf-page");
      html.removeAttribute("data-wf-site");
      html.classList.remove("w-mod-js", "w-mod-ix3");
      document.body.className = "";
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.prod.website-files.com/68b57ef5ef86011d9b251e8e/css/jeskojets.webflow.shared.c930478cf.min.css"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.css" />
      <div dangerouslySetInnerHTML={{ __html: jeskoBody }} />
    </>
  );
}
