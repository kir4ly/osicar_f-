"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const HERO_COUNT = 12;
const heroImagesSorted = Array.from({ length: HERO_COUNT }, (_, i) => `/hero/hero-${i + 1}.png`);

// Fisher-Yates shuffle for random order
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function HeroSection() {
  const [heroImages] = useState(() => shuffle(heroImagesSorted));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex || isTransitioning) return;
      setIsTransitioning(true);
      setNextIndex(index);

      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 1200);
    },
    [currentIndex, isTransitioning]
  );

  const advance = useCallback(() => {
    goToSlide((currentIndex + 1) % heroImages.length);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    const timer = setInterval(advance, 7000);
    return () => clearInterval(timer);
  }, [advance]);

  if (!mounted) {
    return (
      <>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImages[currentIndex]}
          alt="OSICAR prémium használt autó"
          fill
          className="object-contain md:object-cover object-center md:object-bottom"
          priority
          sizes="100vw"
          quality={100}
        />

        <Image
          src={heroImages[nextIndex]}
          alt="OSICAR prémium használt autó"
          fill
          className={`object-contain md:object-cover object-center md:object-bottom transition-opacity duration-[1200ms] ease-in-out ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          quality={100}
        />

        <link
          rel="preload"
          as="image"
          href={heroImages[(currentIndex + 2) % heroImages.length]}
        />

        {/* Dark overlays for text readability - lighter on mobile since text is below */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent md:from-black/85 md:via-black/60 md:to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:from-black/50 md:via-transparent md:to-black/30" />
      </div>

      {/* Dot indicators - hidden on mobile */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Kép ${i + 1}`}
            className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-white scale-110"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  );
}
