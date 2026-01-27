import { Suspense } from "react";
import Image from "next/image";
import { cars as staticCars } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";
import { CarData } from "@/lib/supabase";
import { CarFilters } from "./autok/car-filters";
import { CTAButton } from "@/components/cta-button";

// Revalidate every hour
export const revalidate = 3600;

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
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative px-6 lg:px-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Mercedes autószállító"
            fill
            className="object-cover object-bottom"
            priority
            quality={85}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="flex flex-col items-center text-center max-w-4xl relative z-10">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider animate-fade-up mb-2 text-center text-white leading-tight"
          >
            Megbízható autók, korrekt árak. Legyen könnyű a választás.
          </h1>
          <div className="mt-4 animate-fade-up delay-300">
            <CTAButton href="tel:+36706050350">
              Hívjon minket
            </CTAButton>
          </div>
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
            <CarFilters supabaseCars={supabaseCars} staticCars={staticCars} />
          </Suspense>
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
