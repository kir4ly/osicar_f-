"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "osicar_cookie_consent";
const CONSENT_VERSION = "3";

type Choice = "accepted" | "rejected";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || !stored.startsWith(`${CONSENT_VERSION}:`)) {
        setVisible(true);
        const t = setTimeout(() => setMounted(true), 40);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
      setMounted(true);
    }
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, `${CONSENT_VERSION}:${choice}`);
    } catch {
      // ignore — private mode or storage disabled
    }
    setMounted(false);
    setTimeout(() => setVisible(false), 280);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Süti tájékoztató"
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        left: "auto",
        top: "auto",
        zIndex: 10000,
        maxWidth: "calc(100vw - 2rem)",
        width: "320px",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition:
          "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          borderRadius: "12px",
          background: "rgba(10, 10, 10, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -6px rgba(0,0,0,0.6)",
        }}
      >
        <div className="p-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <h2 className="text-[13px] font-semibold text-foreground tracking-tight">
              Sütik
            </h2>
            <Link
              href="/sutik"
              className="text-[11px] text-foreground/50 hover:text-foreground transition-colors"
            >
              Részletek
            </Link>
          </div>

          <p className="text-[12.5px] text-foreground/65 leading-relaxed mb-4">
            Csak a működéshez szükséges sütiket használjuk. Nyomkövetés nincs.
          </p>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => decide("rejected")}
              className="inline-flex items-center justify-center px-4 py-2 text-[11.5px] font-medium text-foreground/70 hover:text-foreground transition-colors rounded-md leading-none"
            >
              Elutasítom
            </button>
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="inline-flex items-center justify-center px-7 py-2.5 text-[11.5px] font-semibold text-white rounded-md transition-all leading-none"
              style={{
                background: "#3476EA",
                boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 1px 2px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4a86ee";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3476EA";
              }}
            >
              Elfogadom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
