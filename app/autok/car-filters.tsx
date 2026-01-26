"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { brands, fuels, transmissions, Car } from "@/lib/data";
import { CarData } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("hu-HU").format(mileage);
}

type CombinedCar = (Car | CarData) & { isFromSupabase?: boolean };

interface CarFiltersProps {
  supabaseCars: CarData[];
  staticCars: Car[];
}

export function CarFilters({ supabaseCars, staticCars }: CarFiltersProps) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [fuel, setFuel] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("default");

  const allCars: CombinedCar[] = useMemo(() => {
    const supabaseWithFlag = supabaseCars.map((car) => ({
      ...car,
      isFromSupabase: true,
    }));
    return [...supabaseWithFlag, ...staticCars];
  }, [supabaseCars, staticCars]);

  const allBrands = useMemo(() => {
    const supabaseBrands = supabaseCars.map((car) => car.brand);
    return [...new Set([...brands, ...supabaseBrands])];
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
      <div className="border-t border-b border-foreground/10 py-8 mb-16 animate-fade-up delay-200">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Input
              placeholder="Keresés márka vagy modell alapján..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 bg-transparent border-foreground/10 text-base placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="h-12 bg-transparent border-foreground/10">
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
              <SelectTrigger className="h-12 bg-transparent border-foreground/10">
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
              <SelectTrigger className="h-12 bg-transparent border-foreground/10">
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
              <SelectTrigger className="h-12 bg-transparent border-foreground/10">
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
              <SelectTrigger className="h-12 bg-transparent border-foreground/10">
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
            className="mt-4 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Szűrők törlése
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-8 animate-fade-up delay-300">
        {filteredCars.length} találat
      </p>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
          {filteredCars.map((car, index) => (
            <Link
              key={car.id}
              href={car.isFromSupabase ? `/autok/db/${car.id}` : `/autok/${car.id}`}
              className="group bg-background p-6 lg:p-8 hover-lift animate-fade-up"
              style={{ animationDelay: `${(index % 6) * 50 + 300}ms` }}
            >
              <div className="aspect-[16/10] bg-muted/30 mb-6 overflow-hidden relative">
                {car.images && car.images.length > 0 && car.images[0] && !car.images[0].includes("placeholder") ? (
                  <Image
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    loading={index < 6 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10 group-hover:scale-105 transition-transform duration-700">
                    <span className="text-display-md text-foreground/10">
                      {car.brand}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="text-display-md">
                  {car.brand} {car.model}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{car.year}</span>
                  <span>{formatMileage(car.mileage)} km</span>
                  <span className="capitalize">{car.fuel}</span>
                  <span className="capitalize">{car.transmission}</span>
                </div>
                <p className="text-display-md text-primary">{formatPrice(car.price)} Ft</p>
              </div>
              <div className="h-px bg-foreground/10 mt-6 group-hover:bg-foreground/30 transition-colors duration-500"></div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-32">
          <p className="text-display-md text-muted-foreground mb-8">
            Nincs találat
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center h-14 px-10 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
          >
            Szűrők törlése
          </button>
        </div>
      )}
    </>
  );
}
