/**
 * BIO MEETS MOTION ART — 3D Bioluminescent Fluid & Organic Silk Canvas
 * Three.js WebGL visualizer simulating organic molecular flow & kinetic motion art.
 */

(function () {
  'use strict';

  let scene, camera, renderer;
  let ribbonMesh, strandMesh;
  let container;
  let scrollProgress = 0;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  function init() {
    container = document.getElementById('bio-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      init2DFallback();
      return;
    }

    try {
      setupThreeWebGL();
      bindEvents();
      animate();
    } catch (e) {
      console.warn('Three.js initialization failed, switching to 2D fallback', e);
      init2DFallback();
    }
  }

  function setupThreeWebGL() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060709, 0.0009);

    camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 46);

    // 1. Organic Undulating Bio-Ribbon
    const segmentsX = 140;
    const segmentsY = 32;
    const geometry = new THREE.PlaneGeometry(85, 26, segmentsX, segmentsY);

    // Bioluminescent Canvas Texture (Neon Cyan, GFP Green, Electric Violet)
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0.0, 'rgba(0, 229, 255, 0.85)');   // Neon Cyan (Synaptic)
    grad.addColorStop(0.35, 'rgba(0, 255, 135, 0.85)');  // Bioluminescent GFP Green
    grad.addColorStop(0.7, 'rgba(168, 85, 247, 0.8)');   // Bio-RNA Violet
    grad.addColorStop(1.0, 'rgba(56, 189, 248, 0.9)');   // Ocean Deep Cyan
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle microscopic cell membrane striations
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let i = 0; i < 35; i++) {
      ctx.fillRect(i * 30, 0, 1.5, 512);
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.35,
      ior: 1.45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending
    });

    ribbonMesh = new THREE.Mesh(geometry, material);
    ribbonMesh.rotation.x = -Math.PI * 0.18;
    ribbonMesh.rotation.z = Math.PI * 0.06;
    scene.add(ribbonMesh);

    // 2. Bioluminescent Particle Strands (DNA / Molecular Nodes)
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 8;
      pPos[i * 3] = (i - particleCount / 2) * 0.32;
      pPos[i * 3 + 1] = Math.sin(t) * 7;
      pPos[i * 3 + 2] = Math.cos(t) * 7;

      // Color alternating between green and cyan
      if (i % 2 === 0) {
        pColors[i * 3] = 0.0;
        pColors[i * 3 + 1] = 1.0;
        pColors[i * 3 + 2] = 0.53; // #00ff87
      } else {
        pColors[i * 3] = 0.0;
        pColors[i * 3 + 1] = 0.9;
        pColors[i * 3 + 2] = 1.0;  // #00e5ff
      }
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    strandMesh = new THREE.Points(pGeo, pMat);
    strandMesh.position.y = -6;
    scene.add(strandMesh);

    // 3. Dynamic Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0x00e5ff, 2.2);
    keyLight.position.set(25, 30, 40);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00ff87, 1.8);
    rimLight.position.set(-30, -20, 20);
    scene.add(rimLight);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x060709, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
  }

  function bindEvents() {
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function onResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  function onMouseMove(e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onScroll() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentY = window.scrollY;
    if (totalHeight > 0) {
      scrollProgress = currentY / totalHeight;
    }
    scrollVelocity = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;
  }

  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);

    clock += 0.009 + (scrollVelocity * 0.002);
    scrollVelocity *= 0.94;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    if (ribbonMesh) {
      const pos = ribbonMesh.geometry.attributes.position;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);

        // Multi-frequency wave physics
        const wave1 = Math.sin(u * 0.08 + clock * 2.2 + scrollProgress * 5.0) * 4.2;
        const wave2 = Math.cos(v * 0.16 + clock * 1.8 + mouseX * 2.0) * 3.0;
        const wave3 = Math.sin((u + v) * 0.05 + clock * 2.8) * 1.8;

        pos.setZ(i, wave1 + wave2 + wave3);
      }
      pos.needsUpdate = true;
      ribbonMesh.geometry.computeVertexNormals();

      ribbonMesh.rotation.y = mouseX * 0.2 + (scrollProgress * Math.PI * 0.5);
      ribbonMesh.rotation.x = -Math.PI * 0.18 + mouseY * 0.15;
      ribbonMesh.position.y = (scrollProgress * 22) - 6;
      ribbonMesh.position.x = mouseX * 3.5;
    }

    if (strandMesh) {
      strandMesh.rotation.x = clock * 0.8;
      strandMesh.rotation.z = mouseX * 0.3;
    }

    renderer.render(scene, camera);
  }

  // Graceful 2D Fallback
  function init2DFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.innerHTML = '';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let t = 0;
    function loop() {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 3; i++) {
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
        g.addColorStop(0.5, 'rgba(0, 255, 135, 0.12)');
        g.addColorStop(1, 'rgba(168, 85, 247, 0.1)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 40) {
          const y = canvas.height * 0.55 + 
                    Math.sin(x * 0.003 + t + i * 1.2) * 70 + 
                    Math.cos(x * 0.006 - t * 0.8) * 35;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
