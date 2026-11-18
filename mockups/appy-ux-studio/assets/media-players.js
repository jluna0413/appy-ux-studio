// Media Players — Appy-UX Studio
// Video, Audio, and 3D viewers for static HTML pages

(function() {
  'use strict';

  // ── Utility ──
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ── Video Player ──
  function initVideoPlayers() {
    document.querySelectorAll('[data-video-player]').forEach(container => {
      const src = container.dataset.src;
      const poster = container.dataset.poster || '';
      const vertical = container.dataset.vertical === 'true';

      const video = document.createElement('video');
      video.src = src;
      video.poster = poster;
      video.preload = 'metadata';
      if (vertical) container.classList.add('vertical');

      const controls = document.createElement('div');
      controls.className = 'vp-controls';
      controls.innerHTML = `
        <button class="vp-btn vp-play" aria-label="Play/Pause">▶</button>
        <div class="vp-progress" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0"><div class="vp-progress-bar"></div></div>
        <span class="vp-time" aria-live="off">0:00 / 0:00</span>
        <div class="vp-volume" role="slider" aria-label="Volume" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" tabindex="0"><div class="vp-volume-bar"></div></div>
        <button class="vp-btn vp-fullscreen" aria-label="Fullscreen">⛶</button>
      `;

      container.appendChild(video);
      container.appendChild(controls);

      const playBtn = controls.querySelector('.vp-play');
      const progress = controls.querySelector('.vp-progress');
      const progressBar = controls.querySelector('.vp-progress-bar');
      const timeDisplay = controls.querySelector('.vp-time');
      const volumeBar = controls.querySelector('.vp-volume-bar');
      const volumeSlider = controls.querySelector('.vp-volume');
      const fullscreenBtn = controls.querySelector('.vp-fullscreen');

      // Play/pause
      playBtn.addEventListener('click', () => {
        if (video.paused) { video.play(); playBtn.textContent = '⏸'; container.classList.add('playing'); }
        else { video.pause(); playBtn.textContent = '▶'; container.classList.remove('playing'); }
      });

      video.addEventListener('click', () => playBtn.click());

      // Progress
      video.addEventListener('timeupdate', () => {
        if (!video.duration || isNaN(video.duration)) return;
    const pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = pct + '%';
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
      });

      progress.addEventListener('click', (e) => {
        const rect = progress.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        video.currentTime = pct * video.duration;
      });

      // Volume
      volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const vol = (e.clientX - rect.left) / rect.width;
        video.volume = Math.max(0, Math.min(1, vol));
        volumeBar.style.width = (video.volume * 100) + '%';
      });

      // Fullscreen
      fullscreenBtn.addEventListener('click', () => {
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
      });

      // Reset on end
      video.addEventListener('ended', () => {
        playBtn.textContent = '▶';
        container.classList.remove('playing');
        progressBar.style.width = '0%';
      });
    });
  }

  // ── Audio Player ──
  function initAudioPlayers() {
    document.querySelectorAll('[data-audio-player]').forEach(container => {
      const src = container.dataset.src;
      const title = container.dataset.title || 'Untitled Track';
      const artist = container.dataset.artist || '';
      const artwork = container.dataset.artwork || '';

      const audio = new Audio(src);

      // Generate waveform bars
      const barCount = 40;
      const bars = Array.from({length: barCount}, () => Math.random() * 0.6 + 0.2);

      container.innerHTML = `
        <div class="ap-header">
          <div class="ap-artwork">${artwork ? `<img src="${artwork}" alt="">` : '🎵'}</div>
          <div class="ap-info">
            <div class="ap-title"></div>
            <div class="ap-artist"></div>
          </div>
        </div>
        <div class="ap-waveform">${bars.map(h => `<div class="bar" style="height:${h*100}%"></div>`).join('')}</div>
        <div class="ap-progress"><div class="ap-progress-bar"></div></div>
        <div class="ap-controls">
          <button class="ap-btn ap-prev" aria-label="Previous track">⏮</button>
          <button class="ap-btn play" aria-label="Play/Pause">▶</button>
          <button class="ap-btn ap-next" aria-label="Next track">⏭</button>
          <span class="ap-time">0:00 / 0:00</span>
        </div>
      `;
      // Set text content safely (XSS prevention)
      container.querySelector('.ap-title').textContent = title;
      container.querySelector('.ap-artist').textContent = artist;

      const playBtn = container.querySelector('.play');
      const progressBar = container.querySelector('.ap-progress-bar');
      const progress = container.querySelector('.ap-progress');
      const timeDisplay = container.querySelector('.ap-time');
      const waveformBars = container.querySelectorAll('.bar');

      playBtn.addEventListener('click', () => {
        if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
        else { audio.pause(); playBtn.textContent = '▶'; }
      });

      audio.addEventListener('timeupdate', () => {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = pct + '%';
        timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
        // Update waveform
        const activeBar = Math.floor((audio.currentTime / audio.duration) * barCount);
        waveformBars.forEach((bar, i) => {
          bar.classList.toggle('active', i <= activeBar);
        });
      });

      progress.addEventListener('click', (e) => {
        const rect = progress.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
      });

      audio.addEventListener('ended', () => {
        playBtn.textContent = '▶';
        progressBar.style.width = '0%';
        waveformBars.forEach(bar => bar.classList.remove('active'));
      });

      audio.addEventListener('loadedmetadata', () => {
        timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
      });
    });
  }

  // ── 3D Viewer (Three.js) ──
  function init3DViewers() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
      // Load Three.js from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => init3DViewersAfterLoad();
      document.head.appendChild(script);
      return;
    }
    init3DViewersAfterLoad();
  }

  function init3DViewersAfterLoad() {
    // Also load GLTFLoader
    if (!THREE.GLTFLoader) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      script.onload = () => setup3DViewers();
      document.head.appendChild(script);
      return;
    }
    setup3DViewers();
  }

  function setup3DViewers() {
    document.querySelectorAll('[data-3d-viewer]').forEach(container => {
      const src = container.dataset.src;
      const bgColor = container.dataset.bg || '#0a0a0f';

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(bgColor);

      const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 1) / (container.clientHeight || 1), 0.1, 1000);
      camera.position.set(0, 0, 3);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 5, 5);
      scene.add(dirLight);
      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
      dirLight2.position.set(-5, -5, -5);
      scene.add(dirLight2);

      // Controls (simple orbit)
      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };
      let rotation = { x: 0, y: 0 };
      let zoom = 3;

      container.addEventListener('mousedown', (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
      container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        rotation.y += (e.clientX - prevMouse.x) * 0.01;
        rotation.x += (e.clientY - prevMouse.y) * 0.01;
        prevMouse = { x: e.clientX, y: e.clientY };
      });
      container.addEventListener('mouseup', () => isDragging = false);
      container.addEventListener('mouseleave', () => isDragging = false);
      container.addEventListener('wheel', (e) => {
        zoom += e.deltaY * 0.005;
        zoom = Math.max(1, Math.min(10, zoom));
        camera.position.z = zoom;
      });

      // Touch support
      let touchStart = null;
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      });
      container.addEventListener('touchmove', (e) => {
        if (!touchStart || e.touches.length !== 1) return;
        e.preventDefault();
        rotation.y += (e.touches[0].clientX - touchStart.x) * 0.01;
        rotation.x += (e.touches[0].clientY - touchStart.y) * 0.01;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      });
      container.addEventListener('touchend', () => touchStart = null);

      // Load model
      const loadingEl = document.createElement('div');
      loadingEl.className = 'v3d-loading';
      loadingEl.textContent = 'Loading 3D model...';
      container.appendChild(loadingEl);

      const infoEl = document.createElement('div');
      infoEl.className = 'v3d-info';
      infoEl.textContent = 'Drag to rotate • Scroll to zoom';
      container.appendChild(infoEl);

      // Try GLTF/GLB
      if (src.endsWith('.glb') || src.endsWith('.gltf')) {
        const loader = new THREE.GLTFLoader();
        loader.load(src, (gltf) => {
          const model = gltf.scene;
          // Center and scale model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          scene.add(model);
          loadingEl.remove();
        }, undefined, (error) => {
          loadingEl.textContent = 'Failed to load model';
          console.error('3D load error:', error);
        });
      } else {
        // Fallback: create a placeholder cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0099ff, metalness: 0.3, roughness: 0.4 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        loadingEl.remove();
      }

      // Animation loop with IntersectionObserver (pause when off-screen)
      let rafId = null;
      let isVisible = true;
      function animate() {
        if (!isVisible) { rafId = null; return; }
        rafId = requestAnimationFrame(animate);
        scene.rotation.x = rotation.x;
        scene.rotation.y = rotation.y;
        renderer.render(scene, camera);
      }
      animate();

      // Pause rendering when off-screen
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !rafId) animate();
          });
        }, { threshold: 0.1 });
        observer.observe(container);
      }

      // Resize handler (single, removable)
      const resizeHandler = () => {
        if (container.clientWidth === 0 || container.clientHeight === 0) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', resizeHandler);
    });
  }

  // ── Media Grid Enhancement ──
  function initMediaGrids() {
    document.querySelectorAll('.media-card[data-video]').forEach(card => {
      const playBtn = card.querySelector('.mc-play-btn');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const videoSrc = card.dataset.video;
          // Open in lightbox or inline player
          console.log('Play video:', videoSrc);
        });
      }
    });
  }

  // ── Init ──
  function init() {
    initVideoPlayers();
    initAudioPlayers();
    init3DViewers();
    initLightbox();
    initMediaGrids();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual init
  window.AppyUXMedia = { init, initVideoPlayers, initAudioPlayers, init3DViewers, initLightbox };
})();
