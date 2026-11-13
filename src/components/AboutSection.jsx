import React from 'react';
import { Compass, Sparkles, Shield, Cpu, Leaf, Layers, ArrowUpRight } from 'lucide-react';

export const AboutSection = ({ onInspectProject }) => {
  const pillars = [
    {
      num: '01',
      title: 'Parametric Diagrid Engineering',
      icon: Cpu,
      desc: 'External load-bearing exoskeleton structures that eliminate internal columns, creating completely uninterrupted panoramic floorplates and superior seismic dampening.'
    },
    {
      num: '02',
      title: 'Biophilic Vertical Ecosystems',
      icon: Leaf,
      desc: 'Over 35% of all vertical and podium surface area is dedicated to living botanical terraces, microclimatic evaporative cooling, and indigenous bird sanctuaries.'
    },
    {
      num: '03',
      title: 'Autonomous Smart Infrastructure',
      icon: Layers,
      desc: 'Subterranean pneumatic logistics, autonomous electric transit loops, and localized smart micro-grids powered entirely by kinetic solar glazing and geothermal loops.'
    },
    {
      num: '04',
      title: 'Generational Material Permanence',
      icon: Shield,
      desc: 'Ultra-low-carbon concrete, anodized aerospace-grade bronze alloys, and acoustic self-cleaning curtain walls curated to endure for over three centuries.'
    }
  ];

  const milestones = [
    { year: '2024', label: 'Masterplan Ratification', detail: '240-hectare coastal acquisition and environmental impact clearance.' },
    { year: '2026', label: 'Groundbreaking & Deep Caissons', detail: 'Foundational bedrock pilings and marine quay reclamation completed.' },
    { year: '2028', label: 'Apex Tower Topping Out', detail: 'Super-tall 382M crown placed; first commercial tenants enter fitout.' },
    { year: '2030', label: 'Metropolitan Inhabitation', detail: 'Full commercial, residential, and civic districts welcomed to life.' }
  ];

  return (
    <section id="about" className="relative min-h-screen w-full py-32 px-6 md:px-16 pointer-events-auto">
      {/* Background Architectural Grid Accent */}
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#d4af37] uppercase mb-3">
              <span className="w-6 h-[1px] bg-[#d4af37]" />
              <span>Section 02 // Architectural Philosophy</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-white max-w-2xl">
              Transmuting Horizons into Living Cities.
            </h2>
          </div>

          <p className="max-w-md text-sm md:text-base text-gray-300 font-body leading-relaxed">
            We reject ephemeral trends in favor of monumental architectural longevity. Every
            cantilever, boulevard, and reflecting lagoon is sculpted to elevate human dignity and
            foster community connection.
          </p>
        </div>

        {/* Big Editorial Quote Banner */}
        <div className="my-16 p-8 md:p-14 glass-panel crosshair crosshair-tl crosshair-br rounded-sm border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl relative z-10">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#d4af37] uppercase block mb-4">
              The Founding Creed
            </span>
            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-white font-normal leading-relaxed italic">
              &ldquo;A building is not merely an enclosure of volume, but a moral statement on the
              future of our civilization. When we sculpt a city, we sculpt the consciousness of the
              generations that will inherit it.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="text-white font-semibold">Julian V. Vance</span>
              <span>— Chief Design Architect & Masterplan Director</span>
            </div>
          </div>
        </div>

        {/* 4 Architectural Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="glass-panel p-6 sm:p-8 rounded-sm border border-white/10 hover:border-[#d4af37]/50 hover:bg-white/[0.04] transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono tracking-widest text-[#d4af37]">
                      {pillar.num}
                    </span>
                    <div className="w-10 h-10 rounded-sm bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-semibold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed font-body">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Specification Certified</span>
                  <span className="text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
                    Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Masterplan Timeline & Development Goals */}
        <div className="mt-20 glass-panel p-8 md:p-12 rounded-sm border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                Temporal Horizon
              </span>
              <h3 className="text-2xl font-display font-bold text-white mt-1">
                Development Execution Sequence
              </h3>
            </div>
            <div className="text-xs font-mono text-gray-400">
              CURRENT PHASE: <span className="text-emerald-400 font-semibold">STAGE 02 IN PROGRESS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, idx) => (
              <div key={m.year} className="relative flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-display font-bold text-[#d4af37]">{m.year}</span>
                  <span className="h-[1px] flex-1 bg-white/10" />
                </div>
                <h4 className="text-sm font-display font-semibold text-white">{m.label}</h4>
                <p className="text-xs text-gray-400 mt-2 font-body leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
