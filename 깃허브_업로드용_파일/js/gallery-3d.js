/**
 * VENDÔME PARIS — Haute Couture Runway Showcase & Spatial Salon
 * 8-Station Imperial Grand Orbit with 3D Radiant Gold Leaf Dust,
 * Pure Minimalist Photographic Panels, and Camera Crane Finale.
 */

(function () {
  'use strict';

  let scene, camera, renderer;
  let scarfGroup, scarfMesh;
  let coatGroup, bagGroup, jewelryGroup, eyewearGroup, flaconGroup, shoesGroup, trunkGroup;
  let orbitalRings = [];
  let stardustMesh, flakeData = [];
  let softGoldDust;
  let splineCurve, lookSplineCurve;
  let scrollProgress = 0;
  let targetScrollProgress = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let raycaster, mouse;
  let interactiveObjects = [];

  // 360 Turntable & Multi-Angle Runway Camera State
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOrbitX = 0;
  let dragOrbitY = 0;
  let targetDragOrbitX = 0;
  let targetDragOrbitY = 0;

  let currentAnglePreset = 'face';
  let angleOffsetAngleY = 0;
  let targetAngleOffsetY = 0;
  let angleOffsetDistance = 0;
  let targetAngleOffsetDist = 0;

  // 8 Stations along the Widened Grand Runway Spline (Z: 0 to -520) with generous Trunk Dwell Plateau
  const STATIONS = [
    { id: 'scarf', title: "N° 01 — L'ÉCHARPE MAGIQUE", sub: "공기를 가르는 실크의 유동성. 순백의 갤러리 속에 부유하는 에르메스급 실크 카레.", t: 0.00 },
    { id: 'coat', title: "N° 02 — LE MANTEAU RUNWAY", sub: "아이보리 캐시미어와 리퀴드 골드 자수가 빚어내는 런웨이 실루엣.", t: 0.12 },
    { id: 'bag', title: "N° 03 — LE SAC SELLERIE", sub: "수작업 새들 스티치 카프스킨과 24K 골드 하드웨어의 명품 백.", t: 0.24 },
    { id: 'jewelry', title: "N° 04 — LA HAUTE PARURE", sub: "무중력 공간 속에서 부유하는 플래티넘과 콜롬비아산 에메랄드 초커.", t: 0.36 },
    { id: 'eyewear', title: "N° 05 — L'OPTIQUE SOLAIRE", sub: "단조 티타늄과 앰버 그라디언트 렌즈의 조각적 럭셔리 아이웨어.", t: 0.48 },
    { id: 'flacon', title: "N° 06 — LE FLACON D'OR", sub: "순백의 공간 속에 부유하는 크리스탈 퍼퓸 플라콘과 앰버 엑스트레.", t: 0.60 },
    { id: 'shoes', title: "N° 07 — LE SOULIER DE VERRE", sub: "광학 크리스탈 글래스와 리퀴드 크롬으로 조각된 오뜨 꾸뛰르 힐.", t: 0.72 },
    { id: 'trunk', title: "N° 08 — LA MALLE D'OR", sub: "황동 모서리 보강과 화이트 카프스킨으로 완성된 비스포크 주얼리 트렁크.", t: 0.85 }
  ];

  function init() {
    window.__init_steps = [];
    const step = (name) => window.__init_steps.push(name);

    try {
      step('start');
      const canvas = document.getElementById('gallery-3d-canvas');
      if (!canvas) return;

      if (typeof THREE === 'undefined') {
        console.warn('Three.js not found');
        return;
      }

      step('setupScene');
      setupScene(canvas);

      step('createCameraSpline');
      createCameraSpline();

      step('createRadiantGoldDust');
      createRadiantGoldDust();

      step('createFramedScarf');
      createFramedScarf();

      step('createRunwayCoat');
      createRunwayCoat();

      step('createLuxuryBag');
      createLuxuryBag();

      step('createKineticJewelry');
      createKineticJewelry();

      step('createCoutureEyewear');
      createCoutureEyewear();

      step('createPerfumeFlacon');
      createPerfumeFlacon();

      step('createCoutureShoes');
      createCoutureShoes();

      step('createLuxuryTrunk');
      createLuxuryTrunk();

      step('setupRaycaster');
      setupRaycaster();

      step('bindEvents');
      bindEvents();

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('progress')) {
        const p = parseFloat(urlParams.get('progress'));
        window.__pinned_progress = p;
        scrollProgress = targetScrollProgress = p;
        updateActiveStation(p);
      }

      window.__three_scene = scene;
      window.__three_camera = camera;
      window.__three_scarf = scarfGroup;
      window.__three_renderer = renderer;

      step('animate');
      animate();
      step('done');
    } catch (err) {
      window.__init_error = { message: err.message, stack: err.stack, step: window.__init_steps[window.__init_steps.length - 1] };
      console.error('INIT_ERROR at step', window.__init_steps[window.__init_steps.length - 1], err);
    }
  }

  function createStudioEnvMap() {
    const size = 512;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size / 2;
    const ctx = c.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, 0, c.height);
    bg.addColorStop(0, '#fcfbf8');
    bg.addColorStop(0.5, '#eae5d8');
    bg.addColorStop(1, '#cdc7b5');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);

    // Key overhead lightbox
    const sb = ctx.createRadialGradient(size * 0.5, size * 0.1, 5, size * 0.5, size * 0.1, 140);
    sb.addColorStop(0, '#ffffff');
    sb.addColorStop(0.6, '#ffffff');
    sb.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sb;
    ctx.fillRect(0, 0, c.width, c.height);

    // Warm gold side reflector
    const lg = ctx.createLinearGradient(size * 0.1, 0, size * 0.28, 0);
    lg.addColorStop(0, 'rgba(255,220,130,0)');
    lg.addColorStop(0.5, '#ffd269');
    lg.addColorStop(1, 'rgba(255,220,130,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(size * 0.08, 0, size * 0.22, c.height);

    // Crisp white rim reflector
    const rg = ctx.createLinearGradient(size * 0.72, 0, size * 0.9, 0);
    rg.addColorStop(0, 'rgba(255,255,255,0)');
    rg.addColorStop(0.5, '#ffffff');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(size * 0.7, 0, size * 0.22, c.height);

    // Dark contrast absorption stripes
    ctx.fillStyle = '#161514';
    ctx.fillRect(size * 0.35, 0, size * 0.05, c.height);
    ctx.fillRect(size * 0.60, 0, size * 0.05, c.height);

    const texture = new THREE.CanvasTexture(c);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }

  function setupScene(canvas) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfb); // Alabaster Studio White
    scene.fog = new THREE.Fog(0xfcfcfb, 65, 360);
    scene.environment = createStudioEnvMap();

    const aspect = window.innerWidth / window.innerHeight;
    const initialFov = aspect < 1.0 ? 46 + (1.0 - aspect) * 16 : 46;
    camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 1200);

    // Warm, Flattering High-Fashion Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ea, 2.3);
    keyLight.position.set(45, 60, 60);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf2f5fa, 1.6);
    fillLight.position.set(-45, -25, 40);
    scene.add(fillLight);

    const topSun = new THREE.DirectionalLight(0xffe8ba, 1.1);
    topSun.position.set(0, 80, 0);
    scene.add(topSun);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
  }

  function smoothstep5(u) {
    u = Math.max(0, Math.min(1, u));
    return u * u * u * (u * (u * 6 - 15) + 10);
  }

  // Celestial Solar-System Exhibits Constellation: Varied 3D Floating Coordinates
  const CELESTIAL_EXHIBITS = [
    { id: 'scarf',   t: 0.00, pos: [0.0, 0.0, 0.0],       swoopX: 6.0,  swoopY: 1.2,  bank: 1.0 },
    { id: 'coat',    t: 0.12, pos: [-16.0, 3.5, -75.0],   swoopX: -8.0, swoopY: -1.5, bank: -1.0 },
    { id: 'bag',     t: 0.24, pos: [18.0, -1.5, -150.0],  swoopX: 8.0,  swoopY: 2.0,  bank: 1.0 },
    { id: 'jewelry', t: 0.36, pos: [-17.0, 4.0, -225.0],  swoopX: -7.0, swoopY: -1.8, bank: -1.0 },
    { id: 'eyewear', t: 0.48, pos: [16.0, -0.5, -300.0],  swoopX: 7.0,  swoopY: 1.5,  bank: 1.0 },
    { id: 'flacon',  t: 0.60, pos: [-15.0, 2.5, -375.0],  swoopX: -6.0, swoopY: -1.5, bank: -1.0 },
    { id: 'shoes',   t: 0.72, pos: [15.0, -1.8, -450.0],  swoopX: 6.0,  swoopY: 1.5,  bank: 1.0 },
    { id: 'trunk',   t: 0.85, pos: [0.0, 1.2, -525.0],    swoopX: 0.0,  swoopY: 0.0,  bank: 0.0 }
  ];

  function calculateRunwayFrame(progress) {
    const t = Math.max(0, Math.min(1, progress));

    // Solid, Unshakable Dwell on Jewelry Trunk from 0.85 to 0.965
    if (t >= 0.85 && t <= 0.965) {
      const p = CELESTIAL_EXHIBITS[7].pos;
      return {
        camX: p[0], camY: p[1], camZ: p[2] + 26,
        lookX: p[0], lookY: p[1], lookZ: p[2],
        bank: 0
      };
    }

    // Grand Finale High-Altitude Crane Lift from 0.965 to 1.00
    if (t > 0.965) {
      const u = (t - 0.965) / 0.035;
      const s = Math.sin(u * Math.PI * 0.5);
      const p = CELESTIAL_EXHIBITS[7].pos;
      return {
        camX: p[0],
        camY: p[1] + s * 38,
        camZ: p[2] + 26 - s * 55,
        lookX: 0, lookY: 0, lookZ: -525,
        bank: 0
      };
    }

    // Dynamic Swimming & Gliding Transition Between Consecutive Stations
    for (let i = 0; i < CELESTIAL_EXHIBITS.length - 1; i++) {
      const s0 = CELESTIAL_EXHIBITS[i];
      const s1 = CELESTIAL_EXHIBITS[i + 1];
      if (t >= s0.t && t <= s1.t) {
        const u = (t - s0.t) / (s1.t - s0.t);
        const s = smoothstep5(u);

        const p0 = s0.pos;
        const p1 = s1.pos;

        // Base linear glide from camera station 0 to camera station 1
        const c0x = p0[0], c0y = p0[1], c0z = p0[2] + 26;
        const c1x = p1[0], c1y = p1[1], c1z = p1[2] + 26;

        // Swimming swoop arch: sin(pi * u) reaches 1 at midpoint, strictly 0 at stations!
        const swoopArch = Math.sin(Math.PI * u);
        const swoopX = swoopArch * s0.swoopX;
        const swoopY = swoopArch * s0.swoopY;

        // Camera position with dynamic swimming swoop
        const camX = c0x + (c1x - c0x) * s + swoopX;
        const camY = c0y + (c1y - c0y) * s + swoopY;
        const camZ = c0z + (c1z - c0z) * s;

        // Look target smoothly travels from p0 to p1
        const lookX = p0[0] + (p1[0] - p0[0]) * s;
        const lookY = p0[1] + (p1[1] - p0[1]) * s;
        const lookZ = p0[2] + (p1[2] - p0[2]) * s;

        // Subtle zero-gravity banking roll (tilts into the turn, perfectly 0 at stations)
        const bank = swoopArch * s0.bank * 0.035;

        return { camX, camY, camZ, lookX, lookY, lookZ, bank };
      }
    }

    const p0 = CELESTIAL_EXHIBITS[0].pos;
    return {
      camX: p0[0], camY: p0[1], camZ: p0[2] + 26,
      lookX: p0[0], lookY: p0[1], lookZ: p0[2],
      bank: 0
    };
  }

  /* ==========================================================================
     Widened Catwalk Camera Spline (~70-75 units apart per exhibit)
     ========================================================================== */
  function createCameraSpline() {
    // Retained for backwards compatibility if needed
    splineCurve = null;
    lookSplineCurve = null;
  }

  /* ==========================================================================
     Radiant Shimmering 24K Gold Leaf Dust
     ========================================================================== */
  function createRadiantGoldDust() {
    const flakeCount = 380;
    const flakeGeo = new THREE.IcosahedronGeometry(0.24, 0);
    const flakeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5cf68,
      emissive: 0xd4af37,
      emissiveIntensity: 0.65,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.88
    });

    stardustMesh = new THREE.InstancedMesh(flakeGeo, flakeMat, flakeCount);
    const dummy = new THREE.Object3D();
    flakeData = [];

    for (let i = 0; i < flakeCount; i++) {
      const x = (Math.random() - 0.5) * 110;
      const y = (Math.random() - 0.5) * 80;
      const z = -Math.random() * 560;

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(0.7 + Math.random() * 0.9);
      dummy.updateMatrix();
      stardustMesh.setMatrixAt(i, dummy.matrix);

      flakeData.push({
        basePos: new THREE.Vector3(x, y, z),
        rotX: (Math.random() - 0.5) * 0.018,
        rotY: (Math.random() - 0.5) * 0.018,
        floatSpeed: 0.25 + Math.random() * 0.4
      });
    }
    stardustMesh.instanceMatrix.needsUpdate = true;
    scene.add(stardustMesh);

    // Soft blurred circular golden bokeh layer
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 235, 160, 0.95)');
    grad.addColorStop(0.35, 'rgba(212, 175, 55, 0.65)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const goldFlareTex = new THREE.CanvasTexture(canvas);
    const dustCount = 420;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 120;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 90;
      dustPos[i * 3 + 2] = -Math.random() * 570;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 1.5,
      map: goldFlareTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    softGoldDust = new THREE.Points(dustGeo, dustMat);
    scene.add(softGoldDust);
  }

  /* ==========================================================================
     Lord of the Rings 18K High-Jewelry Orbital Ring (Dual-Sided Tengwar Runes)
     ========================================================================== */
  let sharedRingMaterials = null;

  function initSharedRingResources() {
    if (sharedRingMaterials) return sharedRingMaterials;

    function createTengwarCanvas(isOuter = true) {
      const c = document.createElement('canvas');
      c.width = 2048;
      c.height = 256;
      const ctx = c.getContext('2d');

      ctx.fillStyle = isOuter ? '#f3c748' : '#e6a422';
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
      for (let y = 0; y < 256; y += 3) {
        ctx.fillRect(0, y, 2048, 1);
      }
      ctx.fillStyle = 'rgba(180, 130, 20, 0.08)';
      for (let y = 1; y < 256; y += 3) {
        ctx.fillRect(0, y, 2048, 1);
      }

      const phrases = 8;
      const step = c.width / phrases;

      for (let p = 0; p < phrases; p++) {
        const x0 = p * step + 20;
        ctx.save();
        ctx.translate(x0, 128);

        ctx.strokeStyle = isOuter ? '#4a2c00' : '#3d1800';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawTengwarGlyphs(ctx);
        ctx.stroke();

        ctx.strokeStyle = isOuter ? '#ff8500' : '#ff3b00';
        ctx.lineWidth = 10;
        ctx.shadowColor = isOuter ? '#ffaa00' : '#ff4400';
        ctx.shadowBlur = 18;
        drawTengwarGlyphs(ctx);
        ctx.stroke();

        ctx.strokeStyle = '#fffbf0';
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 6;
        drawTengwarGlyphs(ctx);
        ctx.stroke();

        ctx.restore();
      }

      function drawTengwarGlyphs(cx) {
        cx.beginPath();
        cx.moveTo(0, 22);
        cx.bezierCurveTo(10, -30, 25, -50, 45, -18);
        cx.bezierCurveTo(55, 12, 45, 40, 25, 35);
        cx.bezierCurveTo(8, 30, 22, -8, 50, -12);
        cx.lineTo(68, -65);
        cx.bezierCurveTo(78, -75, 92, -60, 85, -38);
        cx.lineTo(70, 42);

        cx.moveTo(60, -72);
        cx.bezierCurveTo(68, -88, 82, -88, 88, -72);

        cx.moveTo(98, 12);
        cx.bezierCurveTo(108, -28, 128, -32, 138, -5);
        cx.bezierCurveTo(142, 22, 128, 42, 108, 38);
        cx.lineTo(108, 68);
        cx.bezierCurveTo(118, 80, 132, 75, 138, 62);

        cx.moveTo(152, 38);
        cx.lineTo(152, -38);
        cx.bezierCurveTo(162, -52, 185, -42, 192, -10);
        cx.bezierCurveTo(195, 20, 178, 40, 158, 38);
        cx.lineTo(202, 38);

        cx.arc(172, -60, 4, 0, Math.PI * 2);
        cx.arc(182, -68, 4, 0, Math.PI * 2);
        cx.arc(192, -60, 4, 0, Math.PI * 2);

        cx.moveTo(215, -32);
        cx.bezierCurveTo(235, -58, 250, -25, 228, 2);
        cx.bezierCurveTo(205, 30, 232, 62, 255, 38);

        cx.moveTo(255, 38);
        cx.bezierCurveTo(265, 32, 270, 18, 280, 15);
      }

      const diffTex = new THREE.CanvasTexture(c);
      diffTex.wrapS = THREE.RepeatWrapping;
      diffTex.wrapT = THREE.ClampToEdgeWrapping;

      const emC = document.createElement('canvas');
      emC.width = 2048;
      emC.height = 256;
      const ectx = emC.getContext('2d');
      ectx.fillStyle = '#000000';
      ectx.fillRect(0, 0, 2048, 256);

      for (let p = 0; p < phrases; p++) {
        const x0 = p * step + 20;
        ectx.save();
        ectx.translate(x0, 128);
        ectx.strokeStyle = isOuter ? '#ff8500' : '#ff3b00';
        ectx.lineWidth = 11;
        ectx.shadowColor = isOuter ? '#ffaa00' : '#ff4400';
        ectx.shadowBlur = 20;
        drawTengwarGlyphs(ectx);
        ectx.stroke();

        ectx.strokeStyle = '#ffffff';
        ectx.lineWidth = 4;
        ectx.shadowBlur = 8;
        drawTengwarGlyphs(ectx);
        ectx.stroke();
        ectx.restore();
      }

      const emTex = new THREE.CanvasTexture(emC);
      emTex.wrapS = THREE.RepeatWrapping;
      emTex.wrapT = THREE.ClampToEdgeWrapping;

      const bumpC = document.createElement('canvas');
      bumpC.width = 2048;
      bumpC.height = 256;
      const bctx = bumpC.getContext('2d');
      bctx.fillStyle = '#808080';
      bctx.fillRect(0, 0, 2048, 256);
      bctx.globalCompositeOperation = 'difference';
      bctx.drawImage(emC, 0, 0);

      const bumpTex = new THREE.CanvasTexture(bumpC);
      bumpTex.wrapS = THREE.RepeatWrapping;
      bumpTex.wrapT = THREE.ClampToEdgeWrapping;

      return { map: diffTex, emissive: emTex, bump: bumpTex };
    }

    const outerData = createTengwarCanvas(true);
    const innerData = createTengwarCanvas(false);

    const outerMat = new THREE.MeshStandardMaterial({
      map: outerData.map,
      bumpMap: outerData.bump,
      bumpScale: 0.04,
      emissive: 0xff8811,
      emissiveMap: outerData.emissive,
      emissiveIntensity: 1.4,
      metalness: 0.95,
      roughness: 0.14,
      side: THREE.FrontSide
    });

    const innerMat = new THREE.MeshStandardMaterial({
      map: innerData.map,
      bumpMap: innerData.bump,
      bumpScale: 0.05,
      emissive: 0xff3800,
      emissiveMap: innerData.emissive,
      emissiveIntensity: 2.2,
      metalness: 0.95,
      roughness: 0.16,
      side: THREE.BackSide
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xf6c84c,
      metalness: 0.98,
      roughness: 0.08
    });

    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5fa,
      metalness: 0.99,
      roughness: 0.05
    });

    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.0,
      ior: 2.42,
      reflectivity: 0.98
    });

    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xffd56b,
      metalness: 0.98,
      roughness: 0.1,
      emissive: 0xffaa22,
      emissiveIntensity: 0.4
    });

    sharedRingMaterials = { outerMat, innerMat, rimMat, bezelMat, diamondMat, haloMat };
    return sharedRingMaterials;
  }

  function createSignatureOrbitalRing(radius = 12.2, width = 0.52, tiltX = 0.38, tiltZ = 0.12) {
    const mats = initSharedRingResources();
    const ringGroup = new THREE.Group();
    const wallThick = 0.08;

    // 1. Outer Band (Tengwar Runes outside)
    const outerGeo = new THREE.CylinderGeometry(radius + wallThick, radius + wallThick, width, 140, 4, true);
    const outerMesh = new THREE.Mesh(outerGeo, mats.outerMat);
    outerMesh.userData = { id: 'bangle' };
    ringGroup.add(outerMesh);
    interactiveObjects.push(outerMesh);

    // 2. Inner Band (Fiery Tengwar Runes inside)
    const innerGeo = new THREE.CylinderGeometry(radius, radius, width * 0.98, 140, 4, true);
    const innerMesh = new THREE.Mesh(innerGeo, mats.innerMat);
    innerMesh.userData = { id: 'bangle' };
    ringGroup.add(innerMesh);

    // 3. Delicate Upper & Lower Beveled Rims
    const rimGeo = new THREE.TorusGeometry(radius + wallThick * 0.5, wallThick * 0.45, 16, 128);
    const topRim = new THREE.Mesh(rimGeo, mats.rimMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = width * 0.5;
    ringGroup.add(topRim);

    const bottomRim = new THREE.Mesh(rimGeo, mats.rimMat);
    bottomRim.rotation.x = Math.PI / 2;
    bottomRim.position.y = -width * 0.5;
    ringGroup.add(bottomRim);

    // 4. 4 Cardinal Diamond Solitaires
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const markerGroup = new THREE.Group();

      const bezelGeo = new THREE.BoxGeometry(0.18, width * 0.55, 0.12);
      const bezel = new THREE.Mesh(bezelGeo, mats.bezelMat);
      markerGroup.add(bezel);

      const diaGeo = new THREE.BoxGeometry(0.12, width * 0.42, 0.08);
      const dia = new THREE.Mesh(diaGeo, mats.diamondMat);
      dia.position.z = 0.03;
      markerGroup.add(dia);

      const r = radius + wallThick + 0.04;
      markerGroup.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      markerGroup.rotation.y = -angle + Math.PI / 2;
      ringGroup.add(markerGroup);
    }

    // 5. Celestial Counter-Orbiting Fine Gold Filament Halo
    const haloGeo = new THREE.TorusGeometry(radius * 1.07, 0.022, 12, 128);
    const haloMesh = new THREE.Mesh(haloGeo, mats.haloMat);
    haloMesh.rotation.x = Math.PI * 0.15;
    haloMesh.rotation.z = Math.PI * 0.22;
    ringGroup.add(haloMesh);

    ringGroup.userData = {
      id: 'bangle',
      baseTiltX: tiltX,
      baseTiltZ: tiltZ,
      secondaryHalo: haloMesh,
      radius: radius
    };

    ringGroup.rotation.x = tiltX;
    ringGroup.rotation.z = tiltZ;

    orbitalRings.push(ringGroup);
    return ringGroup;
  }

  /* ==========================================================================
     Masterpiece Exhibits with 18K Orbital Ring Enclosure
     ========================================================================== */

  // 1. Station 0: Framed Silk Scarf Panel (Z: 0)
  function createFramedScarf() {
    scarfGroup = new THREE.Group();
    scarfGroup.position.set(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const scarfTexture = textureLoader.load('assets/images/silk-scarf-pattern.jpg', () => {
      if (renderer && scene && camera) renderer.render(scene, camera);
    });

    const panelGeo = new THREE.PlaneGeometry(15, 15);
    const panelMat = new THREE.MeshStandardMaterial({
      map: scarfTexture,
      roughness: 0.25,
      metalness: 0.08,
      side: THREE.DoubleSide
    });

    scarfMesh = new THREE.Mesh(panelGeo, panelMat);
    scarfMesh.frustumCulled = false;
    scarfGroup.add(scarfMesh);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(12.2, 0.52, 0.38, 0.12);
    scarfGroup.add(orbitalRing);

    scarfGroup.userData = { id: 'scarf' };
    scarfMesh.userData = { id: 'scarf' };
    scene.add(scarfGroup);
    interactiveObjects.push(scarfMesh);
  }

  // 2. Station 1: Runway Sculptural Coat (Z: -75) - Floating Up-Left in Celestial Space
  function createRunwayCoat() {
    coatGroup = new THREE.Group();
    coatGroup.position.set(-16.0, 3.5, -75.0);

    const texLoader = new THREE.TextureLoader();
    const coatTex = texLoader.load('assets/images/runway-coat-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(13.5, 18);
    const panelMat = new THREE.MeshStandardMaterial({
      map: coatTex,
      roughness: 0.25,
      metalness: 0.08,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    coatGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(13.2, 0.52, 0.42, -0.15);
    coatGroup.add(orbitalRing);

    coatGroup.userData = { id: 'coat' };
    scene.add(coatGroup);
    interactiveObjects.push(panel);
  }

  // 3. Station 2: Luxury Handbag (Z: -150) - Floating Down-Right in Celestial Space
  function createLuxuryBag() {
    bagGroup = new THREE.Group();
    bagGroup.position.set(18.0, -1.5, -150.0);

    const texLoader = new THREE.TextureLoader();
    const bagTex = texLoader.load('assets/images/luxury-handbag-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(15, 15);
    const panelMat = new THREE.MeshStandardMaterial({
      map: bagTex,
      roughness: 0.2,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    bagGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(12.2, 0.52, 0.35, 0.18);
    bagGroup.add(orbitalRing);

    bagGroup.userData = { id: 'bag' };
    scene.add(bagGroup);
    interactiveObjects.push(panel);
  }

  // 4. Station 3: Kinetic Platinum Choker (Z: -225) - Floating Up-Left in Celestial Space
  function createKineticJewelry() {
    jewelryGroup = new THREE.Group();
    jewelryGroup.position.set(-17.0, 4.0, -225.0);

    const texLoader = new THREE.TextureLoader();
    const chokerTex = texLoader.load('assets/images/choker-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(16, 12);
    const panelMat = new THREE.MeshStandardMaterial({
      map: chokerTex,
      roughness: 0.15,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    jewelryGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(12.5, 0.52, 0.40, -0.12);
    jewelryGroup.add(orbitalRing);

    jewelryGroup.userData = { id: 'jewelry' };
    scene.add(jewelryGroup);
    interactiveObjects.push(panel);
  }

  // 5. Station 4: Architectural Eyewear (Z: -300) - Floating Right in Celestial Space
  function createCoutureEyewear() {
    eyewearGroup = new THREE.Group();
    eyewearGroup.position.set(16.0, -0.5, -300.0);

    const texLoader = new THREE.TextureLoader();
    const eyeTex = texLoader.load('assets/images/couture-eyewear-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(16, 11);
    const panelMat = new THREE.MeshStandardMaterial({
      map: eyeTex,
      roughness: 0.15,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    eyewearGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(12.0, 0.52, 0.32, 0.16);
    eyewearGroup.add(orbitalRing);

    eyewearGroup.userData = { id: 'eyewear' };
    scene.add(eyewearGroup);
    interactiveObjects.push(panel);
  }

  // 6. Station 5: Sculptural Perfume Flacon (Z: -375) - Floating Elevated Left
  function createPerfumeFlacon() {
    flaconGroup = new THREE.Group();
    flaconGroup.position.set(-15.0, 2.5, -375.0);

    const texLoader = new THREE.TextureLoader();
    const flaconTex = texLoader.load('assets/images/perfume-flacon-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(14, 17.5);
    const panelMat = new THREE.MeshStandardMaterial({
      map: flaconTex,
      roughness: 0.15,
      metalness: 0.12,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    flaconGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(13.0, 0.52, 0.45, -0.18);
    flaconGroup.add(orbitalRing);

    flaconGroup.userData = { id: 'flacon' };
    scene.add(flaconGroup);
    interactiveObjects.push(panel);
  }

  // 7. Station 6: Architectural Crystal Shoes (Z: -450) - Floating Low-Right
  function createCoutureShoes() {
    shoesGroup = new THREE.Group();
    shoesGroup.position.set(15.0, -1.8, -450.0);

    const texLoader = new THREE.TextureLoader();
    const shoesTex = texLoader.load('assets/images/couture-shoes-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(16, 12);
    const panelMat = new THREE.MeshStandardMaterial({
      map: shoesTex,
      roughness: 0.15,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    shoesGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(12.2, 0.52, 0.36, 0.14);
    shoesGroup.add(orbitalRing);

    shoesGroup.userData = { id: 'shoes' };
    scene.add(shoesGroup);
    interactiveObjects.push(panel);
  }

  // 8. Station 7: Bespoke Luxury Trunk (Z: -525) - Grand Centerpiece Climax
  function createLuxuryTrunk() {
    trunkGroup = new THREE.Group();
    trunkGroup.position.set(0.0, 1.2, -525.0);

    const texLoader = new THREE.TextureLoader();
    const trunkTex = texLoader.load('assets/images/luxury-trunk-white.jpg');
    const panelGeo = new THREE.PlaneGeometry(16, 12.5);
    const panelMat = new THREE.MeshStandardMaterial({
      map: trunkTex,
      roughness: 0.2,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    trunkGroup.add(panel);

    // 18K Lord of the Rings Orbital Ring Enclosure
    const orbitalRing = createSignatureOrbitalRing(12.8, 0.52, 0.38, -0.15);
    trunkGroup.add(orbitalRing);

    trunkGroup.userData = { id: 'trunk' };
    scene.add(trunkGroup);
    interactiveObjects.push(panel);
  }

  /* ==========================================================================
     Raycaster & Interaction
     ========================================================================== */
  function setupRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    window.addEventListener('click', onCanvasClick);
  }

  function onCanvasClick(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let hitObj = intersects[0].object;
      while (hitObj && !hitObj.userData.id && hitObj.parent) {
        hitObj = hitObj.parent;
      }
      if (hitObj && hitObj.userData.id) {
        window.dispatchEvent(new CustomEvent('openCurtain', { detail: { id: hitObj.userData.id } }));
      }
    }
  }

  /* ==========================================================================
     Events & Bindings
     ========================================================================== */
  function bindEvents() {
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
  }

  function onPointerDown(e) {
    if (e.target.closest('#curtain-drawer, .story-card, .salon-header, .royal-finale-container, .booking-dialog, .silk-atelier-dialog')) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  }

  function onPointerUp() {
    isDragging = false;
  }

  function onTouchStart(e) {
    if (e.target.closest('#curtain-drawer, .story-card, .salon-header, .royal-finale-container, .booking-dialog, .silk-atelier-dialog')) return;
    if (e.touches.length === 1) {
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      isDragging = true;
    }
  }

  function onTouchMove(e) {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStartX;
      const deltaY = e.touches[0].clientY - dragStartY;
      targetDragOrbitX += deltaX * 0.005;
      targetDragOrbitY += deltaY * 0.002;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
    }
  }

  function onResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      if (camera.aspect < 1.0) {
        camera.fov = 46 + (1.0 - camera.aspect) * 16;
      } else {
        camera.fov = 46;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      targetDragOrbitX += deltaX * 0.005;
      targetDragOrbitY += deltaY * 0.005;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }
  }

  function onScroll() {
    if (window.__pinned_progress !== undefined) {
      targetScrollProgress = scrollProgress = window.__pinned_progress;
      return;
    }
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      targetScrollProgress = window.scrollY / totalHeight;
    }
  }

  /* ==========================================================================
     Render Loop: Smooth Runway Promenade & High Crane Bird's Eye Finale
     ========================================================================== */
  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);

    clock += 0.016;

    // Smooth inertia
    if (window.__pinned_progress !== undefined) {
      scrollProgress = targetScrollProgress = window.__pinned_progress;
    } else {
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
    }
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Finale Damping
    const finaleDamping = scrollProgress > 0.91 ? Math.max(0, 1 - (scrollProgress - 0.91) * 10) : 1;
    dragOrbitX += (targetDragOrbitX * finaleDamping - dragOrbitX) * 0.08;
    dragOrbitY += (targetDragOrbitY * finaleDamping - dragOrbitY) * 0.08;

    angleOffsetAngleY += (targetAngleOffsetY - angleOffsetAngleY) * 0.08;
    angleOffsetDistance += (targetAngleOffsetDist - angleOffsetDistance) * 0.08;

    // Radiant 3D Gold Stardust Tumble & Shimmer
    if (stardustMesh && flakeData.length) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < flakeData.length; i++) {
        const fd = flakeData[i];
        dummy.position.x = fd.basePos.x + Math.sin(clock * fd.floatSpeed + i) * 0.45;
        dummy.position.y = fd.basePos.y + Math.cos(clock * fd.floatSpeed + i * 0.5) * 0.45;
        dummy.position.z = fd.basePos.z;
        dummy.rotation.x = clock * fd.rotX * 22;
        dummy.rotation.y = clock * fd.rotY * 22;
        dummy.scale.setScalar(0.75);
        dummy.updateMatrix();
        stardustMesh.setMatrixAt(i, dummy.matrix);
      }
      stardustMesh.instanceMatrix.needsUpdate = true;
    }

    if (softGoldDust) {
      softGoldDust.rotation.y = clock * 0.012;
    }

    // Runway Catwalk Model Walking Rotation
    const runwayTurn = Math.sin(scrollProgress * Math.PI * 7) * 0.2 * finaleDamping;

    if (scarfGroup) {
      scarfGroup.rotation.y = Math.sin(clock * 0.8) * 0.08 + dragOrbitX + angleOffsetAngleY;
      scarfGroup.position.y = Math.sin(clock * 0.9) * 0.35;
    }
    if (coatGroup) {
      coatGroup.rotation.y = Math.sin(clock * 0.75 + 1) * 0.08 + dragOrbitX + angleOffsetAngleY;
      coatGroup.position.y = 3.5 + Math.sin(clock * 0.8) * 0.35;
    }
    if (bagGroup) {
      bagGroup.rotation.y = Math.sin(clock * 0.7 + 2) * 0.08 + dragOrbitX + angleOffsetAngleY;
      bagGroup.position.y = -1.5 + Math.cos(clock * 0.9) * 0.35;
    }
    if (jewelryGroup) {
      jewelryGroup.rotation.y = Math.sin(clock * 0.8 + 3) * 0.08 + dragOrbitX + angleOffsetAngleY;
      jewelryGroup.position.y = 4.0 + Math.sin(clock * 0.85) * 0.35;
    }
    if (eyewearGroup) {
      eyewearGroup.rotation.y = Math.sin(clock * 0.75 + 4) * 0.08 + dragOrbitX + angleOffsetAngleY;
      eyewearGroup.position.y = -0.5 + Math.cos(clock * 0.8) * 0.35;
    }
    if (flaconGroup) {
      flaconGroup.rotation.y = Math.sin(clock * 0.7 + 5) * 0.08 + dragOrbitX + angleOffsetAngleY;
      flaconGroup.position.y = 2.5 + Math.sin(clock * 0.75) * 0.35;
    }
    if (shoesGroup) {
      shoesGroup.rotation.y = Math.sin(clock * 0.8 + 6) * 0.08 + dragOrbitX + angleOffsetAngleY;
      shoesGroup.position.y = -1.8 + Math.sin(clock * 0.7) * 0.35;
    }
    if (trunkGroup) {
      trunkGroup.rotation.y = Math.sin(clock * 0.65 + 7) * 0.08 + dragOrbitX + angleOffsetAngleY;
      trunkGroup.position.y = 1.2 + Math.sin(clock * 0.6) * 0.35;
    }

    // 18K High-Jewelry Lord of the Rings Orbital Precession & Shimmer
    for (let i = 0; i < orbitalRings.length; i++) {
      const rg = orbitalRings[i];
      rg.rotation.y = clock * (0.22 + (i % 3) * 0.02) + i * 0.78;
      rg.rotation.x = rg.userData.baseTiltX + Math.sin(clock * 0.6 + i) * 0.04;
      rg.rotation.z = rg.userData.baseTiltZ + Math.cos(clock * 0.45 + i) * 0.04;

      if (rg.userData.secondaryHalo) {
        rg.userData.secondaryHalo.rotation.y = -clock * 0.18 - i * 0.35;
        rg.userData.secondaryHalo.rotation.x = Math.sin(clock * 0.5 + i) * 0.10;
      }
    }

    // Camera Progression: Organic Swimming Gliding between Stations & Perfect Dead-Center Arrival
    const frame = calculateRunwayFrame(scrollProgress);
    camera.position.x = frame.camX + mouseX * 1.5;
    camera.position.y = frame.camY - mouseY * 1.2;
    camera.position.z = frame.camZ + angleOffsetDistance;
    camera.lookAt(frame.lookX, frame.lookY, frame.lookZ);
    if (frame.bank) {
      camera.rotateZ(frame.bank);
    }

    updateActiveStation(scrollProgress);
    document.title = `P=${scrollProgress.toFixed(2)} Cam=(${camera.position.x.toFixed(1)},${camera.position.y.toFixed(1)},${camera.position.z.toFixed(1)})`;
    renderer.render(scene, camera);
  }

  let currentStationIndex = -1;
  function updateActiveStation(progress) {
    let nearestIndex = 0;
    let minDiff = 999;

    STATIONS.forEach((s, idx) => {
      const diff = Math.abs(progress - s.t);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = idx;
      }
    });

    if (nearestIndex !== currentStationIndex) {
      currentStationIndex = nearestIndex;
      window.dispatchEvent(new CustomEvent('stationChanged', {
        detail: STATIONS[currentStationIndex]
      }));
    }

    // Royal Finale Trigger at End of Scroll (Trunk plateau extends from ~0.78 to 0.96)
    const isAtFinale = progress >= 0.965;
    window.dispatchEvent(new CustomEvent('royalFinale', {
      detail: { active: isAtFinale }
    }));
  }

  // Export
  window.MaisonGallery3D = {
    init: init,
    getCurrentStation: function () {
      return STATIONS[currentStationIndex >= 0 ? currentStationIndex : 0];
    },
    jumpToProgress: function (p) {
      scrollProgress = targetScrollProgress = p;
      updateActiveStation(p);
    },
    goToStation: function (idx) {
      const targetT = STATIONS[idx].t;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: targetT * totalHeight,
        behavior: 'smooth'
      });
    },
    setRunwayAngle: function (preset) {
      currentAnglePreset = preset;
      if (preset === 'face') {
        targetAngleOffsetY = 0;
        targetAngleOffsetDist = 0;
      } else if (preset === 'walk') {
        targetAngleOffsetY = Math.PI * 0.28;
        targetAngleOffsetDist = -2;
      } else if (preset === 'back') {
        targetAngleOffsetY = Math.PI * 0.95;
        targetAngleOffsetDist = 0;
      } else if (preset === 'macro') {
        targetAngleOffsetY = 0;
        targetAngleOffsetDist = -6;
      }
    },
    setColorway: function (hexColor) {
      if (scarfMesh && scarfMesh.material) {
        scarfMesh.material.color.set(hexColor);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
