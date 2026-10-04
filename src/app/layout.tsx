import type { Metadata } from "next";
import { Suspense } from "react";
import WebTracker from "./WebTracker";
import "@astryxdesign/core/astryx.css";
import "@astryxdesign/theme-neutral/theme.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locas por la aventura",
  description: "Viajes a medida, experiencias y aventuras pensadas para mujeres que quieren viajar diferente.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://cdn.prod.website-files.com" crossOrigin="anonymous" />
      </head>
      <body><Suspense fallback={null}><WebTracker /></Suspense>{children}</body>
    </html>
  );
}
