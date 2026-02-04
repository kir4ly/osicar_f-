import { ChevronRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="grain-overlay min-h-screen pt-24 md:pt-32">
      {/* Services Section */}
      <section id="szolgaltatasok" className="py-16 md:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl mb-10 md:mb-16">
            <h1 className="text-display-lg md:text-display-xl mb-4 animate-fade-up">
              Autók, amikben megbízhatsz
            </h1>
            <p className="text-xl md:text-2xl text-primary animate-fade-up delay-100">
              Több mint 13 év tapasztalat az autók világában
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            <div className="animate-fade-up delay-200">
              <div className="flex items-start gap-3 md:gap-4">
                <ChevronRight className="w-7 h-7 md:w-8 md:h-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-display-md md:text-display-lg mb-2 md:mb-3">Használt autók 99%-ban külföldről</h3>
                  <p className="text-primary text-lg md:text-xl">
                    Belgium, Hollandia, Luxemburg, Németország, Franciaország és Olaszország
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-300">
              <div className="flex items-start gap-3 md:gap-4">
                <ChevronRight className="w-7 h-7 md:w-8 md:h-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-display-md md:text-display-lg mb-2 md:mb-3">Autószállítás & Autómentés</h3>
                  <p className="text-primary text-lg md:text-xl">
                    Gyors és megbízható megoldás baj esetén is
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up delay-400">
              <div className="flex items-start gap-3 md:gap-4">
                <ChevronRight className="w-7 h-7 md:w-8 md:h-8 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="text-display-md md:text-display-lg mb-2 md:mb-3">Bérautók</h3>
                  <p className="text-primary text-lg md:text-xl">
                    Elérhető személyautók és teherautók rövid vagy hosszú távra
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kapcsolat" className="py-16 md:py-32 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="mb-8 md:mb-16">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Kapcsolat
            </p>
            <h2 className="text-display-lg md:text-display-xl mb-4 md:mb-6 animate-fade-up delay-100">
              Lépjen velünk kapcsolatba
            </h2>
            <p className="text-base md:text-lg text-muted-foreground animate-fade-up delay-200">
              Kérdése van? Szívesen segítünk. Keressen minket telefonon vagy e-mailben.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-16 lg:gap-24">
            {/* Bal oldal - kapcsolati adatok */}
            <div className="flex-1 space-y-8 md:space-y-12 mb-12 md:mb-0">
              <div className="animate-fade-up delay-300">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Telefon
                </p>
                <a
                  href="tel:+36706050350"
                  className="text-display-md md:text-display-lg line-hover inline-block text-primary"
                >
                  +36 70 605 0350
                </a>
              </div>

              <div className="animate-fade-up delay-400">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Email
                </p>
                <a
                  href="mailto:info@osicar.hu"
                  className="text-display-md md:text-display-lg line-hover inline-block text-primary break-all"
                >
                  info@osicar.hu
                </a>
              </div>

              <div className="animate-fade-up delay-500">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Cím
                </p>
                <p className="text-display-md md:text-display-lg text-primary">
                  9500 Celldömölk
                </p>
                <p className="text-display-md md:text-display-lg text-primary">
                  Magyarország
                </p>
              </div>

              <div className="animate-fade-up delay-500">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3">
                  Cím
                </p>
                <p className="text-display-md md:text-display-lg text-primary">
                  9600 Sárvár
                </p>
                <p className="text-display-md md:text-display-lg text-primary">
                  Rákóczi Ferenc utca 73 A
                </p>
                <p className="text-display-md md:text-display-lg text-primary">
                  Magyarország
                </p>
              </div>
            </div>

            {/* Jobb oldal - Google Maps */}
            <div className="flex-1 animate-fade-up delay-400">
              <div className="relative rounded-2xl overflow-hidden w-full shadow-lg">
                <iframe
                  src="https://maps.google.com/maps?q=R%C3%A1k%C3%B3czi+Ferenc+utca+73+A,+S%C3%A1rv%C3%A1r,+9600&t=&z=16&ie=UTF8&iwloc=&output=embed&hl=hu"
                  className="w-full aspect-[4/3] border-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="OSICAR - 9600 Sárvár, Rákóczi Ferenc utca 73"
                />
                <a
                  href="https://maps.app.goo.gl/zjPXxxa1KiY1GcDE8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
