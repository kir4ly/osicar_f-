import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { CarData } from "@/lib/supabase";
import { Metadata } from "next";
import { CTAButton } from "@/components/cta-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Revalidate every hour
export const revalidate = 3600;

const supabaseUrl = "https://avtfailpzsnelebpvebz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dGZhaWxwenNuZWxlYnB2ZWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MzEyMzcsImV4cCI6MjA4NTAwNzIzN30.I4_YUG2OuJJLspKh9v5Fp0rfAiRtzuZfLbWQbOd5rg0";

async function getCar(id: string): Promise<CarData | null> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getAllCars(): Promise<CarData[]> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data, error } = await supabase
    .from("cars")
    .select("id, brand, model")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as CarData[];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return {
      title: "Autó nem található - OSICAR",
    };
  }

  return {
    title: `${car.brand} ${car.model} ${car.year} - OSICAR`,
    description: car.description,
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year}`,
      description: car.description,
      images: car.images?.[0] ? [car.images[0]] : [],
    },
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("hu-HU").format(mileage);
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [car, allCars] = await Promise.all([getCar(id), getAllCars()]);

  if (!car) {
    notFound();
  }

  // Navigációhoz: előző és következő autó
  const carIndex = allCars.findIndex((c) => c.id === id);
  const prevCar = carIndex > 0 ? allCars[carIndex - 1] : null;
  const nextCar = carIndex < allCars.length - 1 ? allCars[carIndex + 1] : null;

  const specs = [
    { label: "Évjárat", value: car.year.toString() },
    { label: "Kilométer", value: `${formatMileage(car.mileage)} km` },
    { label: "Üzemanyag", value: car.fuel },
    { label: "Váltó", value: car.transmission },
    { label: "Teljesítmény", value: `${car.power} LE` },
    { label: "Szín", value: car.color },
  ];

  return (
    <div className="grain-overlay min-h-screen pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        {/* Back link */}
        <div className="mb-6 md:mb-12 animate-fade-up">
          <CTAButton href="/#kinalat" direction="left">
            Vissza a kínálathoz
          </CTAButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
          {/* Left column - Image */}
          <div className="animate-fade-up delay-100">
            <div className="aspect-[4/3] bg-black overflow-hidden relative">
              {car.images && car.images.length > 0 && car.images[0] ? (
                <Image
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
                  <span className="text-display-lg md:text-display-xl text-foreground/10">
                    {car.brand}
                  </span>
                </div>
              )}
            </div>
            {/* Additional images */}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-1 md:gap-2 mt-1 md:mt-2">
                {car.images.slice(1, 5).map((img, index) => (
                  <div key={index} className="aspect-[4/3] bg-black overflow-hidden relative">
                    <Image
                      src={img}
                      alt={`${car.brand} ${car.model} - ${index + 2}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                      loading="lazy"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div>
            <div className="mb-6 md:mb-12 animate-fade-up delay-200">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4">
                {car.year} / {formatMileage(car.mileage)} km
              </p>
              <h1 className="text-display-lg md:text-display-xl mb-4 md:mb-6">
                {car.brand} {car.model}
              </h1>
              <p
                className="text-display-md md:text-display-lg text-primary"
                style={{
                  textShadow: '0 0 10px rgba(52, 118, 234, 0.5), 0 0 20px rgba(52, 118, 234, 0.3), 0 0 30px rgba(52, 118, 234, 0.2)'
                }}
              >{formatPrice(car.price)} Ft</p>
            </div>

            <div className="h-px bg-foreground/10 mb-6 md:mb-12 animate-line-expand delay-300"></div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-12">
              {specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-1 md:mb-2">
                    {spec.label}
                  </p>
                  <p className="text-base md:text-lg capitalize">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-foreground/10 mb-6 md:mb-12 animate-line-expand delay-500"></div>

            {/* Description */}
            <div className="mb-6 md:mb-12 animate-fade-up delay-600">
              <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-4">
                Leírás
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mb-6 md:mb-12 animate-fade-up delay-700">
                <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-2 md:mb-4">
                  Felszereltség
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {car.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 md:px-4 py-1.5 md:py-2 border border-foreground/10 text-xs md:text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="animate-fade-up delay-800 flex justify-center">
              <CTAButton href="tel:+36706050350">
                Hívj most
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Navigáció autók között */}
        <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-foreground/10 animate-fade-up delay-900">
          <div className="flex items-center justify-between">
            {prevCar ? (
              <Link
                href={`/autok/db/${prevCar.id}`}
                className="group flex items-center gap-3 md:gap-4 hover:text-primary transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 border border-foreground/20 group-hover:border-primary/50 flex items-center justify-center transition-colors rounded-full">
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-0.5 md:mb-1">Előző</p>
                  <p className="text-sm md:text-base font-display uppercase">{prevCar.brand} {prevCar.model}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextCar ? (
              <Link
                href={`/autok/db/${nextCar.id}`}
                className="group flex items-center gap-3 md:gap-4 hover:text-primary transition-colors"
              >
                <div className="text-right">
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-0.5 md:mb-1">Következő</p>
                  <p className="text-sm md:text-base font-display uppercase">{nextCar.brand} {nextCar.model}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 border border-foreground/20 group-hover:border-primary/50 flex items-center justify-center transition-colors rounded-full">
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
