import type { Metadata } from "next";
import { Inter, Instrument_Serif, Archivo_Black } from "next/font/google";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-loaded",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jashanveer Singh — Software Engineer",
  description:
    "Software engineer building for the web and native on Apple platforms. Currently @ onAir Tech, shipping Rung and Earth Lens on the side.",
  metadataBase: new URL("https://jashanveer.com"),
  openGraph: {
    title: "Jashanveer Singh — Software Engineer",
    description:
      "Building for the web, native on Apple platforms. Earth Lens · Rung · onAir Tech.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} ${archivoBlack.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-cream font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
