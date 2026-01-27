"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CTAButton } from "@/components/cta-button";

const navigation = [
  { name: "Főoldal", href: "/#hero" },
  { name: "Kínálat", href: "/#kinalat" },
  { name: "Szolgáltatások", href: "/rolunk#szolgaltatasok" },
  { name: "Kapcsolat", href: "/rolunk#kapcsolat" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Determine back link based on current path
  const getBackHref = () => {
    if (pathname.startsWith("/admin")) return "/";
    if (pathname.startsWith("/autok/")) return "/";
    if (pathname.startsWith("/rolunk")) return "/";
    return "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background">
      <div className="container mx-auto flex h-16 md:h-20 items-center px-4 md:px-6 lg:px-12">
        {/* Logo bal oldalon */}
        <div className="flex-1">
          <Link href="/#hero" className="inline-block">
            <Image
              src="/logo.svg"
              alt="OSICAR Logo"
              width={280}
              height={84}
              className="h-16 md:h-20 w-auto"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-12">
          {navigation.map((item) => {
            // Ha főoldalon vagyunk és a link /#-val kezdődik, akkor anchor link
            if (isHomePage && item.href.startsWith("/#")) {
              const anchorId = item.href.replace("/#", "");
              return (
                <a
                  key={item.name}
                  href={`#${anchorId}`}
                  className="text-sm uppercase tracking-widest text-foreground line-hover transition-opacity duration-300 hover:opacity-70"
                >
                  {item.name}
                </a>
              );
            }

            // Minden más esetben Link komponens
            return (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm uppercase tracking-widest text-foreground line-hover transition-opacity duration-300 hover:opacity-70"
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 hidden md:flex justify-end">
          <CTAButton href="tel:+36706050350">
            +36 70 605 0350
          </CTAButton>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <button className="text-foreground p-2">
              <div className="flex flex-col gap-1.5">
                <span className="block w-6 h-px bg-foreground"></span>
                <span className="block w-6 h-px bg-foreground"></span>
              </div>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background border-border w-full" showCloseButton={false}>
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full justify-between py-12">
              <nav className="flex flex-row flex-wrap gap-x-6 gap-y-4">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-widest animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="space-y-4">
                <a
                  href="tel:+36706050350"
                  className="block text-lg text-muted-foreground"
                >
                  +36 70 605 0350
                </a>
                <Button
                  asChild
                  className="w-full h-14 text-base uppercase tracking-widest"
                >
                  <Link href="/kapcsolat" onClick={() => setOpen(false)}>
                    Ajánlatkérés
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
