"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CarImageGalleryProps {
  images: string[];
  brand: string;
  model: string;
}

function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}

export function CarImageGallery({ images, brand, model }: CarImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const validImages = images.filter(Boolean);
  const hasMultiple = validImages.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  // Swipe support for main image
  const mainSwipe = useSwipe(goToNext, goToPrevious);
  // Swipe support for lightbox
  const lightboxSwipe = useSwipe(lightboxNext, lightboxPrev);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/3] bg-black overflow-hidden relative">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 to-foreground/10">
          <span className="text-display-lg md:text-display-xl text-foreground/10">
            {brand}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div
        className="aspect-[4/3] bg-black overflow-hidden relative group"
        onTouchStart={mainSwipe.onTouchStart}
        onTouchMove={mainSwipe.onTouchMove}
        onTouchEnd={mainSwipe.onTouchEnd}
      >
        <button
          type="button"
          className="w-full h-full cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
          aria-label="Kép nagyítása"
        >
          <Image
            src={validImages[currentIndex]}
            alt={`${brand} ${model}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            quality={80}
            className="object-contain"
          />
        </button>

        {/* Navigation arrows for images */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 z-10 rounded-full cursor-pointer"
              aria-label="Előző kép"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 z-10 rounded-full cursor-pointer"
              aria-label="Következő kép"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </>
        )}

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-black/60 backdrop-blur-sm px-3 py-1 text-xs md:text-sm text-white z-10 rounded-full">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail grid */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-1 md:gap-2 mt-1 md:mt-2">
          {validImages.slice(0, 4).map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrentIndex(index);
                openLightbox(index);
              }}
              className={`aspect-[4/3] bg-black overflow-hidden relative cursor-pointer transition-all ${
                currentIndex === index
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`${brand} ${model} - kép ${index + 1}`}
            >
              <Image
                src={img}
                alt={`${brand} ${model} - ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 25vw, 12.5vw"
                loading="lazy"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={lightboxSwipe.onTouchStart}
          onTouchMove={lightboxSwipe.onTouchMove}
          onTouchEnd={lightboxSwipe.onTouchEnd}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-50 rounded-full cursor-pointer"
            aria-label="Bezárás"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Lightbox image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[90vh] m-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validImages[lightboxIndex]}
              alt={`${brand} ${model} - ${lightboxIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Lightbox navigation */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-50 rounded-full cursor-pointer"
                aria-label="Előző kép"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all z-50 rounded-full cursor-pointer"
                aria-label="Következő kép"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </button>
            </>
          )}

          {/* Lightbox counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm md:text-base text-white z-50 rounded-full">
              {lightboxIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
