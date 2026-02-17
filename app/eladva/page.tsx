import { createClient } from "@supabase/supabase-js";
import { CarData } from "@/lib/supabase";
import { SoldCarsGrid } from "./sold-cars-grid";

// Revalidate every 60 seconds as fallback
export const revalidate = 60;

// Server-side Supabase client
const supabaseUrl = "https://avtfailpzsnelebpvebz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dGZhaWxwenNuZWxlYnB2ZWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MzEyMzcsImV4cCI6MjA4NTAwNzIzN30.I4_YUG2OuJJLspKh9v5Fp0rfAiRtzuZfLbWQbOd5rg0";

async function getSoldCars(): Promise<CarData[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("sold", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sold cars:", error);
    return [];
  }

  return data || [];
}

async function getFulfilledCars(): Promise<CarData[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("fulfilled", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching fulfilled cars:", error);
    return [];
  }

  return data || [];
}

export default async function EladvaPage() {
  const [soldCars, fulfilledCars] = await Promise.all([
    getSoldCars(),
    getFulfilledCars(),
  ]);

  return (
    <div className="grain-overlay">
      {/* Spacer a fixed header + safe area alatt */}
      <div className="h-20 md:h-24" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }} />

      {/* Sold Cars Section */}
      <section className="py-16 md:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="mb-8 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Korábban eladott
            </p>
            <h1 className="text-display-lg md:text-display-xl animate-fade-up delay-100">
              Eladva
            </h1>
          </div>

          <SoldCarsGrid soldCars={soldCars} fulfilledCars={fulfilledCars} />
        </div>
      </section>
    </div>
  );
}
