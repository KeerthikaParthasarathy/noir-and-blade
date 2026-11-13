import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { ThreeCanvas } from './components/ThreeCanvas';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MasterplanHUD } from './components/MasterplanHUD';
import { BuildingDossierModal } from './components/BuildingDossierModal';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [cityInstance, setCityInstance] = useState(null);
  const [activeTheme, setActiveTheme] = useState('golden');
  const [isFreeOrbit, setIsFreeOrbit] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedDossierProject, setSelectedDossierProject] = useState(null);

  const lenisRef = useRef(null);

  // Initialize Lenis Smooth Scrolling and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Set up GSAP ScrollTrigger camera choreography once 3D city is ready
  useEffect(() => {
    if (!cityInstance) return;

    // Timeline positions for each section
    const cameraKeyframes = [
      {
        trigger: '#hero',
        pos: { x: 45, y: 38, z: 55 },
        lookAt: { x: 0, y: 8, z: 0 },
        section: 'hero'
      },
      {
        trigger: '#about',
        pos: { x: 18, y: 14, z: 28 },
        lookAt: { x: -4, y: 6, z: -2 },
        section: 'about'
      },
      {
        trigger: '#projects',
        pos: { x: 16, y: 22, z: 12 },
        lookAt: { x: 3, y: 32, z: -4 },
        section: 'projects'
      },
      {
        trigger: '#contact',
        pos: { x: 44, y: 10, z: 28 },
        lookAt: { x: 32, y: 4, z: 18 },
        section: 'contact'
      }
    ];

    cameraKeyframes.forEach((kf) => {
      ScrollTrigger.create({
        trigger: kf.trigger,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setActiveSection(kf.section);
          if (!isFreeOrbit) {
            cityInstance.setCameraTarget(kf.pos, kf.lookAt);
          }
        },
        onEnterBack: () => {
          setActiveSection(kf.section);
          if (!isFreeOrbit) {
            cityInstance.setCameraTarget(kf.pos, kf.lookAt);
          }
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [cityInstance, isFreeOrbit]);

  // Smooth scroll to section
  const handleNavigate = (sectionId) => {
    if (isFreeOrbit) {
      setIsFreeOrbit(false);
    }
    const targetElement = document.getElementById(sectionId);
    if (targetElement && lenisRef.current) {
      lenisRef.current.scrollTo(targetElement, { offset: 0, duration: 1.4 });
    }
  };

  // Focus building in 3D
  const handleFocusBuilding = (buildingId) => {
    if (cityInstance) {
      if (isFreeOrbit) {
        setIsFreeOrbit(false);
      }
      cityInstance.focusBuilding(buildingId);
    }
  };

  // Preset selector from HUD
  const handlePresetSelect = (presetId) => {
    if (cityInstance) {
      cityInstance.focusBuilding(presetId);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07090d] text-white selection:bg-[#d4af37]/30 selection:text-white">
      {/* Film Grain & Cinematic Vignette Overlays */}
      <div className="noise-overlay" />
      <div className="cinematic-vignette" />

      {/* 3D WebGL Architectural City Background Canvas */}
      <ThreeCanvas
        onCityReady={(instance) => setCityInstance(instance)}
        onBuildingSelect={(buildingData) => {
          setSelectedDossierProject(buildingData);
        }}
        activeTheme={activeTheme}
        isFreeOrbit={isFreeOrbit}
      />

      {/* Top Architectural Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isFreeOrbit={isFreeOrbit}
        onToggleFreeOrbit={(val) => setIsFreeOrbit(val)}
      />

      {/* Floating Masterplan HUD Controller */}
      <MasterplanHUD
        activeTheme={activeTheme}
        onThemeChange={(theme) => setActiveTheme(theme)}
        onPresetSelect={handlePresetSelect}
        isFreeOrbit={isFreeOrbit}
        onToggleFreeOrbit={(val) => setIsFreeOrbit(val)}
      />

      {/* Main Narrative Scroll Experience */}
      <main className="relative z-10">
        {/* 01. Hero Section */}
        <HeroSection
          onExplore={handleNavigate}
          onBuildingFocus={handleFocusBuilding}
        />

        {/* 02. About Section: Masterplan Vision & Philosophy */}
        <AboutSection
          onInspectProject={(id) => handleFocusBuilding(id)}
        />

        {/* 03. Projects Section: Explore Signature Developments */}
        <ProjectsSection
          onFocusBuilding={handleFocusBuilding}
          onOpenDossier={(proj) => setSelectedDossierProject(proj)}
        />

        {/* 04. Contact Section: Private Consultation Booking */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onScrollToTop={() => handleNavigate('hero')} />

      {/* Architectural Dossier Modal */}
      {selectedDossierProject && (
        <BuildingDossierModal
          project={selectedDossierProject}
          onClose={() => setSelectedDossierProject(null)}
          onScheduleConsultation={() => {
            handleNavigate('contact');
          }}
        />
      )}
    </div>
  );
}

export default App;
