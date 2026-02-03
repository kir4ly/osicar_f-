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
  title: "OSICAR - Megbízható Használt Autók",
  description:
    "Prémium használt autók széles kínálata. BMW, Mercedes, Audi és más márkák. Átlátható ügyintézés, garanciával.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "OSICAR",
  },
  formatDetection: {
    telephone: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${bebasNeue.variable} ${outfit.variable} ${cinzel.variable} bg-black`}>
      <body className="min-h-screen flex flex-col antialiased bg-black">
        {/* iOS overscroll fekete háttér - Dynamic Island felett */}
        <div
          className="fixed left-0 right-0 bg-black z-[60] pointer-events-none"
          style={{
            top: 'calc(-100vh - env(safe-area-inset-top))',
            height: 'calc(100vh + env(safe-area-inset-top))',
          }}
          aria-hidden="true"
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
