import React, { useEffect } from 'react';
import { X, Download, Compass, Shield, CheckCircle2, Layers, Cpu, ExternalLink } from 'lucide-react';
import { soundManager } from './AudioEngine';

export const BuildingDossierModal = ({ project, onClose, onScheduleConsultation }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-panel-gold max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-sm border border-[#d4af37]/40 shadow-2xl p-6 sm:p-10 relative flex flex-col justify-between">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 w-10 h-10 border border-white/20 rounded-sm bg-black/40 text-gray-300 hover:text-white hover:border-[#d4af37] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dossier Header */}
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-[#d4af37] tracking-widest uppercase mb-2">
            <span className="w-6 h-[1px] bg-[#d4af37]" />
            <span>CONFIDENTIAL ARCHITECTURAL DOSSIER // {project.code || 'DOC-01'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            {project.title || project.name}
          </h2>
          <p className="text-sm font-body text-gray-300 mt-1">
            {project.tagline || project.subtitle || project.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-4 bg-white/[0.02] border border-white/10 rounded-sm font-mono text-xs">
            <div>
              <span className="text-gray-500 block uppercase">Elevation</span>
              <span className="text-white font-semibold">{project.height}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase">Design Studio</span>
              <span className="text-white font-semibold">{project.architect}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase">Total Area</span>
              <span className="text-white font-semibold">{project.grossArea || project.area}</span>
            </div>
            <div>
              <span className="text-gray-500 block uppercase">Rating</span>
              <span className="text-emerald-400 font-semibold">{project.leed}</span>
            </div>
          </div>

          {/* Blueprint Layout & Floorplates */}
          <div className="mt-8">
            <h3 className="text-sm font-mono tracking-widest uppercase text-[#d4af37] mb-4">
              Structural Floorplate Allocation
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold">Tiers 70 — 84 // Sky Villa Penthouses</span>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Private infinity pools, 360° private terraces, direct executive heli-elevator.
                  </p>
                </div>
                <span className="text-[#d4af37] font-semibold">P.O.A</span>
              </div>

              <div className="p-3 border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold">Tiers 32 — 68 // Prime Executive Floorplates</span>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Column-free 2,400 sq.m floorplates with acoustic triple-glazed smart facades.
                  </p>
                </div>
                <span className="text-emerald-400 font-semibold">64% Leased</span>
              </div>

              <div className="p-3 border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold">Tiers 01 — 30 // Innovation Podiums & Sky Gardens</span>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    Double-height public atriums, fine dining culinary galleria, conference auditorium.
                  </p>
                </div>
                <span className="text-white font-semibold">Ready Q4 2027</span>
              </div>
            </div>
          </div>

          {/* Environmental Performance */}
          <div className="mt-8 p-4 border border-[#d4af37]/30 bg-[#d4af37]/5 rounded-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase font-semibold">
              <Shield className="w-4 h-4" />
              <span>Net Zero Energy & Seismic Dampening Guarantee</span>
            </div>
            <p className="text-xs text-gray-300 font-body mt-2 leading-relaxed">
              Equipped with a tuned mass liquid damper at Level 80 and triple-redundant geothermal
              circulation. Certified to withstand magnitude 8.5 seismic tremors while maintaining
              uninterrupted municipal power continuity.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              soundManager.playClick();
              alert(`Architectural PDF Specification Package downloaded for ${project.title || project.name}`);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-white/20 bg-white/[0.03] text-gray-300 hover:text-white hover:border-[#d4af37] text-xs font-mono tracking-widest uppercase transition-colors"
          >
            <Download className="w-4 h-4 text-[#d4af37]" />
            <span>Download Architectural CAD / PDF</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-5 py-2.5 text-xs font-mono text-gray-400 hover:text-white uppercase tracking-wider"
            >
              Close
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
                onScheduleConsultation();
              }}
              className="px-6 py-2.5 bg-[#d4af37] text-black text-xs font-mono uppercase tracking-widest font-semibold hover:bg-[#e6c458] transition-colors"
            >
              Inquire Acquisition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
