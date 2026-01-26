import Link from "next/link";
import Image from "next/image";
import { cars } from "@/lib/data";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("hu-HU").format(price);
}

function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("hu-HU").format(mileage);
}

export default function HomePage() {
  const featuredCars = cars.slice(0, 6);

  return (
    <div className="grain-overlay">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative px-6 lg:px-12">
        <div className="flex flex-col items-center text-center max-w-4xl">
          <div className="animate-fade-up mb-4">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={800}
              height={240}
              className="h-48 md:h-64 lg:h-80 w-auto"
              priority
            />
          </div>
          <p className="text-display-md md:text-display-lg text-foreground max-w-2xl mb-2 animate-fade-up delay-200 -mt-16">
            Megbízható autók, korrekt árak. Legyen könnyű a választás.
          </p>
          <p className="text-lg md:text-xl text-primary font-bold animate-fade-up delay-300">
            Több mint 13 év tapasztalat.
          </p>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section id="kinálat" className="py-32 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
                Válogatott kínálat
              </p>
              <h2 className="text-display-xl animate-fade-up delay-100">
                Kiemelt ajánlatok
              </h2>
            </div>
            <Link
              href="/autok"
              className="inline-flex items-center justify-center h-12 px-8 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300 animate-fade-up delay-200"
            >
              Összes megtekintése
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {featuredCars.map((car, index) => (
              <Link
                key={car.id}
                href={`/autok/${car.id}`}
                className="group bg-background p-8 lg:p-12 hover-lift animate-fade-up"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="aspect-[16/10] bg-muted/50 mb-8 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10 group-hover:scale-105 transition-transform duration-700">
                    <span className="text-display-lg text-foreground/10">
                      {car.brand}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-display-md mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">
                      {car.year} / {formatMileage(car.mileage)} km
                    </p>
                  </div>
                  <p className="text-display-md text-primary">{formatPrice(car.price)} Ft</p>
                </div>
                <div className="h-px bg-foreground/10 group-hover:bg-foreground/30 transition-colors duration-500"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="szolgaltatasok" className="py-32 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mb-16">
            <h2 className="text-display-xl mb-4 animate-fade-up">
              Autók, amikben megbízhatsz
            </h2>
            <p className="text-xl text-primary animate-fade-up delay-100">
              Több mint 13 év tapasztalat az autók világában
            </p>
          </div>

          <div className="space-y-12">
            <div className="animate-fade-up delay-200">
              <div className="flex items-start gap-4">
                <span className="text-primary text-2xl">&#9654;</span>
                <div>
                  <h3 className="text-display-md mb-2">Használt autók 99%-ban külföldről</h3>
                  <p className="text-primary text-lg">
                    Belgium, Hollandia, Luxemburg, Németország, Franciaország és Olaszország
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-300">
              <div className="flex items-start gap-4">
                <span className="text-primary text-2xl">&#9654;</span>
                <div>
                  <h3 className="text-display-md mb-2">Autószállítás & Autómentés</h3>
                  <p className="text-primary text-lg">
                    Gyors és megbízható megoldás baj esetén is
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-400">
              <div className="flex items-start gap-4">
                <span className="text-primary text-2xl">&#9654;</span>
                <div>
                  <h3 className="text-display-md mb-2">Bérautók</h3>
                  <p className="text-primary text-lg">
                    Elérhető személyautók és teherautók rövid vagy hosszú távra
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kapcsolat" className="py-32 border-t border-foreground/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
              Kapcsolat
            </p>
            <h2 className="text-display-xl mb-6 animate-fade-up delay-100">
              Lépjen velünk kapcsolatba
            </h2>
            <p className="text-lg text-muted-foreground mb-16 animate-fade-up delay-200">
              Kérdése van? Szívesen segítünk. Keressen minket telefonon vagy e-mailben.
            </p>

            <div className="space-y-12">
              <div className="animate-fade-up delay-300">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Telefon
                </p>
                <a
                  href="tel:+36706050350"
                  className="text-display-md line-hover inline-block"
                >
                  +36 70 605 0350
                </a>
              </div>

              <div className="animate-fade-up delay-400">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Email
                </p>
                <a
                  href="mailto:osvath0911@gmail.com"
                  className="text-display-md line-hover inline-block"
                >
                  osvath0911@gmail.com
                </a>
              </div>

              <div className="animate-fade-up delay-500">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Cím
                </p>
                <p className="text-display-md">
                  9500 Celldömölk
                </p>
                <p className="text-display-md">
                  Magyarország
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
