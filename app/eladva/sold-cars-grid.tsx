"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CarData } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Kép carousel komponens
function CarImageCarousel({
  images,
  brand,
  model,
  carId,
  grayscale = false
}: {
  images?: string[];
  brand: string;
  model: string;
  carId: string;
  grayscale?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validImages = images?.filter(img => img && !img.includes("placeholder")) || [];
  const hasMultipleImages = validImages.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="aspect-[16/10] bg-black overflow-hidden relative rounded-t-xl group/carousel">
      <Link href={`/autok/db/${carId}`}>
        {validImages.length > 0 ? (
          <Image
            src={validImages[currentIndex]}
            alt={`${brand} ${model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-contain transition-transform duration-700 ${grayscale ? 'grayscale' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
            <span className="text-lg md:text-display-md text-foreground/10 font-display uppercase">
              {brand}
            </span>
          </div>
        )}
      </Link>

      {/* Navigációs nyilak */}
      {hasMultipleImages && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover/carousel:opacity-100 z-10 rounded-full"
            aria-label="Előző kép"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover/carousel:opacity-100 z-10 rounded-full"
            aria-label="Következő kép"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Képszámláló */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white/80 z-10">
            {currentIndex + 1} / {validImages.length}
          </div>
        </>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("hu-HU").format(mileage);
}

interface SoldCarsGridProps {
  soldCars: CarData[];
  fulfilledCars: CarData[];
}

export function SoldCarsGrid({ soldCars, fulfilledCars }: SoldCarsGridProps) {
  return (
    <>
      {/* Eladott autók */}
      {soldCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up delay-200">
          {soldCars.map((car, index) => (
            <div
              key={car.id}
              className="group bg-[#0d0d0d] border border-white/[0.08] rounded-xl opacity-70 hover:opacity-90 transition-opacity"
              style={{ animationDelay: `${(index % 6) * 50}ms` }}
            >
              {/* Kép évjárat és eladva badge-dzsel */}
              <div className="relative">
                <CarImageCarousel
                  images={car.images}
                  brand={car.brand}
                  model={car.model}
                  carId={car.id}
                  grayscale
                />
                {/* Évjárat badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded z-20">
                  {car.year}
                </div>
                {/* Eladva badge */}
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded z-20">
                  Eladva
                </div>
              </div>

              {/* Tartalom */}
              <div className="p-6 pt-6">
                {/* Név és ár */}
                <Link href={`/autok/db/${car.id}`}>
                  <h3 className="text-lg md:text-xl font-display uppercase mb-2 tracking-wide text-white/60">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-2xl md:text-3xl text-white/40 font-display mb-6 line-through">{formatPrice(car.price)} Ft</p>
                </Link>

                {/* 2x2 Adatok grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-white/[0.08] px-4 py-4">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">KM</p>
                    <p className="text-base font-medium text-white/60">{formatMileage(car.mileage)} km</p>
                  </div>
                  <div className="border border-white/[0.08] px-4 py-4">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Üzemanyag</p>
                    <p className="text-base font-medium capitalize text-white/60">{car.fuel}</p>
                  </div>
                  <div className="border border-white/[0.08] px-4 py-4">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Váltó</p>
                    <p className="text-base font-medium capitalize text-white/60">{car.transmission}</p>
                  </div>
                  <div className="border border-white/[0.08] px-4 py-4">
                    <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Évjárat</p>
                    <p className="text-base font-medium text-white/60">{car.year}</p>
                  </div>
                </div>

                {/* Leírás */}
                {car.description && (
                  <p className="text-sm text-white/40 mt-6 line-clamp-2 leading-relaxed">
                    {car.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 md:py-32">
          <p className="text-lg md:text-display-md text-muted-foreground font-display uppercase">
            Jelenleg nincs eladott autó
          </p>
        </div>
      )}

      {/* Teljesített megrendelések szekció */}
      {fulfilledCars.length > 0 && (
        <div className="mt-16 md:mt-32 pt-16 md:pt-32 border-t border-white/[0.08]">
          <div className="mb-8 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-blue-400/60 mb-2 md:mb-4">
              Sikeres tranzakciók
            </p>
            <h2 className="text-display-lg md:text-display-xl text-blue-400">
              Teljesített megrendelések
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fulfilledCars.map((car, index) => (
              <div
                key={car.id}
                className="group bg-[#0d0d0d] border border-blue-500/20 rounded-xl opacity-70 hover:opacity-90 transition-opacity"
                style={{ animationDelay: `${(index % 6) * 50}ms` }}
              >
                {/* Kép évjárat és teljesítve badge-dzsel */}
                <div className="relative">
                  <CarImageCarousel
                    images={car.images}
                    brand={car.brand}
                    model={car.model}
                    carId={car.id}
                    grayscale
                  />
                  {/* Évjárat badge */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded z-20">
                    {car.year}
                  </div>
                  {/* Teljesítve badge */}
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded z-20">
                    Teljesítve
                  </div>
                </div>

                {/* Tartalom */}
                <div className="p-6 pt-6">
                  {/* Név és ár */}
                  <Link href={`/autok/db/${car.id}`}>
                    <h3 className="text-lg md:text-xl font-display uppercase mb-2 tracking-wide text-white/60">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-2xl md:text-3xl text-white/40 font-display mb-6 line-through">{formatPrice(car.price)} Ft</p>
                  </Link>

                  {/* 2x2 Adatok grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-blue-500/10 px-4 py-4">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-2">KM</p>
                      <p className="text-base font-medium text-white/60">{formatMileage(car.mileage)} km</p>
                    </div>
                    <div className="border border-blue-500/10 px-4 py-4">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Üzemanyag</p>
                      <p className="text-base font-medium capitalize text-white/60">{car.fuel}</p>
                    </div>
                    <div className="border border-blue-500/10 px-4 py-4">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Váltó</p>
                      <p className="text-base font-medium capitalize text-white/60">{car.transmission}</p>
                    </div>
                    <div className="border border-blue-500/10 px-4 py-4">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Évjárat</p>
                      <p className="text-base font-medium text-white/60">{car.year}</p>
                    </div>
                  </div>

                  {/* Leírás */}
                  {car.description && (
                    <p className="text-sm text-white/40 mt-6 line-clamp-2 leading-relaxed">
                      {car.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
