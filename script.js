/**
 * NOIR & BLADE — Ultra-Luxury 3D Scroll-Driven Men's Grooming Lounge
 * Multi-Canvas Scroll Engine, Balanced Chair Framing, Split-Screen Layout,
 * Interactive Before/After Slider & Appointment Booking
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. ASSET CONFIGURATION & PATH RESOLUTION
  // =========================================================================
  const SEQUENCE_CONFIG = {
    chair: {
      folder: 'chair',
      count: 240,
      canvasId: 'canvas-chair',
      containerId: 'hero',
      prefix: 'ezgif-frame-',
      padLength: 3,
      extension: '.jpg'
    },
    tools: {
      folder: 'tools',
      count: 240,
      canvasId: 'canvas-tools',
      containerId: 'craft',
      prefix: 'ezgif-frame-',
      padLength: 3,
      extension: '.jpg'
    },
    clipper: {
      folder: 'clipper',
      count: 240,
      canvasId: 'canvas-clipper',
      containerId: 'tech',
      prefix: 'ezgif-frame-',
      padLength: 3,
      extension: '.jpg'
    },
    atelier: {
      folder: 'atelier',
      count: 240,
      canvasId: 'canvas-atelier',
      containerId: 'grooming-atelier',
      prefix: 'ezgif-frame-',
      padLength: 3,
      extension: '.jpg'
    },
    lounge: {
      folder: 'lounge',
      count: 240,
      canvasId: 'canvas-lounge',
      containerId: 'lounge',
      prefix: 'ezgif-frame-',
      padLength: 3,
      extension: '.jpg'
    }
  };

  // State storage for preloaded Image objects
  const frameSequences = {
    chair: [],
    tools: [],
    clipper: [],
    atelier: [],
    lounge: []
  };

  // Rendering state for smooth 60fps interpolation
  const renderState = {
    chair: { currentFrame: 0, targetFrame: 0, loaded: false },
    tools: { currentFrame: 0, targetFrame: 0, loaded: false },
    clipper: { currentFrame: 0, targetFrame: 0, loaded: false },
    atelier: { currentFrame: 0, targetFrame: 0, loaded: false },
    lounge: { currentFrame: 0, targetFrame: 0, loaded: false }
  };

  // Base path resolution that seamlessly supports dev, dist, and local static servers
  let detectedBasePath = 'public/frames/';

  function getFramePath(basePath, folder, index) {
    const padded = String(index).padStart(3, '0');
    return `${basePath}${folder}/ezgif-frame-${padded}.jpg`;
  }

  // =========================================================================
  // 2. INSTANT BACKGROUND ASSET LOADER (Zero Loading Screen / Instant Display)
  // =========================================================================
  async function determineBasePath() {
    return new Promise((resolve) => {
      const tryPath = (paths, index) => {
        if (index >= paths.length) {
          detectedBasePath = 'public/frames/';
          resolve(detectedBasePath);
          return;
        }
        const currentPath = paths[index];
        const testImg = new Image();
        testImg.onload = () => {
          detectedBasePath = currentPath;
          resolve(detectedBasePath);
        };
        testImg.onerror = () => {
          tryPath(paths, index + 1);
        };
        testImg.src = `${currentPath}chair/ezgif-frame-001.jpg`;
      };

      tryPath(['public/frames/', 'frames/', '/frames/'], 0);
    });
  }

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function initCanvasAssets() {
    const presentCanvasKeys = Object.keys(SEQUENCE_CONFIG).filter((key) => {
      const cfg = SEQUENCE_CONFIG[key];
      return !!document.getElementById(cfg.canvasId);
    });

    if (presentCanvasKeys.length === 0) return;

    await determineBasePath();

    // Priority 1: Instantly load & paint frame 1 on every active canvas without delay
    const firstFramePromises = presentCanvasKeys.map(async (key) => {
      const config = SEQUENCE_CONFIG[key];
      const frames = new Array(config.count);
      frameSequences[key] = frames;
      const firstUrl = getFramePath(detectedBasePath, config.folder, 1);
      const img = await loadImage(firstUrl);
      if (img) {
        frames[0] = img;
        renderState[key].loaded = true;
        drawSequenceFrame(key, 0);
      }
    });

    await Promise.all(firstFramePromises);

    // Priority 2: Asynchronously stream all remaining sequence frames in the background
    presentCanvasKeys.forEach((key) => {
      preloadSequenceRemaining(key);
    });
  }

  async function preloadSequenceRemaining(key) {
    const config = SEQUENCE_CONFIG[key];
    const frames = frameSequences[key] || new Array(config.count);
    frameSequences[key] = frames;
    const total = config.count;
    const batchSize = 10;

    for (let i = 2; i <= total; i += batchSize) {
      const batchPromises = [];
      const end = Math.min(i + batchSize, total + 1);

      for (let index = i; index < end; index++) {
        const frameUrl = getFramePath(detectedBasePath, config.folder, index);
        const p = loadImage(frameUrl).then((img) => {
          frames[index - 1] = img;
        });
        batchPromises.push(p);
      }
      await Promise.all(batchPromises);
    }
    renderState[key].loaded = true;
  }

  // =========================================================================
  // 3. CANVAS SETUP, BALANCED FRAMING & DRAWING ENGINE
  // =========================================================================
  const canvases = {};
  const contexts = {};

  function setupCanvases() {
    Object.keys(SEQUENCE_CONFIG).forEach((key) => {
      const config = SEQUENCE_CONFIG[key];
      const canvas = document.getElementById(config.canvasId);
      if (!canvas) return;

      canvases[key] = canvas;
      contexts[key] = canvas.getContext('2d', { alpha: false });
      resizeCanvas(key);
    });
  }

  function resizeCanvas(key) {
    const canvas = canvases[key];
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const frameIdx = Math.round(renderState[key].currentFrame);
    drawSequenceFrame(key, frameIdx);
  }

  function resizeAllCanvases() {
    Object.keys(SEQUENCE_CONFIG).forEach(resizeCanvas);
  }

  window.addEventListener('resize', () => {
    resizeAllCanvases();
  }, { passive: true });

  /**
   * Refined Drawing Logic:
   * 1. Chair: Full height-fit scale so top headrest and gold circular halo
   *    are 100% visible. On desktop, shifted right (offsetX = cw * 0.14)
   *    so the left side remains pure pitch-black (#050505) for editorial text.
   * 2. Split-Screen Canvases (Tools, Clipper, Lounge): High-precision cover scale
   *    filling the 58% right-column viewport crisply without overlay blockages.
   */
  function drawSequenceFrame(key, frameIndex) {
    const canvas = canvases[key];
    const ctx = contexts[key];
    if (!canvas || !ctx) return;

    const frames = frameSequences[key];
    if (!frames || frames.length === 0) return;

    const idx = Math.max(0, Math.min(frames.length - 1, frameIndex));
    let img = frames[idx];

    if (!img || !img.complete || img.naturalWidth === 0) {
      img = frames[0];
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    if (key === 'chair') {
      // Balanced framing for the chair sequence:
      // Fit by height with slight scale (1.02) to guarantee full top headrest and halo visibility
      const isDesktop = window.innerWidth >= 992;
      const scale = (ch / ih) * (isDesktop ? 1.02 : 1.0);
      const dw = iw * scale;
      const dh = ih * scale;

      // On desktop, shift the chair rightward so left stays pitch black
      const dx = isDesktop ? ((cw - dw) / 2 + cw * 0.14) : ((cw - dw) / 2);
      const dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      // Unobstructed cover framing for Tools, Clipper, Lounge in the 58% split column
      const scale = Math.max(cw / iw, ch / ih) * 1.05;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  }

  // =========================================================================
  // 4. SMOOTH 60FPS SCROLL ENGINE & SPLIT-SCREEN STEP TRACKER
  // =========================================================================
  const containers = {};

  function setupContainers() {
    Object.keys(SEQUENCE_CONFIG).forEach((key) => {
      const config = SEQUENCE_CONFIG[key];
      containers[key] = document.getElementById(config.containerId);
    });
  }

  function updateScrollProgress() {
    const vh = window.innerHeight;

    Object.keys(SEQUENCE_CONFIG).forEach((key) => {
      const container = containers[key];
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - vh;

      // Viewport culling
      if (rect.bottom < -100 || rect.top > vh + 100) return;

      let progress = -rect.top / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      const config = SEQUENCE_CONFIG[key];
      const maxFrame = config.count - 1;
      renderState[key].targetFrame = progress * maxFrame;

      // Hero Minimalist Milestones (Left Column)
      if (key === 'chair') {
        const heroMilestones = container.querySelectorAll('.hero-milestone');
        heroMilestones.forEach((el) => {
          const start = parseFloat(el.getAttribute('data-start') || '0');
          const end = parseFloat(el.getAttribute('data-end') || '1');
          if (progress >= start && progress <= end) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
      }

      // Split-Screen Editorial Step Panels & Step Numbers (#craft, #tech, #grooming-atelier, #lounge)
      if (key === 'tools' || key === 'clipper' || key === 'atelier' || key === 'lounge') {
        const stepPanels = container.querySelectorAll('.split-editorial-content');
        stepPanels.forEach((el) => {
          const start = parseFloat(el.getAttribute('data-start') || '0');
          const end = parseFloat(el.getAttribute('data-end') || '1');
          if (progress >= start && progress <= end) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });

        // Update Step Numbers
        const stepNums = container.querySelectorAll('.step-num');
        if (stepNums && stepNums.length > 0) {
          const count = stepNums.length;
          const activeIndex = Math.min(count - 1, Math.floor(progress * count));
          stepNums.forEach((s, idx) => {
            if (idx === activeIndex) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });
        }
      }

      // Feature #3A: Floating Corner HUD Callouts for The Craft (#craft)
      if (key === 'tools') {
        const progressFill = container.querySelector('.hud-progress-fill');
        if (progressFill) {
          progressFill.style.width = `${Math.round(progress * 100)}%`;
        }

        const kineticNum = container.querySelector('.hud-kinetic-num');
        const editorialTitle = container.querySelector('.hud-editorial-title');
        const editorialDesc = container.querySelector('.hud-editorial-desc');
        const specCapsule = container.querySelector('.hud-spec-capsule');

        if (progress < 0.35) {
          if (kineticNum) kineticNum.textContent = '01';
          if (editorialTitle) editorialTitle.textContent = 'Japanese Cobalt Steel';
          if (editorialDesc) editorialDesc.textContent = 'Cobalt alloy shears hand-honed to a 17° razor edge in Seki, Japan.';
          if (specCapsule) specCapsule.textContent = '[ SPEC: 6.0" COBALT ALLOY • 0.05mm MICRO-SERRATION ]';
        } else if (progress < 0.70) {
          if (kineticNum) kineticNum.textContent = '02';
          if (editorialTitle) editorialTitle.textContent = 'Single-Use Feather Blades';
          if (editorialDesc) editorialDesc.textContent = 'Surgical platinum edge replaced after every gentleman for absolute sterility.';
          if (specCapsule) specCapsule.textContent = '[ SPEC: JAPANESE FEATHER BLADE • 0.10mm BEVEL ]';
        } else {
          if (kineticNum) kineticNum.textContent = '03';
          if (editorialTitle) editorialTitle.textContent = 'Zero-Rush 45-Min Ritual';
          if (editorialDesc) editorialDesc.textContent = 'Uninterrupted sanctuary time dedicated purely to your architectural craft.';
          if (specCapsule) specCapsule.textContent = '[ SPEC: COMPLETE ARTISAN RITUAL • 45 MIN TIMELESS ]';
        }
      }

      // Feature #3B: Precision Tech Spec Dial Activation (#tech)
      if (key === 'clipper') {
        const dialNodes = container.querySelectorAll('.tech-dial-node');
        let activeDialIdx = 0;
        if (progress >= 0.66) activeDialIdx = 2;
        else if (progress >= 0.33) activeDialIdx = 1;

        if (dialNodes && dialNodes.length > 0) {
          dialNodes.forEach((node, idx) => {
            if (idx === activeDialIdx) {
              node.classList.add('active');
            } else {
              node.classList.remove('active');
            }
          });
        }

        // Live Telemetry updates
        const rpmVal = container.querySelector('#telemetryRpm');
        const tempVal = container.querySelector('#telemetryTemp');
        const gapVal = container.querySelector('#telemetryGap');
        const dbVal = container.querySelector('#telemetryDb');

        if (activeDialIdx === 0) {
          if (gapVal) gapVal.textContent = '0.10 mm';
          if (rpmVal) rpmVal.textContent = '7,200 RPM';
          if (tempVal) tempVal.textContent = '28°C CHILLED';
          if (dbVal) dbVal.textContent = '58 dB WHISPER';
        } else if (activeDialIdx === 1) {
          if (gapVal) gapVal.textContent = '0.15 mm';
          if (rpmVal) rpmVal.textContent = '7,200 RPM';
          if (tempVal) tempVal.textContent = '31°C STABLE';
          if (dbVal) dbVal.textContent = '59 dB SMOOTH';
        } else {
          if (gapVal) gapVal.textContent = '0.20 mm';
          if (rpmVal) rpmVal.textContent = '7,400 RPM';
          if (tempVal) tempVal.textContent = '29°C DLC DISSIPATED';
          if (dbVal) dbVal.textContent = '58 dB WHISPER';
        }
      }

      // Feature #3C: Facial & Grooming Atelier Floating Cards (#grooming-atelier)
      if (key === 'atelier') {
        const ritualCards = container.querySelectorAll('.atelier-ritual-glass-card');
        if (ritualCards && ritualCards.length > 0) {
          let activeCardIdx = 0;
          if (progress >= 0.66) activeCardIdx = 2;
          else if (progress >= 0.33) activeCardIdx = 1;

          ritualCards.forEach((card, idx) => {
            if (idx === activeCardIdx) {
              card.classList.add('active');
            } else {
              card.classList.remove('active');
            }
          });
        }
      }
    });
  }

  // =========================================================================
  // VIEWPORT INTERSECTION OBSERVER FOR 3D CANVAS SEQUENCES (70% CPU SAVINGS)
  // =========================================================================
  const visibleSequences = new Set();
  let isLoopRunning = false;

  function setupSequenceObserver() {
    if (!('IntersectionObserver' in window)) {
      Object.keys(containers).forEach((k) => visibleSequences.add(k));
      startAnimationLoop();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const targetId = entry.target.id;
        const key = Object.keys(SEQUENCE_CONFIG).find((k) => SEQUENCE_CONFIG[k].containerId === targetId);
        if (!key) return;

        if (entry.isIntersecting) {
          visibleSequences.add(key);
          if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(animationLoop);
          }
        } else {
          visibleSequences.delete(key);
        }
      });
    }, { rootMargin: '120px 0px' });

    Object.keys(containers).forEach((key) => {
      const el = containers[key];
      if (el) observer.observe(el);
    });
  }

  function startAnimationLoop() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      requestAnimationFrame(animationLoop);
    }
  }

  // 60FPS Animation Loop with Linear Interpolation (Active Only When In-Viewport)
  function animationLoop() {
    if (visibleSequences.size === 0) {
      isLoopRunning = false;
      return;
    }

    visibleSequences.forEach((key) => {
      const state = renderState[key];
      if (!state) return;
      const diff = state.targetFrame - state.currentFrame;
      if (Math.abs(diff) > 0.01) {
        state.currentFrame += diff * 0.16;
        const frameToDraw = Math.round(state.currentFrame);
        drawSequenceFrame(key, frameToDraw);
      }
    });

    requestAnimationFrame(animationLoop);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // =========================================================================
  // 5. NAVBAR SCROLL EFFECT & MOBILE DRAWER
  // =========================================================================
  const mainHeader = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // =========================================================================
  // 6. STATS COUNTER ON SCROLL ANIMATION
  // =========================================================================
  const statCards = document.querySelectorAll('.stat-card');
  let statsCounted = false;

  function countUpStats() {
    statCards.forEach((card) => {
      const target = parseInt(card.getAttribute('data-target') || '0', 10);
      const suffix = card.getAttribute('data-suffix') || '';
      const numEl = card.querySelector('.stat-number');
      if (!numEl) return;

      let current = 0;
      const step = Math.max(1, Math.floor(target / 45));
      const duration = 1500;
      const intervalTime = Math.floor(duration / (target / step));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          numEl.textContent = (target >= 1000 ? target.toLocaleString() : target) + suffix;
          clearInterval(timer);
        } else {
          numEl.textContent = (current >= 1000 ? current.toLocaleString() : current) + suffix;
        }
      }, Math.max(16, intervalTime));
    });
  }

  const philosophySection = document.getElementById('philosophy');
  if (philosophySection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          countUpStats();
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(philosophySection);
  }

  // =========================================================================
  // 7. RATE CARD TAB FILTER & SELECT BUTTONS
  // =========================================================================
  const rateTabs = document.querySelectorAll('.rate-tab-btn');
  const rateCategoryCards = document.querySelectorAll('.rate-category-card');

  rateTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      rateTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');

      rateCategoryCards.forEach((col) => {
        if (targetTab === 'tab-all' || col.getAttribute('data-cat') === targetTab) {
          col.classList.remove('hidden-tab');
        } else {
          col.classList.add('hidden-tab');
        }
      });
    });
  });

  // Clicking any rate card row or "Select +" opens booking modal
  const rateRows = document.querySelectorAll('.rate-menu-row');
  rateRows.forEach((row) => {
    row.addEventListener('click', (e) => {
      // If clicked the inner button, let the delegation handle it
      if (e.target.closest('.btn-rate-select')) return;
      const serviceName = row.getAttribute('data-name');
      const servicePrice = row.getAttribute('data-price');
      openBookingModal(serviceName, null, servicePrice);
    });
  });

  // =========================================================================
  // 7B. AWARD-WINNING PANERAI-STYLE INTERACTIVE RATE CARD & SERVICE EXPLORER
  // =========================================================================
  const paneraiStageWrapper = document.getElementById('paneraiStageWrapper');
  const paneraiMainView = document.getElementById('paneraiMainView');
  const paneraiStripBg = document.getElementById('paneraiStripBg');
  const paneraiStripVerticalTitle = document.getElementById('paneraiStripVerticalTitle');
  const paneraiStripPrice = document.getElementById('paneraiStripPrice');
  const paneraiCatTitle = document.getElementById('paneraiCatTitle');
  const paneraiCatSubtitle = document.getElementById('paneraiCatSubtitle');
  const paneraiPriceValue = document.getElementById('paneraiPriceValue');
  const paneraiCounterActive = document.getElementById('paneraiCounterActive');
  const paneraiPrevBtn = document.getElementById('paneraiPrevBtn');
  const paneraiNextBtn = document.getElementById('paneraiNextBtn');
  const btnPaneraiOpenDrawer = document.getElementById('btnPaneraiOpenDrawer');
  const paneraiPreviewStrip = document.getElementById('paneraiPreviewStrip');
  const btnPaneraiCloseDrawer = document.getElementById('btnPaneraiCloseDrawer');
  const paneraiDrawerTitle = document.getElementById('paneraiDrawerTitle');
  const paneraiDrawerTabs = document.querySelectorAll('.drawer-tab-btn');
  const paneraiDrawerMenuContainer = document.getElementById('paneraiDrawerMenuContainer');

  const PANERAI_CATEGORIES = [
    {
      id: 'hair',
      num: '01',
      title: '01 / HAIR CUTS & ARCHITECTURE',
      subtitle: 'Precision architectural fades, bespoke scissor sculpture, and skull-alignment analysis.',
      startingPrice: '499',
      image: 'public/images/lookbook/style-1.jpg',
      previewTitle: '02. BEARD SCULPT & SHAVES',
      previewPrice: 'From ₹399',
      items: [
        { name: 'Executive Skin Fade', price: '599', time: '45 MIN', desc: '0.1mm foil boundary fade, hot lather razor nape finish, organic scalp tonic massage.' },
        { name: 'Classic Scissor Cut', price: '499', time: '45 MIN', desc: 'Pure Japanese shear sculpture, tailored graduation, and matte clay styling.' },
        { name: 'Junior Heir Cut (Under 12)', price: '399', time: '30 MIN', desc: 'Gentle patient styling, natural proportions, and premium grooming balm.' },
        { name: 'Beard Fade & Re-Shaping', price: '349', time: '25 MIN', desc: 'Seamless boundary fade connecting temples to jawline with razor edge.' },
        { name: 'Hair & Scalp Detox Infusion', price: '449', time: '30 MIN', desc: 'Eucalyptus exfoliation, warm mineral rinse, and cool tonic blast soothing.' }
      ]
    },
    {
      id: 'beard',
      num: '02',
      title: '02 / BEARD SCULPT & SHAVES',
      subtitle: 'Single-use Japanese feather razor boundary carving and hot aromatic eucalyptus towel rituals.',
      startingPrice: '399',
      image: 'public/images/lookbook/style-3.jpg',
      previewTitle: '03. FACIAL & SPA RITUALS',
      previewPrice: 'From ₹549',
      items: [
        { name: 'Bespoke Beard Sculpting', price: '399', time: '30 MIN', desc: 'Tailored jawline enhancement, straight razor carving, and cedarwood oil steam.' },
        { name: 'Royal Hot Towel Shave', price: '499', time: '40 MIN', desc: 'Three steaming eucalyptus towels, feather blade shave, cold alum block soothing.' },
        { name: 'Mustache Contour & Conditioning', price: '249', time: '20 MIN', desc: 'Precision symmetry trimming, styling wax contour, and organic conditioning oil.' },
        { name: 'Charcoal Beard Detox Wrap', price: '349', time: '25 MIN', desc: 'Clarifying charcoal steam wrap to open pores and soften coarse facial bristles.' }
      ]
    },
    {
      id: 'facial',
      num: '03',
      title: '03 / FACIAL & SPA RITUALS',
      subtitle: 'High-performance men’s botanical skin recovery, deep pore extraction, and acupressure therapies.',
      startingPrice: '549',
      image: 'public/images/lookbook/style-4.jpg',
      previewTitle: '04. VIP EXECUTIVE PACKAGES',
      previewPrice: 'From ₹1,499',
      items: [
        { name: 'Hydra-Glow Men\'s Facial', price: '899', time: '50 MIN', desc: 'Deep pore ultrasonic suction, hyaluronic acid infusion, and chilled ice globe drainage.' },
        { name: 'Shiatsu Scalp & Neck Spa', price: '699', time: '35 MIN', desc: 'Acupressure tension release, warm Moroccan argan oil infusion, warm neck collar.' },
        { name: 'Detox Charcoal Black Mask', price: '549', time: '30 MIN', desc: 'Bamboo charcoal peel-off extraction, sebum regulation, and chilled rosewater toner.' },
        { name: 'Eye De-Puffing Cold Stone Treatment', price: '449', time: '25 MIN', desc: 'Jade roller lymphatic drainage, peptide eye serum, and calming cold stone compresses.' }
      ]
    },
    {
      id: 'vip',
      num: '04',
      title: '04 / VIP EXECUTIVE PACKAGES',
      subtitle: 'Complete head-to-toe grooming sanctuary experiences with private suite lounge hospitality.',
      startingPrice: '1,499',
      image: 'public/images/lookbook/style-5.jpg',
      previewTitle: '01. HAIR CUTS & ARCHITECTURE',
      previewPrice: 'From ₹499',
      items: [
        { name: 'The Noir Signature Ritual', price: '1,499', time: '90 MIN', desc: 'Executive Skin Fade + Bespoke Beard Sculpt + Hot Towel Facial + Single Malt service.' },
        { name: 'Executive Grooming Passport', price: '2,199', time: '120 MIN', desc: 'Complete haircut, royal shave, scalp spa, hand detail, and private espresso lounge.' },
        { name: 'Groom\'s Wedding Day Suite', price: '3,499', time: '150 MIN', desc: 'Full bespoke transformation, HD styling, skin prep, and VIP suite reservation.' }
      ]
    }
  ];

  let activePaneraiIdx = 0;

  function updatePaneraiView(idx) {
    activePaneraiIdx = (idx + PANERAI_CATEGORIES.length) % PANERAI_CATEGORIES.length;
    const current = PANERAI_CATEGORIES[activePaneraiIdx];
    const nextIdx = (activePaneraiIdx + 1) % PANERAI_CATEGORIES.length;
    const next = PANERAI_CATEGORIES[nextIdx];

    if (paneraiMainView) {
      paneraiMainView.style.backgroundImage = `url('${current.image}')`;
    }
    if (paneraiCatTitle) paneraiCatTitle.textContent = current.title;
    if (paneraiCatSubtitle) paneraiCatSubtitle.textContent = current.subtitle;
    if (paneraiPriceValue) paneraiPriceValue.textContent = `From ₹${current.startingPrice}`;
    if (paneraiCounterActive) paneraiCounterActive.textContent = current.num;

    // Next preview strip
    if (paneraiStripBg) {
      paneraiStripBg.style.backgroundImage = `url('${next.image}')`;
    }
    if (paneraiStripVerticalTitle) {
      paneraiStripVerticalTitle.textContent = `NEXT: ${next.previewTitle || next.title}`;
    }
    if (paneraiStripPrice) {
      paneraiStripPrice.textContent = next.previewPrice || `From ₹${next.startingPrice}`;
    }

    renderPaneraiDrawerMenu(activePaneraiIdx);
  }

  function renderPaneraiDrawerMenu(catIdx) {
    if (!paneraiDrawerMenuContainer) return;
    const cat = PANERAI_CATEGORIES[catIdx];
    if (paneraiDrawerTitle) paneraiDrawerTitle.textContent = cat.title;

    paneraiDrawerTabs.forEach((tab) => {
      const tabCat = tab.getAttribute('data-cat-index');
      if (parseInt(tabCat, 10) === catIdx) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    let html = '';
    cat.items.forEach((item) => {
      html += `
        <div class="panerai-menu-dotted-row">
          <div class="panerai-row-top">
            <span class="panerai-item-name">${item.name}</span>
            <span class="panerai-item-dotted-leader"></span>
            <span class="panerai-item-price">₹${item.price}</span>
          </div>
          <div class="panerai-row-bottom">
            <div>
              <p class="panerai-item-desc">${item.desc}</p>
              <span class="panerai-item-duration">${item.time}</span>
            </div>
            <button class="btn-panerai-book-row" data-name="${item.name}" data-price="${item.price}">
              <span>Book Ritual</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;
    });
    paneraiDrawerMenuContainer.innerHTML = html;

    // Attach click events to the new book buttons
    paneraiDrawerMenuContainer.querySelectorAll('.btn-panerai-book-row').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sName = btn.getAttribute('data-name');
        const sPrice = btn.getAttribute('data-price');
        openBookingModal(sName, null, sPrice);
      });
    });
  }

  if (paneraiStageWrapper) {
    updatePaneraiView(0);

    if (paneraiPrevBtn) {
      paneraiPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updatePaneraiView(activePaneraiIdx - 1);
      });
    }

    if (paneraiNextBtn) {
      paneraiNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updatePaneraiView(activePaneraiIdx + 1);
      });
    }

    if (btnPaneraiOpenDrawer) {
      btnPaneraiOpenDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        paneraiStageWrapper.classList.add('drawer-open');
        renderPaneraiDrawerMenu(activePaneraiIdx);
      });
    }

    if (paneraiPreviewStrip) {
      paneraiPreviewStrip.addEventListener('click', () => {
        if (!paneraiStageWrapper.classList.contains('drawer-open')) {
          paneraiStageWrapper.classList.add('drawer-open');
          updatePaneraiView(activePaneraiIdx + 1);
        } else {
          updatePaneraiView(activePaneraiIdx + 1);
        }
      });
    }

    if (btnPaneraiCloseDrawer) {
      btnPaneraiCloseDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        paneraiStageWrapper.classList.remove('drawer-open');
      });
    }

    paneraiDrawerTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-cat-index') || '0', 10);
        updatePaneraiView(idx);
      });
    });
  }

  // Interactive Spec Dial Node Clicking on atelier.html
  const techDialNodes = document.querySelectorAll('.tech-dial-node');
  if (techDialNodes && techDialNodes.length > 0) {
    techDialNodes.forEach((node, idx) => {
      node.addEventListener('click', () => {
        techDialNodes.forEach((n) => n.classList.remove('active'));
        node.classList.add('active');

        const rpmVal = document.getElementById('telemetryRpm');
        const tempVal = document.getElementById('telemetryTemp');
        const gapVal = document.getElementById('telemetryGap');
        const dbVal = document.getElementById('telemetryDb');

        if (idx === 0) {
          if (gapVal) gapVal.textContent = '0.10 mm';
          if (rpmVal) rpmVal.textContent = '7,200 RPM';
          if (tempVal) tempVal.textContent = '28°C CHILLED';
          if (dbVal) dbVal.textContent = '58 dB WHISPER';
        } else if (idx === 1) {
          if (gapVal) gapVal.textContent = '0.15 mm';
          if (rpmVal) rpmVal.textContent = '7,200 RPM';
          if (tempVal) tempVal.textContent = '31°C STABLE';
          if (dbVal) dbVal.textContent = '59 dB SMOOTH';
        } else {
          if (gapVal) gapVal.textContent = '0.20 mm';
          if (rpmVal) rpmVal.textContent = '7,400 RPM';
          if (tempVal) tempVal.textContent = '29°C DLC DISSIPATED';
          if (dbVal) dbVal.textContent = '58 dB WHISPER';
        }
      });
    });
  }

  // =========================================================================
  // 8. INTERACTIVE BEFORE & AFTER SLIDER ENGINE (#transformations)
  // =========================================================================
  const sliderRangeInput = document.getElementById('sliderRangeInput');
  const layerBefore = document.getElementById('layerBefore');
  const sliderDivider = document.getElementById('sliderDivider');

  if (sliderRangeInput && layerBefore && sliderDivider) {
    function updateComparisonSlider(val) {
      layerBefore.style.width = `${val}%`;
      sliderDivider.style.left = `${val}%`;
    }

    sliderRangeInput.addEventListener('input', (e) => {
      updateComparisonSlider(e.target.value);
    });

    // Touch and mouse move support
    sliderRangeInput.addEventListener('change', (e) => {
      updateComparisonSlider(e.target.value);
    });

    // Split side-by-side public/images/transformation/before-after.png cleanly into Before & After
    const splitImg = new Image();
    splitImg.crossOrigin = 'anonymous';
    splitImg.onload = () => {
      try {
        const halfW = Math.floor(splitImg.naturalWidth / 2);
        const h = splitImg.naturalHeight;
        if (halfW > 0 && h > 0) {
          const cBefore = document.createElement('canvas');
          cBefore.width = halfW;
          cBefore.height = h;
          const ctxB = cBefore.getContext('2d');
          if (ctxB) {
            ctxB.drawImage(splitImg, 0, 0, halfW, h, 0, 0, halfW, h);
          }

          const cAfter = document.createElement('canvas');
          cAfter.width = halfW;
          cAfter.height = h;
          const ctxA = cAfter.getContext('2d');
          if (ctxA) {
            ctxA.drawImage(splitImg, halfW, 0, halfW, h, 0, 0, halfW, h);
          }

          const imgB = document.getElementById('imgBefore');
          const imgA = document.getElementById('imgAfter');
          if (imgB && imgA) {
            imgB.src = cBefore.toDataURL('image/jpeg', 0.92);
            imgB.className = 'trans-split-img';
            imgB.style.width = '100%';
            imgB.style.maxWidth = '100%';
            imgB.style.objectPosition = 'center';

            imgA.src = cAfter.toDataURL('image/jpeg', 0.92);
            imgA.className = 'trans-split-img';
            imgA.style.width = '100%';
            imgA.style.maxWidth = '100%';
            imgA.style.transform = 'none';
            imgA.style.objectPosition = 'center';
          }
        }
      } catch {
        // Fallback: CSS .img-before-half and .img-after-half already handle the 200% split visual alignment cleanly
      }
    };
    splitImg.onerror = () => {
      if (splitImg.src.includes('public/images/')) {
        splitImg.src = 'images/transformation/before-after.png';
      }
    };
    splitImg.src = 'public/images/transformation/before-after.png';
  }

  // =========================================================================
  // 9. LOOKBOOK CATEGORY FILTER
  // =========================================================================
  const styleTabs = document.querySelectorAll('.style-tab-btn');
  const lookbookCards = document.querySelectorAll('.lookbook-card');

  styleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      styleTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      lookbookCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  // =========================================================================
  // 10. INTERACTIVE LUXURY APPOINTMENT BOOKING MODAL
  // =========================================================================
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalFormStep = document.getElementById('modalFormStep');
  const modalSuccessStep = document.getElementById('modalSuccessStep');
  const appointmentForm = document.getElementById('appointmentForm');

  const bookServiceSelect = document.getElementById('bookService');
  const bookBarberSelect = document.getElementById('bookBarber');
  const bookDateInput = document.getElementById('bookDate');
  const bookTimeSelect = document.getElementById('bookTime');
  const bookNameInput = document.getElementById('bookName');
  const bookPhoneInput = document.getElementById('bookPhone');

  const summaryServiceText = document.getElementById('summaryServiceText');
  const summaryMetaText = document.getElementById('summaryMetaText');
  const summaryPriceText = document.getElementById('summaryPriceText');

  // Ticket elements
  const ticketPassId = document.getElementById('ticketPassId');
  const ticketGuest = document.getElementById('ticketGuest');
  const ticketBarber = document.getElementById('ticketBarber');
  const ticketRitual = document.getElementById('ticketRitual');
  const ticketAmount = document.getElementById('ticketAmount');
  const ticketDate = document.getElementById('ticketDate');
  const ticketTime = document.getElementById('ticketTime');
  const ticketBookAnotherBtn = document.getElementById('ticketBookAnotherBtn');

  // Preset tomorrow as default date
  if (bookDateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    bookDateInput.value = tomorrow.toISOString().split('T')[0];
    bookDateInput.min = today.toISOString().split('T')[0];
  }

  function updateLiveSummary() {
    if (!bookServiceSelect) return;
    const selectedOption = bookServiceSelect.options[bookServiceSelect.selectedIndex];
    const serviceName = selectedOption.value;
    const price = selectedOption.getAttribute('data-price') || '599';
    const duration = selectedOption.getAttribute('data-time') || '45 mins';
    const barber = bookBarberSelect ? bookBarberSelect.value : 'First Available';

    if (summaryServiceText) summaryServiceText.textContent = serviceName;
    if (summaryMetaText) summaryMetaText.textContent = `Estimated: ${duration} • With ${barber}`;
    if (summaryPriceText) summaryPriceText.textContent = `₹${price}`;
  }

  if (bookServiceSelect) {
    bookServiceSelect.addEventListener('change', updateLiveSummary);
  }
  if (bookBarberSelect) {
    bookBarberSelect.addEventListener('change', updateLiveSummary);
  }

  function openBookingModal(serviceName = null, barberName = null, _price = null) {
    if (!bookingModal) return;

    if (serviceName && bookServiceSelect) {
      for (let i = 0; i < bookServiceSelect.options.length; i++) {
        if (bookServiceSelect.options[i].value === serviceName) {
          bookServiceSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (barberName && bookBarberSelect) {
      for (let i = 0; i < bookBarberSelect.options.length; i++) {
        if (bookBarberSelect.options[i].value.includes(barberName) || barberName.includes(bookBarberSelect.options[i].value)) {
          bookBarberSelect.selectedIndex = i;
          break;
        }
      }
    }

    updateLiveSummary();

    modalFormStep.classList.add('active');
    modalSuccessStep.classList.remove('active');

    bookingModal.classList.add('active');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Open booking buttons delegation
  document.querySelectorAll('.open-booking-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service');
      const barber = btn.getAttribute('data-barber');
      const price = btn.getAttribute('data-price');
      openBookingModal(service, barber, price);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
      closeBookingModal();
    }
  });

  // Handle Booking Form Submit
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = bookNameInput.value.trim() || 'Distinguished Guest';
      const guestPhone = bookPhoneInput ? bookPhoneInput.value.trim() : '';
      const barberVal = bookBarberSelect.value;
      const serviceVal = bookServiceSelect.value;
      const selectedOption = bookServiceSelect.options[bookServiceSelect.selectedIndex];
      const priceVal = selectedOption.getAttribute('data-price') || '599';
      const dateVal = bookDateInput.value;
      const timeVal = bookTimeSelect.value;

      const randomId = 'NB-' + Math.floor(10000 + Math.random() * 90000);

      let formattedDate = dateVal;
      try {
        const d = new Date(dateVal);
        formattedDate = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        // Fallback
      }

      if (ticketPassId) ticketPassId.textContent = randomId;
      if (ticketGuest) ticketGuest.textContent = guestName + (guestPhone ? ` (${guestPhone})` : '');
      if (ticketBarber) ticketBarber.textContent = barberVal;
      if (ticketRitual) ticketRitual.textContent = serviceVal;
      if (ticketAmount) ticketAmount.textContent = `₹${priceVal}`;
      if (ticketDate) ticketDate.textContent = formattedDate;
      if (ticketTime) ticketTime.textContent = timeVal;

      modalFormStep.classList.remove('active');
      modalSuccessStep.classList.add('active');
    });
  }

  if (ticketBookAnotherBtn) {
    ticketBookAnotherBtn.addEventListener('click', () => {
      if (appointmentForm) appointmentForm.reset();
      updateLiveSummary();
      modalSuccessStep.classList.remove('active');
      modalFormStep.classList.add('active');
    });
  }

  // =========================================================================
  // 11. BOOTSTRAP (INSTANT DISPLAY & ZERO PRELOADER DELAY)
  // =========================================================================
  setupCanvases();
  setupContainers();
  setupSequenceObserver();
  updateScrollProgress();
  startAnimationLoop();

  // Instantly paint initial frame and stream assets in the background
  initCanvasAssets();

});
