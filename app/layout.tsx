import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit, Cinzel } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IOSOverscrollFix } from "@/components/ios-overscroll-fix";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cinematic",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "OSICAR - Megbízható Használt Autók",
  description:
    "Prémium használt autók széles kínálata. BMW, Mercedes, Audi és más márkák. Átlátható ügyintézés, garanciával.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
    <html lang="hu" className={`${bebasNeue.variable} ${outfit.variable} ${cinzel.variable}`} style={{ backgroundColor: '#000' }}>
      <body className="min-h-screen flex flex-col antialiased" style={{ backgroundColor: '#000' }}>
        <IOSOverscrollFix />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
