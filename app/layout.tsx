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
    <html lang="hu" className={`${bebasNeue.variable} ${outfit.variable} ${cinzel.variable}`}>
      <body className="fixed inset-0 overflow-hidden bg-black">
        <div className="h-full overflow-y-auto overflow-x-hidden overscroll-none">
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
