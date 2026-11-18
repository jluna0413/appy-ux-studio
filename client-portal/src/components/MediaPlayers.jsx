// Media Players — React Components for Appy-UX Studio
// Video, Audio, and 3D viewers for React apps

import { useState, useRef, useEffect, useCallback } from 'react';

// ── Video Player ──
export function VideoPlayer({ src, poster, vertical = false, title }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showControls, setShowControls] = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  const handleVolume = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const vol = (e.clientX - rect.left) / rect.width;
    v.volume = Math.max(0, Math.min(1, vol));
    setVolume(v.volume);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'relative',
        background: '#000',
        borderRadius: 12,
        overflow: 'hidden',
        aspectRatio: vertical ? '9/16' : '16/9',
        maxWidth: vertical ? 320 : '100%',
        margin: vertical ? '0 auto' : undefined,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
      {(showControls || !playing) && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18, padding: 4 }}>
            {playing ? '⏸' : '▶'}
          </button>
          <div onClick={handleSeek} style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, cursor: 'pointer', position: 'relative' }}>
            <div style={{ height: '100%', background: '#0071e3', borderRadius: 2, width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'monospace', minWidth: 80, textAlign: 'center' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <div onClick={handleVolume} style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, cursor: 'pointer' }}>
            <div style={{ height: '100%', background: '#fff', borderRadius: 2, width: `${volume * 100}%` }} />
          </div>
        </div>
      )}
      {!playing && (
        <div onClick={togglePlay} style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', cursor: 'pointer',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,113,227,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff',
          }}>▶</div>
        </div>
      )}
    </div>
  );
}

// ── Audio Player ──
export function AudioPlayer({ src, title, artist, artwork }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const barCount = 40;
  const [bars] = useState(() => Array.from({ length: barCount }, () => Math.random() * 0.6 + 0.2));

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnd);
    };
  }, []);

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * a.duration;
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const activeBar = duration ? Math.floor((currentTime / duration) * barCount) : -1;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, padding: 20,
    }}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 8, background: '#0a0a0f',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0, overflow: 'hidden',
        }}>
          {artwork ? <img src={artwork} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🎵'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          <div style={{ fontSize: 13, color: '#a1a1a6', marginTop: 2 }}>{artist}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 32, marginBottom: 12 }}>
        {bars.map((h, i) => (
          <div key={i} style={{
            width: 3, height: `${h * 100}%`, borderRadius: 1,
            background: i <= activeBar ? '#0071e3' : 'rgba(255,255,255,0.15)',
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <div onClick={handleSeek} style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, cursor: 'pointer', marginBottom: 8 }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #0071e3, #30d158)', borderRadius: 2, width: `${duration ? (currentTime / duration) * 100 : 0}%`, transition: 'width 0.1s' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={togglePlay} style={{
          width: 40, height: 40, borderRadius: '50%', border: 'none',
          background: '#0071e3', color: '#fff', fontSize: 16, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {playing ? '⏸' : '▶'}
        </button>
        <span style={{ fontSize: 12, color: '#a1a1a6', fontFamily: 'monospace', marginLeft: 'auto' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

// ── 3D Viewer ──
export function Viewer3D({ src, bgColor = '#0a0a0f', height = 400 }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let scene, camera, renderer, model;
    let animationId;
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };
    let zoom = 3;

    const container = containerRef.current;
    if (!container) return;

    // Load Three.js if not available
    const initThree = () => {
      if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
          const gltfScript = document.createElement('script');
          gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
          gltfScript.onload = setupScene;
          document.head.appendChild(gltfScript);
        };
        document.head.appendChild(script);
      } else {
        setupScene();
      }
    };

    const setupScene = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(bgColor);

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.set(0, 0, zoom);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
      dir1.position.set(5, 5, 5);
      scene.add(dir1);
      const dir2 = new THREE.DirectionalLight(0xffffff, 0.3);
      dir2.position.set(-5, -5, -5);
      scene.add(dir2);

      // Mouse controls
      const onMouseDown = (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        rotation.y += (e.clientX - prevMouse.x) * 0.01;
        rotation.x += (e.clientY - prevMouse.y) * 0.01;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => isDragging = false;
      const onWheel = (e) => {
        zoom += e.deltaY * 0.005;
        zoom = Math.max(1, Math.min(10, zoom));
        camera.position.z = zoom;
      };

      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseup', onMouseUp);
      container.addEventListener('mouseleave', onMouseUp);
      container.addEventListener('wheel', onWheel);

      // Load model
      if (src && (src.endsWith('.glb') || src.endsWith('.gltf'))) {
        const loader = new THREE.GLTFLoader();
        loader.load(src, (gltf) => {
          model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          scene.add(model);
          setLoading(false);
        }, undefined, (err) => {
          setError('Failed to load model');
          setLoading(false);
        });
      } else {
        // Placeholder cube
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshStandardMaterial({ color: 0x0071e3, metalness: 0.3, roughness: 0.4 });
        model = new THREE.Mesh(geo, mat);
        scene.add(model);
        setLoading(false);
      }

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        if (model) {
          scene.rotation.x = rotation.x;
          scene.rotation.y = rotation.y;
        }
        renderer.render(scene, camera);
      };
      animate();

      // Resize
      const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', onResize);

      // Cleanup
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', onResize);
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('mouseleave', onMouseUp);
        container.removeEventListener('wheel', onWheel);
        if (renderer) renderer.dispose();
        if (container.contains(renderer?.domElement)) container.removeChild(renderer.domElement);
      };
    };

    initThree();

    return () => {
      // Cleanup handled in setupScene
    };
  }, [src, bgColor]);

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height, background: bgColor }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1a6', fontSize: 14 }}>
          Loading 3D model...
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b6b', fontSize: 14 }}>
          {error}
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: 20, fontSize: 11, color: '#a1a1a6', display: 'flex', gap: 8 }}>
        <span>Drag to rotate</span>
        <span>•</span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}

// ── Media Card ──
export function MediaCard({ title, meta, thumbnail, type, onClick }) {
  const icons = { video: '🎬', audio: '🎵', '3d': '🧊', image: '🖼️' };
  return (
    <div onClick={onClick} style={{
      background: '#12121a', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ aspectRatio: '16/9', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {thumbnail ? <img src={thumbnail} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>{icons[type] || '📦'}</span>}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,113,227,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' }}>
            {type === 'image' ? '🔍' : '▶'}
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#a1a1a6' }}>{meta}</div>
      </div>
    </div>
  );
}

export default { VideoPlayer, AudioPlayer, Viewer3D, MediaCard };
