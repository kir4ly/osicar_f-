import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPage,
  LegalSection,
  DataRows,
  PurposeCard,
  InfoCard,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | OSICAR",
  description:
    "Az osicar.hu weboldal adatkezelési tájékoztatója az Európai Unió Általános Adatvédelmi Rendelete (GDPR) alapján.",
};

const toc = [
  { id: "adatkezelo", number: "01", label: "Az adatkezelő" },
  { id: "alapelvek", number: "02", label: "Alapelvek" },
  { id: "adatkor", number: "03", label: "Kezelt adatok" },
  { id: "feldolgozok", number: "04", label: "Adatfeldolgozók" },
  { id: "tovabbitas", number: "05", label: "Adattovábbítás" },
  { id: "onkentesseg", number: "06", label: "Önkéntesség" },
  { id: "automatizalt", number: "07", label: "Automatizált döntés" },
  { id: "jogok", number: "08", label: "Az érintett jogai" },
  { id: "biztonsag", number: "09", label: "Adatbiztonság" },
  { id: "jogorvoslat", number: "10", label: "Jogorvoslat" },
  { id: "modositas", number: "11", label: "Módosítás" },
];

export default function AdatkezelesPage() {
  return (
    <LegalPage
      eyebrow="GDPR"
      title="Adatkezelési tájékoztató"
      lead="Az Európai Parlament és a Tanács (EU) 2016/679. rendelete (GDPR), valamint az információs önrendelkezési jogról szóló 2011. évi CXII. törvény (Infotv.) alapján."
      meta={[
        { label: "Hatályos", value: "2026. április 25." },
        { label: "Verzió", value: "1.0" },
      ]}
      toc={toc}
      related={[
        { href: "/impresszum", label: "Impresszum" },
        { href: "/sutik", label: "Süti tájékoztató" },
      ]}
    >
      <LegalSection id="adatkezelo" number="01" title="Az adatkezelő">
        <DataRows
          items={[
            { label: "Név", value: "Osváth Alajos Gábor egyéni vállalkozó" },
            { label: "Székhely", value: "9500 Celldömölk, Kinizsi utca 8." },
            { label: "Adószám", value: "68806545-2-38" },
            {
              label: "E-mail",
              value: <a href="mailto:info@osicar.hu">info@osicar.hu</a>,
            },
            {
              label: "Telefon",
              value: <a href="tel:+36706050350">+36 70 605 0350</a>,
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Az adatkezelő a GDPR 37. cikke alapján adatvédelmi tisztviselő (DPO) kijelölésére nem
          köteles, így ilyen tisztviselőt nem alkalmaz.
        </p>
      </LegalSection>

      <LegalSection id="alapelvek" number="02" title="Az adatkezelés alapelvei">
        <p>
          Személyes adatait kizárólag a GDPR és az Infotv. rendelkezéseivel összhangban kezeljük.
          Adatait meghatározott célból, jogos érdek vagy törvényi kötelezettség teljesítése érdekében,
          a cél eléréséhez szükséges minimális mértékben és ideig kezeljük. Tisztességes,
          átlátható, célhoz kötött, pontos és bizalmas eljárást követünk.
        </p>
      </LegalSection>

      <LegalSection id="adatkor" number="03" title="A kezelt adatok köre, célja, jogalapja">
        <div className="space-y-7 mt-2">
          <PurposeCard
            title="3.1. Kapcsolatfelvétel (e-mail, telefon)"
            rows={[
              {
                label: "Adatok",
                value: "név, e-mail cím, telefonszám, az üzenet tartalma",
              },
              {
                label: "Cél",
                value: "kommunikáció, ajánlatadás, ügyintézés",
              },
              {
                label: "Jogalap",
                value:
                  "GDPR 6. cikk (1) b) — szerződéskötést megelőző lépések; f) — jogos érdek (üzleti megkeresés megválaszolása)",
              },
              {
                label: "Megőrzés",
                value: "az utolsó érdemi kapcsolatfelvételt követő 1 év",
              },
            ]}
          />

          <PurposeCard
            title="3.2. Adásvétel és szolgáltatás teljesítése"
            rows={[
              {
                label: "Adatok",
                value:
                  "név, lakcím, telefonszám, e-mail cím, személyi azonosító okmány adatai, járműadatok",
              },
              {
                label: "Cél",
                value:
                  "adásvételi / bérleti / fuvarozási szerződés létrehozása és teljesítése, számlázás",
              },
              {
                label: "Jogalap",
                value:
                  "GDPR 6. cikk (1) b) — szerződés teljesítése; c) — jogi kötelezettség (számviteli tv.)",
              },
              {
                label: "Megőrzés",
                value: "8 év (2000. évi C. tv. 169. §)",
              },
            ]}
          />

          <PurposeCard
            title="3.3. A weboldal működéséhez szükséges sütik / tárolók"
            rows={[
              {
                label: "Adatok",
                value:
                  "munkamenet-azonosító, adminisztrátori bejelentkezési token, süti-hozzájárulás állapota",
              },
              {
                label: "Cél",
                value: "a weboldal alapfunkcióinak biztosítása, az adminisztrátori felület védelme",
              },
              {
                label: "Jogalap",
                value:
                  "GDPR 6. cikk (1) f) — jogos érdek; ePrivacy: feltétlenül szükséges technikai sütik, hozzájárulás nem szükséges",
              },
              {
                label: "Részletek",
                value: <Link href="/sutik">Süti tájékoztató →</Link>,
              },
            ]}
          />
        </div>
      </LegalSection>

      <LegalSection id="feldolgozok" number="04" title="Igénybe vett adatfeldolgozók">
        <p>Az adatkezelő az alábbi külső szolgáltatókat veszi igénybe:</p>
        <div className="space-y-5 mt-2">
          <PurposeCard
            title="Tárhely- és weboldal-infrastruktúra"
            rows={[
              { label: "Szolgáltató", value: "Vercel Inc. (USA)" },
              {
                label: "Tevékenység",
                value: "a weboldal kiszolgálása, technikai naplózás",
              },
              {
                label: "Garancia",
                value: "EU–USA Data Privacy Framework, EU SCC",
              },
              {
                label: "Adatvédelem",
                value: (
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    vercel.com/legal/privacy-policy
                  </a>
                ),
              },
            ]}
          />

          <PurposeCard
            title="Adatbázis-szolgáltatás"
            rows={[
              { label: "Szolgáltató", value: "Supabase Inc. (USA)" },
              {
                label: "Tevékenység",
                value: "az autókkal és adminisztrációval kapcsolatos adatok tárolása",
              },
              {
                label: "Garancia",
                value: "DPA (adatfeldolgozói megállapodás), EU SCC",
              },
            ]}
          />

          <PurposeCard
            title="E-mail kommunikáció"
            rows={[
              { label: "Szolgáltató", value: "az adatkezelő e-mail szolgáltatója" },
              {
                label: "Tevékenység",
                value: "üzenetek kézbesítése, archiválása",
              },
              {
                label: "Cél",
                value: "kizárólag a megkereséssel kapcsolatos ügyintézés",
              },
            ]}
          />
        </div>
      </LegalSection>

      <LegalSection id="tovabbitas" number="05" title="Adattovábbítás harmadik félnek">
        <p>
          Személyes adatot harmadik félnek csak az érintett előzetes hozzájárulásával vagy
          jogszabályi kötelezettség alapján továbbítunk. Az adásvételi / bérleti ügylet jellegéből
          adódóan ilyen címzettek lehetnek: <strong>könyvelő, NAV, okmányiroda, biztosító,
          finanszírozó pénzintézet</strong>.
        </p>
      </LegalSection>

      <LegalSection id="onkentesseg" number="06" title="Az adatszolgáltatás önkéntessége">
        <p>
          A kapcsolatfelvétel során az adatszolgáltatás <strong>önkéntes</strong> — Ön szabadon
          dönti el, hogy ír-e vagy hív minket. Adatkezelést nem végzünk megkeresés nélkül.
        </p>
        <p>
          Adásvétel, bérlet vagy fuvarozási szerződés esetén bizonyos adatok megadása{" "}
          <strong>jogszabályi kötelezettség</strong> (pl. szerződéskötés, számlakiállítás). Az
          ezekhez szükséges adatok megadásának hiánya azt eredményezheti, hogy a szerződés nem jön
          létre vagy nem teljesíthető.
        </p>
      </LegalSection>

      <LegalSection id="automatizalt" number="07" title="Automatizált döntéshozatal és profilalkotás">
        <p>
          Az adatkezelő az érintettek vonatkozásában{" "}
          <strong>kizárólag automatizált döntéshozatalt nem alkalmaz, profilalkotást nem végez</strong>{" "}
          (GDPR 22. cikk).
        </p>
      </LegalSection>

      <LegalSection id="jogok" number="08" title="Az érintett jogai">
        <p>A GDPR alapján Ön az alábbi jogokkal élhet:</p>
        <ul className="space-y-2.5 mt-2">
          {[
            ["Tájékoztatáshoz és hozzáféréshez való jog", "információt és másolatot kérhet a kezelt adatairól"],
            ["Helyesbítéshez való jog", "kérheti pontatlan adatainak javítását"],
            ["Törléshez való jog", "kérheti adatai törlését, ha a kezelés feltételei már nem állnak fenn"],
            ["Korlátozáshoz való jog", "bizonyos esetekben korlátozhatja az adatkezelést"],
            ["Adathordozhatósághoz való jog", "tagolt, géppel olvasható formátumban kérheti adatait"],
            ["Tiltakozás joga", "jogos érdeken alapuló adatkezelés ellen tiltakozhat"],
            ["Hozzájárulás visszavonásához való jog", "hozzájáruláson alapuló adatkezelést bármikor visszavonhat"],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="text-primary mt-1.5 shrink-0" aria-hidden="true">▸</span>
              <span>
                <strong>{t}</strong> — {d}.
              </span>
            </li>
          ))}
        </ul>
        <p>
          Kérelmét az <a href="mailto:info@osicar.hu">info@osicar.hu</a> címen vagy postai úton
          (9500 Celldömölk, Kinizsi utca 8.) jelezheti. A kérelem beérkezésétől számított legkésőbb
          egy hónapon belül tájékoztatjuk a megtett intézkedésekről.
        </p>
      </LegalSection>

      <LegalSection id="biztonsag" number="09" title="Adatbiztonság">
        <p>
          Megfelelő technikai és szervezési intézkedésekkel biztosítjuk a személyes adatok védelmét
          a jogosulatlan hozzáférés, megváltoztatás, továbbítás, nyilvánosságra hozatal, törlés vagy
          megsemmisítés ellen. A weboldalt <strong>HTTPS</strong> titkosítás védi, az
          adminisztrátori hozzáférés jelszóval védett, az adatfeldolgozóinkkal pedig szerződéses
          adatvédelmi megállapodások (DPA, SCC) biztosítják az európai szintű védelmet.
        </p>
      </LegalSection>

      <LegalSection id="jogorvoslat" number="10" title="Jogorvoslat — felügyeleti hatóság">
        <p>
          Ha úgy érzi, hogy személyes adatainak kezelése során jogsérelem érte, panaszt tehet a
          felügyeleti hatóságnál vagy bírósághoz fordulhat.
        </p>
        <InfoCard
          title="Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)"
          rows={[
            { label: "Cím", value: "1055 Budapest, Falk Miksa utca 9–11." },
            { label: "Postacím", value: "1363 Budapest, Pf. 9." },
            { label: "Telefon", value: "+36 1 391 1400" },
            {
              label: "E-mail",
              value: (
                <a href="mailto:ugyfelszolgalat@naih.hu">ugyfelszolgalat@naih.hu</a>
              ),
            },
            {
              label: "Weboldal",
              value: (
                <a href="https://naih.hu" target="_blank" rel="noopener noreferrer">
                  naih.hu
                </a>
              ),
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="modositas" number="11" title="A tájékoztató módosítása">
        <p>
          Fenntartjuk a jogot a jelen tájékoztató módosítására. A módosításokról a weboldalon
          közzétett, mindenkor hatályos változat ad tájékoztatást — a verzió és a hatálybalépés
          dátuma a dokumentum elején található.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
