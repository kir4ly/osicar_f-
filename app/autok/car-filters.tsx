"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { fuels, transmissions } from "@/lib/data";
import { CarData } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CTAButton } from "@/components/cta-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Kép carousel komponens a kártyákhoz
function CarImageCarousel({
  images,
  brand,
  model,
  carId,
  isFromSupabase,
  priority = false,
  grayscale = false
}: {
  images?: string[];
  brand: string;
  model: string;
  carId: string;
  isFromSupabase?: boolean;
  priority?: boolean;
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
      <Link href={isFromSupabase ? `/autok/db/${carId}` : `/autok/${carId}`}>
        {validImages.length > 0 ? (
          <Image
            src={validImages[currentIndex]}
            alt={`${brand} ${model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-contain transition-transform duration-700 ${grayscale ? 'grayscale' : ''}`}
            loading={priority ? "eager" : "lazy"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
            <span className="text-lg md:text-display-md text-foreground/10 font-display uppercase">
              {brand}
            </span>
          </div>
        )}
      </Link>

      {/* Navigációs nyilak - csak ha több kép van */}
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

type CombinedCar = CarData & { isFromSupabase: boolean };

interface CarFiltersProps {
  supabaseCars: CarData[];
}

export function CarFilters({ supabaseCars }: CarFiltersProps) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [fuel, setFuel] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("default");

  // Szétválasztjuk az eladott, teljesített és elérhető autókat
  const { availableCars, soldCars, fulfilledCars } = useMemo(() => {
    const all = supabaseCars.map((car) => ({
      ...car,
      isFromSupabase: true as const,
    }));
    return {
      availableCars: all.filter((car) => !car.sold && !car.fulfilled),
      soldCars: all.filter((car) => car.sold),
      fulfilledCars: all.filter((car) => car.fulfilled),
    };
  }, [supabaseCars]);

  const allCars: CombinedCar[] = availableCars;

  const allBrands = useMemo(() => {
    return [...new Set(supabaseCars.map((car) => car.brand))];
  }, [supabaseCars]);

  const filteredCars = useMemo(() => {
    let result = allCars.filter((car) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower);

      const matchesBrand = brand === "all" || car.brand === brand;
      const matchesFuel = fuel === "all" || car.fuel === fuel;
      const matchesTransmission =
        transmission === "all" || car.transmission === transmission;

      let matchesPrice = true;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        matchesPrice = car.price >= min && (max ? car.price <= max : true);
      }

      return (
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesPrice
      );
    });

    if (sortOrder === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [allCars, search, brand, fuel, transmission, priceRange, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setBrand("all");
    setFuel("all");
    setTransmission("all");
    setPriceRange("all");
    setSortOrder("default");
  };

  const hasFilters =
    search !== "" ||
    brand !== "all" ||
    fuel !== "all" ||
    transmission !== "all" ||
    priceRange !== "all" ||
    sortOrder !== "default";

  return (
    <>
      {/* Filters */}
      <div className="py-4 md:py-8 mb-8 md:mb-16 animate-fade-up delay-200">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="w-full">
            <Input
              placeholder="Keresés márka vagy modell alapján..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 md:h-12 bg-transparent text-sm md:text-base placeholder:text-muted-foreground/50 rounded-lg"
              style={{
                border: '1px solid rgba(52, 118, 234, 0.35)',
                boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
              }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger
                className="h-10 md:h-12 bg-transparent text-sm rounded-lg"
                style={{
                  border: '1px solid rgba(52, 118, 234, 0.35)',
                  boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
                }}
              >
                <SelectValue placeholder="Márka" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes márka</SelectItem>
                {allBrands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={fuel} onValueChange={setFuel}>
              <SelectTrigger
                className="h-10 md:h-12 bg-transparent text-sm rounded-lg"
                style={{
                  border: '1px solid rgba(52, 118, 234, 0.35)',
                  boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
                }}
              >
                <SelectValue placeholder="Üzemanyag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes</SelectItem>
                {fuels.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={transmission} onValueChange={setTransmission}>
              <SelectTrigger
                className="h-10 md:h-12 bg-transparent text-sm rounded-lg"
                style={{
                  border: '1px solid rgba(52, 118, 234, 0.35)',
                  boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
                }}
              >
                <SelectValue placeholder="Váltó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes</SelectItem>
                {transmissions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger
                className="h-10 md:h-12 bg-transparent text-sm rounded-lg"
                style={{
                  border: '1px solid rgba(52, 118, 234, 0.35)',
                  boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
                }}
              >
                <SelectValue placeholder="Ár" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes ár</SelectItem>
                <SelectItem value="0-10000000">10M Ft alatt</SelectItem>
                <SelectItem value="10000000-15000000">10-15M Ft</SelectItem>
                <SelectItem value="15000000-20000000">15-20M Ft</SelectItem>
                <SelectItem value="20000000-">20M Ft felett</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger
                className="h-10 md:h-12 bg-transparent text-sm col-span-2 md:col-span-1 rounded-lg"
                style={{
                  border: '1px solid rgba(52, 118, 234, 0.35)',
                  boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
                }}
              >
                <SelectValue placeholder="Rendezés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Alapértelmezett</SelectItem>
                <SelectItem value="price-asc">Ár: növekvő</SelectItem>
                <SelectItem value="price-desc">Ár: csökkenő</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-3 md:mt-4 text-xs md:text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Szűrők törlése
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-8 animate-fade-up delay-300">
        {filteredCars.length} találat
      </p>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredCars.map((car, index) => (
            <div
              key={car.id}
              className="group bg-[#0a0a0a] rounded-xl animate-fade-up flex flex-col transition-all duration-300 hover:shadow-[0_0_25px_rgba(52,118,234,0.25)]"
              style={{
                animationDelay: `${(index % 6) * 50 + 300}ms`,
                border: '1px solid rgba(52, 118, 234, 0.35)',
                boxShadow: '0 0 10px rgba(52, 118, 234, 0.15), 0 0 20px rgba(52, 118, 234, 0.08)'
              }}
            >
              {/* Kép carousel - széltől-szélig mobilon */}
              <CarImageCarousel
                images={car.images}
                brand={car.brand}
                model={car.model}
                carId={car.id}
                isFromSupabase={car.isFromSupabase}
                priority={index < 6}
              />

              {/* Tartalom */}
              <div className="p-4 md:p-6 pt-4 md:pt-6 flex flex-col flex-1">
                {/* Név és ár */}
                <Link href={car.isFromSupabase ? `/autok/db/${car.id}` : `/autok/${car.id}`}>
                  <h3 className="text-base md:text-xl font-display uppercase mb-1 md:mb-2 tracking-wide">
                    {car.brand} {car.model}
                  </h3>
                  <p
                    className="text-xl md:text-3xl text-primary font-display mb-4 md:mb-6"
                    style={{
                      textShadow: '0 0 10px rgba(52, 118, 234, 0.5), 0 0 20px rgba(52, 118, 234, 0.3), 0 0 30px rgba(52, 118, 234, 0.2)'
                    }}
                  >{formatPrice(car.price)} Ft</p>
                </Link>

                {/* 2x2 Adatok grid */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
                  <div className="border border-white/[0.08] px-3 py-3 md:px-4 md:py-4">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider mb-1 md:mb-2">KM</p>
                    <p className="text-sm md:text-base font-medium">{formatMileage(car.mileage)} km</p>
                  </div>
                  <div className="border border-white/[0.08] px-3 py-3 md:px-4 md:py-4">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider mb-1 md:mb-2">Üzemanyag</p>
                    <p className="text-sm md:text-base font-medium capitalize">{car.fuel}</p>
                  </div>
                  <div className="border border-white/[0.08] px-3 py-3 md:px-4 md:py-4">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider mb-1 md:mb-2">Váltó</p>
                    <p className="text-sm md:text-base font-medium capitalize">{car.transmission}</p>
                  </div>
                  <div className="border border-white/[0.08] px-3 py-3 md:px-4 md:py-4">
                    <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider mb-1 md:mb-2">Évjárat</p>
                    <p className="text-sm md:text-base font-medium">{car.year}</p>
                  </div>
                </div>

                {/* Leírás */}
                {car.description && (
                  <p className="text-xs md:text-sm text-white/50 mb-4 md:mb-8 line-clamp-2 leading-relaxed">
                    {car.description}
                  </p>
                )}

                {/* Spacer hogy a gomb mindig alul legyen */}
                <div className="flex-1" />

                {/* Megtekintés gomb */}
                <CTAButton href={car.isFromSupabase ? `/autok/db/${car.id}` : `/autok/${car.id}`} fullWidth variant="card">
                  Megtekintés
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 md:py-32">
          <p className="text-lg md:text-display-md text-muted-foreground mb-6 md:mb-8 font-display uppercase">
            Nincs találat
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 border border-foreground/20 text-xs md:text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
          >
            Szűrők törlése
          </button>
        </div>
      )}

      {/* Eladva szekció */}
      {soldCars.length > 0 && (
        <div className="mt-16 md:mt-32 pt-16 md:pt-32 border-t border-white/[0.08]">
          <div className="mb-8 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/40 mb-2 md:mb-4">
              Korábban eladott
            </p>
            <h2 className="text-display-lg md:text-display-xl">
              Eladva
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldCars.map((car, index) => (
              <div
                key={car.id}
                className="group bg-[#0d0d0d] border border-white/[0.08] opacity-50"
                style={{ animationDelay: `${(index % 6) * 50}ms` }}
              >
                {/* Kép évjárat és eladva badge-dzsel */}
                <div className="relative">
                  <CarImageCarousel
                    images={car.images}
                    brand={car.brand}
                    model={car.model}
                    carId={car.id}
                    isFromSupabase={car.isFromSupabase}
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
                  <Link href={car.isFromSupabase ? `/autok/db/${car.id}` : `/autok/${car.id}`}>
                    <h3 className="text-lg md:text-xl font-display uppercase mb-2 tracking-wide text-white/60">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-2xl md:text-3xl text-white/40 font-display mb-6 line-through">{formatPrice(car.price)} Ft</p>
                  </Link>

                  {/* 2x2 Adatok grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
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
                    <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
                      {car.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                className="group bg-[#0d0d0d] border border-blue-500/20 opacity-50"
                style={{ animationDelay: `${(index % 6) * 50}ms` }}
              >
                {/* Kép évjárat és teljesítve badge-dzsel */}
                <div className="relative">
                  <CarImageCarousel
                    images={car.images}
                    brand={car.brand}
                    model={car.model}
                    carId={car.id}
                    isFromSupabase={car.isFromSupabase}
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
                  <Link href={car.isFromSupabase ? `/autok/db/${car.id}` : `/autok/${car.id}`}>
                    <h3 className="text-lg md:text-xl font-display uppercase mb-2 tracking-wide text-white/60">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-2xl md:text-3xl text-white/40 font-display mb-6 line-through">{formatPrice(car.price)} Ft</p>
                  </Link>

                  {/* 2x2 Adatok grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
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
                    <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
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
