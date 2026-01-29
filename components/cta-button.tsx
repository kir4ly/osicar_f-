"use client";

import { useState } from "react";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  direction?: "right" | "left";
  variant?: "default" | "hero" | "card";
}

export function CTAButton({ href, children, fullWidth = false, direction = "right", variant = "default" }: CTAButtonProps) {
  const [isHovered, setIsHovered] = useState(variant === "hero");
  const [isPressed, setIsPressed] = useState(false);

  return (
    <a
      href={href}
      className={`group relative ${fullWidth ? 'flex w-full' : 'inline-flex'} items-center justify-center gap-2 overflow-hidden transition-all duration-300 cursor-pointer uppercase text-base font-semibold tracking-tight ${variant === "card" ? '' : 'rounded-full'} shadow-2xl ${variant === "hero" ? '' : 'backdrop-blur-2xl'}`}
      style={{
        '--main-color': 'rgb(52, 118, 234)',
        '--main-bg-color': 'rgba(52, 118, 234, 0.36)',
        '--pattern-color': 'rgba(52, 118, 234, 0.073)',
        filter: isPressed ? 'hue-rotate(250deg)' : 'hue-rotate(0deg)',
        letterSpacing: '0.3rem',
        backgroundSize: isHovered ? 'cover, 10px 10px, 10px 10px' : 'cover, 15px 15px, 15px 15px',
        backgroundPosition: 'center center, center center, center center',
        backgroundColor: variant === "hero" ? 'rgb(0, 0, 0)' : 'transparent',
        border: variant === "card" ? 'none' : '1px solid rgba(52, 118, 234, 0.5)',
        borderImage: variant === "card" ? 'radial-gradient(circle, var(--main-color) 0%, rgba(0, 0, 0, 0) 100%) 1' : 'none',
        borderWidth: variant === "card" ? '1px 0px' : '1px',
        borderStyle: 'solid',
        borderRadius: variant === "card" ? '0' : '9999px',
        color: 'var(--main-color)',
        padding: variant === "hero" ? '1rem 2rem' : '0.75rem 1.5rem',
        fontWeight: 700,
        fontSize: variant === "hero" ? '1.25rem' : '0.875rem',
        boxShadow: isHovered
          ? '0 0 0 1px rgba(52,118,234,0.35), 0 40px 80px rgba(52,118,234,0.18)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(variant === "hero");
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onBlur={() => {
        setIsHovered(variant === "hero");
        setIsPressed(false);
      }}
    >
      {direction === "left" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-[1] w-4 h-4 transition-transform duration-300"
          style={{
            color: 'var(--main-color)',
            transform: isHovered ? 'translateX(-8px)' : 'translateX(0)',
          }}
        >
          <path d="M19 12H5"></path>
          <path d="m12 19-7-7 7-7"></path>
        </svg>
      )}
      <span className="relative z-[1] text-sm">{children}</span>
      {direction === "right" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-[1] w-4 h-4 transition-transform duration-300"
          style={{
            color: 'var(--main-color)',
            transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
          }}
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      )}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${variant === "card" ? '' : 'rounded-full'} transition-all duration-300`}
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      ></span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[1px] ${variant === "card" ? '' : 'rounded-full'}`}
        style={{
          background: 'radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 60%), radial-gradient(90% 80% at 50% 120%, rgba(52,118,234,0.18) 0%, rgba(52,118,234,0) 60%)',
        }}
      ></span>
    </a>
  );
}
