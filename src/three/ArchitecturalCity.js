import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ArchitecturalCity {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      onBuildingSelect: null,
      onBuildingHover: null,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();

    // Scene groups
    this.cityGroup = new THREE.Group();
    this.trafficGroup = new THREE.Group();
    this.natureGroup = new THREE.Group();
    this.infrastructureGroup = new THREE.Group();
    this.landmarkGroup = new THREE.Group();

    // Interactive objects registry for raycasting
    this.interactiveObjects = [];
    this.hoveredObject = null;
    this.selectedObject = null;

    // Traffic system
    this.vehicles = [];

    // Lighting scheme
    this.currentTheme = 'golden'; // 'golden', 'daylight', 'twilight'
    this.lights = {};

    // Camera target vectors for GSAP scrubbing
    this.cameraPosition = new THREE.Vector3(45, 38, 55);
    this.cameraLookAt = new THREE.Vector3(0, 8, 0);
    this.targetLookAt = new THREE.Vector3(0, 8, 0);

    // Free orbit mode toggle
    this.isFreeOrbit = false;

    // Mouse & Raycasting
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0c10);
    this.scene.fog = new THREE.FogExp2(0x0a0c10, 0.012);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800);
    this.camera.position.copy(this.cameraPosition);
    this.camera.lookAt(this.cameraLookAt);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls (for free inspection mode)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't go below ground
    this.controls.minDistance = 8;
    this.controls.maxDistance = 180;
    this.controls.enabled = false; // Disabled by default, activated in free inspect mode

    // 5. Add Groups to Scene
    this.scene.add(this.cityGroup);
    this.scene.add(this.trafficGroup);
    this.scene.add(this.natureGroup);
    this.scene.add(this.infrastructureGroup);
    this.scene.add(this.landmarkGroup);

    // 6. Generate Procedural Textures & Materials
    this.createTexturesAndMaterials();

    // 7. Setup Environmental Lighting
    this.setupLighting();

    // 8. Build Architectural Masterplan
    this.buildGroundAndWater();
    this.buildRoadNetwork();
    this.buildSurroundingCity();
    this.buildApexTower(); // Flagship Commercial
    this.buildLuminaResidences(); // Flagship Residential
    this.buildElysiumVillas(); // Flagship Luxury Waterfront
    this.buildMasterplanPavilion(); // Flagship Experience Pavilion
    this.buildVegetationAndPlazas();
    this.initTraffic();

    // 9. Event Listeners
    this.bindEvents();

    // 10. Start Animation Loop
    this.animate();
  }

  createTexturesAndMaterials() {
    // Generate high-resolution procedural window grid texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base dark facade
    ctx.fillStyle = '#0f131a';
    ctx.fillRect(0, 0, 512, 1024);

    // Architectural window grid pattern
    const rows = 48;
    const cols = 16;
    const padX = 6;
    const padY = 5;
    const w = (512 - padX * (cols + 1)) / cols;
    const h = (1024 - padY * (rows + 1)) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * (w + padX);
        const y = padY + r * (h + padY);

        // Random illuminated windows
        const rand = Math.random();
        if (rand > 0.45) {
          // Warm illuminated office/residence
          const temp = Math.random();
          if (temp > 0.6) {
            ctx.fillStyle = '#ffdfa0'; // Warm gold light
          } else if (temp > 0.3) {
            ctx.fillStyle = '#fcebd2'; // Soft champagne light
          } else {
            ctx.fillStyle = '#8ee0f7'; // Modern cool executive light
          }
        } else {
          // Dark glass pane with subtle reflection
          ctx.fillStyle = '#181e28';
        }
        ctx.fillRect(x, y, w, h);
      }
    }

    this.windowTexture = new THREE.CanvasTexture(canvas);
    this.windowTexture.wrapS = THREE.RepeatWrapping;
    this.windowTexture.wrapT = THREE.RepeatWrapping;

    // Materials Library
    this.materials = {
      concreteDark: new THREE.MeshStandardMaterial({
        color: 0x1b1f28,
        roughness: 0.85,
        metalness: 0.1
      }),
      concretePavement: new THREE.MeshStandardMaterial({
        color: 0x222834,
        roughness: 0.9,
        metalness: 0.05
      }),
      roadAsphalt: new THREE.MeshStandardMaterial({
        color: 0x12151b,
        roughness: 0.95,
        metalness: 0.02
      }),
      curbStone: new THREE.MeshStandardMaterial({
        color: 0x4a5260,
        roughness: 0.7,
        metalness: 0.1
      }),
      glassFacade: new THREE.MeshStandardMaterial({
        map: this.windowTexture,
        roughness: 0.15,
        metalness: 0.85,
        envMapIntensity: 1.2
      }),
      glassCurtainClear: new THREE.MeshPhysicalMaterial({
        color: 0x8ab8d8,
        transmission: 0.7,
        opacity: 0.85,
        transparent: true,
        roughness: 0.08,
        metalness: 0.15,
        ior: 1.52
      }),
      champagneBronze: new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.3,
        metalness: 0.75
      }),
      titaniumSlate: new THREE.MeshStandardMaterial({
        color: 0x2c3340,
        roughness: 0.4,
        metalness: 0.65
      }),
      waterMarina: new THREE.MeshStandardMaterial({
        color: 0x0c2538,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.9
      }),
      greeneryFoliage: new THREE.MeshStandardMaterial({
        color: 0x2e4b38,
        roughness: 0.85,
        metalness: 0.05,
        flatShading: true
      }),
      greeneryLawn: new THREE.MeshStandardMaterial({
        color: 0x1d3625,
        roughness: 0.9,
        metalness: 0.0
      }),
      woodDeck: new THREE.MeshStandardMaterial({
        color: 0x5a3f2b,
        roughness: 0.7,
        metalness: 0.05
      }),
      glowingWarm: new THREE.MeshBasicMaterial({
        color: 0xffd27d
      }),
      glowingCyan: new THREE.MeshBasicMaterial({
        color: 0x38e8d8
      }),
      glowingRedTail: new THREE.MeshBasicMaterial({
        color: 0xff2a44
      }),
      wireframeAccent: new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        wireframe: true
      })
    };
  }

  setupLighting() {
    // 1. Ambient & Hemispheric lighting
    this.lights.hemi = new THREE.HemisphereLight(0xdce5f2, 0x1a212e, 0.6);
    this.scene.add(this.lights.hemi);

    // 2. Main Sun Light (Key Directional Light with soft shadows)
    this.lights.sun = new THREE.DirectionalLight(0xffeed6, 2.2);
    this.lights.sun.position.set(65, 80, 50);
    this.lights.sun.castShadow = true;
    this.lights.sun.shadow.mapSize.width = 2048;
    this.lights.sun.shadow.mapSize.height = 2048;
    this.lights.sun.shadow.camera.near = 10;
    this.lights.sun.shadow.camera.far = 250;
    this.lights.sun.shadow.camera.left = -70;
    this.lights.sun.shadow.camera.right = 70;
    this.lights.sun.shadow.camera.top = 70;
    this.lights.sun.shadow.camera.bottom = -70;
    this.lights.sun.shadow.bias = -0.0005;
    this.lights.sun.shadow.radius = 2.5;
    this.scene.add(this.lights.sun);

    // 3. Fill Light (Soft cool rim light from opposite side)
    this.lights.fill = new THREE.DirectionalLight(0x7aa6d6, 0.7);
    this.lights.fill.position.set(-60, 45, -50);
    this.scene.add(this.lights.fill);

    // 4. Accent Point Light for the Masterplan Civic Plaza
    this.lights.plaza = new THREE.PointLight(0xffbe6b, 1.5, 45, 1.2);
    this.lights.plaza.position.set(0, 4, 4);
    this.scene.add(this.lights.plaza);

    // Set initial theme
    this.setTheme('golden');
  }

  setTheme(themeName) {
    this.currentTheme = themeName;

    if (themeName === 'golden') {
      // Golden Hour Architectural Warmth
      this.scene.background.set(0x0c0f16);
      this.scene.fog.color.set(0x0c0f16);
      this.scene.fog.density = 0.011;
      this.lights.sun.color.set(0xffd599);
      this.lights.sun.intensity = 2.6;
      this.lights.sun.position.set(70, 60, 45);
      this.lights.hemi.color.set(0xffe6cb);
      this.lights.hemi.groundColor.set(0x181f2a);
      this.lights.hemi.intensity = 0.7;
      this.lights.fill.color.set(0x7695ba);
      this.lights.fill.intensity = 0.6;
      this.renderer.toneMappingExposure = 1.15;
    } else if (themeName === 'daylight') {
      // Crisp Architectural Clay & Clear Sunlight
      this.scene.background.set(0x141822);
      this.scene.fog.color.set(0x141822);
      this.scene.fog.density = 0.009;
      this.lights.sun.color.set(0xffffff);
      this.lights.sun.intensity = 2.2;
      this.lights.sun.position.set(40, 95, 30);
      this.lights.hemi.color.set(0xeaf2ff);
      this.lights.hemi.groundColor.set(0x28313e);
      this.lights.hemi.intensity = 0.9;
      this.lights.fill.color.set(0x9bc0e6);
      this.lights.fill.intensity = 0.8;
      this.renderer.toneMappingExposure = 1.0;
    } else if (themeName === 'twilight') {
      // Midnight Cyber & Glowing Architectural Luminescence
      this.scene.background.set(0x05070a);
      this.scene.fog.color.set(0x05070a);
      this.scene.fog.density = 0.014;
      this.lights.sun.color.set(0x385c96);
      this.lights.sun.intensity = 0.6;
      this.lights.sun.position.set(-50, 40, -40);
      this.lights.hemi.color.set(0x1e2840);
      this.lights.hemi.groundColor.set(0x0a0c12);
      this.lights.hemi.intensity = 0.4;
      this.lights.fill.color.set(0xd4af37);
      this.lights.fill.intensity = 0.5;
      this.renderer.toneMappingExposure = 1.35;
    }
  }

  buildGroundAndWater() {
    // 1. Masterplan Podium Base
    const podiumGeo = new THREE.BoxGeometry(180, 2, 180);
    const podiumMesh = new THREE.Mesh(podiumGeo, this.materials.concreteDark);
    podiumMesh.position.y = -1;
    podiumMesh.receiveShadow = true;
    this.cityGroup.add(podiumMesh);

    // 2. Marina / Waterfront Basin
    const waterGeo = new THREE.PlaneGeometry(80, 80);
    const waterMesh = new THREE.Mesh(waterGeo, this.materials.waterMarina);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(-42, 0.05, -35);
    waterMesh.receiveShadow = true;
    this.cityGroup.add(waterMesh);
    this.waterMesh = waterMesh;

    // Waterfront seawall quays
    const quayGeo = new THREE.BoxGeometry(82, 0.6, 2);
    const quay1 = new THREE.Mesh(quayGeo, this.materials.curbStone);
    quay1.position.set(-42, 0.3, 5);
    quay1.receiveShadow = true;
    quay1.castShadow = true;
    this.cityGroup.add(quay1);

    const quayGeo2 = new THREE.BoxGeometry(2, 0.6, 82);
    const quay2 = new THREE.Mesh(quayGeo2, this.materials.curbStone);
    quay2.position.set(-1, 0.3, -35);
    quay2.receiveShadow = true;
    quay2.castShadow = true;
    this.cityGroup.add(quay2);

    // Wooden Boardwalk Pier
    const pierGeo = new THREE.BoxGeometry(32, 0.4, 4);
    const pier1 = new THREE.Mesh(pierGeo, this.materials.woodDeck);
    pier1.position.set(-36, 0.25, -20);
    pier1.receiveShadow = true;
    this.cityGroup.add(pier1);

    const pier2 = pier1.clone();
    pier2.position.set(-36, 0.25, -36);
    this.cityGroup.add(pier2);

    // Moored Luxury Yacht Silhouettes
    [-20, -36].forEach((zPos, idx) => {
      const yachtGroup = new THREE.Group();
      const hullGeo = new THREE.ConeGeometry(1.6, 9, 4);
      const hull = new THREE.Mesh(hullGeo, this.materials.titaniumSlate);
      hull.rotation.z = Math.PI / 2;
      hull.rotation.y = Math.PI / 4;
      hull.position.set(0, 0.4, 0);
      yachtGroup.add(hull);

      const cabinGeo = new THREE.BoxGeometry(4, 1.2, 1.8);
      const cabin = new THREE.Mesh(cabinGeo, this.materials.glassCurtainClear);
      cabin.position.set(-0.5, 1.1, 0);
      yachtGroup.add(cabin);

      yachtGroup.position.set(-20 - idx * 4, 0.1, zPos + 3);
      yachtGroup.rotation.y = idx === 0 ? 0.2 : -0.15;
      this.cityGroup.add(yachtGroup);
    });
  }

  buildRoadNetwork() {
    // Main North-South Boulevard
    const roadMainGeo = new THREE.PlaneGeometry(10, 160);
    const roadMain = new THREE.Mesh(roadMainGeo, this.materials.roadAsphalt);
    roadMain.rotation.x = -Math.PI / 2;
    roadMain.position.set(16, 0.02, 0);
    roadMain.receiveShadow = true;
    this.infrastructureGroup.add(roadMain);

    // East-West Central Avenue
    const roadCrossGeo = new THREE.PlaneGeometry(160, 10);
    const roadCross = new THREE.Mesh(roadCrossGeo, this.materials.roadAsphalt);
    roadCross.rotation.x = -Math.PI / 2;
    roadCross.position.set(0, 0.02, 12);
    roadCross.receiveShadow = true;
    this.infrastructureGroup.add(roadCross);

    // Diagonal Boulevard linking Waterfront to Innovation Hub
    const roadDiagGeo = new THREE.PlaneGeometry(8, 90);
    const roadDiag = new THREE.Mesh(roadDiagGeo, this.materials.roadAsphalt);
    roadDiag.rotation.x = -Math.PI / 2;
    roadDiag.rotation.z = Math.PI / 4;
    roadDiag.position.set(-8, 0.02, -10);
    roadDiag.receiveShadow = true;
    this.infrastructureGroup.add(roadDiag);

    // Dashed Lane Markings (White)
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xdedede });
    for (let i = -70; i <= 70; i += 6) {
      const dashGeo = new THREE.PlaneGeometry(0.35, 3.2);
      const dashMesh = new THREE.Mesh(dashGeo, dashMat);
      dashMesh.rotation.x = -Math.PI / 2;
      dashMesh.position.set(16, 0.03, i);
      this.infrastructureGroup.add(dashMesh);
    }

    for (let i = -70; i <= 70; i += 6) {
      if (Math.abs(i - 16) < 6) continue; // Skip intersection
      const dashGeo = new THREE.PlaneGeometry(3.2, 0.35);
      const dashMesh = new THREE.Mesh(dashGeo, dashMat);
      dashMesh.rotation.x = -Math.PI / 2;
      dashMesh.position.set(i, 0.03, 12);
      this.infrastructureGroup.add(dashMesh);
    }

    // Modern Streetlights along the avenue
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.5, 8);
    const headGeo = new THREE.BoxGeometry(0.6, 0.12, 0.25);

    [-60, -42, -24, -6, 26, 44, 62].forEach((z) => {
      [11.5, 20.5].forEach((x, isRight) => {
        const pole = new THREE.Mesh(poleGeo, this.materials.curbStone);
        pole.position.set(x, 2.25, z);
        pole.castShadow = true;

        const head = new THREE.Mesh(headGeo, this.materials.glowingWarm);
        head.position.set(isRight ? x - 0.25 : x + 0.25, 4.4, z);

        this.infrastructureGroup.add(pole);
        this.infrastructureGroup.add(head);
      });
    });
  }

  // 1. COMMERCIAL FLAGSHIP: THE APEX TOWER & INNOVATION HUB
  buildApexTower() {
    const towerGroup = new THREE.Group();
    towerGroup.userData = {
      id: 'commercial',
      name: 'The Apex Tower',
      subtitle: 'Commercial & Financial Supertall',
      category: 'Commercial Spaces',
      height: '382 m / 1,253 ft',
      floors: '84 Stories',
      architect: 'Zaha Hadid & Aetheria Studio',
      completion: 'Q4 2027',
      status: 'Phase II Structuring',
      area: '185,000 sq.m',
      leed: 'Platinum Pre-Certified',
      investment: 'From $4.2M Suites',
      description:
        'A revolutionary soaring diagrid commercial skyscraper engineered with an aerodynamic tapered crown, quadruple-glazed acoustic curtain walls, suspended sky-gardens, and an executive heli-pad.'
    };

    // Podium Atrium
    const podiumGeo = new THREE.BoxGeometry(16, 4, 16);
    const podium = new THREE.Mesh(podiumGeo, this.materials.concreteDark);
    podium.position.y = 2;
    podium.castShadow = true;
    podium.receiveShadow = true;
    towerGroup.add(podium);

    // Glass Atrium Walls with internal warm lobby glow
    const atriumGlassGeo = new THREE.BoxGeometry(15.2, 3.6, 15.2);
    const atriumGlass = new THREE.Mesh(atriumGlassGeo, this.materials.glassCurtainClear);
    atriumGlass.position.y = 2;
    towerGroup.add(atriumGlass);

    // Diagrid V-Columns on Podium
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      const colGeo = new THREE.CylinderGeometry(0.25, 0.25, 4.2, 8);
      const col = new THREE.Mesh(colGeo, this.materials.champagneBronze);
      col.position.set(Math.cos(angle) * 7.4, 2.1, Math.sin(angle) * 7.4);
      col.rotation.z = Math.sin(angle) * 0.15;
      col.rotation.x = Math.cos(angle) * 0.15;
      col.castShadow = true;
      towerGroup.add(col);
    }

    // Lower Tower Tier (Stories 1 - 30)
    const tier1Geo = new THREE.BoxGeometry(12, 24, 12);
    const tier1 = new THREE.Mesh(tier1Geo, this.materials.glassFacade);
    tier1.position.y = 4 + 12;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    towerGroup.add(tier1);

    // Sky Garden 1 (Level 31 Cantilever)
    const deck1Geo = new THREE.BoxGeometry(14, 1.2, 14);
    const deck1 = new THREE.Mesh(deck1Geo, this.materials.champagneBronze);
    deck1.position.y = 28.6;
    deck1.castShadow = true;
    towerGroup.add(deck1);

    // Sky Garden Trees
    [-5, 5].forEach((x) => {
      [-5, 5].forEach((z) => {
        const miniTree = this.createTree(0.7);
        miniTree.position.set(x, 29.2, z);
        towerGroup.add(miniTree);
      });
    });

    // Mid Tower Tier (Stories 32 - 58) - Tapered
    const tier2Geo = new THREE.CylinderGeometry(4.8, 5.8, 22, 8);
    const tier2 = new THREE.Mesh(tier2Geo, this.materials.glassFacade);
    tier2.position.y = 29.2 + 11;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    towerGroup.add(tier2);

    // Sky Garden 2 (Level 59)
    const deck2Geo = new THREE.CylinderGeometry(5.4, 5.4, 1, 8);
    const deck2 = new THREE.Mesh(deck2Geo, this.materials.champagneBronze);
    deck2.position.y = 51.7;
    deck2.castShadow = true;
    towerGroup.add(deck2);

    // Upper Tower Tier (Stories 60 - 80)
    const tier3Geo = new THREE.ConeGeometry(5.2, 16, 8, 1, true);
    const tier3 = new THREE.Mesh(tier3Geo, this.materials.glassFacade);
    tier3.position.y = 52.2 + 8;
    tier3.castShadow = true;
    towerGroup.add(tier3);

    // Architectural Spire & Crown
    const crownRingGeo = new THREE.TorusGeometry(3.2, 0.2, 8, 32);
    const crownRing = new THREE.Mesh(crownRingGeo, this.materials.champagneBronze);
    crownRing.rotation.x = Math.PI / 2;
    crownRing.position.y = 68.2;
    towerGroup.add(crownRing);

    // Glowing Helipad Ring
    const heliGeo = new THREE.RingGeometry(1.8, 2.2, 24);
    const heli = new THREE.Mesh(heliGeo, this.materials.glowingCyan);
    heli.rotation.x = -Math.PI / 2;
    heli.position.y = 68.3;
    towerGroup.add(heli);

    // Needle Spire with warning light
    const spireGeo = new THREE.CylinderGeometry(0.06, 0.45, 12, 8);
    const spire = new THREE.Mesh(spireGeo, this.materials.champagneBronze);
    spire.position.y = 74.2;
    spire.castShadow = true;
    towerGroup.add(spire);

    const beaconGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const beacon = new THREE.Mesh(beaconGeo, this.materials.glowingRedTail);
    beacon.position.y = 80.2;
    towerGroup.add(beacon);

    // Position in Masterplan: Main Boulevard West Axis
    towerGroup.position.set(3, 0, -4);
    this.cityGroup.add(towerGroup);
    this.interactiveObjects.push(towerGroup);
    this.apexTower = towerGroup;
  }

  // 2. RESIDENTIAL FLAGSHIP: LUMINA SKY RESIDENCES
  buildLuminaResidences() {
    const resGroup = new THREE.Group();
    resGroup.userData = {
      id: 'residential',
      name: 'Lumina Sky Residences',
      subtitle: 'Luxury Vertical Living & Cascading Terraces',
      category: 'Residential Apartments',
      height: '240 m / 787 ft',
      floors: '62 Stories (Dual Towers)',
      architect: 'Snøhetta & Kengo Kuma Collaborations',
      completion: 'Q1 2028',
      status: 'Sales 72% Reserved',
      area: '124,000 sq.m',
      leed: 'Net Zero Carbon Ready',
      investment: 'From $1.8M - $18M Penthouses',
      description:
        'Twin sculptured residential towers conjoined by an aerial skybridge at level 28. Featuring stepped cantilevered terraces, panoramic floor-to-ceiling soundproof glass, and private plunge pools.'
    };

    // Shared Luxury Podium & Drop-off Valet
    const podiumGeo = new THREE.BoxGeometry(26, 3, 14);
    const podium = new THREE.Mesh(podiumGeo, this.materials.concreteDark);
    podium.position.y = 1.5;
    podium.castShadow = true;
    podium.receiveShadow = true;
    resGroup.add(podium);

    // Tower A (West Tower - Higher)
    const towerAGeo = new THREE.BoxGeometry(9, 44, 10);
    const towerA = new THREE.Mesh(towerAGeo, this.materials.glassFacade);
    towerA.position.set(-7, 3 + 22, 0);
    towerA.castShadow = true;
    towerA.receiveShadow = true;
    resGroup.add(towerA);

    // Cantilever Balconies for Tower A
    for (let floor = 6; floor <= 42; floor += 3) {
      const balcGeo = new THREE.BoxGeometry(10.2, 0.4, 2.2);
      const balc = new THREE.Mesh(balcGeo, this.materials.champagneBronze);
      balc.position.set(-7, floor, 5.2);
      balc.castShadow = true;
      resGroup.add(balc);

      const balcBack = balc.clone();
      balcBack.position.set(-7, floor, -5.2);
      resGroup.add(balcBack);
    }

    // Tower B (East Tower - Stepped)
    const towerBGeo = new THREE.BoxGeometry(9, 36, 10);
    const towerB = new THREE.Mesh(towerBGeo, this.materials.glassFacade);
    towerB.position.set(7, 3 + 18, 0);
    towerB.castShadow = true;
    towerB.receiveShadow = true;
    resGroup.add(towerB);

    // Balconies for Tower B
    for (let floor = 6; floor <= 34; floor += 3) {
      const balcGeo = new THREE.BoxGeometry(10.2, 0.4, 2.2);
      const balc = new THREE.Mesh(balcGeo, this.materials.champagneBronze);
      balc.position.set(7, floor, 5.2);
      balc.castShadow = true;
      resGroup.add(balc);
    }

    // Skybridge connecting Tower A & Tower B at Y=24
    const skybridgeGeo = new THREE.BoxGeometry(7, 3.2, 6);
    const skybridge = new THREE.Mesh(skybridgeGeo, this.materials.glassCurtainClear);
    skybridge.position.set(0, 24, 0);
    skybridge.castShadow = true;
    resGroup.add(skybridge);

    const bridgeFrameGeo = new THREE.BoxGeometry(7.2, 0.4, 6.2);
    const bridgeFloor = new THREE.Mesh(bridgeFrameGeo, this.materials.champagneBronze);
    bridgeFloor.position.set(0, 22.3, 0);
    resGroup.add(bridgeFloor);

    const bridgeRoof = bridgeFloor.clone();
    bridgeRoof.position.set(0, 25.7, 0);
    resGroup.add(bridgeRoof);

    // Rooftop Cantilever Infinity Pool on Tower A
    const poolDeckGeo = new THREE.BoxGeometry(11, 1.2, 12);
    const poolDeck = new THREE.Mesh(poolDeckGeo, this.materials.concreteDark);
    poolDeck.position.set(-7, 47.6, 0);
    resGroup.add(poolDeck);

    const poolWaterGeo = new THREE.BoxGeometry(7, 0.4, 8);
    const poolWater = new THREE.Mesh(poolWaterGeo, this.materials.glowingCyan);
    poolWater.position.set(-7, 48.2, 0);
    resGroup.add(poolWater);

    // Position in Masterplan: North-West quadrant
    resGroup.position.set(-20, 0, 16);
    this.cityGroup.add(resGroup);
    this.interactiveObjects.push(resGroup);
    this.luminaResidences = resGroup;
  }

  // 3. LUXURY VILLAS FLAGSHIP: ELYSIUM WATERFRONT ESTATE
  buildElysiumVillas() {
    const villasGroup = new THREE.Group();
    villasGroup.userData = {
      id: 'villas',
      name: 'Elysium Waterfront Pavilions',
      subtitle: 'Ultra-Prime Private Estates & Moorings',
      category: 'Luxury Villas',
      height: '14 m / 46 ft',
      floors: '3-Level Cantilever Villas',
      architect: 'Vincent Van Duysen & Studio MK27',
      completion: 'Immediate Handover Ready',
      status: 'Limited Release (3 of 12 Available)',
      area: '1,450 sq.m per Villa',
      leed: 'Passive House Certified',
      investment: 'From $12.5M - $34M Private Waterfront',
      description:
        'A collection of 12 museum-grade minimalist glass pavilions cantilevered over serene reflecting lagoons. Featuring private deep-water yacht berths, teak courtyards, and subterranean wellness spas.'
    };

    // Four ultra-luxury pavilions arranged along the lagoon quay
    const villaPositions = [
      { x: -28, z: -14 },
      { x: -44, z: -14 },
      { x: -28, z: -32 },
      { x: -44, z: -32 }
    ];

    villaPositions.forEach((pos, idx) => {
      const villa = new THREE.Group();

      // Lower slab
      const slab1 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 10), this.materials.concreteDark);
      slab1.position.y = 0.25;
      slab1.receiveShadow = true;
      villa.add(slab1);

      // Ground Floor Glass Living Pavilion
      const livingGlass = new THREE.Mesh(new THREE.BoxGeometry(10, 2.6, 8), this.materials.glassCurtainClear);
      livingGlass.position.y = 1.6;
      villa.add(livingGlass);

      // Feature Basalt Stone Wall
      const stoneWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 8.2), this.materials.titaniumSlate);
      stoneWall.position.set(-4.6, 1.7, 0);
      stoneWall.castShadow = true;
      villa.add(stoneWall);

      // Mid Cantilever Slab
      const slab2 = new THREE.Mesh(new THREE.BoxGeometry(13, 0.5, 11), this.materials.champagneBronze);
      slab2.position.y = 3.2;
      slab2.castShadow = true;
      villa.add(slab2);

      // Second Level Bedroom Suite
      const upperSuite = new THREE.Mesh(new THREE.BoxGeometry(9, 2.4, 7), this.materials.glassFacade);
      upperSuite.position.set(1.5, 4.6, 0);
      upperSuite.castShadow = true;
      villa.add(upperSuite);

      // Roof Overhang
      const roof = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 11), this.materials.concreteDark);
      roof.position.y = 6.0;
      roof.castShadow = true;
      villa.add(roof);

      // Private Infinity Lap Pool
      const pool = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 7), this.materials.glowingCyan);
      pool.position.set(-6.5, 0.3, 0);
      villa.add(pool);

      // Teak Sun Deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(2, 0.35, 7.5), this.materials.woodDeck);
      deck.position.set(-4.5, 0.32, 0);
      villa.add(deck);

      villa.position.set(pos.x, 0, pos.z);
      villasGroup.add(villa);
    });

    this.cityGroup.add(villasGroup);
    this.interactiveObjects.push(villasGroup);
    this.elysiumVillas = villasGroup;
  }

  // 4. MASTERPLAN EXPERIENCE CENTER & CIVIC PAVILION
  buildMasterplanPavilion() {
    const pavGroup = new THREE.Group();
    pavGroup.userData = {
      id: 'pavilion',
      name: 'Aetheria Experience Pavilion',
      subtitle: 'Global Presentation Center & Design Gallery',
      category: 'Civic & Culture',
      height: '18 m / 59 ft',
      floors: '2-Story Sculptural Gallery',
      architect: 'Aetheria Masterplan Studio',
      completion: 'Operational',
      status: 'Open For Private Consultations',
      area: '8,200 sq.m',
      leed: 'Living Building Challenge',
      investment: 'Public & Investor Amenity',
      description:
        'The centerpiece architectural pavilion housing the interactive masterplan models, holographic spatial theater, private investor lounges, and design consulting suites.'
    };

    // Circular stepped amphitheater podium
    const baseGeo = new THREE.CylinderGeometry(11, 12, 1.2, 32);
    const base = new THREE.Mesh(baseGeo, this.materials.curbStone);
    base.position.y = 0.6;
    base.receiveShadow = true;
    pavGroup.add(base);

    // Torus / Möbius-style sculptural building
    const glassDrumGeo = new THREE.CylinderGeometry(9.5, 9.5, 3.8, 32);
    const glassDrum = new THREE.Mesh(glassDrumGeo, this.materials.glassCurtainClear);
    glassDrum.position.y = 2.8;
    pavGroup.add(glassDrum);

    // Dynamic Bronze Canopy with skylight aperture
    const canopyGeo = new THREE.CylinderGeometry(11.5, 8.5, 1.2, 32);
    const canopy = new THREE.Mesh(canopyGeo, this.materials.champagneBronze);
    canopy.position.y = 5.2;
    canopy.castShadow = true;
    pavGroup.add(canopy);

    // Golden Monolith Sculpture in foreground plaza
    const monoGeo = new THREE.BoxGeometry(0.8, 5, 0.8);
    const mono = new THREE.Mesh(monoGeo, this.materials.champagneBronze);
    mono.position.set(0, 3.2, 8);
    mono.rotation.y = Math.PI / 6;
    mono.castShadow = true;
    pavGroup.add(mono);

    // Position in Civic Plaza (Central East Boulevard)
    pavGroup.position.set(32, 0, 18);
    this.cityGroup.add(pavGroup);
    this.interactiveObjects.push(pavGroup);
    this.masterplanPavilion = pavGroup;
  }

  // 5. SURROUNDING URBAN METROPOLIS SKYLINE
  buildSurroundingCity() {
    // Generate 28 diverse architectural buildings for urban context and scale
    const buildingConfigs = [
      // East Commercial District
      { x: 34, z: -18, w: 10, d: 10, h: 38, style: 'stepped' },
      { x: 48, z: -14, w: 8, d: 11, h: 46, style: 'spire' },
      { x: 38, z: -36, w: 9, d: 8, h: 32, style: 'modern' },
      { x: 52, z: -32, w: 10, d: 9, h: 42, style: 'stepped' },

      // North Innovation Hub
      { x: 0, z: -38, w: 12, d: 9, h: 36, style: 'cantilever' },
      { x: 18, z: -42, w: 8, d: 12, h: 50, style: 'spire' },
      { x: -14, z: -52, w: 11, d: 11, h: 28, style: 'modern' },
      { x: 30, z: -54, w: 9, d: 10, h: 44, style: 'stepped' },

      // South Civic & Residential Corridor
      { x: 36, z: 38, w: 11, d: 9, h: 34, style: 'modern' },
      { x: 50, z: 24, w: 9, d: 9, h: 40, style: 'stepped' },
      { x: 46, z: 46, w: 8, d: 8, h: 48, style: 'spire' },
      { x: 18, z: 46, w: 10, d: 10, h: 30, style: 'cantilever' },
      { x: 2, z: 44, w: 9, d: 12, h: 26, style: 'modern' },

      // West Waterfront Skyline (Background)
      { x: -36, z: 38, w: 10, d: 10, h: 35, style: 'stepped' },
      { x: -50, z: 22, w: 9, d: 11, h: 42, style: 'spire' },
      { x: -54, z: 42, w: 8, d: 8, h: 38, style: 'modern' },
      { x: -56, z: -2, w: 9, d: 10, h: 30, style: 'cantilever' },

      // Far Background Towers (Atmospheric Skyline Depth)
      { x: 68, z: 0, w: 12, d: 12, h: 60, style: 'spire' },
      { x: 64, z: -25, w: 10, d: 10, h: 54, style: 'stepped' },
      { x: 65, z: 30, w: 11, d: 9, h: 52, style: 'modern' },
      { x: -65, z: 20, w: 10, d: 10, h: 48, style: 'modern' },
      { x: 0, z: -70, w: 14, d: 12, h: 62, style: 'spire' },
      { x: 25, z: -72, w: 11, d: 11, h: 56, style: 'stepped' },
      { x: -26, z: -74, w: 12, d: 10, h: 50, style: 'modern' }
    ];

    buildingConfigs.forEach((cfg, idx) => {
      const bldg = new THREE.Group();

      // Main Tower Mass
      const mainGeo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const mainMesh = new THREE.Mesh(mainGeo, this.materials.glassFacade);
      mainMesh.position.y = cfg.h / 2;
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      bldg.add(mainMesh);

      // Architectural Rooftop mechanical enclosure or crown
      if (cfg.style === 'spire') {
        const crownGeo = new THREE.BoxGeometry(cfg.w * 0.75, 4, cfg.d * 0.75);
        const crown = new THREE.Mesh(crownGeo, this.materials.concreteDark);
        crown.position.y = cfg.h + 2;
        crown.castShadow = true;
        bldg.add(crown);

        const spireGeo = new THREE.CylinderGeometry(0.1, 0.4, 8, 8);
        const spire = new THREE.Mesh(spireGeo, this.materials.champagneBronze);
        spire.position.y = cfg.h + 8;
        bldg.add(spire);

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), this.materials.glowingRedTail);
        beacon.position.y = cfg.h + 12;
        bldg.add(beacon);
      } else if (cfg.style === 'stepped') {
        const stepGeo = new THREE.BoxGeometry(cfg.w * 0.7, 6, cfg.d * 0.7);
        const step = new THREE.Mesh(stepGeo, this.materials.titaniumSlate);
        step.position.y = cfg.h + 3;
        step.castShadow = true;
        bldg.add(step);

        const plantGeo = new THREE.BoxGeometry(cfg.w * 0.45, 3, cfg.d * 0.45);
        const plant = new THREE.Mesh(plantGeo, this.materials.concreteDark);
        plant.position.y = cfg.h + 7.5;
        bldg.add(plant);
      } else if (cfg.style === 'cantilever') {
        const cantGeo = new THREE.BoxGeometry(cfg.w * 1.15, 3, cfg.d * 1.15);
        const cant = new THREE.Mesh(cantGeo, this.materials.champagneBronze);
        cant.position.y = cfg.h * 0.65;
        bldg.add(cant);
      }

      // Lobby Base Colonnade
      const baseGeo = new THREE.BoxGeometry(cfg.w + 0.6, 2.5, cfg.d + 0.6);
      const baseMesh = new THREE.Mesh(baseGeo, this.materials.concreteDark);
      baseMesh.position.y = 1.25;
      bldg.add(baseMesh);

      bldg.position.set(cfg.x, 0, cfg.z);
      this.cityGroup.add(bldg);
    });
  }

  // 6. URBAN LANDSCAPING, TREES & GREEN PARKS
  buildVegetationAndPlazas() {
    // Central Promenade Green Belt
    const greenBeltGeo = new THREE.BoxGeometry(22, 0.15, 12);
    const greenBelt = new THREE.Mesh(greenBeltGeo, this.materials.greeneryLawn);
    greenBelt.position.set(0, 0.08, 28);
    greenBelt.receiveShadow = true;
    this.natureGroup.add(greenBelt);

    // Plant 60+ Low-Poly Architectural Trees along avenues and parks
    const treeCoords = [
      // Along Central Boulevard East
      { x: 10.5, z: -50 }, { x: 10.5, z: -38 }, { x: 10.5, z: -26 }, { x: 10.5, z: -14 },
      { x: 10.5, z: 2 }, { x: 10.5, z: 22 }, { x: 10.5, z: 34 }, { x: 10.5, z: 46 }, { x: 10.5, z: 58 },
      // Along Boulevard West
      { x: 21.5, z: -50 }, { x: 21.5, z: -38 }, { x: 21.5, z: -26 }, { x: 21.5, z: -14 },
      { x: 21.5, z: 2 }, { x: 21.5, z: 22 }, { x: 21.5, z: 34 }, { x: 21.5, z: 46 }, { x: 21.5, z: 58 },
      // Green Belt Park Clustered Groves
      { x: -6, z: 26 }, { x: -3, z: 29 }, { x: 0, z: 25 }, { x: 3, z: 28 }, { x: 6, z: 26 },
      { x: -5, z: 32 }, { x: -1, z: 31 }, { x: 4, z: 32 },
      // Waterfront Promenade Avenue
      { x: -3, z: -10 }, { x: -3, z: -18 }, { x: -3, z: -26 }, { x: -3, z: -34 }, { x: -3, z: -42 },
      // Plaza Surrounds
      { x: 26, z: 12 }, { x: 38, z: 12 }, { x: 26, z: 24 }, { x: 38, z: 24 }
    ];

    treeCoords.forEach((coord) => {
      const scale = 0.9 + Math.random() * 0.4;
      const tree = this.createTree(scale);
      tree.position.set(coord.x, 0, coord.z);
      this.natureGroup.add(tree);
    });
  }

  createTree(scale = 1.0) {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.12 * scale, 0.2 * scale, 1.8 * scale, 6);
    const trunk = new THREE.Mesh(trunkGeo, this.materials.curbStone);
    trunk.position.y = (1.8 * scale) / 2;
    trunk.castShadow = true;
    tree.add(trunk);

    // Stylized Faceted Foliage (Architectural Icosahedron)
    const foliageGeo = new THREE.IcosahedronGeometry(1.3 * scale, 1);
    const foliage = new THREE.Mesh(foliageGeo, this.materials.greeneryFoliage);
    foliage.position.y = 2.4 * scale;
    foliage.rotation.y = Math.random() * Math.PI;
    foliage.castShadow = true;
    tree.add(foliage);

    return tree;
  }

  // 7. DYNAMIC TRAFFIC & MOVING VEHICLES SYSTEM
  initTraffic() {
    // Define 2 road circuit tracks
    // Path 1: Boulevard N-S straight lanes
    // Path 2: Cross Avenue E-W
    const carColors = [0x222630, 0xd4af37, 0xefefef, 0x364152];

    for (let i = 0; i < 18; i++) {
      const carGroup = new THREE.Group();

      // Car body
      const bodyGeo = new THREE.BoxGeometry(1.1, 0.5, 2.2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: carColors[i % carColors.length],
        roughness: 0.3,
        metalness: 0.7
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.35;
      body.castShadow = true;
      carGroup.add(body);

      // Cabin / Roof
      const cabinGeo = new THREE.BoxGeometry(0.9, 0.4, 1.2);
      const cabin = new THREE.Mesh(cabinGeo, this.materials.titaniumSlate);
      cabin.position.set(0, 0.7, -0.1);
      carGroup.add(cabin);

      // Headlights (Warm White Glow)
      const headL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.05), this.materials.glowingWarm);
      headL.position.set(-0.35, 0.35, -1.12);
      carGroup.add(headL);

      const headR = headL.clone();
      headR.position.set(0.35, 0.35, -1.12);
      carGroup.add(headR);

      // Taillights (Red Glow)
      const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.05), this.materials.glowingRedTail);
      tailL.position.set(-0.35, 0.35, 1.12);
      carGroup.add(tailL);

      const tailR = tailL.clone();
      tailR.position.set(0.35, 0.35, 1.12);
      carGroup.add(tailR);

      // Assign trajectory
      const lane = i % 4;
      let x = 14;
      let z = -65 + i * 8;
      let dir = 1;
      let axis = 'z';

      if (lane === 0) {
        x = 14.5;
        dir = 1; // Southbound
        carGroup.rotation.y = Math.PI;
      } else if (lane === 1) {
        x = 17.5;
        dir = -1; // Northbound
        carGroup.rotation.y = 0;
      } else if (lane === 2) {
        axis = 'x';
        z = 10.5;
        x = -65 + i * 8;
        dir = 1; // Eastbound
        carGroup.rotation.y = -Math.PI / 2;
      } else {
        axis = 'x';
        z = 13.5;
        x = 65 - i * 8;
        dir = -1; // Westbound
        carGroup.rotation.y = Math.PI / 2;
      }

      carGroup.position.set(x, 0, z);
      this.trafficGroup.add(carGroup);

      this.vehicles.push({
        mesh: carGroup,
        axis,
        dir,
        speed: 12 + Math.random() * 8,
        min: -75,
        max: 75
      });
    }
  }

  updateTraffic(delta) {
    this.vehicles.forEach((veh) => {
      if (veh.axis === 'z') {
        veh.mesh.position.z += veh.dir * veh.speed * delta;
        if (veh.dir > 0 && veh.mesh.position.z > veh.max) {
          veh.mesh.position.z = veh.min;
        } else if (veh.dir < 0 && veh.mesh.position.z < veh.min) {
          veh.mesh.position.z = veh.max;
        }
      } else {
        veh.mesh.position.x += veh.dir * veh.speed * delta;
        if (veh.dir > 0 && veh.mesh.position.x > veh.max) {
          veh.mesh.position.x = veh.min;
        } else if (veh.dir < 0 && veh.mesh.position.x < veh.min) {
          veh.mesh.position.x = veh.max;
        }
      }
    });
  }

  // 8. CAMERA INTERPOLATION FOR GSAP SCROLL & PRESETS
  setCameraTarget(pos, lookAt, immediate = false) {
    if (immediate) {
      this.camera.position.set(pos.x, pos.y, pos.z);
      this.cameraLookAt.set(lookAt.x, lookAt.y, lookAt.z);
      this.camera.lookAt(this.cameraLookAt);
      if (this.controls) this.controls.target.copy(this.cameraLookAt);
    } else {
      this.targetLookAt.set(lookAt.x, lookAt.y, lookAt.z);
      this.cameraPosition.set(pos.x, pos.y, pos.z);
    }
  }

  // Focus on a specific building or zone
  focusBuilding(buildingId) {
    let targetPos, targetLook;

    switch (buildingId) {
      case 'commercial':
        targetPos = { x: 16, y: 22, z: 12 };
        targetLook = { x: 3, y: 34, z: -4 };
        break;
      case 'residential':
        targetPos = { x: -8, y: 28, z: 32 };
        targetLook = { x: -20, y: 22, z: 16 };
        break;
      case 'villas':
        targetPos = { x: -16, y: 12, z: -10 };
        targetLook = { x: -36, y: 4, z: -26 };
        break;
      case 'pavilion':
        targetPos = { x: 44, y: 10, z: 28 };
        targetLook = { x: 32, y: 4, z: 18 };
        break;
      default:
        targetPos = { x: 45, y: 38, z: 55 };
        targetLook = { x: 0, y: 8, z: 0 };
    }

    this.setCameraTarget(targetPos, targetLook);
  }

  setFreeOrbitMode(enabled) {
    this.isFreeOrbit = enabled;
    if (this.controls) {
      this.controls.enabled = enabled;
      if (enabled) {
        this.controls.target.copy(this.cameraLookAt);
      }
    }
  }

  // 9. EVENT BINDING & RAYCASTING
  bindEvents() {
    this.onResize = this.onResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);

    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('mousemove', this.onPointerMove);
    this.container.addEventListener('click', this.onPointerDown);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onPointerMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast against interactive landmark buildings
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && !topGroup.userData?.id && topGroup.parent !== this.scene) {
        topGroup = topGroup.parent;
      }

      if (topGroup.userData?.id) {
        if (this.hoveredObject !== topGroup) {
          this.hoveredObject = topGroup;
          this.container.style.cursor = 'pointer';
          if (this.options.onBuildingHover) {
            this.options.onBuildingHover(topGroup.userData);
          }
        }
        return;
      }
    }

    if (this.hoveredObject) {
      this.hoveredObject = null;
      this.container.style.cursor = 'default';
      if (this.options.onBuildingHover) {
        this.options.onBuildingHover(null);
      }
    }
  }

  onPointerDown(event) {
    // Only register click selection if not dragging orbit controls
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && !topGroup.userData?.id && topGroup.parent !== this.scene) {
        topGroup = topGroup.parent;
      }

      if (topGroup.userData?.id) {
        this.selectedObject = topGroup;
        if (this.options.onBuildingSelect) {
          this.options.onBuildingSelect(topGroup.userData);
        }
      }
    }
  }

  // 10. ANIMATION TICKER
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Update traffic
    this.updateTraffic(delta);

    // Subtle water surface shimmer
    if (this.waterMesh) {
      this.waterMesh.position.y = 0.05 + Math.sin(elapsedTime * 1.5) * 0.02;
    }

    // Camera handling
    if (this.isFreeOrbit) {
      this.controls.update();
    } else {
      // Smooth lerp camera position and lookAt toward GSAP targets
      this.camera.position.lerp(this.cameraPosition, 0.04);
      this.cameraLookAt.lerp(this.targetLookAt, 0.04);
      this.camera.lookAt(this.cameraLookAt);
    }

    // Subtle float animation on hovered building if applicable
    if (this.hoveredObject) {
      this.hoveredObject.position.y = Math.sin(elapsedTime * 4) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    if (this.container) {
      this.container.removeEventListener('mousemove', this.onPointerMove);
      this.container.removeEventListener('click', this.onPointerDown);
      if (this.renderer && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
