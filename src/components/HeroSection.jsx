import React, { useEffect, useRef } from 'react';
import { ArrowDown, Compass, ShieldCheck, Sparkles, Building2, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

export const HeroSection = ({ onExplore, onBuildingFocus }) => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const descRef = useRef(null);
  const metricsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    // Initial GSAP Choreography
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.3 }
      )
        .fromTo(
          headlineRef.current?.querySelectorAll('.headline-word'),
          { opacity: 0, y: 45, rotateX: -20 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 1.4 },
          '-=0.8'
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2 },
          '-=0.9'
        )
        .fromTo(
          metricsRef.current?.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 1.0 },
          '-=0.8'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.0 },
          '-=0.6'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-16 px-6 md:px-16 pointer-events-none select-none"
    >
      {/* Top Architectural Elevation Tag */}
      <div
        ref={eyebrowRef}
        className="flex items-center gap-3 text-[11px] font-mono tracking-[0.25em] text-[#d4af37] uppercase pointer-events-auto"
      >
        <span className="w-8 h-[1px] bg-[#d4af37]" />
        <span>ARCHITECTURAL MASTERPLAN 2028 · TOKYO METROPOLITAN BAY</span>
        <span className="hidden sm:inline text-gray-500">·</span>
        <span className="hidden sm:inline text-gray-400">PHASE 01 GROUNDBREAKING</span>
      </div>

      {/* Main Center-Left Headline Composition */}
      <div className="max-w-4xl my-auto py-12 pointer-events-auto">
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight text-white leading-[1.05]"
          style={{ perspective: '1000px' }}
        >
          <span className="headline-word inline-block mr-3">Sculpting</span>
          <span className="headline-word inline-block mr-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3df9b] to-[#d4af37]">
            Tomorrow&apos;s
          </span>
          <br className="hidden sm:inline" />
          <span className="headline-word inline-block mr-3">Architectural</span>
          <span className="headline-word inline-block gold-gradient-text">Skyline.</span>
        </h1>

        <p
          ref={descRef}
          className="mt-6 md:mt-8 max-w-xl text-base sm:text-lg text-gray-300 font-body font-light leading-relaxed tracking-wide"
        >
          Where avant-garde structural synthesis converges with biophilic luxury. A 240-hectare
          private metropolitan masterplan transforming raw waterfront terrain into an enduring,
          carbon-neutral living organism.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onExplore('projects')}
            className="px-6 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#aa8524] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Developments
          </button>
          <button
            onClick={() => onBuildingFocus('commercial')}
            className="px-6 py-3.5 border border-white/20 bg-white/[0.04] backdrop-blur-md text-white font-mono text-xs uppercase tracking-[0.2em] hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
          >
            Inspect The Apex 382M
          </button>
        </div>
      </div>

      {/* Bottom Technical Spec Bar & Scroll Indicator */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pt-8 border-t border-white/[0.08] pointer-events-auto">
        {/* Masterplan Spec Metrics */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-12 text-left"
        >
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              Apex Elevation
            </div>
            <div className="text-xl sm:text-2xl font-display font-semibold text-white mt-1">
              382 M
            </div>
            <div className="text-[11px] font-mono text-gray-400">84 Stories Supertall</div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              Masterplan Area
            </div>
            <div className="text-xl sm:text-2xl font-display font-semibold text-white mt-1">
              240 HA
            </div>
            <div className="text-[11px] font-mono text-gray-400">4.8M SQ.M Developed</div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              Waterfront Lagoon
            </div>
            <div className="text-xl sm:text-2xl font-display font-semibold text-white mt-1">
              1.8 KM
            </div>
            <div className="text-[11px] font-mono text-gray-400">Private Deep Mooring</div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              Sustainability
            </div>
            <div className="text-xl sm:text-2xl font-display font-semibold text-white mt-1">
              LEED PLAT.
            </div>
            <div className="text-[11px] font-mono text-gray-400">Net Zero Energy Target</div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div
          ref={scrollIndicatorRef}
          onClick={() => onExplore('about')}
          className="cursor-pointer group flex items-center gap-3 self-center lg:self-end"
        >
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 group-hover:text-[#d4af37] transition-colors">
              Scroll Story
            </span>
            <span className="text-[11px] font-mono text-white/80">01 / 04</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
            <ChevronDown className="w-4 h-4 text-[#d4af37] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
