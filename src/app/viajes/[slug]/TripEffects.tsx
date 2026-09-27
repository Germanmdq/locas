"use client";
import { useEffect } from "react";

export default function TripEffects() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-trip-reveal]"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    els.forEach((el) => io.observe(el));

    const track = document.querySelector<HTMLElement>(".locas-related-track");
    let raf = 0;
    let x = 0;
    const animate = () => {
      if (track && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        x -= 0.35;
        const half = track.scrollWidth / 2;
        if (half && Math.abs(x) >= half) x = 0;
        track.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
