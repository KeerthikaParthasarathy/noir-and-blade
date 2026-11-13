import React, { useState } from 'react';
import {
  Building2,
  Home,
  Waves,
  ArrowUpRight,
  Maximize2,
  CheckCircle2,
  Compass,
  FileText,
  Sparkles
} from 'lucide-react';
import { soundManager } from './AudioEngine';

export const ProjectsSection = ({ onFocusBuilding, onOpenDossier }) => {
  const [activeTab, setActiveTab] = useState('commercial');

  const projects = {
    commercial: {
      id: 'commercial',
      code: 'DEV-APEX-01',
      title: 'The Apex Tower',
      tagline: 'Global Financial Headquarters & Innovation Epicenter',
      category: 'Commercial Spaces',
      height: '382 Meters / 1,253 Feet',
      stories: '84 Stories',
      architect: 'Zaha Hadid & Aetheria Masterplan Studio',
      leed: 'Platinum Net-Zero Energy Certified',
      completion: 'Q4 2027',
      grossArea: '185,000 sq.m',
      status: 'Phase II Structuring · 64% Leased',
      investment: 'From $4.2M Executive Suites to Full Floorplates',
      features: [
        'Aerodynamic Diagrid Exoskeleton column-free floorplates',
        'Multi-level Suspended Sky Gardens at levels 31 & 59',
        'Executive Private Rooftop Helipad & Sky Lounge',
        'Quadruple-glazed acoustic thermal facade with kinetic shading',
        'Smart AI climate automation reducing energy load by 48%'
      ],
      materials: ['Champagne Anodized Bronze', 'Acoustic Structural Glass', 'Honed Basalt'],
      coordinates: '35°41\'22"N · 139°45\'18"E'
    },
    residential: {
      id: 'residential',
      code: 'DEV-LUMINA-02',
      title: 'Lumina Sky Residences',
      tagline: 'Ultra-Luxury Dual Cascading Towers with Aerial Skybridge',
      category: 'Residential Apartments',
      height: '240 Meters / 787 Feet',
      stories: '62 Stories (Twin Connected Towers)',
      architect: 'Snøhetta Architectural Collaboration',
      leed: 'WELL Gold & Net-Zero Carbon Ready',
      completion: 'Q1 2028',
      grossArea: '124,000 sq.m (310 Bespoke Residences)',
      status: 'Sales Release Phase 03 · 72% Reserved',
      investment: 'From $1.85M 2-Bed to $22M Penthouse Triplex',
      features: [
        'Cantilevered private terrace gardens for every residence',
        'Suspended glass-bottom Skybridge & Club Lounge at Level 28',
        'Rooftop 50M Cantilever Infinity Pool overlooking the ocean bay',
        'Private subterranean valet parking with induction fast-charging',
        '24/7 White-glove concierge and Michelin-partnered private dining'
      ],
      materials: ['Smoked Structural Glass', 'Titanium Composite Slate', 'Natural Teak'],
      coordinates: '35°41\'15"N · 139°45\'04"E'
    },
    villas: {
      id: 'villas',
      code: 'DEV-ELYSIUM-03',
      title: 'Elysium Waterfront Pavilions',
      tagline: 'Private Marina Sanctuaries Cantilevered Over Reflecting Lagoons',
      category: 'Luxury Villas',
      height: '14 Meters / 3 Levels',
      stories: '3 Sculptural Levels per Estate',
      architect: 'Vincent Van Duysen & Studio MK27',
      leed: 'Passive House Ultra-Low Energy Rating',
      completion: 'Immediate Handover Ready',
      grossArea: '1,450 sq.m Internal + 800 sq.m Private Marine Deck',
      status: 'Only 3 of 12 Sanctuaries Available',
      investment: 'From $14.5M to $36M Waterfront Sanctuaries',
      features: [
        'Private deep-water yacht berth accommodating up to 45m vessels',
        'Infinity glass perimeter pool merging into the coastal lagoon',
        'Subterranean 6-car gallery with glass ceiling view into pool',
        'Private wellness pavilion featuring sauna, onsen, and cryo-suite',
        'Discreet biometric perimeter security and smart air filtration'
      ],
      materials: ['Volcanic Basalt', 'Teak Ship Decking', 'Low-Iron Floor-to-Ceiling Glass'],
      coordinates: '35°41\'02"N · 139°44\'48"E'
    }
  };

  const currentProject = projects[activeTab];

  const handleTabChange = (key) => {
    soundManager.playFocus();
    setActiveTab(key);
    if (onFocusBuilding) {
      onFocusBuilding(key);
    }
  };

  return (
    <section id="projects" className="relative min-h-screen w-full py-32 px-6 md:px-16 pointer-events-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#d4af37] uppercase mb-2">
              <span className="w-6 h-[1px] bg-[#d4af37]" />
              <span>Section 03 // Masterplan Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-white">
              Signature Developments
            </h2>
          </div>

          <p className="max-w-md text-sm text-gray-300 font-body leading-relaxed">
            Select a development to fly the 3D virtual camera directly to its coordinates in the
            masterplan city and inspect its architectural anatomy.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap gap-3 my-8">
          {[
            { id: 'commercial', label: 'Commercial Spaces', icon: Building2, tag: 'The Apex' },
            { id: 'residential', label: 'Residential Apartments', icon: Home, tag: 'Lumina Sky' },
            { id: 'villas', label: 'Luxury Waterfront Villas', icon: Waves, tag: 'Elysium Lagoon' }
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleTabChange(cat.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-sm font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
                  isSelected
                    ? 'glass-panel-gold text-[#d4af37] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                    : 'glass-panel text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#d4af37]' : 'text-gray-400'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {cat.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Architectural Folio Presentation Box */}
        <div className="glass-panel p-8 md:p-14 rounded-sm border border-white/10 crosshair crosshair-tl crosshair-tr crosshair-bl crosshair-br shadow-2xl relative overflow-hidden transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14">
            {/* Left Column: Editorial Headline & Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-4 pb-4 border-b border-white/10">
                  <span className="text-[#d4af37] font-semibold">{currentProject.code}</span>
                  <span>{currentProject.coordinates}</span>
                  <span className="text-emerald-400">{currentProject.status}</span>
                </div>

                <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase">
                  {currentProject.category}
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mt-2 leading-tight">
                  {currentProject.title}
                </h3>
                <p className="text-base text-[#f3df9b] font-body mt-2 font-medium">
                  {currentProject.tagline}
                </p>

                {/* Key Architectural Highlights */}
                <div className="mt-8">
                  <span className="text-xs font-mono tracking-widest text-gray-400 uppercase block mb-3">
                    Architectural Innovations
                  </span>
                  <div className="space-y-3">
                    {currentProject.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 font-body">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Swatches */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <span className="text-xs font-mono tracking-widest text-gray-400 uppercase block mb-3">
                    Material Specification
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.materials.map((mat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-sm text-xs font-mono text-gray-300"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenDossier(currentProject)}
                  className="px-6 py-3.5 bg-[#d4af37] text-black font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#e6c458] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                >
                  <FileText className="w-4 h-4" />
                  <span>Inspect Full Dossier & Blueprints</span>
                </button>

                <button
                  onClick={() => onFocusBuilding(currentProject.id)}
                  className="px-5 py-3.5 border border-white/20 bg-white/[0.04] text-white font-mono text-xs uppercase tracking-[0.2em] hover:border-[#d4af37] hover:text-[#d4af37] transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Center 3D Camera</span>
                </button>
              </div>
            </div>

            {/* Right Column: Architectural Technical Metrics Board */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-black/40 border border-white/10 p-6 md:p-8 rounded-sm">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
                    Specification Matrix
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">
                    ISO 19650 BIM Verified
                  </span>
                </div>

                <div className="divide-y divide-white/5 text-xs font-mono">
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Total Structural Height</span>
                    <span className="text-white font-semibold">{currentProject.height}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Elevation Stories</span>
                    <span className="text-white font-semibold">{currentProject.stories}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Design Architect</span>
                    <span className="text-white font-semibold text-right max-w-[200px]">
                      {currentProject.architect}
                    </span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Gross Floor Area</span>
                    <span className="text-white font-semibold">{currentProject.grossArea}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Environmental Standard</span>
                    <span className="text-emerald-400 font-semibold">{currentProject.leed}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Handover Horizon</span>
                    <span className="text-white font-semibold">{currentProject.completion}</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-gray-400">Acquisition Tier</span>
                    <span className="text-[#d4af37] font-semibold text-right max-w-[200px]">
                      {currentProject.investment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mini Blueprint Visualizer Accent */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="relative h-28 border border-white/10 bg-[#090d14] rounded-sm p-3 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 architectural-grid-bg opacity-40 pointer-events-none" />
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#d4af37] z-10">
                    <span>ELEVATION SCHEMATIC</span>
                    <span>SCALE 1:500</span>
                  </div>
                  <div className="flex items-end justify-center gap-2 h-16 z-10">
                    <div className="w-8 bg-[#d4af37]/30 border-t-2 border-[#d4af37] h-10 animate-pulse" />
                    <div className="w-12 bg-[#d4af37]/50 border-t-2 border-[#d4af37] h-16" />
                    <div className="w-8 bg-[#d4af37]/30 border-t-2 border-[#d4af37] h-8" />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-500 z-10">
                    <span>DATUM 0.00</span>
                    <span>+382.00M PEAK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
