import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { SceneMode } from './content';

const mint = 0xb8f7ce, teal = 0x73c5b9, blue = 0xa0bced, amber = 0xf3be88;
export interface SceneController { setMode(mode: SceneMode): void; setPaused(value: boolean): void; reset(): void; dispose(): void }
export async function createScene(host: HTMLElement): Promise<SceneController> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x090e12, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
  camera.position.set(6.3, 11.5, 13.2);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xe0f2ed, 1.8));
  const key = new THREE.DirectionalLight(0xd8fff0, 4); key.position.set(-5, 10, 4); scene.add(key);
  const rim = new THREE.PointLight(0x8abfff, 100, 30); rim.position.set(6, 4, -5); scene.add(rim);
  const fill = new THREE.PointLight(0xb1ffcb, 70, 30); fill.position.set(-6, 1, 5); scene.add(fill);
  const world = new THREE.Group(); scene.add(world);
  const groups = Object.fromEntries((['grid', 'lake', 'signals', 'clusters'] as SceneMode[]).map(m => {
    const group = new THREE.Group(); world.add(group); return [m, group];
  })) as Record<SceneMode, THREE.Group>;
  const metal = new THREE.MeshStandardMaterial({ color: 0x334d4e, roughness: 0.34, metalness: 0.72 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111f24, roughness: 0.5, metalness: 0.6 });
  const lightLine = new THREE.LineBasicMaterial({ color: mint, transparent: true, opacity: 0.38 });
  const bright = (color: number) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6, roughness: 0.25, metalness: 0.4 });
  function edge(geometry: THREE.BufferGeometry, target: THREE.Object3D, color = mint, opacity = 0.35) {
    target.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 25), new THREE.LineBasicMaterial({ color, transparent: true, opacity })));
  }
  function ring(radius: number, y: number, target: THREE.Object3D, color = teal, opacity = 0.3) {
    const mesh = new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.012, 120), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity }));
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; target.add(mesh); return mesh;
  }
  const grid = groups.grid;
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(5.7, 5.85, 0.24, 100), dark);
  plinth.position.y = -0.48; grid.add(plinth); edge(plinth.geometry, plinth, teal, 0.22);
  [4.95, 5.4, 5.95, 6.2].forEach(r => ring(r, -0.33, grid));
  const gridLines = new THREE.GridHelper(7.8, 20, 0x35584e, 0x203632); gridLines.position.y = -0.345; grid.add(gridLines);
  const geoResponse = await fetch(`${import.meta.env.BASE_URL}philippines.geo.json`);
  if (!geoResponse.ok) { renderer.dispose(); renderer.domElement.remove(); throw new Error('Map geometry unavailable'); }
  const geo = await geoResponse.json();
  const xy = (lon: number, lat: number) => new THREE.Vector3((lon - 122.4) * 0.78, 0, -(lat - 12.5) * 0.78);
  for (const polygon of geo.features[0].geometry.coordinates as number[][][][]) {
    const outline = polygon[0];
    const shape = new THREE.Shape(outline.map(([lon, lat]) => new THREE.Vector2((lon - 122.4) * 0.78, (lat - 12.5) * 0.78)));
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 2, steps: 1 });
    geometry.rotateX(-Math.PI / 2);
    const island = new THREE.Mesh(geometry, metal); grid.add(island); edge(geometry, island, mint, 0.58);
  }
  const hubs = [
    { name: 'Luzon', lon: 121.0, lat: 16.1, color: mint },
    { name: 'Visayas', lon: 123.7, lat: 10.7, color: amber },
    { name: 'Mindanao', lon: 124.8, lat: 7.8, color: blue },
  ];
  const paths: THREE.QuadraticBezierCurve3[] = [];
  const markers: { element: HTMLElement; anchor: THREE.Vector3 }[] = [];
  hubs.forEach((hub, i) => {
    const p = xy(hub.lon, hub.lat); p.y = 0.3;
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.08, 0.9, 12), bright(hub.color)); beacon.position.copy(p).add(new THREE.Vector3(0, 0.45, 0)); grid.add(beacon);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), bright(hub.color)); orb.position.copy(p).add(new THREE.Vector3(0, 0.94, 0)); grid.add(orb);
    for (let r = 0; r < 3; r++) { const halo = ring(0.17 + r * 0.19, 0.25, grid, hub.color, 0.75 - r * 0.2); halo.position.x = p.x; halo.position.z = p.z; }
    const element = document.createElement('div'); element.className = 'map-label';
    element.innerHTML = `<span class="map-dot" style="background:#${hub.color.toString(16)}"></span>${hub.name}<small>${i === 1 ? 'PROPOSED PILOT' : 'PHILIPPINE GRID'}</small>`;
    host.append(element); markers.push({ element, anchor: p.clone().add(new THREE.Vector3(0.22, 1.5, 0)) });
    if (i) {
      const start = xy(hubs[i - 1].lon, hubs[i - 1].lat).setY(0.4), end = p.clone().setY(0.4);
      const middle = start.clone().lerp(end, 0.5).setY(2.4);
      const curve = new THREE.QuadraticBezierCurve3(start, middle, end); paths.push(curve);
      grid.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 70, 0.014, 5, false), bright(teal)));
    }
  });
  const particles = Array.from({ length: 12 }, (_, i) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.046, 8, 8), bright(i % 2 ? mint : amber)); grid.add(mesh); return mesh;
  });
  const stars = new Float32Array(160 * 3);
  let seed = 93;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < stars.length; i += 3) stars.set([(random() - 0.5) * 15, random() * 6 - 0.3, (random() - 0.5) * 12], i);
  const starsGeo = new THREE.BufferGeometry(); starsGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3));
  grid.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ size: 0.022, color: mint, transparent: true, opacity: 0.65 })));

  const lake = groups.lake;
  const slabColors = [0x8fa6c8, 0x77c4ba, mint];
  for (let i = 0; i < 3; i++) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.28, 4.3), new THREE.MeshStandardMaterial({ color: slabColors[i], transparent: true, opacity: 0.35, metalness: 0.55, roughness: 0.22 }));
    slab.position.y = (1 - i) * 1.9; lake.add(slab); edge(slab.geometry, slab, slabColors[i], 0.7);
    const substrate = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.12, 4.2), dark); substrate.position.y = slab.position.y - 0.22; lake.add(substrate);
    for (let j = 0; j < 35; j++) {
      const cube = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14 + random() * 0.22, 0.16), bright(slabColors[i]));
      cube.position.set((j % 7 - 3) * 0.64, slab.position.y + 0.25, (Math.floor(j / 7) - 2) * 0.64); lake.add(cube);
    }
  }
  const streams = Array.from({ length: 34 }, () => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.04, 7, 7), bright(mint)); mesh.position.set((random() - 0.5) * 4.7, random() * 6 - 3, (random() - 0.5) * 3.4); lake.add(mesh); return mesh;
  });
  for (const x of [-2.65, 2.65]) for (const z of [-2.05, 2.05]) {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, -2, z), new THREE.Vector3(x, 2, z)]); lake.add(new THREE.Line(lineGeo, lightLine));
  }
  ring(4.4, -2.6, lake); ring(4.65, -2.6, lake);
  lake.scale.setScalar(1.2);

  const signals = groups.signals;
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.018, 8, 150), bright(teal)); orbit.rotation.x = Math.PI / 2.8; signals.add(orbit);
  const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.009, 8, 150), new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity: 0.45 })); orbit2.rotation.set(0.7, 1.1, 0); signals.add(orbit2);
  const coords = new Float32Array(360 * 3);
  for (let i = 0; i < 360; i++) {
    const t = random() * Math.PI * 2, r = 0.4 + random() * 2.8;
    coords.set([Math.cos(t) * r, (random() - 0.5) * 1.8 + Math.cos(t) * 1.0, Math.sin(t) * r * 0.7], i * 3);
  }
  const sigGeo = new THREE.BufferGeometry(); sigGeo.setAttribute('position', new THREE.BufferAttribute(coords, 3));
  signals.add(new THREE.Points(sigGeo, new THREE.PointsMaterial({ color: mint, size: 0.065, transparent: true, opacity: 0.9 })));
  for (let j = 0; j < 3; j++) {
    const line = Array.from({ length: 100 }, (_, k) => { const x = k / 99 * 7 - 3.5; return new THREE.Vector3(x, Math.sin(x * 0.9 + j * 1.2) * 0.9 + (j - 1) * 0.6, (j - 1) * 1.1); });
    signals.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(line), 100, 0.022, 6, false), bright([mint, blue, amber][j])));
  }
  signals.scale.setScalar(1.3);

  const cluster = groups.clusters;
  const centers = [new THREE.Vector3(-2.1, -0.7, 0.8), new THREE.Vector3(1.8, 1.1, -1.1), new THREE.Vector3(-1.4, 1.7, -1.6), new THREE.Vector3(1.9, -0.8, 1.6)];
  const clusterColors = [mint, amber, blue, teal];
  centers.forEach((center, k) => {
    const instance = new THREE.InstancedMesh(new THREE.SphereGeometry(0.065, 8, 8), bright(clusterColors[k]), 70);
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < 70; i++) {
      const v = new THREE.Vector3(random() + random() - 1, random() + random() - 1, random() + random() - 1).multiplyScalar(1.2).add(center);
      matrix.makeTranslation(v.x, v.y, v.z); instance.setMatrixAt(i, matrix);
    }
    cluster.add(instance);
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), new THREE.MeshBasicMaterial({ color: clusterColors[k], wireframe: true, transparent: true, opacity: 0.12 })); shell.position.copy(center); cluster.add(shell);
    const centroid = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), bright(clusterColors[k])); centroid.position.copy(center); cluster.add(centroid);
  });
  ring(4.4, -2.3, cluster); ring(4.6, -2.3, cluster); cluster.scale.setScalar(1.2);

  const renderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, renderTarget);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(800, 800), 0.38, 0.55, 1.15); composer.addPass(bloom); composer.addPass(new OutputPass());
  let mode: SceneMode = 'grid', paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 1, height = 1, frame = 0, time = 0, previous = 0, disposed = false, dirty = true;
  const pointer = { x: 0, y: 0 }, rotation = { x: 0, y: 0 };
  function setMode(next: SceneMode) {
    mode = next; Object.entries(groups).forEach(([name, group]) => { group.visible = name === mode; });
    markers.forEach(m => m.element.hidden = mode !== 'grid'); dirty = true;
  }
  function resize() {
    width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    camera.position.set(6.3, 11.5, 13.2).multiplyScalar(camera.aspect < 0.95 ? 1.12 : 1);
    camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); renderer.setSize(width, height); composer.setSize(width, height); dirty = true;
  }
  const observer = new ResizeObserver(resize); observer.observe(host);
  function move(e: PointerEvent) { const box = host.getBoundingClientRect(); pointer.x = ((e.clientX - box.left) / box.width - 0.5) * 0.22; pointer.y = ((e.clientY - box.top) / box.height - 0.5) * 0.07; dirty = true; }
  function leave() { pointer.x = pointer.y = 0; dirty = true; }
  host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
  const vector = new THREE.Vector3();
  function tick(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    if (document.hidden) { previous = now; return; }
    if (now - previous < 32) return;
    const dt = Math.min((now - previous) / 1000, 0.08); previous = now;
    if (paused && !dirty) return;
    if (!paused) {
      time += dt; rotation.y += (pointer.x - rotation.y) * 0.055; rotation.x += (pointer.y - rotation.x) * 0.055;
      world.rotation.y = rotation.y + Math.sin(time * 0.12) * 0.045; world.rotation.x = rotation.x;
      particles.forEach((p, i) => p.position.copy(paths[i % paths.length].getPoint((time * 0.13 + i / particles.length) % 1)));
      streams.forEach((p, i) => { p.position.y = 2.7 - ((time * 0.55 + i * 0.18) % 5.4); });
      orbit2.rotation.z = time * 0.05;
    }
    scene.updateMatrixWorld();
    markers.forEach(m => {
      vector.copy(m.anchor).applyMatrix4(grid.matrixWorld).project(camera);
      m.element.style.left = `${(vector.x * 0.5 + 0.5) * width}px`;
      m.element.style.top = `${(-vector.y * 0.5 + 0.5) * height}px`;
    });
    composer.render(); dirty = false;
  }
  function contextLost(event: Event) { event.preventDefault(); host.classList.remove('scene-ready'); host.dataset.error = '3D unavailable. Static illustration shown.'; paused = true; }
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  setMode('grid'); resize(); host.classList.add('scene-ready'); frame = requestAnimationFrame(tick);
  return {
    setMode,
    setPaused(value) { paused = value; dirty = true; },
    reset() { pointer.x = pointer.y = rotation.x = rotation.y = 0; world.rotation.set(0, 0, 0); dirty = true; },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(obj => { const mesh = obj as THREE.Mesh; if (mesh.geometry) geometries.add(mesh.geometry); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => materials.add(m)); });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); composer.dispose(); renderer.dispose(); renderer.domElement.remove(); markers.forEach(m => m.element.remove());
    },
  };
}
