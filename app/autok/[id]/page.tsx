import { notFound } from "next/navigation";
import Link from "next/link";
import { cars } from "@/lib/data";
import { CTAButton } from "@/components/cta-button";

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
  const car = cars.find((c) => c.id === id);

  if (!car) {
    notFound();
  }

  const specs = [
    { label: "Évjárat", value: car.year.toString() },
    { label: "Kilométer", value: `${formatMileage(car.mileage)} km` },
    { label: "Üzemanyag", value: car.fuel },
    { label: "Váltó", value: car.transmission },
    { label: "Teljesítmény", value: `${car.power} LE` },
    { label: "Szín", value: car.color },
  ];

  return (
    <div className="grain-overlay min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Back link */}
        <div className="mb-12 animate-fade-up">
          <CTAButton href="/#kinalat" direction="left">
            Vissza a kínálathoz
          </CTAButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Image */}
          <div className="animate-fade-up delay-100">
            <div className="aspect-[4/3] bg-muted/30 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
                <span className="text-display-xl text-foreground/10">
                  {car.brand}
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div>
            <div className="mb-12 animate-fade-up delay-200">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                {car.year} / {formatMileage(car.mileage)} km
              </p>
              <h1 className="text-display-xl mb-6">
                {car.brand} {car.model}
              </h1>
              <p
                className="text-display-lg text-primary"
                style={{
                  textShadow: '0 0 10px rgba(52, 118, 234, 0.5), 0 0 20px rgba(52, 118, 234, 0.3), 0 0 30px rgba(52, 118, 234, 0.2)'
                }}
              >{formatPrice(car.price)} Ft</p>
            </div>

            <div className="h-px bg-foreground/10 mb-12 animate-line-expand delay-300"></div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              {specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className="animate-fade-up"
                  style={{ animationDelay: `${(index + 4) * 50}ms` }}
                >
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
                    {spec.label}
                  </p>
                  <p className="text-lg capitalize">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-foreground/10 mb-12 animate-line-expand delay-500"></div>

            {/* Description */}
            <div className="mb-12 animate-fade-up delay-600">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Leírás
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-12 animate-fade-up delay-700">
              <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Felszereltség
              </p>
              <div className="flex flex-wrap gap-3">
                {car.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 border border-foreground/10 text-sm"
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

      </div>
    </div>
  );
}
