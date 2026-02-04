import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { CarData } from "@/lib/supabase";
import { CarFilters } from "./autok/car-filters";
import { CTAButton } from "@/components/cta-button";
import { HeroSection } from "@/components/hero-slideshow";

// Revalidate every 60 seconds as fallback
export const revalidate = 60;

// Server-side Supabase client
const supabaseUrl = "https://avtfailpzsnelebpvebz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dGZhaWxwenNuZWxlYnB2ZWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MzEyMzcsImV4cCI6MjA4NTAwNzIzN30.I4_YUG2OuJJLspKh9v5Fp0rfAiRtzuZfLbWQbOd5rg0";

async function getSupabaseCars(): Promise<CarData[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const supabaseCars = await getSupabaseCars();

  return (
    <div className="grain-overlay">
      {/* Spacer a fixed header + safe area alatt */}
      <div className="md:h-0" style={{ height: 'calc(4rem + env(safe-area-inset-top, 0px))' }} />

      {/* Hero Section */}
      {/* Mobile: stacked layout (image then text below). Desktop: overlay layout */}
      <section id="hero" className="flex flex-col md:pt-0 md:min-h-screen md:justify-end md:items-start md:relative md:px-6 lg:px-12 mb-10 md:pb-48">
        {/* Szöveg - mobilon: 1., desktopon: overlay */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left w-full max-w-4xl relative z-10 px-6 pt-8 pb-4 md:px-0 md:py-0 order-1 md:order-2">
          <h1
            className="font-light uppercase tracking-wider animate-fade-up mb-2 text-white leading-relaxed"
          >
            <span className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3">Megbízható autók, korrekt árak.</span>
            <span className="block text-lg sm:text-2xl md:text-3xl lg:text-4xl">Legyen könnyű a választás.</span>
          </h1>
          {/* Gomb - desktopon a szöveg alatt marad */}
          <div className="hidden md:block mt-6 animate-fade-up delay-300">
            <CTAButton href="tel:+36706050350" variant="hero">
              +36 70 605 0350
            </CTAButton>
          </div>
        </div>

        {/* Background Slideshow - mobilon: 2., desktopon: háttér */}
        <div className="relative w-full aspect-[16/9] md:aspect-auto md:absolute md:inset-0 overflow-hidden order-2 md:order-1">
          <HeroSection />
        </div>

        {/* Gomb - mobilon: 3. (kép alatt) */}
        <div className="flex justify-center w-full px-6 py-4 order-3 md:hidden animate-fade-up delay-300">
          <CTAButton href="tel:+36706050350" variant="hero">
            +36 70 605 0350
          </CTAButton>
        </div>
      </section>

      {/* Cars Section */}
      <section id="kinalat" className="py-16 md:py-32 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="mb-8 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Teljes kínálat
            </p>
            <h2 className="text-display-lg md:text-display-xl animate-fade-up delay-100">
              Összes autó
            </h2>
          </div>

          <Suspense fallback={<CarsLoading />}>
            <CarFilters supabaseCars={supabaseCars} />
          </Suspense>

          {/* Google Maps */}
          <div className="mt-16 md:mt-24 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden max-w-lg w-full shadow-lg">
              <iframe
                src="https://maps.google.com/maps?q=R%C3%A1k%C3%B3czi+Ferenc+utca+73+A,+S%C3%A1rv%C3%A1r,+9600&t=&z=16&ie=UTF8&iwloc=&output=embed&hl=hu"
                className="w-full aspect-[4/3] border-0 pointer-events-none"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="OSICAR - 9600 Sárvár, Rákóczi Ferenc utca 73"
              />
              <a
                href="https://maps.app.goo.gl/zjPXxxa1KiY1GcDE8"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CarsLoading() {
  return (
    <>
      <div className="border-t border-b border-foreground/10 py-8 mb-16 animate-pulse">
        <div className="h-12 bg-foreground/5 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-background p-6 lg:p-8">
            <div className="aspect-[16/10] bg-foreground/5 mb-6 animate-pulse" />
            <div className="space-y-3">
              <div className="h-6 bg-foreground/5 w-3/4 animate-pulse" />
              <div className="h-4 bg-foreground/5 w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
