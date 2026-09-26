"use client";

import { useEffect, useRef } from "react";

export default function StorytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const innerVignetteRef = useRef<HTMLDivElement>(null);

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

      const p = currentProgress;
      const vh = window.innerHeight;

      // 1. Calculate expansion for the center 9:16 portrait image
      const container = imageContainerRef.current;
      if (container) {
        // Base unscaled layout dimensions
        const baseW = container.offsetWidth || 300;
        const baseH = container.offsetHeight || (baseW * 16) / 9;

        // Scale factor required to reach exact whole viewport height
        const targetScale = Math.max(1, vh / baseH);

        // Phase 1 (0.04 -> 0.44): Scale up until it takes the whole viewport height
        // Phase 2 (0.44 -> 0.56): Hold at full viewport height for immersive viewing
        // Phase 3 (0.56 -> 0.92): Unscale back down to original size as user scrolls further
        let expansionFactor = 0;

        if (p <= 0.04) {
          expansionFactor = 0;
        } else if (p < 0.44) {
          const t = (p - 0.04) / 0.40;
          // Smooth cubic ease-in-out
          expansionFactor = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        } else if (p <= 0.56) {
          // Peak: takes whole viewport height
          expansionFactor = 1;
        } else if (p < 0.92) {
          const t = (p - 0.56) / 0.36;
          // Smooth cubic ease-in-out unscale
          const unscaleT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          expansionFactor = 1 - unscaleT;
        } else {
          expansionFactor = 0;
        }

        const currentScale = 1 + (targetScale - 1) * expansionFactor;

        // Refined corner radius & border opacity linked to expansion
        const currentRadius = Math.max(10, 16 - expansionFactor * 6);
        const borderAlpha = Math.max(0.15, 0.25 - expansionFactor * 0.08);
        const shadowBlur = 30 + expansionFactor * 30;
        const shadowOpacity = 0.7 + expansionFactor * 0.2;

        container.style.transform = `scale3d(${currentScale.toFixed(4)}, ${currentScale.toFixed(4)}, 1)`;
        container.style.borderRadius = `${currentRadius.toFixed(1)}px`;
        container.style.borderColor = `rgba(255, 255, 255, ${borderAlpha.toFixed(3)})`;
        container.style.boxShadow = `0 25px ${shadowBlur.toFixed(1)}px -10px rgba(0, 0, 0, ${shadowOpacity.toFixed(3)}), 0 0 40px rgba(255, 255, 255, ${(borderAlpha * 0.25).toFixed(3)})`;

        if (innerVignetteRef.current) {
          innerVignetteRef.current.style.opacity = `${Math.max(0, 0.4 * (1 - expansionFactor)).toFixed(3)}`;
        }
      }

      // 2. Subtle internal depth
      if (imageElementRef.current) {
        const innerZoom = 1.02 + 0.03 * (1 - (p > 0.5 ? 1 - (p - 0.5) * 2 : p * 2));
        imageElementRef.current.style.transform = `scale(${Math.max(1, innerZoom).toFixed(4)})`;
      }

      // 3. Staggered departure and return of asymmetric editorial text elements
      if (textGroupRef.current) {
        const elements = textGroupRef.current.children;
        const isMobile = window.innerWidth < 768;

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i] as HTMLElement;

          let dispersal = 0;

          if (isMobile) {
            // Rapid mobile departure: elements clear out cleanly before image scales into their area
            if (p <= 0.44) {
              const exitT = Math.max(0, Math.min(1, p / 0.08));
              dispersal = 1 - Math.pow(1 - exitT, 3);
            } else if (p <= 0.56) {
              dispersal = 1;
            } else {
              // On unscaling, only restore text when image is fully back to its original compact size
              const returnT = Math.max(0, Math.min(1, (p - 0.86) / 0.10));
              dispersal = 1 - (1 - Math.pow(1 - returnT, 3));
            }
          } else {
            // Desktop Staggered Departure Phase
            if (p <= 0.44) {
              const startP = el.dataset.start ? parseFloat(el.dataset.start) : 0.02 + (i % 5) * 0.035;
              const duration = el.dataset.dur ? parseFloat(el.dataset.dur) : 0.28;
              const endP = startP + duration;

              const exitT = Math.max(0, Math.min(1, (p - startP) / (endP - startP)));
              dispersal = 1 - Math.pow(1 - exitT, 3);
            } else if (p <= 0.56) {
              dispersal = 1;
            } else {
              const returnStart = 0.58 + ((i % 5) * 0.035);
              const returnDur = 0.16;
              const returnT = Math.max(0, Math.min(1, (p - returnStart) / returnDur));
              const returnEase = 1 - Math.pow(1 - returnT, 3);
              dispersal = 1 - returnEase;
            }
          }

          const opacity = Math.max(0, 1 - dispersal * 1.25);

          // Directional drifts: on mobile fly vertically away from center without rotation
          let dirX = el.dataset.dirX ? parseFloat(el.dataset.dirX) : 0;
          let dirY = el.dataset.dirY ? parseFloat(el.dataset.dirY) : 0;
          let baseRot = el.dataset.baseRot ? parseFloat(el.dataset.baseRot) : 0;
          let rotDelta = el.dataset.rotDelta ? parseFloat(el.dataset.rotDelta) : 0;

          if (isMobile) {
            dirX = 0;
            dirY = dirY < 0 ? -220 : 220;
            baseRot = 0;
            rotDelta = 0;
          }

          const tx = dirX * dispersal;
          const ty = dirY * dispersal;
          const currentRot = baseRot + rotDelta * dispersal;
          const currentScale = 1 - dispersal * 0.12;

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
        {/* ASYMMETRIC EDITORIAL TYPOGRAPHY CONSTELLATION (BEHIND EXPANDING ARTWORK)   */}
        {/* z-10 ensures the image (z-20) is ALWAYS in front, never obscured by text  */}
        {/* ========================================================================= */}
        <div
          ref={textGroupRef}
          className="pointer-events-none absolute inset-0 z-10 w-full h-full max-w-[1720px] mx-auto select-none"
        >
          {/* Element 1: Top-Left Archival Specimen & Settlement Badge */}
          <div
            data-start="0.03"
            data-dur="0.32"
            data-dir-x="-180"
            data-dir-y="-110"
            data-base-rot="-3.5"
            data-rot-delta="-6"
            className="absolute top-3 sm:top-5 md:top-8 lg:top-[9%] xl:top-[12%] left-3 right-3 sm:left-[6%] lg:left-[8%] xl:left-[11%] sm:right-auto max-w-[320px] mx-auto sm:mx-0 sm:max-w-[270px] lg:max-w-[300px] xl:max-w-[360px] flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-mono tracking-[0.22em] sm:tracking-[0.28em] text-[#a7c957] uppercase">
                [02 // SETTLEMENT SANCTUARY]
              </span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#a7c957] shadow-[0_0_10px_#a7c957] animate-pulse" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-xl lg:text-2xl xl:text-3xl tracking-tight text-white/95 leading-tight">
              The Woolen Terraces
            </h3>
            <p className="text-[10px] sm:text-xs lg:text-[13.5px] text-neutral-300 font-light leading-snug sm:leading-relaxed max-w-[280px] sm:max-w-none">
              Knitted cottage dwellings woven into rolling green knolls, sculpted with thistle thread and morning sunlight.
            </p>
          </div>

          {/* Element 2: Top-Right Cartographic Telemetry & Density Badge (Wide Screens Only) */}
          <div
            data-start="0.04"
            data-dur="0.30"
            data-dir-x="180"
            data-dir-y="-100"
            data-base-rot="2.8"
            data-rot-delta="5"
            className="hidden xl:flex absolute top-[9%] xl:top-[12%] right-[7%] xl:right-[11%] max-w-[260px] xl:max-w-[300px] text-right flex-col gap-2 items-end"
          >
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] text-[#e9c46a] uppercase">
              SECTOR 04 · ELEVATION 840M
            </span>
            <div className="inline-block border border-white/20 bg-white/[0.06] backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm shadow-md">
              <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-mono text-neutral-100 tracking-wider font-semibold">
                KNIT DENSITY: 98.4%
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono tracking-widest uppercase">
              DISTRICT // HIMEYORYN
            </span>
          </div>

          {/* Element 3: Left Vertical Editorial Spine (Ultra-Wide Only) */}
          <div
            data-start="0.08"
            data-dur="0.34"
            data-dir-x="-180"
            data-dir-y="-20"
            data-base-rot="-90"
            data-rot-delta="-8"
            className="hidden 2xl:block absolute top-[52%] left-[2.5%] origin-left"
          >
            <span className="text-[10px] sm:text-[11.5px] font-mono tracking-[0.45em] uppercase text-neutral-400/90 whitespace-nowrap">
              — FL-SANCTUARY · SECTION 02: THE HILL WEAVERS —
            </span>
          </div>

          {/* Element 4: Floating Specimen ID Tag (Wide Screens Only) */}
          <div
            data-start="0.02"
            data-dur="0.26"
            data-dir-x="-140"
            data-dir-y="-60"
            data-base-rot="2"
            data-rot-delta="4"
            className="hidden xl:flex absolute top-[36%] left-[9%] xl:left-[13%] border border-white/15 bg-neutral-950/80 backdrop-blur-sm px-3.5 py-2 rounded-[3px] shadow-lg flex-col gap-1"
          >
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase font-medium">
              SPECIMEN ID: FL-702
            </span>
            <span className="text-xs sm:text-[13px] font-sans font-semibold text-white/90">
              Cottage Type: Spun Gable
            </span>
          </div>

          {/* Element 5: Bottom-Left Folklore & Literary Inscription */}
          <div
            data-start="0.07"
            data-dur="0.35"
            data-dir-x="-160"
            data-dir-y="120"
            data-base-rot="-2"
            data-rot-delta="-5"
            className="absolute bottom-5 sm:bottom-7 md:bottom-10 lg:bottom-[9%] xl:bottom-[12%] left-3 right-3 sm:left-[6%] lg:left-[8%] xl:left-[11%] sm:right-auto max-w-[320px] mx-auto sm:mx-0 sm:max-w-[280px] lg:max-w-[310px] xl:max-w-[380px] flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-mono tracking-[0.22em] sm:tracking-[0.3em] text-[#f4a261] uppercase font-semibold">
                FOLKLORE // CHAPTER IV
              </span>
            </div>
            <blockquote className="text-[10.5px] sm:text-xs lg:text-[14px] xl:text-[15px] text-neutral-200 italic font-light leading-snug sm:leading-relaxed border-l-0 sm:border-l-2 border-white/40 pl-0 sm:pl-3.5 max-w-[280px] sm:max-w-none">
              &ldquo;Follow the pebble stairs up the knoll; the hill-weavers greet travelers only in stillness and wonder.&rdquo;
            </blockquote>
            <span className="text-[8.5px] sm:text-[9.5px] lg:text-[11px] font-mono text-neutral-400 tracking-wider pl-0 sm:pl-3.5">
              — Oral Chronicles of Floria
            </span>
          </div>

          {/* Element 6: Right-Mid Frosted Botanical Harvest Pill (Wide Screens Only) */}
          <div
            data-start="0.05"
            data-dur="0.30"
            data-dir-x="180"
            data-dir-y="30"
            data-base-rot="-3.2"
            data-rot-delta="-6"
            className="hidden xl:flex absolute top-[39%] right-[7%] xl:right-[10%] max-w-[240px] xl:max-w-[280px] flex-col items-end gap-1.5"
          >
            <div className="border border-white/25 bg-neutral-950/85 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-[4px] shadow-2xl flex flex-col gap-1 text-right">
              <div className="flex items-center justify-end gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e76f51] shadow-[0_0_8px_#e76f51]" />
                <span className="text-[9px] sm:text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-medium">
                  HARVEST YIELD
                </span>
              </div>
              <span className="text-sm sm:text-base font-extrabold font-mono text-white tracking-wider">
                YARN PUMPKINS
              </span>
              <span className="text-[10px] sm:text-[11.5px] text-neutral-300 font-light">
                Cycle 14 · Spun organic vegetation
              </span>
            </div>
          </div>

          {/* Element 7: Far Right Vertical Typography (Ultra-Wide Only) */}
          <div
            data-start="0.10"
            data-dur="0.32"
            data-dir-x="180"
            data-dir-y="40"
            data-base-rot="90"
            data-rot-delta="7"
            className="hidden 2xl:block absolute top-[55%] right-[2.5%] origin-right"
          >
            <span className="text-[10px] sm:text-[11.5px] font-mono tracking-[0.45em] uppercase text-neutral-400/90 whitespace-nowrap">
              — PERMANENT COLLECTION · EXHIBITION ROOM II —
            </span>
          </div>

          {/* Element 8: Bottom-Right Expedition Status (Wide Screens Only) */}
          <div
            data-start="0.06"
            data-dur="0.33"
            data-dir-x="160"
            data-dir-y="120"
            data-base-rot="2.5"
            data-rot-delta="5"
            className="hidden xl:flex absolute bottom-[9%] xl:bottom-[12%] right-[7%] xl:right-[11%] max-w-[260px] xl:max-w-[320px] text-right flex-col gap-2"
          >
            <div className="flex items-center justify-end gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-200 tracking-[0.22em] uppercase font-semibold">
                SETTLEMENT: HARMONIOUS
              </span>
            </div>
            <p className="text-[11px] sm:text-[12.5px] lg:text-[13.5px] text-neutral-300 font-light leading-snug">
              Pastel cottage roofs nestled along hillside terraces under a wool-drift sky.
            </p>
            <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
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
            className="hidden lg:block absolute top-[4%] sm:top-[5%] left-1/2 -translate-x-1/2 text-center pointer-events-none"
          >
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono uppercase tracking-[0.38em] text-neutral-300/90 font-medium">
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
            className="absolute bottom-1 sm:bottom-2.5 left-1/2 -translate-x-1/2 text-center flex flex-col items-center gap-0.5 pointer-events-none"
          >
            <span className="text-[8px] sm:text-[9.5px] font-mono uppercase tracking-[0.25em] sm:tracking-[0.3em] text-neutral-300 font-medium">
              SCROLL TO EXPAND
            </span>
            <span className="text-xs sm:text-sm text-neutral-300 animate-bounce">↓</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER 9:16 PORTRAIT IMAGE (EXPANDS SEAMLESSLY INTO FULLSCREEN VIEWPORT)  */}
        {/* z-20 guarantees image is ALWAYS in front of background text               */}
        {/* ========================================================================= */}
        <div
          ref={imageContainerRef}
          className="relative z-20 aspect-[9/16] w-[130px] sm:w-[170px] md:w-[220px] lg:w-[270px] xl:w-[340px] 2xl:w-[360px] overflow-hidden border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl select-none will-change-transform"
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
            ref={innerVignetteRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: 0.4,
              background: "radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.6) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

      </div>
    </section>
  );
}
