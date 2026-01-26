import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="grain-overlay min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Hero */}
        <div className="max-w-4xl mb-32">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
            Rólunk
          </p>
          <h1 className="text-display-hero mb-8 animate-fade-up delay-100">
            <span className="text-primary">15</span> év tapasztalat
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-up delay-200">
            Több mint másfél ezer elégedett ügyfél. Megbízhatóság,
            átláthatóság és szakértelem jellemzi munkánkat.
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div className="animate-fade-up delay-300">
            <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center">
              <span className="text-display-lg text-foreground/10">AUTOPIAC</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up delay-300">
              Történetünk
            </p>
            <h2 className="text-display-lg mb-8 animate-fade-up delay-400">
              A kezdetektől napjainkig
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground animate-fade-up delay-500">
              <p>
                Az AutoPiac 2009-ben alakult Budapesten, azzal a céllal, hogy
                megbízható és átlátható használtautó-kereskedelmet hozzon létre.
              </p>
              <p>
                Azóta több mint 5000 elégedett ügyfelünk van, és büszkék
                vagyunk arra, hogy sokan ajánlják tovább szolgáltatásainkat.
              </p>
              <p>
                Ma már saját szervizzel is rendelkezünk, ahol minden járművet
                alaposan átvizsgálunk és felkészítünk az értékesítés előtt.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-32">
          <div className="mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
              Értékeink
            </p>
            <h2 className="text-display-xl animate-fade-up delay-100">
              Amiben hiszünk
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {[
              {
                num: "01",
                title: "Megbízhatóság",
                desc: "Minden autónk átfogó műszaki vizsgálaton esik át",
              },
              {
                num: "02",
                title: "Ügyfélközpontúság",
                desc: "Személyre szabott tanácsadással segítjük ügyfeleinket",
              },
              {
                num: "03",
                title: "Minőség",
                desc: "Csak gondosan kiválasztott járműveket kínálunk",
              },
              {
                num: "04",
                title: "Becsületesség",
                desc: "Átlátható árazás és őszinte kommunikáció",
              },
              {
                num: "05",
                title: "Szakértelem",
                desc: "Képzett szakembereink évtizedes tapasztalattal",
              },
              {
                num: "06",
                title: "Kínálat",
                desc: "A kompakt autótól a prémium SUV-ig minden kategóriával",
              },
            ].map((value, index) => (
              <div
                key={value.num}
                className="bg-background p-10 animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <p className="text-6xl font-display text-primary/20 mb-6">
                  {value.num}
                </p>
                <h3 className="text-display-md mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-32">
          <div className="mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
              Csapat
            </p>
            <h2 className="text-display-xl animate-fade-up delay-100">
              A szakértők mögöttünk
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { name: "Kovács Péter", role: "Ügyvezető" },
              { name: "Nagy Anna", role: "Értékesítési vezető" },
              { name: "Szabó Gábor", role: "Szerviz vezető" },
              { name: "Tóth Eszter", role: "Ügyfélszolgálat" },
            ].map((member, index) => (
              <div
                key={member.name}
                className="animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="aspect-square bg-muted/30 mb-6 flex items-center justify-center">
                  <span className="text-4xl text-foreground/10">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <p className="text-display-md">{member.name}</p>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-foreground/10 pt-20">
          <div className="max-w-2xl">
            <h2 className="text-display-xl mb-8 animate-fade-up">
              Látogasson el hozzánk
            </h2>
            <p className="text-xl text-muted-foreground mb-12 animate-fade-up delay-100">
              Ismerje meg kínálatunkat személyesen, ahol kollégáink örömmel
              segítenek megtalálni az Önnek megfelelő autót.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-200">
              <Link
                href="/autok"
                className="inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
              >
                Kínálat megtekintése
              </Link>
              <Link
                href="/kapcsolat"
                className="inline-flex items-center justify-center h-14 px-10 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300"
              >
                Kapcsolat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
