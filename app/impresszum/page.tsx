import type { Metadata } from "next";
import { LegalPage, LegalSection, DataRows } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Impresszum | OSICAR",
  description:
    "Az Osváth Alajos Gábor egyéni vállalkozó által üzemeltetett osicar.hu weboldal impresszuma.",
};

const toc = [
  { id: "szolgaltato", number: "01", label: "Szolgáltató" },
  { id: "tarhely", number: "02", label: "Tárhelyszolgáltató" },
  { id: "panasz", number: "03", label: "Panaszkezelés" },
];

export default function ImpresszumPage() {
  return (
    <LegalPage
      eyebrow="Jogi információ"
      title="Impresszum"
      lead="Az osicar.hu weboldalt üzemeltető szolgáltató és tárhelyszolgáltató adatai az elektronikus kereskedelmi szolgáltatásokról szóló 2001. évi CVIII. törvény 4. §-a alapján."
      toc={toc}
      related={[
        { href: "/adatkezeles", label: "Adatkezelési tájékoztató" },
        { href: "/sutik", label: "Süti tájékoztató" },
      ]}
    >
      <LegalSection id="szolgaltato" number="01" title="A szolgáltató adatai">
        <DataRows
          items={[
            { label: "Név", value: "Osváth Alajos Gábor egyéni vállalkozó" },
            { label: "Székhely", value: "9500 Celldömölk, Kinizsi utca 8." },
            { label: "Nyilvántartási szám", value: "52278305" },
            { label: "Adószám", value: "68806545-2-38" },
            {
              label: "E-mail",
              value: <a href="mailto:info@osicar.hu">info@osicar.hu</a>,
            },
            {
              label: "Telefon",
              value: <a href="tel:+36706050350">+36 70 605 0350</a>,
            },
            {
              label: "Weboldal",
              value: <a href="https://osicar.hu">osicar.hu</a>,
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="tarhely" number="02" title="Tárhelyszolgáltató adatai">
        <DataRows
          items={[
            { label: "Név", value: "Vercel Inc." },
            { label: "Ország", value: "Amerikai Egyesült Államok" },
            {
              label: "Adatvédelmi e-mail",
              value: <a href="mailto:privacy@vercel.com">privacy@vercel.com</a>,
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
            {
              label: "Weboldal",
              value: (
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vercel.com
                </a>
              ),
            },
          ]}
        />
        <p className="mt-5 text-sm text-muted-foreground">
          Az adatbázis-szolgáltatást a <strong>Supabase Inc.</strong> (USA) biztosítja, szerződéses
          adatfeldolgozói garanciákkal (DPA, SCC).
        </p>
      </LegalSection>

      <LegalSection id="panasz" number="03" title="Panaszkezelés és jogorvoslat">
        <p>
          A szolgáltatással kapcsolatos panaszokat a fenti e-mail címen vagy telefonszámon jelezheti.
          A területileg illetékes fogyasztóvédelmi hatóság a <strong>Vas Vármegyei Kormányhivatal</strong>,
          a békéltető testület pedig a <strong>Vas Vármegyei Békéltető Testület</strong> — pontos
          elérhetőségüket a hivatalos oldalukon találja.
        </p>
        <p className="text-sm text-muted-foreground">
          A megrendelőlapon közzétett adatok és e weboldal tartalma az üzemeltető tulajdona; harmadik
          fél által történő bármilyen felhasználás csak előzetes írásbeli engedéllyel megengedett.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
