"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type LegalTOCItem = { id: string; label: string; number?: string };

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  lead: string;
  meta?: { label: string; value: string }[];
  toc: LegalTOCItem[];
  children: React.ReactNode;
  related?: { href: string; label: string }[];
}

export function LegalPage({ eyebrow, title, lead, meta, toc, children, related }: LegalPageProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");

  useEffect(() => {
    const handler = () => {
      const offset = 140;
      let current = toc[0]?.id ?? "";
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - offset <= 0) current = item.id;
      }
      setActiveId(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [toc]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-6xl">
        {/* Hero */}
        <header className="mb-12 md:mb-20 max-w-3xl">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.32em] text-primary mb-3">
            {eyebrow}
          </p>
          <h1 className="text-display-lg md:text-display-xl mb-5 leading-[0.95]">{title}</h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{lead}</p>

          {meta && meta.length > 0 && (
            <dl className="mt-6 md:mt-8 flex flex-wrap gap-x-8 gap-y-3 text-xs md:text-sm">
              {meta.map((m) => (
                <div key={m.label} className="flex items-baseline gap-2">
                  <dt className="uppercase tracking-widest text-muted-foreground">{m.label}</dt>
                  <dd className="text-foreground/80">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* TOC desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-4">
                Tartalom
              </p>
              <nav>
                <ul className="space-y-2 border-l border-foreground/10">
                  {toc.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`block pl-4 py-1 text-sm transition-colors border-l -ml-px ${
                            isActive
                              ? "border-primary text-foreground"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.number && (
                            <span className="text-primary mr-2 tabular-nums">{item.number}</span>
                          )}
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-14 md:space-y-20">{children}</div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-20 md:mt-32 pt-10 md:pt-14 border-t border-foreground/10">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-6">
              Kapcsolódó dokumentumok
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex items-center justify-between p-5 border border-foreground/10 hover:border-primary/40 transition-colors"
                >
                  <span className="text-sm uppercase tracking-widest">{r.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-primary transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface LegalSectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

export function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="flex items-baseline gap-4 md:gap-5 mb-6 md:mb-8">
        <span
          className="text-primary text-sm md:text-base tabular-nums font-medium"
          style={{ letterSpacing: "0.05em" }}
        >
          {number}
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="text-[15px] md:text-base leading-relaxed text-foreground/85 space-y-4 [&_strong]:text-foreground [&_a]:text-primary [&_a:hover]:underline">
        {children}
      </div>
    </section>
  );
}

interface DataRowsProps {
  items: { label: string; value: React.ReactNode }[];
}

export function DataRows({ items }: DataRowsProps) {
  return (
    <dl className="divide-y divide-foreground/10 border-y border-foreground/10">
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-3.5"
        >
          <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:pt-0.5">
            {item.label}
          </dt>
          <dd className="text-foreground/90">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

interface PurposeCardProps {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
}

export function PurposeCard({ title, rows }: PurposeCardProps) {
  return (
    <div className="border-l-2 border-primary/30 pl-5 py-1">
      <h3 className="text-base md:text-lg font-medium mb-3 text-foreground">{title}</h3>
      <dl className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-4 text-[14px]">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:pt-0.5">
              {r.label}
            </dt>
            <dd className="text-foreground/85">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
}

export function InfoCard({ title, rows }: InfoCardProps) {
  return (
    <div
      className="p-5 md:p-6"
      style={{
        background:
          "linear-gradient(180deg, rgba(52,118,234,0.05) 0%, rgba(52,118,234,0.01) 100%)",
        border: "1px solid rgba(52,118,234,0.18)",
      }}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-1.5">Hivatalos kapcsolat</p>
      <p className="text-base md:text-lg font-medium mb-4 text-foreground">{title}</p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-col">
            <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {r.label}
            </dt>
            <dd className="text-foreground/90">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
