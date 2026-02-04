import { notFound } from "next/navigation";
import Link from "next/link";
import { cars } from "@/lib/data";
import { CTAButton } from "@/components/cta-button";
import { CarImageGallery } from "@/components/car-image-gallery";
import { ChevronLeft, ChevronRight } from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("hu-HU").format(mileage);
}

export function generateStaticParams() {
  return cars.map((car) => ({
    id: car.id,
  }));
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const carIndex = cars.findIndex((c) => c.id === id);
  const car = cars[carIndex];

  if (!car) {
    notFound();
  }

  // Navigációhoz: előző és következő autó
  const prevCar = carIndex > 0 ? cars[carIndex - 1] : null;
  const nextCar = carIndex < cars.length - 1 ? cars[carIndex + 1] : null;

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
          {/* Left column - Image Gallery */}
          <div className="animate-fade-up delay-100">
            <CarImageGallery
              images={car.images || []}
              brand={car.brand}
              model={car.model}
            />
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
                href={`/autok/${prevCar.id}`}
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
                href={`/autok/${nextCar.id}`}
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
