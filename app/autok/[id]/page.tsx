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
              <p className="text-display-lg text-primary">{formatPrice(car.price)} Ft</p>
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
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-800">
              <Link
                href={`/kapcsolat?auto=${car.id}`}
                className="inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
              >
                Érdeklődök
              </Link>
              <a
                href="tel:+3612345678"
                className="inline-flex items-center justify-center h-14 px-10 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
              >
                +36 1 234 5678
              </a>
            </div>
          </div>
        </div>

        {/* Financing section */}
        <section className="mt-32 border-t border-foreground/10 pt-20">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
              Finanszírozás
            </p>
            <h2 className="text-display-lg mb-8 animate-fade-up delay-100">
              Havi törlesztő akár
            </h2>
            <p className="text-display-xl mb-4 animate-fade-up delay-200 text-primary">
              {formatPrice(Math.round(car.price / 60))} Ft / hó
            </p>
            <p className="text-muted-foreground mb-8 animate-fade-up delay-300">
              60 hónapos futamidővel, reprezentatív példa
            </p>
            <Link
              href="/kapcsolat?tema=finanszirozas"
              className="inline-flex items-center text-sm uppercase tracking-widest line-hover animate-fade-up delay-400"
            >
              Finanszírozási ajánlat kérése
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
