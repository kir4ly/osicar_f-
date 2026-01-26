import type { Metadata } from "next";
import { Bebas_Neue, Outfit, Cinzel } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinematic",
});

export const metadata: Metadata = {
  title: "AutoPiac - Megbízható Használt Autók",
  description:
    "Prémium használt autók széles kínálata Budapesten. BMW, Mercedes, Audi és más márkák. Átlátható ügyintézés, garanciával.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${bebasNeue.variable} ${outfit.variable} ${cinzel.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
