import { memo } from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main footer */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Logo és leírás */}
          <div className="flex flex-col">
            <Image
              src="/logo.svg"
              alt="OSICAR Logo"
              width={160}
              height={48}
              className="h-12 w-auto mb-6"
            />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px]">
              Megbízható használt autók, átlátható ügyintézés. Több mint 13 éve a piacon.
            </p>
          </div>

          {/* Navigáció */}
          <div className="md:justify-self-center">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
              Navigáció
            </p>
            <nav className="flex flex-col gap-4">
              <Link
                href="/autok"
                className="text-lg line-hover inline-block w-fit"
              >
                Kínálat
              </Link>
              <Link
                href="/#szolgaltatasok"
                className="text-lg line-hover inline-block w-fit"
              >
                Szolgáltatások
              </Link>
              <Link
                href="/#kapcsolat"
                className="text-lg line-hover inline-block w-fit"
              >
                Kapcsolat
              </Link>
            </nav>
          </div>

          {/* Elérhetőség */}
          <div className="md:justify-self-end md:text-right">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
              Elérhetőség
            </p>
            <div className="space-y-4 text-lg">
              <p>9500 Celldömölk</p>
              <p>Magyarország</p>
              <a
                href="tel:+36706050350"
                className="block line-hover md:ml-auto w-fit"
              >
                +36 70 605 0350
              </a>
              <a
                href="mailto:osvath0911@gmail.com"
                className="block line-hover md:ml-auto w-fit"
              >
                osvath0911@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-foreground/10 flex justify-center">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} OSICAR
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
