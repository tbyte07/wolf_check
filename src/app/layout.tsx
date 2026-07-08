import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Figtree } from "next/font/google";
import "./globals.css";

// Display = Barlow Semi Condensed (heavy italic) — stands in for More's
// proprietary condensed-italic display face. Body = Figtree.
const display = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WolfCheck",
  description:
    "WolfCheck — virale Videos mit Ernährungs-Falschaussagen prüfen und richtigstellen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
