import { Suspense } from "react";
import { cars as staticCars } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";
import { CarData } from "@/lib/supabase";
import { CarFilters } from "./car-filters";

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

export default async function CarsPage() {
  const supabaseCars = await getSupabaseCars();

  return (
    <div className="grain-overlay min-h-screen pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
            Teljes kínálat
          </p>
          <h1 className="text-display-lg md:text-display-xl animate-fade-up delay-100">
            Összes autó
          </h1>
        </div>

        <Suspense fallback={<CarsLoading />}>
          <CarFilters supabaseCars={supabaseCars} staticCars={staticCars} />
        </Suspense>
      </div>
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
