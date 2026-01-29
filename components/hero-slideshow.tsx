"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const HERO_COUNT = 17;
const heroImages = Array.from({ length: HERO_COUNT }, (_, i) => `/hero/hero-${HERO_COUNT - i}.jpg`);

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  return (
    <>
      {/* Background images */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImages[currentIndex]}
          alt="OSICAR prémium használt autó"
          fill
          className="object-cover object-center"
          priority={currentIndex === 0}
          sizes="100vw"
          quality={75}
        />

        <Image
          src={heroImages[nextIndex]}
          alt="OSICAR prémium használt autó"
          fill
          className={`object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
          quality={75}
        />

        <link
          rel="preload"
          as="image"
          href={heroImages[(currentIndex + 2) % heroImages.length]}
        />

        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Dot indicators - below hero */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Kép ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
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
