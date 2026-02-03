export default function ServicesPage() {
  return (
    <div className="grain-overlay min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl mb-10 md:mb-16">
            <h1 className="text-display-lg md:text-display-xl mb-10 md:mb-12 animate-fade-up text-primary">
              Használt autók - autómentés - autószállítás - teljes körű ügyintézés egy helyen
            </h1>
            <div className="flex items-start gap-3 animate-fade-up delay-100">
              <span className="text-primary text-lg mt-0.5">&#9654;</span>
              <p className="text-lg md:text-xl text-foreground">
                Megbízható, ellenőrzött használt autók értékesítésével foglalkozunk, autóink 99%-a külföldről érkezik, dokumentált előélettel.
              </p>
            </div>
            <div className="flex items-start gap-3 mt-4 animate-fade-up delay-200">
              <span className="text-primary text-lg mt-0.5">&#9654;</span>
              <p className="text-lg md:text-xl text-foreground">
                Vállaljuk az autók teljes körű papírozását, valamint autómentést és autószállítást belföldön és külföldön.
              </p>
            </div>
            <div className="flex items-start gap-3 mt-4 animate-fade-up delay-300">
              <span className="text-primary text-lg mt-0.5">&#9654;</span>
              <p className="text-lg md:text-xl text-foreground">
                Nálunk nem csak autót kapsz – nyugalmat és biztonságot is.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Autók section */}
      <section id="autok" className="py-16 md:py-24 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Használt autók
            </p>
            <h2 className="text-display-lg md:text-display-xl mb-6 md:mb-8 animate-fade-up delay-100">
              Autók, amikben megbízhatsz
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up delay-200">
              Miért bízhatsz meg az általunk kínált autókban?
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Ellenőrzött előélet</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Külföldről származó, karbantartott járművek</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Valós futásteljesítmény</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Átvizsgált, kipróbált autók</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Rejtett költségek és meglepetések nélkül</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Igény szerint egyedi beszerzés</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Ügyfél számára legjobb ár-érték arányú megoldást segítünk megtalálni</p>
              </div>
            </div>

            <p className="text-lg md:text-xl text-primary mt-8 animate-fade-up delay-400">
              Minden autónkat személyesen válogatjuk, és csak olyan jármű kerül ki a kezünkből, amit mi magunk is nyugodt szívvel használnánk.
            </p>
          </div>
        </div>
      </section>

      {/* Bérautó section */}
      <section id="berauto" className="py-16 md:py-24 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Bérautó
            </p>
            <h2 className="text-display-lg md:text-display-xl mb-6 md:mb-8 animate-fade-up delay-100">
              Bérautó gyorsan, rugalmasan
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-up delay-200">
              Ha ideiglenesen autóra van szükséged:
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl text-foreground">szerviz idejére</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl text-foreground">külföldi utazáshoz</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl text-foreground">átmeneti megoldásként</p>
              </div>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-up delay-300">
              akkor bérautó szolgáltatásunk megoldást nyújt.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Rövid és hosszú távra</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Megbízható, karbantartott járművek</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Gyors ügyintézés</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Kedvező árak</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Személy- és kisteherautó egyaránt megtalálható</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Külföldi autó behozatal section */}
      <section id="behozatal" className="py-16 md:py-24 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Külföldi autó behozatal
            </p>
            <h2 className="text-display-lg md:text-display-xl mb-6 md:mb-8 animate-fade-up delay-100">
              Autóink 99%-a külföldről származik
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-up delay-200">
              Főként Nyugat-Európából behozott, gondosan kiválasztott járművekkel dolgozunk.
            </p>
            <p className="text-lg md:text-xl text-foreground mb-6 animate-fade-up delay-200">
              A külföldi autók előnyei:
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl">jobb felszereltség</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl">rendszeres szervizelés</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl">kevesebb kilométer</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-300">
                <span className="text-primary text-lg mt-0.5">&#9654;</span>
                <p className="text-lg md:text-xl">jobb állapot</p>
              </div>
            </div>

            <p className="text-lg md:text-xl text-primary animate-fade-up delay-400">
              Mi nem csak behozzuk, hanem végigkísérjük az egész folyamatot.
            </p>
          </div>
        </div>
      </section>

      {/* Teljes körű ügyintézés section */}
      <section id="ugyintezes" className="py-16 md:py-24 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Teljes körű ügyintézés / Papírozás
            </p>
            <h2 className="text-display-lg md:text-display-xl mb-6 md:mb-8 animate-fade-up delay-100">
              Mindent elintézünk helyetted
            </h2>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Biztosítás kötés</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Honosítás</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Műszaki vizsga</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Regisztrációs adó</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Okmányirodai ügyintézés</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Forgalomba helyezés</p>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-primary font-medium mt-8 animate-fade-up delay-300">
              Neked csak annyi a dolgod, hogy átvedd az autót és vezesd.
            </p>
          </div>
        </div>
      </section>

      {/* Autómentés & Autószállítás section */}
      <section id="automentes" className="py-16 md:py-24 border-t border-foreground/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2 md:mb-4 animate-fade-up">
              Autómentés & Autószállítás
            </p>
            <h2 className="text-display-lg md:text-display-xl mb-6 md:mb-8 animate-fade-up delay-100">
              Autómentés belföldön és külföldön
            </h2>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Meghibásodott jármű</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Balesetes autó</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Műszaki nélküli jármű</p>
              </div>
              <div className="flex items-start gap-3 animate-fade-up delay-200">
                <span className="text-primary text-lg mt-0.5">✔</span>
                <p className="text-lg md:text-xl">Külföldről / külföldre szállítás</p>
              </div>
            </div>

            <p className="text-xl md:text-2xl text-primary font-medium mt-8 animate-fade-up delay-300">
              Gyors, megbízható, korrekt árakon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
