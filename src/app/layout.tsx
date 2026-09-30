import type { Metadata } from "next";
import { Suspense } from "react";
import WebTracker from "./WebTracker";
import "@astryxdesign/core/astryx.css";
import "@astryxdesign/theme-neutral/theme.css";
import "./globals.css";
import "./avenora-original.css";

export const metadata: Metadata = {
  title: "Locas por la aventura",
  description: "Viajes a medida, experiencias y aventuras pensadas para mujeres que quieren viajar diferente.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className="w-mod-js w-mod-ix3"
      data-wf-domain="avenora.webflow.io"
      data-wf-page="6a13e532999601af0ed6354a"
      data-wf-site="6a13e532999601af0ed6354d"
    >
      <head>
        <link rel="preconnect" href="https://cdn.prod.website-files.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.prod.website-files.com/6a13e532999601af0ed6354d/css/avenora.webflow.shared.b8240b304.css"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body><Suspense fallback={null}><WebTracker /></Suspense>{children}</body>
    </html>
  );
}
