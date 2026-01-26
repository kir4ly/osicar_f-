import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main footer */}
        <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div>
            <p className="text-muted-foreground max-w-md">
              Megbízható használt autók, átlátható ügyintézés.
              Több mint 13 éve a piacon.
            </p>
          </div>

          <div>
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

          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
              Elérhetőség
            </p>
            <div className="space-y-4 text-lg">
              <p>9500 Celldömölk</p>
              <p>Magyarország</p>
              <a
                href="tel:+36706050350"
                className="block line-hover w-fit"
              >
                +36 70 605 0350
              </a>
              <a
                href="mailto:osvath0911@gmail.com"
                className="block line-hover w-fit"
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
}
