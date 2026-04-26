import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Süti tájékoztató | OSICAR",
  description: "Az osicar.hu weboldal által használt sütik (cookie-k) bemutatása.",
};

const toc = [
  { id: "mi-az", number: "01", label: "Mi az a süti?" },
  { id: "mit-hasznalunk", number: "02", label: "Mit használunk?" },
  { id: "kezeles", number: "03", label: "Kezelés a böngészőben" },
  { id: "tovabbi", number: "04", label: "További információ" },
];

const cookies = [
  {
    name: "osicar_cookie_consent",
    type: "Helyi tároló (localStorage)",
    purpose:
      "A süti tájékoztató tudomásulvételének tárolása, hogy a banner ne jelenjen meg újra.",
    duration: "Amíg a látogató nem törli (kb. 12 hónap)",
    category: "Szükséges",
  },
  {
    name: "sb-*-auth-token",
    type: "Süti (cookie)",
    purpose: "Adminisztrátori bejelentkezés munkamenetének fenntartása (Supabase).",
    duration: "Munkamenet / max. 7 nap",
    category: "Szükséges",
  },
];

export default function SutikPage() {
  return (
    <LegalPage
      eyebrow="Cookie-k"
      title="Süti tájékoztató"
      lead="A weboldal által használt sütik és böngészőtárolók bemutatása. Az Európai Unió ePrivacy irányelve és a GDPR szerinti szabályozás alapján."
      toc={toc}
      related={[
        { href: "/adatkezeles", label: "Adatkezelési tájékoztató" },
        { href: "/impresszum", label: "Impresszum" },
      ]}
    >
      <LegalSection id="mi-az" number="01" title="Mi az a süti?">
        <p>
          A süti (angolul „cookie") egy kis szöveges fájl, amelyet a böngésző az Ön eszközén
          (számítógép, tablet, telefon) tárol, amikor weboldalakat látogat meg. A weboldalak ezzel
          rokon technológiát használnak, mint a <em>localStorage</em> vagy <em>sessionStorage</em>{" "}
          — ezek szintén a böngészőben tárolt értékek. Mindkettő célja ugyanaz: hogy a weboldal
          felismerje a böngészőjét és megfelelően működjön.
        </p>
        <p className="text-sm text-muted-foreground">
          A jelen tájékoztató mind a hagyományos sütiket, mind az ezekkel egyenértékű
          böngészőtárolókat egységesen „süti"-ként említi.
        </p>
      </LegalSection>

      <LegalSection id="mit-hasznalunk" number="02" title="Milyen sütiket használunk?">
        <p>
          Az osicar.hu kizárólag a működéséhez <strong>feltétlenül szükséges</strong> sütiket
          használja. Nincs analitikai, marketing vagy harmadik féltől származó nyomkövető süti. A
          szükséges sütikhez az ePrivacy irányelv alapján <strong>nem kell előzetes
          hozzájárulás</strong>, mivel ezek nélkül a weboldal egyes funkciói nem működnének.
        </p>

        {/* Cookie cards */}
        <div className="not-prose mt-4 space-y-3">
          {cookies.map((c) => (
            <div
              key={c.name}
              className="border border-foreground/10 hover:border-foreground/20 transition-colors"
            >
              <div className="p-4 md:p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <code className="text-xs md:text-sm bg-foreground/5 px-2 py-1 font-mono text-foreground/90">
                    {c.name}
                  </code>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] px-2 py-1"
                    style={{
                      color: "#3476EA",
                      background: "rgba(52,118,234,0.08)",
                      border: "1px solid rgba(52,118,234,0.2)",
                    }}
                  >
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-foreground/85 mb-3">{c.purpose}</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col">
                    <dt className="uppercase tracking-[0.18em] text-muted-foreground">Típus</dt>
                    <dd className="text-foreground/80">{c.type}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="uppercase tracking-[0.18em] text-muted-foreground">Élettartam</dt>
                    <dd className="text-foreground/80">{c.duration}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Az adminisztrátori süti csak akkor jön létre, ha az oldal üzemeltetője a védett felületen
          bejelentkezik — látogatók böngészőjében ez nem keletkezik.
        </p>
      </LegalSection>

      <LegalSection id="kezeles" number="03" title="Hogyan kezelheti a sütiket?">
        <p>
          A legtöbb böngésző automatikusan elfogadja a sütiket, de Ön bármikor módosíthatja a
          böngésző beállításait: letilthatja vagy törölheti azokat. A szigorúan szükséges sütik
          letiltása esetén a weboldal egyes funkciói nem fognak megfelelően működni.
        </p>
        <p className="text-sm text-muted-foreground">Hivatalos böngésző-útmutatók:</p>
        <ul className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {[
            { name: "Google Chrome", href: "https://support.google.com/chrome/answer/95647" },
            {
              name: "Mozilla Firefox",
              href: "https://support.mozilla.org/hu/kb/sutik-informacio-amelyet-weboldalak-tarolnak-szami",
            },
            { name: "Safari", href: "https://support.apple.com/hu-hu/guide/safari/sfri11471/mac" },
            { name: "Microsoft Edge", href: "https://support.microsoft.com/hu-hu/microsoft-edge" },
          ].map((b) => (
            <li key={b.name}>
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 border border-foreground/10 hover:border-primary/40 transition-colors text-sm"
              >
                <span>{b.name}</span>
                <span
                  aria-hidden="true"
                  className="text-primary transition-transform duration-300 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection id="tovabbi" number="04" title="További információ">
        <p>
          A személyes adatok kezelésének részletes feltételeit, valamint az Ön jogait az{" "}
          <Link href="/adatkezeles">adatkezelési tájékoztatónk</Link> tartalmazza. Az üzemeltető
          cégadatait az <Link href="/impresszum">impresszumban</Link> találja.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
