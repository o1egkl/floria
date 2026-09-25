"use client";

import { useEffect, useRef, useState } from "react";

interface Specimen {
  id: string;
  catalog: string;
  name: string;
  latinName: string;
  category: string;
  categoryColor: string;
  image: string;
  description: string;
  telemetry: {
    habitat: string;
    elevation: string;
    frequency: string;
    status: string;
  };
  rotation: string;
  aspect: string;
  colSpan: string;
  offsetY: string;
}

const SPECIMENS: Specimen[] = [
  {
    id: "moss-fox",
    catalog: "FL-01 // SPECIMEN",
    name: "The Moss Fox",
    latinName: "Vulpes Lucida",
    category: "FAUNA · BOTANICAL SENTIENT",
    categoryColor: "#a7c957",
    image: "/floria-moss-fox.jpg",
    description:
      "Sculpted from living velvet moss and elder lichen. Wanders the rain-carved steps of Himeyoryn at dusk, its bioluminescent whiskers sensing the pulse of morning sunlight.",
    telemetry: {
      habitat: "Verdant Terrace Knolls",
      elevation: "840m - 1,120m",
      frequency: "432 Hz",
      status: "Active · Gentle",
    },
    rotation: "-1.5deg",
    aspect: "aspect-[3/4]",
    colSpan: "lg:col-span-7",
    offsetY: "lg:translate-y-0",
  },
  {
    id: "whispering-grove",
    catalog: "FL-02 // BIOME",
    name: "The Whispering Canopy",
    latinName: "Silva Susurrans",
    category: "TERRITORY · ARBOREAL SANCTUARY",
    categoryColor: "#e9c46a",
    image: "/floria-whispering-grove.jpg",
    description:
      "Towering elder trunks knit with braided bark. Hand-woven fiber lanterns ignite autonomously when nocturnal mist descends upon the sanctuary floor.",
    telemetry: {
      habitat: "Ancient Arbor Basin",
      elevation: "620m",
      frequency: "396 Hz",
      status: "Luminescent Equilibrium",
    },
    rotation: "1.8deg",
    aspect: "aspect-[4/3]",
    colSpan: "lg:col-span-5",
    offsetY: "lg:translate-y-16",
  },
  {
    id: "celestial-moth",
    catalog: "FL-03 // SPECIMEN",
    name: "The Celestial Moth",
    latinName: "Lepidoptera Astralis",
    category: "FAUNA · GOSSAMER CELESTIAL",
    categoryColor: "#60a5fa",
    image: "/floria-celestial-moth.jpg",
    description:
      "Feathered wings of gold-spun thread and midnight sapphire silk. Its wings vibrate in micro-harmonic resonance, scattering lunar pollen over dormant knolls.",
    telemetry: {
      habitat: "Obsidian Crags",
      elevation: "1,450m",
      frequency: "528 Hz",
      status: "Rare Sighting",
    },
    rotation: "-2deg",
    aspect: "aspect-square",
    colSpan: "lg:col-span-5",
    offsetY: "lg:-translate-y-8",
  },
  {
    id: "amber-weaver",
    catalog: "FL-04 // SPECIMEN",
    name: "The Amber Weaver",
    latinName: "Aranea Aurum",
    category: "FAUNA · ARTISAN CRAFT",
    categoryColor: "#f4a261",
    image: "/floria-amber-weaver.jpg",
    description:
      "A solitary artisan creature born of fleece and raw fossilized amber. Weaves shimmering loom threads between dew-soaked boulders before sunrise.",
    telemetry: {
      habitat: "Sunstone Quarry",
      elevation: "980m",
      frequency: "480 Hz",
      status: "Harvesting Thread",
    },
    rotation: "2.2deg",
    aspect: "aspect-[3/4]",
    colSpan: "lg:col-span-7",
    offsetY: "lg:translate-y-8",
  },
  {
    id: "obsidian-basin",
    catalog: "FL-05 // BIOME",
    name: "The Obsidian Basin",
    latinName: "Lacus Obscura",
    category: "TERRITORY · LIMINAL WATERS",
    categoryColor: "#c084fc",
    image: "/floria-obsidian-basin.jpg",
    description:
      "A tranquil mirror-black expanse flanked by soft crochet ridges. Miniature luminous lotus pods drift in sacred orbital patterns under twin moons.",
    telemetry: {
      habitat: "Central Lacuna",
      elevation: "410m",
      frequency: "285 Hz",
      status: "Permanent Stillness",
    },
    rotation: "-0.8deg",
    aspect: "aspect-[16/10]",
    colSpan: "lg:col-span-12",
    offsetY: "lg:translate-y-4",
  },
];

interface DiscoverySectionProps {
  onSelectSpecimen?: (specimen: Specimen) => void;
}

export default function DiscoverySection({ onSelectSpecimen }: DiscoverySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen | null>(null);
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-specimen-id");
            if (id) {
              setRevealedCards((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-specimen-id]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleCardClick = (specimen: Specimen) => {
    setSelectedSpecimen(specimen);
    if (onSelectSpecimen) {
      onSelectSpecimen(specimen);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#000000] text-white py-28 sm:py-36 md:py-44 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.08]"
      id="discovery-section"
      aria-label="Floria Discovery Archive"
    >
      {/* Cinematic Ambient Glows */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(52,211,153,0.035)_0%,transparent_70%)] blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-2/3 right-[-100px] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(233,196,106,0.03)_0%,transparent_70%)] blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Floating Oversized Background Typographic Watermarks */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden -z-10 opacity-[0.035]">
        <span className="absolute top-[8%] left-[2%] text-[14vw] font-[family-name:var(--font-display)] font-extrabold tracking-tighter uppercase whitespace-nowrap text-white leading-none">
          TAXONOMY
        </span>
        <span className="absolute top-[42%] right-[-5%] text-[16vw] font-[family-name:var(--font-display)] font-extrabold tracking-tighter uppercase whitespace-nowrap text-white leading-none">
          SPECIMEN
        </span>
        <span className="absolute top-[75%] left-[5%] text-[15vw] font-[family-name:var(--font-display)] font-extrabold tracking-tighter uppercase whitespace-nowrap text-white leading-none">
          SANCTUARY
        </span>
      </div>

      <div className="max-w-[1600px] mx-auto">
        {/* ========================================================================= */}
        {/* SECTION HEADER: SCIENTIFIC ARCHIVE INTRO                                  */}
        {/* ========================================================================= */}
        <div className="relative mb-24 sm:mb-32 md:mb-40 flex flex-col items-start max-w-4xl">
          {/* Metadata Kicker Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#a7c957] shadow-[0_0_10px_#a7c957] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.32em] uppercase text-neutral-400">
              [ SECTION 03 // ARCHIVE OF THE UNEXPLORED ]
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-600">
              ·
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-500 tracking-widest">
              LAT 48°14&apos;N · EXPEDITION VOL. IV
            </span>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.02em] uppercase text-white mb-8 leading-[0.92]">
            Discover <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-neutral-500">
              Floria
            </span>
          </h2>

          {/* Curated Editorial Introduction */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-l border-white/20 pl-6 sm:pl-8">
            <p className="md:col-span-8 text-neutral-300 text-sm sm:text-base md:text-lg font-light leading-relaxed">
              Beyond the woolen threshold lies an uncharted nocturnal biosphere. Here, sentient creatures
              arise from woven moss, elder thistle fibers, and celestial dew—each specimen recorded in field
              notes, awaiting those who seek what has never been named.
            </p>
            <div className="md:col-span-4 flex flex-col justify-end gap-1.5 text-neutral-500 font-mono text-[10px] sm:text-[11px] tracking-wider uppercase">
              <span>FIELD REGISTRY // 05 CATALOGED</span>
              <span>ORGANIC FIBER ACCORD // VERIFIED</span>
              <span className="text-[#a7c957]">STATUS // SANCTUARY OPEN</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ASYMMETRIC EDITORIAL GRID (4-6 CARDS)                                     */}
        {/* Intentional sizes, rotations, offsets and luxury field journal aesthetic  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 md:gap-16 lg:gap-14 items-start">
          {SPECIMENS.map((specimen, index) => {
            const isRevealed = revealedCards[specimen.id];

            return (
              <div
                key={specimen.id}
                data-specimen-id={specimen.id}
                onClick={() => handleCardClick(specimen)}
                className={`group relative col-span-1 ${specimen.colSpan} ${specimen.offsetY} cursor-pointer transition-all duration-700 ease-out`}
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed
                    ? `translateY(0) rotate(${specimen.rotation}) scale(1)`
                    : `translateY(60px) rotate(0deg) scale(0.96)`,
                  transitionDelay: `${index * 90}ms`,
                }}
              >
                {/* Journal Field Specimen Outer Container */}
                <div className="relative border border-white/[0.12] group-hover:border-white/40 bg-[#090909]/90 backdrop-blur-md p-4 sm:p-6 lg:p-7 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)] group-hover:-translate-y-2">
                  
                  {/* Subtle Corner Crosshairs for Scientific Journal Vibe */}
                  <span className="absolute top-2 left-2 text-[10px] font-mono text-neutral-600 select-none">
                    +
                  </span>
                  <span className="absolute top-2 right-2 text-[10px] font-mono text-neutral-600 select-none">
                    +
                  </span>
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-600 select-none">
                    +
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-600 select-none">
                    +
                  </span>

                  {/* Top Bar: Archival Tag & Category */}
                  <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3 text-[10px] font-mono tracking-widest uppercase">
                    <span className="text-neutral-400 group-hover:text-white transition-colors duration-300">
                      {specimen.catalog}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: specimen.categoryColor }}
                      />
                      <span
                        className="transition-colors duration-300 font-medium"
                        style={{ color: specimen.categoryColor }}
                      >
                        {specimen.category}
                      </span>
                    </div>
                  </div>

                  {/* Artwork Image Frame */}
                  <div
                    className={`relative w-full ${specimen.aspect} overflow-hidden rounded-[2px] bg-neutral-950 mb-5 border border-white/[0.06]`}
                  >
                    <img
                      src={specimen.image}
                      alt={specimen.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform filter brightness-95 group-hover:brightness-105"
                    />

                    {/* Gradient Overlay for Mood & Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Floating Hover Indicator on Image */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-sm text-[9px] font-mono tracking-widest text-white uppercase">
                      INSPECT [ + ]
                    </div>
                  </div>

                  {/* Typographic Title & Latin Binomial */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3">
                    <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl md:text-3xl text-white group-hover:text-white transition-colors tracking-tight">
                      {specimen.name}
                    </h3>
                    <span className="text-xs sm:text-sm font-serif italic text-neutral-400 font-light">
                      {specimen.latinName}
                    </span>
                  </div>

                  {/* Mysterious Description */}
                  <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed mb-6 group-hover:text-neutral-300 transition-colors">
                    {specimen.description}
                  </p>

                  {/* Bottom Technical Telemetry Tray */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/[0.08] text-[9px] sm:text-[10px] font-mono text-neutral-500">
                    <div>
                      <span className="block text-neutral-600 uppercase">HABITAT</span>
                      <span className="text-neutral-300 truncate block">{specimen.telemetry.habitat}</span>
                    </div>
                    <div>
                      <span className="block text-neutral-600 uppercase">ELEVATION</span>
                      <span className="text-neutral-300 block">{specimen.telemetry.elevation}</span>
                    </div>
                    <div>
                      <span className="block text-neutral-600 uppercase">RESONANCE</span>
                      <span className="text-neutral-300 block">{specimen.telemetry.frequency}</span>
                    </div>
                    <div>
                      <span className="block text-neutral-600 uppercase">OBSERVATION</span>
                      <span className="text-neutral-300 truncate block">{specimen.telemetry.status}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* CENTERED SECTION CTA: ENTER THE WORLD                                     */}
        {/* ========================================================================= */}
        <div className="mt-32 sm:mt-40 md:mt-48 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.35em] text-neutral-500 mb-4 block">
            [ INITIATE FULL IMMERSION ]
          </span>

          <a
            href="#hero-section"
            className="group relative inline-flex items-center justify-center gap-3 border border-white/40 hover:border-white bg-black/60 hover:bg-white text-white hover:text-black px-8 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-[2px] transition-all duration-300 ease-out shadow-[0_10px_35px_rgba(0,0,0,0.8)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            id="cta-enter-world"
          >
            <span>Enter the World</span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 font-bold">
              →
            </span>
          </a>

          <span className="mt-4 text-[10px] font-mono text-neutral-600 tracking-widest uppercase">
            FLORIA EXPEDITION PROTOCOL // EST. 2026
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE SPECIMEN ARCHIVAL INSPECTION MODAL                            */}
      {/* ========================================================================= */}
      {selectedSpecimen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedSpecimen(null)}
        >
          <div
            className="w-full max-w-2xl border border-neutral-800 bg-[#0c0c0c] p-6 sm:p-10 text-left shadow-2xl relative rounded-[2px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSpecimen(null)}
              className="absolute top-6 right-6 text-neutral-500 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
              aria-label="Close dialog"
            >
              [CLOSE ✕]
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedSpecimen.categoryColor }}
              />
              <span className="text-[10px] font-mono tracking-[0.28em] text-neutral-400 uppercase">
                {selectedSpecimen.catalog} · {selectedSpecimen.category}
              </span>
            </div>

            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight mb-1">
              {selectedSpecimen.name}
            </h3>
            <span className="text-sm font-serif italic text-neutral-400 mb-6 block">
              {selectedSpecimen.latinName}
            </span>

            <div className="w-full h-64 sm:h-80 overflow-hidden rounded-[2px] mb-6 border border-white/10">
              <img
                src={selectedSpecimen.image}
                alt={selectedSpecimen.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6">
              {selectedSpecimen.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/[0.02] border border-white/10 rounded-sm font-mono text-[10px] text-neutral-400 mb-6">
              <div>
                <span className="block text-neutral-600 uppercase text-[9px]">NATURAL HABITAT</span>
                <span className="text-white font-medium">{selectedSpecimen.telemetry.habitat}</span>
              </div>
              <div>
                <span className="block text-neutral-600 uppercase text-[9px]">ALTITUDE REGISTER</span>
                <span className="text-white font-medium">{selectedSpecimen.telemetry.elevation}</span>
              </div>
              <div>
                <span className="block text-neutral-600 uppercase text-[9px]">RESONANCE HARMONIC</span>
                <span className="text-white font-medium">{selectedSpecimen.telemetry.frequency}</span>
              </div>
              <div>
                <span className="block text-neutral-600 uppercase text-[9px]">TAXONOMIC STATE</span>
                <span className="text-white font-medium">{selectedSpecimen.telemetry.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider">
                ARCHIVE ENTRY NO. {selectedSpecimen.id.toUpperCase()}
              </span>
              <button
                onClick={() => setSelectedSpecimen(null)}
                className="text-xs uppercase tracking-widest font-medium border border-neutral-700 px-4 py-2 hover:bg-white hover:text-black transition-all"
              >
                Return to Archive →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
