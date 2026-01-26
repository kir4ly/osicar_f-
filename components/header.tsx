"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Kínálat", href: "/autok" },
  { name: "Rólunk", href: "/rolunk" },
  { name: "Kapcsolat", href: "/kapcsolat" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex h-20 items-center px-6 lg:px-12">
        <div className="flex-1 hidden md:block">
          <Link
            href="/"
            className="text-sm uppercase tracking-widest text-foreground line-hover transition-opacity duration-300 hover:opacity-70"
          >
            Főoldal
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm uppercase tracking-widest text-foreground line-hover transition-opacity duration-300 hover:opacity-70"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1 hidden md:flex justify-end">
          <a
            href="tel:+36706050350"
            className="inline-flex items-center justify-center h-10 px-6 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
          >
            06 70 605 0350
          </a>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
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
              <nav className="flex flex-col gap-8">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-display-lg animate-fade-up"
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
                  06 70 605 0350
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
