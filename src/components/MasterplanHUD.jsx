import React from 'react';
import { Sun, Sunset, Moon, Compass, Camera, Maximize2, RotateCcw } from 'lucide-react';
import { soundManager } from './AudioEngine';

export const MasterplanHUD = ({
  activeTheme,
  onThemeChange,
  onPresetSelect,
  isFreeOrbit,
  onToggleFreeOrbit
}) => {
  const themes = [
    { id: 'golden', label: 'Golden Hour', icon: Sunset },
    { id: 'daylight', label: 'Daylight Clay', icon: Sun },
    { id: 'twilight', label: 'Twilight Glow', icon: Moon }
  ];

  const presets = [
    { id: 'overview', label: 'Masterplan' },
    { id: 'commercial', label: 'Apex Tower' },
    { id: 'residential', label: 'Lumina Residences' },
    { id: 'villas', label: 'Elysium Lagoon' },
    { id: 'pavilion', label: 'Civic Pavilion' }
  ];

  return (
    <div className="fixed bottom-6 right-6 md:right-12 z-30 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Free Orbit Active Banner */}
      {isFreeOrbit && (
        <div className="glass-panel-gold px-4 py-2.5 rounded-sm border border-[#d4af37]/60 text-xs font-mono text-white flex items-center gap-3 shadow-2xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
          <span>360° INSPECT ACTIVE: DRAG TO ROTATE · SCROLL TO ZOOM</span>
          <button
            onClick={() => onToggleFreeOrbit(false)}
            className="text-[10px] uppercase underline text-[#d4af37] hover:text-white"
          >
            Reset
          </button>
        </div>
      )}

      {/* Floating HUD Bar */}
      <div className="glass-panel p-2 md:p-2.5 rounded-sm border border-white/10 shadow-2xl flex flex-wrap items-center gap-2 md:gap-4 backdrop-blur-xl">
        {/* Lighting Atmosphere Selector */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2 md:pr-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase hidden sm:inline mr-1">
            LIGHT:
          </span>
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  soundManager.playClick();
                  onThemeChange(theme.id);
                }}
                title={theme.label}
                className={`p-1.5 md:p-2 rounded-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Camera Elevation Presets */}
        <div className="hidden sm:flex items-center gap-1.5 border-r border-white/10 pr-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase mr-1">
            FOCUS:
          </span>
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                soundManager.playFocus();
                onPresetSelect(preset.id);
              }}
              className="px-2.5 py-1 text-[11px] font-mono text-gray-300 hover:text-white hover:border-[#d4af37]/40 border border-transparent rounded-sm transition-all duration-300"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* 360 Orbit Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleFreeOrbit(!isFreeOrbit);
          }}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-sm transition-all duration-300 ${
            isFreeOrbit
              ? 'bg-[#d4af37] text-black font-semibold'
              : 'text-gray-300 hover:text-[#d4af37] hover:bg-white/[0.04]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-wider">
            {isFreeOrbit ? 'Lock Orbit' : 'Free 360°'}
          </span>
        </button>
      </div>
    </div>
  );
};
