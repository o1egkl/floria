"use client";

import { useState, useRef, useEffect } from "react";
import CharacterModel from "./components/CharacterModel";
import StorytellingSection from "./components/StorytellingSection";
import DiscoverySection from "./components/DiscoverySection";
import FloriaFooter from "./components/FloriaFooter";

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isInside = false;
    let animationFrameId: number;

    const lerpFactor = 0.14; // smooth easing/lerp

    const updateSpotlight = () => {
      // Lerp smooth cursor-following movement
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      const x = currentX.toFixed(2);
      const y = currentY.toFixed(2);

      // Reveal radius: 260px with soft feathered edge
      const maskGradient = `radial-gradient(circle 260px at ${x}px ${y}px, black 0%, black 150px, rgba(0,0,0,0.8) 195px, rgba(0,0,0,0.3) 235px, transparent 260px)`;
      
      // Soft glowing edge
      const glowGradient = `radial-gradient(circle 260px at ${x}px ${y}px, transparent 0%, transparent 215px, rgba(255,230,190,0.18) 246px, rgba(255,255,255,0.32) 256px, transparent 262px)`;

      if (revealLayerRef.current) {
        revealLayerRef.current.style.webkitMaskImage = maskGradient;
        revealLayerRef.current.style.maskImage = maskGradient;
      }

      if (glowRingRef.current) {
        glowRingRef.current.style.backgroundImage = glowGradient;
      }

      animationFrameId = requestAnimationFrame(updateSpotlight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      if (!isInside) {
        isInside = true;
        if (currentX < -500) {
          currentX = targetX;
          currentY = targetY;
        }
        if (revealLayerRef.current) revealLayerRef.current.style.opacity = "1";
        if (glowRingRef.current) glowRingRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      isInside = false;
      if (revealLayerRef.current) revealLayerRef.current.style.opacity = "0";
      if (glowRingRef.current) glowRingRef.current.style.opacity = "0";
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      currentX = targetX;
      currentY = targetY;
      isInside = true;
      if (revealLayerRef.current) revealLayerRef.current.style.opacity = "1";
      if (glowRingRef.current) glowRingRef.current.style.opacity = "1";
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        targetX = touch.clientX - rect.left;
        targetY = touch.clientY - rect.top;

        if (!isInside) {
          isInside = true;
          if (currentX < -500) {
            currentX = targetX;
            currentY = targetY;
          }
          if (revealLayerRef.current) revealLayerRef.current.style.opacity = "1";
          if (glowRingRef.current) glowRingRef.current.style.opacity = "1";
        }
      }
    };

    const handleTouchEnd = () => {
      // Keep reveal alive smoothly on mobile touch
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("touchstart", handleTouchMove, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    animationFrameId = requestAnimationFrame(updateSpotlight);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("touchstart", handleTouchMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full bg-[#000000] text-white selection:bg-white selection:text-black font-sans">
      {/* EXISTING HERO SECTION */}
      <section
        ref={containerRef}
        className="relative min-h-screen w-full bg-[#000000] flex flex-col justify-between overflow-hidden"
        id="hero-section"
      >
      {/* BASE LAYER: Nocturnal Landscape (bg-reveal) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img
          src="/bg-reveal.jpg"
          alt="Floria Nocturnal Sanctuary"
          className="w-full h-full object-cover object-center"
        />
        {/* Editorial darkening overlay for optimal typography legibility */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* REVEAL LAYER: Daylight Landscape (bg-base) through Cursor Spotlight */}
      <div
        ref={revealLayerRef}
        className="absolute inset-0 z-[1] pointer-events-none overflow-hidden transition-opacity duration-300 ease-out opacity-0 select-none"
        style={{
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        <img
          src="/bg-base.jpg"
          alt="Floria Daylight Sanctuary"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      {/* Soft glowing/feathered edge boundary for the 260px spotlight */}
      <div
        ref={glowRingRef}
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden transition-opacity duration-300 ease-out opacity-0"
        aria-hidden="true"
      />

      {/* Atmospheric vignette that maintains pure black borders */}
      <div 
        className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.7)_85%,rgba(0,0,0,0.95)_100%)]" 
        aria-hidden="true" 
      />

      {/* Top Navigation - Above reveal layer */}
      <header className="relative z-20 w-full px-5 sm:px-12 md:px-16 lg:px-24 pt-6 sm:pt-10 md:pt-12 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div className="flex items-center">
          <a
            href="#"
            className="text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] uppercase text-white/90 hover:text-white transition-colors duration-200 drop-shadow-md"
            id="brand-logo"
          >
            FLORIA
          </a>
        </div>

        {/* Right: Editorial Nav Links */}
        <nav className="flex items-center gap-3.5 sm:gap-8" aria-label="Social and portfolio links">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[11px] font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-neutral-300 hover:text-white transition-colors duration-200 drop-shadow-sm"
            id="nav-instagram"
          >
            /INSTAGRAM
          </a>
          <a
            href="https://behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[11px] font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-neutral-300 hover:text-white transition-colors duration-200 drop-shadow-sm"
            id="nav-behance"
          >
            /BEHANCE
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[11px] font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-neutral-300 hover:text-white transition-colors duration-200 drop-shadow-sm"
            id="nav-x"
          >
            /X
          </a>
        </nav>
      </header>

      {/* Main Hero Section - Centered and shifted toward top */}
      <main className="relative z-10 w-full px-4 sm:px-12 md:px-16 lg:px-24 my-auto py-6 sm:py-12 flex flex-col items-center justify-center -translate-y-[10%] sm:-translate-y-[15%] md:-translate-y-[20%]">
        {/* 3D Character Model - Responsive sizing and position for mobile */}
        <div className="absolute left-1 sm:left-6 md:left-10 lg:left-14 xl:left-20 top-1/2 -translate-y-[12%] sm:-translate-y-[20%] md:-translate-y-[20%] w-[170px] sm:w-[300px] md:w-[390px] lg:w-[460px] h-[230px] sm:h-[400px] md:h-[500px] lg:h-[560px] pointer-events-none z-[6] flex items-center justify-center opacity-80 sm:opacity-100">
          <CharacterModel />
        </div>

        <div className="w-full max-w-[1600px] mx-auto text-center flex flex-col items-center justify-center">
          {/* Eyebrow / Supporting Text - Centered */}
          <div className="mb-2.5 sm:mb-4 md:mb-5 text-center relative z-20 px-2">
            <span
              className="inline-block text-[9px] sm:text-[11px] md:text-[12px] font-medium tracking-[0.2em] sm:tracking-[0.22em] uppercase text-neutral-300 select-none drop-shadow-md"
              id="hero-supporting-text"
            >
              Enter a world where creatures come alive
            </span>
          </div>

          {/* Dominant Hero Headline: FLORIA - Centered */}
          <div className="w-full text-center flex justify-center items-center overflow-visible px-2 sm:px-4 relative z-[4]">
            <h1
              className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-[-0.02em] text-white/45 hover:text-white/65 transition-colors duration-500 leading-[0.88] select-none whitespace-nowrap text-[13.5vw] sm:text-[13vw] md:text-[13.5vw] lg:text-[12.5vw] xl:text-[12vw] 2xl:text-[11.5vw] text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
              id="hero-title"
              style={{
                textRendering: "geometricPrecision",
              }}
            >
              FLORIA
            </h1>
          </div>
        </div>
      </main>

      {/* Bottom Area: Description (Left) + CTAs (Right) - Above reveal layer */}
      <footer className="relative z-20 w-full px-5 sm:px-12 md:px-16 lg:px-24 pb-6 sm:pb-10 md:pb-12">
        <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-8 md:gap-12">
          {/* Left: Bottom Description */}
          <div className="max-w-xs sm:max-w-sm md:max-w-[360px] lg:max-w-[400px]">
            <p
              className="text-[11.5px] sm:text-[13px] md:text-[13.5px] leading-[1.6] sm:leading-[1.65] text-neutral-300 font-normal tracking-wide drop-shadow-md"
              id="bottom-description"
            >
              An immersive world of curious creatures, magical places, and stories waiting to be discovered.
            </p>
          </div>

          {/* Right: CTA Buttons - Stacked on mobile for easy touch targets */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveModal("explore")}
              className="group relative inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white bg-black/50 backdrop-blur-sm hover:bg-white text-white hover:text-black px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-[0.08em] transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-1 focus:ring-white drop-shadow-md"
              id="cta-explore"
            >
              <span>Explore Floria</span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                →
              </span>
            </button>

            <button
              onClick={() => setActiveModal("creatures")}
              className="group relative inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white bg-black/50 backdrop-blur-sm hover:bg-white text-white hover:text-black px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-[12px] md:text-[13px] font-medium tracking-[0.08em] transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-1 focus:ring-white drop-shadow-md"
              id="cta-creatures"
            >
              <span>Meet the Creatures</span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </footer>
      </section>

      {/* NEXT SECTION: CINEMATIC SCROLL-DRIVEN STORYTELLING SECTION */}
      <StorytellingSection />

      {/* NEXT SECTION: FLORIA DISCOVERY ARCHIVE */}
      <DiscoverySection />

      {/* FINAL SECTION: OVERSIZED ART-BOOK FLORIA FOOTER */}
      <FloriaFooter />

      {/* Optional Interactive Editorial Preview Modal */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg border border-neutral-800 bg-[#090909] p-5 sm:p-8 text-left shadow-2xl relative max-h-[88dvh] overflow-y-auto rounded-[2px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-neutral-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
              aria-label="Close dialog"
            >
              [ESC / CLOSE]
            </button>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-2 font-mono">
              FLORIA ARCHIVE // {activeModal === "explore" ? "01" : "02"}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-3 sm:mb-4">
              {activeModal === "explore" ? "Entering the Realm of Floria" : "The Curious Fauna & Sentient Forms"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5 sm:mb-6 font-light">
              {activeModal === "explore"
                ? "Beyond the obsidian threshold lies a vast nocturnal biosphere. Echoes of primordial flora intertwine with luminescence, inviting wanderers to venture into uncharted domains."
                : "From gossamer winged wanderers to shadow-weaving arboreals, every inhabitant of Floria embodies a unique story woven into the living tapestry of the sanctuary."}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono tracking-wider">STATUS: AWAITING EXPEDITION</span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-xs uppercase tracking-widest font-medium border border-neutral-700 px-3.5 py-1.5 sm:px-4 sm:py-2 hover:bg-white hover:text-black transition-all"
              >
                Return to Surface →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
