import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, Orbit, Menu, X, ArrowUpRight, Compass } from 'lucide-react';
import { soundManager } from './AudioEngine';

export const Navbar = ({
  activeSection,
  onNavigate,
  isFreeOrbit,
  onToggleFreeOrbit
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    // Live clock in UTC
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC'
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleSoundToggle = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const navItems = [
    { id: 'hero', label: 'Masterplan', number: '01' },
    { id: 'about', label: 'Vision', number: '02' },
    { id: 'projects', label: 'Developments', number: '03' },
    { id: 'contact', label: 'Consultation', number: '04' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#080a0e]/85 backdrop-blur-md border-b border-white/[0.08] shadow-2xl'
            : 'py-6 bg-gradient-to-b from-[#06080b]/90 to-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Identity / Logo */}
          <div
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-9 h-9 border border-[#d4af37]/60 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#d4af37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <div className="w-4 h-4 border border-[#d4af37] rotate-45 transition-transform duration-500 group-hover:rotate-90" />
              <div className="absolute inset-0 bg-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl tracking-[0.25em] text-white uppercase group-hover:text-[#d4af37] transition-colors">
                Aetheria
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-gray-400 uppercase -mt-0.5">
                Architectural Developments
              </span>
            </div>
          </div>

          {/* Coordinates & Technical Specs (Desktop only) */}
          <div className="hidden xl:flex items-center gap-6 text-[11px] font-mono text-gray-400/90 pl-8 border-l border-white/10">
            <div>
              <span className="text-[#d4af37] mr-1">GRID:</span> 35°41&apos;N 139°45&apos;E
            </div>
            <div>
              <span className="text-[#d4af37] mr-1">TIME:</span> {currentTime}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CITY SYNCHRONIZED</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate(item.id);
                }}
                className={`relative py-1 text-xs font-mono tracking-[0.16em] uppercase transition-all duration-300 group ${
                  activeSection === item.id
                    ? 'text-[#d4af37] font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-[9px] text-[#d4af37]/60 mr-1.5 font-mono">
                  {item.number}
                </span>
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#d4af37] transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Actions: Orbit Toggle, Sound Ambiance, VIP CTA */}
          <div className="flex items-center gap-3">
            {/* Free Orbit 360° Switch */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleFreeOrbit(!isFreeOrbit);
              }}
              title={isFreeOrbit ? 'Switch back to Story Mode' : 'Enable 360° Free Camera Inspection'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider transition-all duration-300 border ${
                isFreeOrbit
                  ? 'bg-[#d4af37] text-black border-[#d4af37] font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/[0.04] text-gray-300 border-white/10 hover:border-[#d4af37]/50 hover:text-white'
              }`}
            >
              <Orbit className={`w-3.5 h-3.5 ${isFreeOrbit ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isFreeOrbit ? 'Orbit Active' : '360° Inspect'}
              </span>
            </button>

            {/* Audio Ambiance Toggle */}
            <button
              onClick={handleSoundToggle}
              title={isMuted ? 'Turn Soundscape ON' : 'Mute Soundscape'}
              className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-sm bg-white/[0.03] text-gray-300 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-0.5">
                  <span className="w-0.5 h-3 bg-[#d4af37] animate-pulse" />
                  <span className="w-0.5 h-4 bg-[#d4af37] animate-pulse delay-75" />
                  <span className="w-0.5 h-2 bg-[#d4af37] animate-pulse delay-150" />
                </div>
              )}
            </button>

            {/* CTA Private Consultation */}
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('contact');
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-[#d4af37]/60 bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-black text-white text-xs font-mono tracking-widest uppercase transition-all duration-300"
            >
              <span>Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center border border-white/10 rounded-sm text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080a0f]/98 backdrop-blur-2xl flex flex-col justify-center px-8 py-20 lg:hidden">
          <div className="flex flex-col gap-6 max-w-sm mx-auto w-full">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
              Navigation Index
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-2xl font-display font-medium tracking-wider flex items-center justify-between py-2 border-b border-white/10 ${
                  activeSection === item.id ? 'text-[#d4af37]' : 'text-gray-300'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs font-mono text-gray-500">{item.number}</span>
              </button>
            ))}

            <div className="pt-6 flex flex-col gap-4">
              <button
                onClick={() => {
                  onToggleFreeOrbit(!isFreeOrbit);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 border border-[#d4af37]/40 text-center font-mono text-xs uppercase text-[#d4af37]"
              >
                {isFreeOrbit ? 'Disable 360° Free Orbit' : 'Enable 360° Free Orbit'}
              </button>

              <button
                onClick={() => {
                  onNavigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#d4af37] text-black text-center font-mono text-xs uppercase font-semibold"
              >
                Book Private Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
