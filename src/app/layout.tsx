import type { Metadata } from "next";
import "./globals.css";
import "./avenora-original.css";

export const metadata: Metadata = {
  title: "Avenora – Webflow HTML Website Template",
  description: "Avenora is a modern travel agency Webflow template for tours, destinations, travel planning, blogs, and adventure booking websites.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
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
      <body>{children}</body>
    </html>
  );
}
