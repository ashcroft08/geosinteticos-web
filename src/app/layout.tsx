import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "G&G | Geosintéticos y Geomembranas en Ecuador",
  description:
    "Expertos en instalación y asesoría de geosintéticos para minería, agricultura y construcción en todo el Ecuador",
  keywords:
    "geomembranas, geotextiles, impermeabilización, minería, agricultura, construcción, Ecuador, geosintéticos, gaviones",
  openGraph: {
    title: "G&G | Geosintéticos y Geomembranas en Ecuador",
    description:
      "Expertos en instalación y asesoría de geosintéticos para minería, agricultura y construcción en todo el Ecuador",
    type: "website",
    url: "https://geosinteticos.com.ec", // Ajustar si el dominio real es diferente
    siteName: "G&G Geosintéticos",
    locale: "es_EC",
    images: [
      {
        url: "/Logo.png",
        width: 800,
        height: 600,
        alt: "G&G Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "G&G | Geosintéticos y Geomembranas en Ecuador",
    description:
      "Expertos en instalación y asesoría de geosintéticos para minería, agricultura y construcción en todo el Ecuador",
    images: ["/Logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
