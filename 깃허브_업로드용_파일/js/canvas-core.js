/**
 * VENDÔME PARIS — La Cascade Chromatique
 * 3D Undulating Liquid Silk & Chromatic Fluid Ribbon Visualizer
 * Reacts dynamically to scroll velocity, mouse inertia, and section transitions.
 */

(function () {
  'use strict';

  let scene, camera, renderer;
  let ribbonMesh, fluidPlane;
  let container;
  let scrollProgress = 0;
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  function init() {
    container = document.getElementById('liquid-canvas-container');
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
    scene.fog = new THREE.FogExp2(0x070709, 0.0009);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 48);

    // Create Luxury Iridescent Ribbon Geometry
    const ribbonSegmentsX = 140;
    const ribbonSegmentsY = 32;
    const ribbonGeometry = new THREE.PlaneGeometry(80, 24, ribbonSegmentsX, ribbonSegmentsY);

    // Create Chromatic Fluid Gradient Texture
    const gradCanvas = document.createElement('canvas');
    gradCanvas.width = 1024;
    gradCanvas.height = 512;
    const ctx = gradCanvas.getContext('2d');

    // Rich luxury palette: Champagne Gold, Iridescent Pearl Cyan, Royal Violet, Liquid Obsidian
    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
    gradient.addColorStop(0.0, 'rgba(232, 216, 184, 0.9)');  // Champagne Gold
    gradient.addColorStop(0.25, 'rgba(56, 189, 248, 0.85)'); // Pearl Cyan
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.85)');  // Iridescent Violet
    gradient.addColorStop(0.75, 'rgba(244, 114, 182, 0.7)'); // Soft Rose Gold
    gradient.addColorStop(1.0, 'rgba(212, 175, 55, 0.9)');   // Pure Gold
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle luminous diagonal silk threads
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(i * 35, 0, 1.5, 512);
    }

    const texture = new THREE.CanvasTexture(gradCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const ribbonMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.35,
      ior: 1.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.68,
      blending: THREE.NormalBlending
    });

    ribbonMesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbonMesh.rotation.x = -Math.PI * 0.18;
    ribbonMesh.rotation.z = Math.PI * 0.08;
    scene.add(ribbonMesh);

    // Dynamic Lighting for Luxury Shimmer
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe8d8b8, 2.0); // Warm Gold Keylight
    dirLight1.position.set(20, 30, 40);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6); // Cool Cyan Rim
    dirLight2.position.set(-30, -20, 20);
    scene.add(dirLight2);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x070709, 0);

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

    clock += 0.008 + (scrollVelocity * 0.002);
    scrollVelocity *= 0.94; // Decay velocity

    // Mouse inertia lerp
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    if (ribbonMesh) {
      // Wave deconstruction of vertices (Liquid Silk Undulation)
      const pos = ribbonMesh.geometry.attributes.position;
      const count = pos.count;

      for (let i = 0; i < count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);

        // Multi-frequency Harmonic Waves for organic silk draping
        const wave1 = Math.sin(u * 0.08 + clock * 2.2 + scrollProgress * 6.0) * 4.5;
        const wave2 = Math.cos(v * 0.15 + clock * 1.8 + mouseX * 2.0) * 3.2;
        const wave3 = Math.sin((u + v) * 0.05 + clock * 3.0) * 2.0;

        pos.setZ(i, wave1 + wave2 + wave3);
      }
      pos.needsUpdate = true;
      ribbonMesh.geometry.computeVertexNormals();

      // Fluid orientation reacts to scroll & cursor
      ribbonMesh.rotation.y = mouseX * 0.25 + (scrollProgress * Math.PI * 0.6);
      ribbonMesh.rotation.x = -Math.PI * 0.18 + mouseY * 0.2;
      ribbonMesh.position.y = (scrollProgress * 25) - 8;
      ribbonMesh.position.x = mouseX * 4;

      // Camera focal shift
      camera.position.z = 48 + Math.sin(scrollProgress * Math.PI) * 12;
    }

    renderer.render(scene, camera);
  }

  // Graceful 2D Liquid Stream Fallback
  function init2DFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.innerHTML = '';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let t = 0;
    function render2D() {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 4; i++) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, 'rgba(232, 216, 184, 0.15)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.12)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.1)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 30) {
          const y = canvas.height * 0.6 + 
                    Math.sin(x * 0.003 + t + i * 1.2) * 80 + 
                    Math.cos(x * 0.006 - t * 0.8) * 40;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      }

      requestAnimationFrame(render2D);
    }
    render2D();

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
