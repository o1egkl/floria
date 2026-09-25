"use client";

import { useEffect, useRef, useState } from "react";

export default function StorytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - viewportHeight;

      if (totalScrollableDistance <= 0) return;

      // Distance scrolled past the top of the section
      const distanceScrolled = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, distanceScrolled / totalScrollableDistance));
      targetProgress = rawProgress;
    };

    const updateAnimation = () => {
      // High-precision smooth lerp easing for cinematic pacing
      currentProgress += (targetProgress - currentProgress) * 0.12;
      setScrollProgress(currentProgress);

      const p = currentProgress;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // 1. Calculate expansion for the center 9:16 portrait image
      const container = imageContainerRef.current;
      if (container) {
        // Base unscaled layout dimensions
        const baseW = container.offsetWidth || 300;
        const baseH = container.offsetHeight || (baseW * 16) / 9;

        // Scale factor required to reach full page expansion
        const scaleXNeeded = (vw / baseW) * 1.025;
        const scaleYNeeded = (vh / baseH) * 1.025;
        const fullBleedScale = Math.max(scaleXNeeded, scaleYNeeded);

        // Target scale: expands to 60% of full page rather than 100%
        const targetScale = fullBleedScale * 0.60;

        // Growth phase: begins at p = 0.06, achieves 60% expansion by p = 0.76
        const scaleProgress = Math.max(0, Math.min(1, (p - 0.06) / 0.70));
        
        // Custom cubic ease-in-out curve for luxurious deceleration
        const easedScaleT =
          scaleProgress < 0.5
            ? 4 * scaleProgress * scaleProgress * scaleProgress
            : 1 - Math.pow(-2 * scaleProgress + 2, 3) / 2;

        // Current scale with subtle immersive camera dolly past target expansion (up to 3% extra depth)
        const postZoom = p > 0.76 ? 1 + (p - 0.76) * 0.03 : 1;
        const currentScale = (1 + (targetScale - 1) * easedScaleT) * postZoom;

        // Retain refined rounded corners and subtle border for an elegant framed gallery centerpiece
        const borderFadeT = Math.min(1, scaleProgress);
        const currentRadius = Math.max(12, 16 - borderFadeT * 4);
        const borderAlpha = Math.max(0.18, 0.25 - borderFadeT * 0.07);
        const shadowBlur = 30 + scaleProgress * 30;
        const shadowOpacity = 0.7 + scaleProgress * 0.2;

        container.style.transform = `scale3d(${currentScale.toFixed(4)}, ${currentScale.toFixed(4)}, 1)`;
        container.style.borderRadius = `${currentRadius.toFixed(1)}px`;
        container.style.borderColor = `rgba(255, 255, 255, ${borderAlpha.toFixed(3)})`;
        container.style.boxShadow = `0 25px ${shadowBlur.toFixed(1)}px -10px rgba(0, 0, 0, ${shadowOpacity.toFixed(3)}), 0 0 40px rgba(255, 255, 255, ${(borderAlpha * 0.25).toFixed(3)})`;
      }

      // 2. Subtle internal parallax for tactile depth
      if (imageElementRef.current) {
        const t = Math.max(0, Math.min(1, p / 0.8));
        const innerZoom = 1.03 + 0.04 * (1 - t);
        imageElementRef.current.style.transform = `scale(${innerZoom.toFixed(4)})`;
      }

      // 3. Staggered departure of asymmetric editorial text elements
      if (textGroupRef.current) {
        const elements = textGroupRef.current.children;

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;
          // Staggered timing parameters from dataset
          const startP = el.dataset.start ? parseFloat(el.dataset.start) : 0.02 + (i % 5) * 0.035;
          const duration = el.dataset.dur ? parseFloat(el.dataset.dur) : 0.28;
          const endP = startP + duration;

          const exitT = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
          // Cubic ease-out for swift yet refined dispersal
          const easedExit = 1 - Math.pow(1 - exitT, 3);

          const opacity = Math.max(0, 1 - easedExit * 1.3);

          // Directional drifts defined per element
          const dirX = el.dataset.dirX ? parseFloat(el.dataset.dirX) : 0;
          const dirY = el.dataset.dirY ? parseFloat(el.dataset.dirY) : 0;
          const baseRot = el.dataset.baseRot ? parseFloat(el.dataset.baseRot) : 0;
          const rotDelta = el.dataset.rotDelta ? parseFloat(el.dataset.rotDelta) : 0;

          const tx = dirX * easedExit;
          const ty = dirY * easedExit;
          const currentRot = baseRot + rotDelta * easedExit;
          const currentScale = 1 - easedExit * 0.12;

          el.style.opacity = opacity.toFixed(3);
          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${currentRot.toFixed(2)}deg) scale(${currentScale.toFixed(3)})`;
          
          // Completely disable pointer events and hide once faded
          if (opacity <= 0.005) {
            el.style.visibility = "hidden";
          } else {
            el.style.visibility = "visible";
          }
        }
      }

      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    handleScroll();
    animationFrameId = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[340vh] bg-[#000000] text-white selection:bg-white selection:text-black"
      id="storytelling-section"
      aria-label="Floria Cinematic Storytelling and Digital Art Exhibition"
    >
      {/* Sticky Fullscreen Viewport Canvas */}
      <div
        ref={stickyContainerRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#000000]"
      >
        {/* Gallery Ambience: Subtle Dark Void Spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,rgba(0,0,0,1)_80%)]"
          aria-hidden="true"
        />

        {/* ========================================================================= */}
        {/* ASYMMETRIC EDITORIAL "ORGANIZED CHAOS" TYPOGRAPHY CONSTELLATION          */}
        {/* Refined luxury aesthetics: diverse font weights, sizes, tilts & accents  */}
        {/* ========================================================================= */}
        <div
          ref={textGroupRef}
          className="pointer-events-none absolute inset-0 z-20 w-full h-full max-w-[1720px] mx-auto select-none"
        >
          {/* Element 1: Top-Left Archival Specimen & Settlement Badge */}
          <div
            data-start="0.03"
            data-dur="0.32"
            data-dir-x="-150"
            data-dir-y="-100"
            data-base-rot="-3.5"
            data-rot-delta="-6"
            className="absolute top-[8%] sm:top-[10%] lg:top-[12%] left-[4%] sm:left-[6%] lg:left-[9%] max-w-[220px] sm:max-w-[270px] flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.28em] text-[#a7c957] uppercase">
                [02 // SETTLEMENT SANCTUARY]
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957] shadow-[0_0_8px_#a7c957] animate-pulse" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-xl lg:text-2xl tracking-tight text-white/95 leading-tight">
              The Woolen Terraces
            </h3>
            <p className="text-[10px] sm:text-[11px] lg:text-[12px] text-neutral-400 font-light leading-relaxed">
              Knitted cottage dwellings woven into rolling green knolls, sculpted with thistle thread and morning sunlight.
            </p>
          </div>

          {/* Element 2: Top-Right Cartographic Telemetry & Density Badge */}
          <div
            data-start="0.04"
            data-dur="0.30"
            data-dir-x="160"
            data-dir-y="-90"
            data-base-rot="2.8"
            data-rot-delta="5"
            className="absolute top-[9%] sm:top-[11%] lg:top-[13%] right-[4%] sm:right-[7%] lg:right-[10%] max-w-[210px] sm:max-w-[250px] text-right flex flex-col gap-1.5 items-end"
          >
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-[#e9c46a] uppercase">
              SECTOR 04 · ELEVATION 840M
            </span>
            <div className="inline-block border border-white/15 bg-white/[0.04] backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm shadow-sm">
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-200 tracking-wider font-medium">
                KNIT DENSITY: 98.4%
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
              DISTRICT // HIMEYORYN
            </span>
          </div>

          {/* Element 3: Left Vertical Editorial Spine */}
          <div
            data-start="0.08"
            data-dur="0.34"
            data-dir-x="-180"
            data-dir-y="-20"
            data-base-rot="-90"
            data-rot-delta="-8"
            className="hidden sm:block absolute top-[52%] left-[2%] sm:left-[3%] lg:left-[4%] origin-left"
          >
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.45em] uppercase text-neutral-400/90 whitespace-nowrap">
              — FL-SANCTUARY · SECTION 02: THE HILL WEAVERS —
            </span>
          </div>

          {/* Element 4: Floating Specimen ID Tag (Top Left-Mid) */}
          <div
            data-start="0.02"
            data-dur="0.26"
            data-dir-x="-120"
            data-dir-y="-50"
            data-base-rot="2"
            data-rot-delta="4"
            className="hidden md:flex absolute top-[36%] left-[9%] lg:left-[14%] border border-white/10 bg-neutral-950/70 backdrop-blur-sm px-2.5 py-1.5 rounded-[2px] flex-col gap-0.5"
          >
            <span className="text-[8px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
              SPECIMEN ID: FL-702
            </span>
            <span className="text-[10px] font-sans font-medium text-white/80">
              Cottage Type: Spun Gable
            </span>
          </div>

          {/* Element 5: Bottom-Left Folklore & Literary Inscription */}
          <div
            data-start="0.07"
            data-dur="0.35"
            data-dir-x="-140"
            data-dir-y="110"
            data-base-rot="-2"
            data-rot-delta="-5"
            className="absolute bottom-[9%] sm:bottom-[11%] lg:bottom-[13%] left-[4%] sm:left-[7%] lg:left-[10%] max-w-[240px] sm:max-w-[290px] flex flex-col gap-2"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#f4a261] uppercase">
                FOLKLORE // CHAPTER IV
              </span>
            </div>
            <blockquote className="text-[11px] sm:text-xs lg:text-[13px] text-neutral-300 italic font-light leading-relaxed border-l border-white/30 pl-3">
              &ldquo;Follow the pebble stairs up the knoll; the hill-weavers greet travelers only in stillness and wonder.&rdquo;
            </blockquote>
            <span className="text-[9px] font-mono text-neutral-400 tracking-wider pl-3">
              — Oral Chronicles of Floria
            </span>
          </div>

          {/* Element 6: Right-Mid Frosted Botanical Harvest Pill */}
          <div
            data-start="0.05"
            data-dur="0.30"
            data-dir-x="170"
            data-dir-y="30"
            data-base-rot="-3.2"
            data-rot-delta="-6"
            className="absolute top-[42%] sm:top-[40%] right-[3%] sm:right-[6%] lg:right-[9%] max-w-[210px] sm:max-w-[250px] flex flex-col items-end gap-1"
          >
            <div className="border border-white/20 bg-neutral-950/80 backdrop-blur-md px-3.5 py-2 sm:py-2.5 rounded-[3px] shadow-xl flex flex-col gap-0.5 text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e76f51]" />
                <span className="text-[8px] sm:text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                  HARVEST YIELD
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold font-mono text-white tracking-wider">
                YARN PUMPKINS
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-light">
                Cycle 14 · Spun organic vegetation
              </span>
            </div>
          </div>

          {/* Element 7: Far Right Vertical Typography */}
          <div
            data-start="0.10"
            data-dur="0.32"
            data-dir-x="180"
            data-dir-y="40"
            data-base-rot="90"
            data-rot-delta="7"
            className="hidden lg:block absolute top-[55%] right-[2%] origin-right"
          >
            <span className="text-[9px] font-mono tracking-[0.45em] uppercase text-neutral-400/80 whitespace-nowrap">
              — PERMANENT COLLECTION · EXHIBITION ROOM II —
            </span>
          </div>

          {/* Element 8: Bottom-Right Expedition Status & Living Harmony */}
          <div
            data-start="0.06"
            data-dur="0.33"
            data-dir-x="150"
            data-dir-y="110"
            data-base-rot="2.5"
            data-rot-delta="5"
            className="absolute bottom-[8%] sm:bottom-[10%] lg:bottom-[12%] right-[4%] sm:right-[7%] lg:right-[10%] max-w-[220px] sm:max-w-[270px] text-right flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-end gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] sm:text-[10px] font-mono text-neutral-300 tracking-[0.22em] uppercase">
                SETTLEMENT: HARMONIOUS
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] lg:text-[12px] text-neutral-400 font-light leading-snug">
              Pastel cottage roofs nestled along hillside terraces under a wool-drift sky.
            </p>
            <span className="text-[8px] sm:text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
              FLORIA // ARCADIA FIBROSA
            </span>
          </div>

          {/* Element 9: Top-Center Exhibition Sub-Header */}
          <div
            data-start="0.01"
            data-dur="0.22"
            data-dir-x="0"
            data-dir-y="-80"
            data-base-rot="0"
            data-rot-delta="0"
            className="absolute top-[4%] sm:top-[5%] left-1/2 -translate-x-1/2 text-center pointer-events-none"
          >
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono uppercase tracking-[0.38em] text-neutral-400/90">
              [ EXHIBITION PERSPECTIVE · SCROLL TO IMMERSE ]
            </span>
          </div>

          {/* Element 10: Bottom-Center Scroll Indicator */}
          <div
            data-start="0.01"
            data-dur="0.20"
            data-dir-x="0"
            data-dir-y="60"
            data-base-rot="0"
            data-rot-delta="0"
            className="absolute bottom-[3%] sm:bottom-[4%] left-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-1 pointer-events-none"
          >
            <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.3em] text-neutral-400">
              SCROLL TO EXPAND
            </span>
            <span className="text-xs text-neutral-400 animate-bounce">↓</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER 9:16 PORTRAIT IMAGE (EXPANDS SEAMLESSLY INTO FULLSCREEN VIEWPORT)  */}
        {/* Preserves focal composition, flawless across desktop, tablet, and mobile */}
        {/* ========================================================================= */}
        <div
          ref={imageContainerRef}
          className="relative z-10 aspect-[9/16] w-[190px] sm:w-[240px] md:w-[290px] lg:w-[330px] xl:w-[360px] overflow-hidden border border-white/20 rounded-2xl shadow-2xl select-none will-change-transform"
          style={{
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* High-Resolution Attached Artwork: The Knitted Village Sanctuary */}
          <img
            ref={imageElementRef}
            src="/story-village.jpg"
            alt="The Woolen Terraces — Handcrafted Hillside Village Sanctuary"
            className="w-full h-full object-cover object-center will-change-transform"
            style={{
              transformOrigin: "center center",
              imageRendering: "auto",
            }}
          />

          {/* Ambient Inner Vignette: Evaporates as the artwork reaches full viewport */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: Math.max(0, 0.4 * (1 - scrollProgress * 1.5)),
              background: "radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.6) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

      </div>
    </section>
  );
}
