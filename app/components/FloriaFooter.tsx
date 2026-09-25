"use client";

export default function FloriaFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative w-full bg-[#000000] text-white pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 px-6 sm:px-12 md:px-16 lg:px-24 border-t border-white/[0.08] overflow-hidden selection:bg-white selection:text-black"
      aria-label="Floria Sanctuary Colophon and Footer"
      id="floria-footer"
    >
      {/* Subtle Ambient Vignette */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-2xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1600px] mx-auto">
        {/* ========================================================================= */}
        {/* UPPER EDITORIAL CONTENT: 4-COLUMN CURATORIAL SPREAD                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 sm:gap-16 lg:gap-12 pb-24 sm:pb-32 border-b border-white/[0.08]">
          
          {/* Column 1: Brand Statement & Sanctuary Accord (lg: 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7c957]" />
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">
                  COLOPHON // VOL. IV
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-4">
                The Sanctuary Chronicle
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md">
                FLORIA is a living digital art exhibition suspended between tactile textile craft and 
                nocturnal fantasy. Every creature, moss terraced dwelling, and liminal water basin is 
                woven with thistle thread and documented in the permanent archive.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap gap-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>ARCHIVE: TOKYO</span>
              <span>·</span>
              <span>STUDIO: ZURICH</span>
              <span>·</span>
              <span>CHRONICLE: LONDON</span>
            </div>
          </div>

          {/* Column 2: Navigation Index (lg: 3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500 block mb-1">
              [ INDEX ]
            </span>
            <nav className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium tracking-wide">
              <a
                href="#hero-section"
                className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center justify-between group"
              >
                <span>01 // Daylight Sanctuary</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </a>
              <a
                href="#storytelling-section"
                className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center justify-between group"
              >
                <span>02 // The Woolen Terraces</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </a>
              <a
                href="#discovery-section"
                className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center justify-between group"
              >
                <span>03 // Discover Floria</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </a>
              <a
                href="#discovery-section"
                className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center justify-between group"
              >
                <span>04 // Living Specimen Field Guide</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </a>
              <a
                href="#hero-section"
                className="text-neutral-400 hover:text-white transition-colors duration-200 flex items-center justify-between group"
              >
                <span>05 // Interactive 3D Model</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </a>
            </nav>
          </div>

          {/* Column 3: Dispatch & Socials (lg: 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500 block mb-1">
              [ DISPATCHES ]
            </span>
            <div className="flex flex-col gap-2.5 text-xs font-mono tracking-wider uppercase text-neutral-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                /INSTAGRAM
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                /BEHANCE
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                /X (TWITTER)
              </a>
              <a
                href="https://are.na"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                /ARE.NA ARCHIVE
              </a>
              <a
                href="https://substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                /SUBSTACK JOURNAL
              </a>
            </div>
          </div>

          {/* Column 4: Curatorial Inquiries (lg: 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-500 block mb-1">
                [ INQUIRIES ]
              </span>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-neutral-500 text-[10px] font-mono uppercase">CURATORIAL OFFICE</span>
                <a
                  href="mailto:archive@floria.world"
                  className="text-neutral-300 hover:text-white font-mono transition-colors"
                >
                  curate@floria.world
                </a>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-neutral-500 text-[10px] font-mono uppercase">FIELD REGISTRATION</span>
                <span className="text-neutral-400 font-mono text-[11px]">AUTUMN 2026 EDITION</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                STATUS: IMMERSIVE EXHIBIT
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MONUMENTAL FLORIA TYPOGRAPHY: ART BOOK COLOPHON (60% OF PAGE WIDTH)      */}
        {/* ========================================================================= */}
        <div className="py-12 sm:py-16 md:py-20 flex justify-center items-center select-none w-full max-w-[60vw] mx-auto">
          <h2
            onClick={scrollToTop}
            title="Return to beginning"
            className="font-[family-name:var(--font-display)] font-extrabold uppercase tracking-[-0.025em] text-white/[0.18] hover:text-white/[0.65] transition-colors duration-700 leading-[0.8] whitespace-nowrap text-[9.95vw] text-center cursor-pointer drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{
              textRendering: "geometricPrecision",
            }}
          >
            FLORIA
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM METADATA BAR                                                      */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          <div>
            © 2026 FLORIA ARCHIVE · ALL WORLD SPECIMENS RESERVED
          </div>

          <div className="hidden md:block text-neutral-600">
            PERMANENT DIGITAL EXHIBITION · VOL. 04
          </div>

          <button
            onClick={scrollToTop}
            className="hover:text-white transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
            aria-label="Back to top"
          >
            <span>BACK TO SURFACE</span>
            <span className="font-bold">↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
