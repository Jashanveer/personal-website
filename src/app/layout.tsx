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
  title: "Jashanveer Singh | Java Backend / Full-Stack Engineer",
  description:
    "Java backend and full-stack engineer specializing in Spring Boot, REST APIs, PostgreSQL, Redis, and React. Currently at onAir Tech.",
  metadataBase: new URL("https://jashanveer.com"),
  openGraph: {
    title: "Jashanveer Singh | Java Backend / Full-Stack Engineer",
    description:
      "Java backend and full-stack engineer. Spring Boot, PostgreSQL, Redis, React, Rung Backend, and onAir Tech.",
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
