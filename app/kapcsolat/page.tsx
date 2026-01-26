"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="grain-overlay min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left column - Info */}
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4 animate-fade-up">
              Kapcsolat
            </p>
            <h1 className="text-display-xl mb-8 animate-fade-up delay-100">
              Lépjen velünk kapcsolatba
            </h1>
            <p className="text-xl text-muted-foreground mb-16 animate-fade-up delay-200">
              Kérdése van? Szívesen segítünk. Keressen minket telefonon,
              e-mailben, vagy látogasson el hozzánk személyesen.
            </p>

            <div className="space-y-12">
              <div className="animate-fade-up delay-300">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Cím
                </p>
                <p className="text-display-md">1234 Budapest</p>
                <p className="text-display-md">Példa utca 123.</p>
              </div>

              <div className="animate-fade-up delay-400">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Telefon
                </p>
                <a href="tel:+3612345678" className="text-display-md line-hover">
                  +36 1 234 5678
                </a>
              </div>

              <div className="animate-fade-up delay-500">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Email
                </p>
                <a href="mailto:info@autopiac.hu" className="text-display-md line-hover">
                  info@autopiac.hu
                </a>
              </div>

              <div className="animate-fade-up delay-600">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                  Nyitvatartás
                </p>
                <div className="space-y-2 text-lg">
                  <p>Hétfő - Péntek: 9:00 - 18:00</p>
                  <p>Szombat: 9:00 - 14:00</p>
                  <p>Vasárnap: Zárva</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="animate-fade-up delay-300">
            {submitted ? (
              <div className="h-full flex flex-col justify-center">
                <p className="text-display-lg mb-4">Köszönjük üzenetét</p>
                <p className="text-xl text-muted-foreground mb-8">
                  Munkatársunk hamarosan felveszi Önnel a kapcsolatot.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center h-14 px-10 border border-foreground/20 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors duration-300 w-fit"
                >
                  Új üzenet küldése
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                      Név
                    </label>
                    <Input
                      placeholder="Teljes név"
                      required
                      className="h-14 bg-transparent border-foreground/10 text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="pelda@email.hu"
                      required
                      className="h-14 bg-transparent border-foreground/10 text-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      placeholder="+36 30 123 4567"
                      className="h-14 bg-transparent border-foreground/10 text-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                      Téma
                    </label>
                    <Select>
                      <SelectTrigger className="h-14 bg-transparent border-foreground/10 text-lg">
                        <SelectValue placeholder="Válasszon témát" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="erdeklodes">Autó iránt érdeklődök</SelectItem>
                        <SelectItem value="finanszirozas">Finanszírozás</SelectItem>
                        <SelectItem value="probaut">Próbaút időpont</SelectItem>
                        <SelectItem value="egyeb">Egyéb kérdés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm uppercase tracking-widest text-muted-foreground mb-3 block">
                    Üzenet
                  </label>
                  <Textarea
                    placeholder="Írja le kérdését vagy üzenetét..."
                    rows={6}
                    required
                    className="bg-transparent border-foreground/10 text-lg resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-1.5 w-4 h-4"
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground">
                    Elolvastam és elfogadom az adatvédelmi tájékoztatót
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-14 px-10 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors duration-300"
                >
                  Üzenet küldése
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
