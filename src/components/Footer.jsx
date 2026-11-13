import React from 'react';
import { ArrowUp, Compass, Shield } from 'lucide-react';
import { soundManager } from './AudioEngine';

export const Footer = ({ onScrollToTop }) => {
  return (
    <footer className="relative z-10 w-full py-16 px-6 md:px-16 border-t border-white/10 bg-[#06080b] text-gray-400 font-mono text-xs pointer-events-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand & Mission Statement */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-[#d4af37] flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-[#d4af37] rotate-45" />
            </div>
            <span className="font-display font-bold text-base text-white tracking-[0.2em] uppercase">
              Aetheria
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
              Masterplan Corporation
            </span>
          </div>
          <p className="text-[11px] font-body text-gray-500 max-w-sm mt-1">
            Transforming 240 hectares of coastal terrain into an architectural living city.
            Tokyo · Zurich · New York · Dubai.
          </p>
        </div>

        {/* Technical Specs & Accreditation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-[11px]">
          <div>
            <span className="text-[#d4af37] mr-1">COORDINATES:</span>
            <span>35°41&apos;22&quot;N · 139°45&apos;18&quot;E</span>
          </div>
          <div>
            <span className="text-[#d4af37] mr-1">ELEVATION:</span>
            <span>DATUM 0.00 — +382.00M</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>LEED PLATINUM PRE-CERT</span>
          </div>
        </div>

        {/* Scroll To Top */}
        <button
          onClick={() => {
            soundManager.playClick();
            onScrollToTop();
          }}
          className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm hover:border-[#d4af37] hover:text-white transition-colors group cursor-pointer"
        >
          <span className="text-[10px] tracking-widest uppercase">Return to Peak</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#d4af37] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-600 gap-4">
        <div>
          &copy; {new Date().getFullYear()} AETHERIA DEVELOPMENTS INC. ALL ARCHITECTURAL PATENTS & DESIGNS PROTECTED.
        </div>
        <div className="flex gap-6">
          <span className="hover:text-gray-400 cursor-pointer">PRIVACY PROTOCOL</span>
          <span className="hover:text-gray-400 cursor-pointer">REGULATORY DISCLOSURES</span>
          <span className="hover:text-gray-400 cursor-pointer">BIM REPOSITORY</span>
        </div>
      </div>
    </footer>
  );
};
