import React, { useEffect, useRef, useState } from 'react';
import { ArchitecturalCity } from '../three/ArchitecturalCity';
import { Layers, Eye, Compass, Info, Sparkles } from 'lucide-react';

export const ThreeCanvas = ({
  onCityReady,
  onBuildingSelect,
  activeTheme = 'golden',
  isFreeOrbit = false,
  selectedBuilding = null
}) => {
  const containerRef = useRef(null);
  const cityRef = useRef(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize 3D Architectural City
    const city = new ArchitecturalCity(containerRef.current, {
      onBuildingHover: (buildingData) => {
        setHoveredBuilding(buildingData);
      },
      onBuildingSelect: (buildingData) => {
        if (onBuildingSelect) {
          onBuildingSelect(buildingData);
        }
      }
    });

    cityRef.current = city;

    if (onCityReady) {
      onCityReady(city);
    }

    return () => {
      city.destroy();
    };
  }, []);

  // Update theme when changed
  useEffect(() => {
    if (cityRef.current) {
      cityRef.current.setTheme(activeTheme);
    }
  }, [activeTheme]);

  // Update free orbit mode
  useEffect(() => {
    if (cityRef.current) {
      cityRef.current.setFreeOrbitMode(isFreeOrbit);
    }
  }, [isFreeOrbit]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full pointer-events-auto"
        style={{ touchAction: isFreeOrbit ? 'none' : 'auto' }}
      />

      {/* Floating Building Hover Tag (Architectural Reticle) */}
      {hoveredBuilding && (
        <div className="absolute top-24 right-8 md:right-16 z-30 pointer-events-none transition-all duration-300">
          <div className="glass-panel-gold px-5 py-4 rounded-sm border border-[#d4af37]/40 shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#d4af37]">
                {hoveredBuilding.category}
              </span>
            </div>
            <h4 className="text-lg font-display font-semibold text-white tracking-wide">
              {hoveredBuilding.name}
            </h4>
            <p className="text-xs text-gray-300 font-body mt-1">
              {hoveredBuilding.subtitle}
            </p>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span>{hoveredBuilding.height}</span>
              <span className="text-[#d4af37] flex items-center gap-1 font-sans">
                Click to Inspect &rarr;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Technical HUD Overlay Watermark */}
      <div className="absolute bottom-6 left-8 hidden lg:flex flex-col gap-1 text-[11px] font-mono text-gray-400/80 pointer-events-none">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>BEARING 042° · AZIMUTH +38.4°</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span>MASTERPLAN REAL-TIME ENGINE ACTIVE (60 FPS)</span>
        </div>
      </div>
    </div>
  );
};
