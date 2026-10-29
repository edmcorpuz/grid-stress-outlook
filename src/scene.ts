import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { balance, type Shot } from './content';
import { createSwarm, type Formation } from './swarm';
import { createBackdrop, createPlanet, createAtmosphere, createFlowMaterial, createHologramMaterial, makeRevealable } from './effects';

const mint = 0xb8f7ce, teal = 0x73c5b9, blue = 0xa0bced, amber = 0xf3be88, red = 0xff7a66, slate = 0x8fa6c8;
type Station = 'map' | 'blocks' | 'signals' | 'sources' | 'layers' | 'schema' | 'tunnel' | 'analysis';
type V3 = [number, number, number];
/** One world, one camera: each slide is a shot of a station. Camera and target are in the station's local space. */
const shots: Record<Shot, { station: Station; cam: V3; look: V3; orbit?: number; fog?: number }> = {
  orbit: { station: 'map', cam: [7.2, 11, 14.6], look: [0.2, 0, 0.4], orbit: 0.05 },
  flow: { station: 'map', cam: [6.5, 7, 10], look: [0.4, 0.2, 0.6] },
  alerts: { station: 'map', cam: [5.4, 4.6, 7.4], look: [1.0, 0.7, 1.3] },
  balance: { station: 'map', cam: [8.2, 4.6, 7.2], look: [3.4, 2.2, 0.9] },
  outlook: { station: 'map', cam: [5, 6.6, 8.6], look: [1.0, 0, 1.3] },
  shield: { station: 'map', cam: [10.5, 8.5, 13.5], look: [0, 1.4, 0] },
  finale: { station: 'map', cam: [0, 46, 96], look: [0, -2, -10], orbit: 0.02, fog: 0.004 },
  blocks: { station: 'blocks', cam: [5.4, 3.2, 9.5], look: [-0.6, 0.1, 0] },
  scatter: { station: 'signals', cam: [0, 1.4, 11], look: [0, 0.2, 0] },
  braid: { station: 'signals', cam: [3.2, 1.3, 10.5], look: [2.0, 0, 0] },
  sources: { station: 'sources', cam: [0, 5.4, 10.5], look: [0, -0.4, -0.8] },
  layers: { station: 'layers', cam: [6.5, 3, 9.5], look: [0, 0, 0] },
  schema: { station: 'schema', cam: [0, 3.6, 11.2], look: [0, 0.3, 0] },
  tunnel: { station: 'tunnel', cam: [-3.4, 2.6, 7.6], look: [0.4, 0, 0] },
  waves: { station: 'analysis', cam: [0, 0.6, 9.5], look: [0, 0, 0] },
  pca: { station: 'analysis', cam: [3.6, 2.6, 8.6], look: [0, 0, 0] },
  clusters: { station: 'analysis', cam: [-2.6, 3, 9], look: [0, 0, 0] },
};
const radius = 44;
const angles: Record<Exclude<Station, 'map'>, number> = { blocks: 150, signals: 210, sources: 260, layers: 310, schema: 0, tunnel: 50, analysis: 100 };
const animKeys = ['flow', 'alerts', 'balance', 'outlook', 'shield', 'finale', 'blocks', 'signals', 'braid', 'sources', 'layers', 'schema', 'tunnel', 'waves', 'cloud', 'flat', 'cluster'] as const;
type AnimKey = typeof animKeys[number];
const speed: Partial<Record<AnimKey, number>> = { blocks: 0.45, alerts: 0.55, flat: 0.5, cluster: 0.55 };
function goals(shot: Shot): Record<AnimKey, number> {
  const all = shot === 'finale', is = (...names: Shot[]) => +(all || names.includes(shot));
  return {
    flow: +(shot === 'flow'), alerts: +(shot === 'alerts'), balance: +(shot === 'balance'), outlook: +(shot === 'outlook'), shield: +(shot === 'shield'), finale: +all,
    blocks: is('blocks'), signals: is('scatter', 'braid'), braid: is('braid'), sources: is('sources'), layers: is('layers'), schema: is('schema'), tunnel: is('tunnel'),
    waves: +(shot === 'waves'), cloud: is('pca', 'clusters'), flat: is('pca', 'clusters'), cluster: is('clusters'),
  };
}
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const easeInOut = (x: number) => x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
const grow = (amount: number, delay: number, span = 0.35) => THREE.MathUtils.clamp((amount - delay * (1 - span)) / span, 0, 1);
/** Rounds the coarse island outlines with Chaikin corner cutting. */
function chaikin(ring: number[][], passes = 2) {
  let points = ring[0][0] === ring.at(-1)![0] && ring[0][1] === ring.at(-1)![1] ? ring.slice(0, -1) : ring;
  for (let p = 0; p < passes; p++) points = points.flatMap((a, i) => { const b = points[(i + 1) % points.length]; return [[a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]]; });
  return points;
}
function inside(x: number, y: number, ring: number[][]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) hit = !hit; }
  return hit;
}

export interface SceneController { setShot(shot: Shot): void; setSupply(mw: number): void; setPaused(value: boolean): void; dispose(): void }
export async function createScene(host: HTMLElement, initial: Shot): Promise<SceneController> {
  const geoResponse = await fetch(`${import.meta.env.BASE_URL}philippines.geo.json`);
  if (!geoResponse.ok) throw new Error('Map geometry unavailable');
  const geo = await geoResponse.json();
  let low = new URLSearchParams(location.search).get('quality') === 'low';
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(low ? 1 : Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  // ACES crushes very dark colors to black; this fog color tone-maps back to the page background (#070b0e).
  const fog = new THREE.FogExp2(0x14191c, 0.03); scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1500);
  scene.add(new THREE.HemisphereLight(0xd6f5ea, 0x0a1411, 1.3));
  const key = new THREE.DirectionalLight(0xe2fff4, 3.2); key.position.set(-20, 30, 14); scene.add(key);
  const rim = new THREE.DirectionalLight(0x8abfff, 1.6); rim.position.set(18, 8, -20); scene.add(rim);
  const world = new THREE.Group(); scene.add(world);
  // A soft studio reflection so metal and glass read as real materials instead of flat color.
  const pmrem = new THREE.PMREMGenerator(renderer), environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment; scene.environmentIntensity = 0.32; pmrem.dispose();

  let seed = 93;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const gauss = () => Math.sqrt(-2 * Math.log(random() + 1e-9)) * Math.cos(2 * Math.PI * random());
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  function radial(stops: [number, string][]) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
    const g = canvas.getContext('2d')!, gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color)); g.fillStyle = gradient; g.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }
  const dot = radial([[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,.6)'], [1, 'rgba(255,255,255,0)']]);
  const heat = radial([[0, 'rgba(255,140,105,.95)'], [0.35, 'rgba(243,190,136,.45)'], [1, 'rgba(243,190,136,0)']]);
  const metal = new THREE.MeshStandardMaterial({ color: 0x2c4546, roughness: 0.35, metalness: 0.75 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0f1c20, roughness: 0.5, metalness: 0.6 });
  const neon = (color: number, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false });
  const glass = (color: number, opacity = 0.16) => new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity, metalness: 0.2, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.35, envMapIntensity: 0.6, depthWrite: false });
  const additive = <T extends THREE.Material>(material: T) => { material.blending = THREE.AdditiveBlending; material.depthWrite = false; material.transparent = true; return material; };
  function edges<T extends THREE.Mesh>(mesh: T, color = mint, opacity = 0.5) { mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), new THREE.LineBasicMaterial({ color, transparent: true, opacity }))); return mesh; }
  function flatRing(r: number, y: number, parent: THREE.Object3D, color = teal, opacity = 0.3, width = 0.014) {
    const mesh = new THREE.Mesh(new THREE.RingGeometry(r, r + width, 128), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity, depthWrite: false }));
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; parent.add(mesh); return mesh;
  }
  function points(count: number, size: number, parent: THREE.Object3D) {
    const geometry = new THREE.BufferGeometry();
    const position = new THREE.BufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage);
    const color = new THREE.BufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', position); geometry.setAttribute('color', color);
    const material = additive(new THREE.PointsMaterial({ size, map: dot, vertexColors: true, toneMapped: false }));
    const object = new THREE.Points(geometry, material); object.frustumCulled = false; parent.add(object);
    const paint = (i: number, hex: number, brightness = 1) => { const c = new THREE.Color(hex).multiplyScalar(brightness); color.setXYZ(i, c.r, c.g, c.b); };
    return { object, position, color, material, paint };
  }
  function line(count: number, color: number, opacity: number, parent: THREE.Object3D) {
    const geometry = new THREE.BufferGeometry(), position = new THREE.BufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', position);
    const material = additive(new THREE.LineBasicMaterial({ color, opacity, toneMapped: false }));
    const object = new THREE.Line(geometry, material); object.frustumCulled = false; parent.add(object);
    return { object, position, material, base: opacity };
  }
  const labels: { element: HTMLElement; anchor: THREE.Object3D; offset: THREE.Vector3; shots: Shot[] }[] = [];
  function label(text: string, sub: string | null, anchor: THREE.Object3D, offset: V3, shotList: Shot[], color?: number) {
    const element = document.createElement('div'); element.className = 'scene-label';
    element.innerHTML = `${color === undefined ? '' : `<i style="background:#${color.toString(16).padStart(6, '0')}"></i>`}${text}${sub ? `<small>${sub}</small>` : ''}`;
    host.append(element); labels.push({ element, anchor, offset: new THREE.Vector3(...offset), shots: shotList });
  }

  const stations = { map: new THREE.Group() } as Record<Station, THREE.Group>;
  world.add(stations.map);
  for (const [name, degrees] of Object.entries(angles) as [Exclude<Station, 'map'>, number][]) {
    const a = degrees * Math.PI / 180, group = new THREE.Group();
    group.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius); group.rotation.y = Math.atan2(Math.cos(a), Math.sin(a));
    world.add(group); stations[name] = group;
    flatRing(5.2, -2.3, group, teal, 0.22); flatRing(5.55, -2.3, group, teal, 0.1);
  }
  // The world stands on a dark planet; from altitude its curve and glowing rim appear (opening and closing shots).
  const planet = createPlanet(600, -2.45, 0x14191c, 0x1d3d36), atmosphere = createAtmosphere(600, -2.45, 0x4fd1b0);
  // The backdrop shares the planet's base color (the fog color, which tone-maps to the page background), so the horizon has no seam.
  const backdrop = createBackdrop(1200, 0x14191c);
  world.add(planet.mesh, atmosphere.mesh); scene.add(backdrop);
  const dust = points(1800, 0.09, world); dust.material.opacity = 0.55;
  for (let i = 0; i < 1800; i++) { dust.position.setXYZ(i, (random() - 0.5) * 190, -2 + random() * 26, (random() - 0.5) * 190); dust.paint(i, random() > 0.8 ? amber : mint, 0.4 + random() * 0.5); }

  // Map station: the Philippines at night, its three grids, and the shots that zoom into Visayas.
  const map = stations.map;
  const plinth = edges(new THREE.Mesh(new THREE.CylinderGeometry(6, 6.15, 0.24, 96), dark), teal, 0.2); plinth.position.y = -0.36; map.add(plinth);
  [6.35, 6.75, 7.2].forEach((r, i) => flatRing(r, -0.24, map, teal, 0.3 - i * 0.08));
  const mapGrid = new THREE.GridHelper(8.4, 24, 0x35584e, 0x1d3430); mapGrid.position.y = -0.235; map.add(mapGrid);
  const project = (lon: number, lat: number) => [(lon - 122.4) * 0.78, (lat - 12.5) * 0.78];
  const outlines: number[][][] = [];
  for (const polygon of geo.features[0].geometry.coordinates as number[][][][]) {
    const outline = chaikin(polygon[0].map(([lon, lat]) => project(lon, lat))); outlines.push(outline);
    const geometry = new THREE.ExtrudeGeometry(new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y))), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 });
    geometry.rotateX(-Math.PI / 2);
    map.add(edges(new THREE.Mesh(geometry, metal), mint, 0.55));
  }
  const cityLights = points(650, 0.075, map);
  for (let n = 0, tries = 0; n < 650 && tries < 40000; tries++) {
    const x = -4.1 + random() * 7.4, y = -5.45 + random() * 10.2;
    if (outlines.some(o => inside(x, y, o))) { cityLights.position.setXYZ(n, x, 0.21, -y); cityLights.paint(n, random() > 0.85 ? amber : mint, 0.35 + random() * 0.6); n++; }
  }
  const hubs = [
    { name: 'Luzon', sub: 'Grid', lon: 121.0, lat: 16.1, color: mint },
    { name: 'Visayas', sub: 'Proposed pilot', lon: 123.7, lat: 10.7, color: amber },
    { name: 'Mindanao', sub: 'Grid', lon: 124.8, lat: 7.8, color: blue },
  ];
  const hubPositions = hubs.map(h => { const [x, y] = project(h.lon, h.lat); return new THREE.Vector3(x, 0.2, -y); });
  hubs.forEach((hub, i) => {
    const p = hubPositions[i];
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 0.9, 12), neon(hub.color)); beacon.position.set(p.x, 0.65, p.z); map.add(beacon);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), neon(hub.color)); orb.position.set(p.x, 1.12, p.z); map.add(orb);
    for (let r = 0; r < 3; r++) { const halo = flatRing(0.16 + r * 0.18, 0.23, map, hub.color, 0.7 - r * 0.2, 0.012); halo.position.x = p.x; halo.position.z = p.z; }
    label(hub.name, hub.sub, map, [p.x + 0.15, 1.5, p.z], ['orbit', 'flow', 'outlook'], hub.color);
  });
  const visayas = hubPositions[1];
  const arcs = [[0, 1], [1, 2]].map(([a, b]) => { const s = hubPositions[a].clone().setY(0.35), e = hubPositions[b].clone().setY(0.35); return new THREE.QuadraticBezierCurve3(s, s.clone().lerp(e, 0.5).setY(2.2), e); });
  const arcMaterial = createFlowMaterial(teal, 3, 0.45);
  arcs.forEach(curve => map.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.02, 6), arcMaterial)));
  const pulses = points(24, 0.24, map); for (let i = 0; i < 24; i++) pulses.paint(i, i % 2 ? mint : amber, 1.2);

  const reds = new Set<number>(); while (reds.size < 30) reds.add(Math.floor(random() * 123));
  const pillars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 1, 0.05), neon(0xffffff), 123); pillars.frustumCulled = false; map.add(pillars);
  const pillarData = Array.from({ length: 123 }, (_, i) => { const r = 0.32 + 1.45 * Math.sqrt(i / 123), a = i * 2.39996; return { x: visayas.x + Math.cos(a) * r, z: visayas.z + Math.sin(a) * r, h: reds.has(i) ? 0.9 + random() * 0.8 : 0.3 + random() * 0.6, delay: i / 123 }; });
  pillarData.forEach((_, i) => pillars.setColorAt(i, new THREE.Color(reds.has(i) ? red : amber)));

  const scaleMW = 1 / 850, demandMW = 2545, regulatingMW = demandMW * 0.04, contingencyMW = 150;
  const balanceGroup = new THREE.Group(); balanceGroup.position.set(3.0, -0.24, 0.9); map.add(balanceGroup);
  const column = (r: number, material: THREE.Material, x: number) => { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 40), material); mesh.position.x = x; balanceGroup.add(mesh); return mesh; };
  const stackAt = (mesh: THREE.Mesh, bottom: number, height: number) => { mesh.scale.y = Math.max(height, 1e-4); mesh.position.y = bottom + height / 2; };
  stackAt(edges(column(0.3, glass(amber, 0.22), 0.8), amber, 0.6), 0, demandMW * scaleMW);
  stackAt(column(0.3, neon(red, 0.85), 0.8), demandMW * scaleMW, regulatingMW * scaleMW);
  stackAt(column(0.3, neon(amber, 0.6), 0.8), (demandMW + regulatingMW) * scaleMW, contingencyMW * scaleMW);
  const supplyColumn = column(0.3, new THREE.MeshStandardMaterial({ color: 0x1d3a33, emissive: mint, emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.4 }), 0);
  const gapColumn = column(0.31, neon(red, 0.45), 0);
  const capMaterial = neon(mint), supplyCap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.03, 40), capMaterial); balanceGroup.add(supplyCap);
  const levelMaterial = neon(mint, 0.9), level = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.014, 0.014), levelMaterial); balanceGroup.add(level);
  label('Supply', null, balanceGroup, [0, 3.35, 0], ['balance'], mint);
  label('Demand + reserves', null, balanceGroup, [0.95, 3.6, 0], ['balance'], amber);
  let supply = 2468;
  function applySupply() {
    const h = supply * scaleMW, gap = Math.max(0, demandMW - supply) * scaleMW, state = balance(supply).state;
    stackAt(supplyColumn, 0, h); supplyCap.position.y = h; level.position.set(0.4, h, 0);
    gapColumn.visible = gap > 0.0005; stackAt(gapColumn, h, gap);
    const color = state === 'Red alert' ? red : state === 'Yellow alert' ? amber : mint; capMaterial.color.set(color); levelMaterial.color.set(color);
  }
  applySupply();

  const heatGlow = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.4), additive(new THREE.MeshBasicMaterial({ map: heat, opacity: 0 })));
  heatGlow.rotation.x = -Math.PI / 2; heatGlow.position.set(visayas.x, 0.27, visayas.z); map.add(heatGlow);
  const sweep = new THREE.Mesh(new THREE.RingGeometry(0.15, 2.1, 48, 1, 0, 0.7), additive(new THREE.MeshBasicMaterial({ color: mint, opacity: 0, side: THREE.DoubleSide })));
  sweep.rotation.x = -Math.PI / 2; sweep.position.set(visayas.x, 0.29, visayas.z); map.add(sweep);
  const horizons = [0.8, 1.4, 2.0].map(r => { const ringMesh = flatRing(r, 0.28, map, amber, 0, 0.016); ringMesh.position.x = visayas.x; ringMesh.position.z = visayas.z; return ringMesh; });
  const domeGeometry = new THREE.SphereGeometry(6.8, 36, 14, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Group(); dome.position.y = -0.24; map.add(dome);
  const domeMaterial = createHologramMaterial(mint); domeMaterial.uniforms.uOpacity.value = 0.4;
  dome.add(new THREE.Mesh(domeGeometry, additive(new THREE.MeshBasicMaterial({ color: mint, wireframe: true, opacity: 0.08 }))), new THREE.Mesh(new THREE.SphereGeometry(6.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), domeMaterial));
  const spokeCurves = Object.values(angles).map(degrees => { const a = degrees * Math.PI / 180, end = new THREE.Vector3(Math.cos(a) * radius, -1.6, Math.sin(a) * radius); return new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(end.x * 0.5, 9, end.z * 0.5), end); });
  const spokeMaterial = createFlowMaterial(mint, 2, 0.35, 0.3);
  const spokes = new THREE.Group(); map.add(spokes);
  spokeCurves.forEach(curve => spokes.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.07, 6), spokeMaterial)));
  const spokePulses = points(28, 1.1, spokes); for (let i = 0; i < 28; i++) spokePulses.paint(i, i % 3 ? mint : amber, 1.2);

  // Big data: a block of five-minute intervals that stacks itself.
  const cubeCount = 12 ** 3, cubeGap = 0.34, blockPivot = new THREE.Group(); stations.blocks.add(blockPivot);
  const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), new THREE.MeshStandardMaterial({ color: 0xa9bdb7, roughness: 0.5, metalness: 0.35, emissive: 0x0b1e1a }), cubeCount);
  cubes.frustumCulled = false; blockPivot.add(cubes);
  const cubeData = Array.from({ length: cubeCount }, (_, i) => {
    const xi = i % 12, zi = Math.floor(i / 12) % 12, yi = Math.floor(i / 144), t = yi / 11;
    cubes.setColorAt(i, random() > 0.97 ? new THREE.Color(amber) : t < 0.5 ? new THREE.Color(blue).lerp(new THREE.Color(teal), t * 2) : new THREE.Color(teal).lerp(new THREE.Color(mint), (t - 0.5) * 2));
    return { x: (xi - 5.5) * cubeGap, y: yi * cubeGap - 1.9, z: (zi - 5.5) * cubeGap, delay: t * 0.8 + random() * 0.2 };
  });

  // Signals: three streams that drift apart, then braid into one beam.
  const signals = stations.signals, streamColors = [mint, amber, blue], perStream = 220;
  const streams = points(perStream * 3, 0.13, signals), streamLines = streamColors.map(c => line(120, c, 0.32, signals));
  const streamSeeds = Array.from({ length: perStream * 3 }, (_, i) => ({ t: (i % perStream) / perStream + random() * 0.004, jitter: [gauss() * 0.07, gauss() * 0.07, gauss() * 0.07] }));
  streamSeeds.forEach((_, i) => streams.paint(i, streamColors[Math.floor(i / perStream)], 1));
  const core = new THREE.Group(); core.position.set(4.3, 0, 0); signals.add(core);
  core.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), neon(mint)), new THREE.Sprite(additive(new THREE.SpriteMaterial({ map: dot, color: mint, opacity: 0.8 }))));
  core.children[1].scale.setScalar(1.6);
  const scatterStart: V3[] = [[-4.6, 2.2, -1.5], [4.2, -1.8, -0.8], [-1.2, -2.4, 1.6]], scatterEnd: V3[] = [[1.4, -0.6, 1.3], [-2.4, 2.0, 0.4], [3.4, 1.9, -1.4]];
  function streamPoint(k: number, t: number, braid: number, out: THREE.Vector3) {
    const s = scatterStart[k], e = scatterEnd[k], a = t * 12 + k * 2.094 + time * 0.8, r = 1 - 0.88 * t;
    const sx = s[0] + (e[0] - s[0]) * t + Math.sin(t * 7 + k * 2 + time * 0.6) * 0.45, sy = s[1] + (e[1] - s[1]) * t + Math.cos(t * 5 + k + time * 0.5) * 0.45, sz = s[2] + (e[2] - s[2]) * t + Math.sin(t * 6 + k * 3) * 0.4;
    return out.set(sx + (-2.6 + t * 6.9 - sx) * braid, sy + (r * Math.cos(a) - sy) * braid, sz + (r * Math.sin(a) - sz) * braid);
  }

  // Sources: four feeds beam into one 288-tick clock.
  const sources = stations.sources;
  const feeds = [{ name: 'NGCP', color: mint, x: -3.1, z: -0.8, h: 3.2 }, { name: 'IEMOP', color: amber, x: -1.2, z: -2.7, h: 3.6 }, { name: 'DOE', color: blue, x: 1.2, z: -2.7, h: 2.6 }, { name: 'PAGASA', color: teal, x: 3.1, z: -0.8, h: 3.0 }];
  const clock = new THREE.Group(); clock.position.set(0, -0.9, 0.3); sources.add(clock);
  const ticks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.02, 0.012, 0.12), neon(0xffffff), 288);
  for (let i = 0; i < 288; i++) { const a = i / 288 * Math.PI * 2, major = i % 12 === 0; q.setFromEuler(new THREE.Euler(0, Math.PI / 2 - a, 0)); ticks.setMatrixAt(i, m4.compose(v1.set(Math.cos(a) * 1.75, 0, Math.sin(a) * 1.75), q, v2.set(1, 1, major ? 2 : 1))); ticks.setColorAt(i, new THREE.Color(major ? mint : teal).multiplyScalar(major ? 1 : 0.55)); }
  clock.add(ticks);
  const handGeometry = new THREE.BoxGeometry(0.025, 0.02, 1.6); handGeometry.translate(0, 0, 0.8);
  const hand = new THREE.Mesh(handGeometry, neon(mint)); clock.add(hand, new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 20), neon(mint)));
  const feedMeshes = feeds.map(feed => {
    const pillar = edges(new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), new THREE.MeshStandardMaterial({ color: 0x1c2c2e, emissive: feed.color, emissiveIntensity: 0.14, roughness: 0.35, metalness: 0.6 })), feed.color, 0.8); pillar.position.set(feed.x, 0, feed.z); sources.add(pillar);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.07, 0.58), neon(feed.color)); cap.position.set(feed.x, 0, feed.z); sources.add(cap);
    const anchor = new THREE.Object3D(); anchor.position.set(feed.x, -2.2 + feed.h, feed.z); sources.add(anchor);
    label(feed.name, null, anchor, [0, 0.55, 0], ['sources'], feed.color);
    const top = anchor.position.clone(), end = clock.position.clone();
    return { pillar, cap, curve: new THREE.QuadraticBezierCurve3(top, top.clone().lerp(end, 0.5).setY(top.y + 1.4), end) };
  });
  const beams = points(144, 0.16, sources); for (let i = 0; i < 144; i++) beams.paint(i, feeds[i % 4].color, 1.1);

  // Lakehouse: records fall through raw, clean and curated shelves and line up as they go.
  const layers = stations.layers, shelfColors = [slate, teal, mint], shelfNames = ['Raw', 'Clean', 'Curated'];
  const shelves = shelfColors.map((color, i) => {
    const slab = edges(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 3.6), glass(color, 0.16)), color, 0.75); slab.position.y = 2 - i * 2; layers.add(slab);
    label(shelfNames[i], null, slab, [2.75, 0.25, 1.8], ['layers'], color); return slab;
  });
  const records = points(520, 0.12, layers);
  const recordSeeds = Array.from({ length: 520 }, (_, i) => ({ rx: (random() - 0.5) * 4.8, rz: (random() - 0.5) * 3.2, gx: -2.2 + (i % 13) * 0.367, gz: -1.45 + (Math.floor(i / 13) % 9) * 0.3625, phase: random() }));
  const colorRaw = new THREE.Color(slate), colorClean = new THREE.Color(teal), colorCurated = new THREE.Color(mint), mixed = new THREE.Color();

  // Warehouse: a star schema at one grid × one five-minute interval.
  const schema = stations.schema, schemaPivot = new THREE.Group(); schema.add(schemaPivot);
  const nodes = [
    { name: 'fact_grid_interval', color: mint, at: [0, 0.3, 0] as V3, size: [1.5, 0.55, 1.0] as V3 },
    { name: 'dim_grid', color: teal, at: [-2.8, 1.3, -0.4] as V3 }, { name: 'dim_time', color: teal, at: [2.8, 1.3, -0.4] as V3 },
    { name: 'dim_date', color: teal, at: [0, 2.4, -2.3] as V3 }, { name: 'dim_source', color: teal, at: [0, -1.3, 1.9] as V3 },
    { name: 'fact_grid_alert', color: amber, at: [-3.8, -1.0, -2.0] as V3, size: [1.1, 0.4, 0.75] as V3 }, { name: 'fact_plant_outage', color: blue, at: [3.8, -1.0, -2.0] as V3, size: [1.1, 0.4, 0.75] as V3 },
  ];
  const nodeMeshes = nodes.map((node, i) => {
    const [w, h, d] = node.size ?? [0.95, 0.38, 0.6];
    const mesh = edges(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: 0x0f1c20, emissive: node.color, emissiveIntensity: i ? 0.25 : 0.5, roughness: 0.4, metalness: 0.5 })), node.color, 0.85);
    mesh.position.set(...node.at); schemaPivot.add(mesh); label(node.name, null, mesh, [0, h / 2 + 0.35, 0], ['schema'], node.color); return mesh;
  });
  const links = [[0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [6, 1], [6, 2]];
  const linkGeometry = new THREE.BufferGeometry().setFromPoints(links.flatMap(([a, b]) => [new THREE.Vector3(...nodes[a].at), new THREE.Vector3(...nodes[b].at)]));
  const linkMaterial = additive(new THREE.LineBasicMaterial({ color: mint, opacity: 0 })); schemaPivot.add(new THREE.LineSegments(linkGeometry, linkMaterial));
  const linkPulses = points(links.length * 3, 0.2, schemaPivot); for (let i = 0; i < links.length * 3; i++) linkPulses.paint(i, nodes[links[i % links.length][0]].color, 1.2);

  // Preprocessing: training data flows up to a glass wall; later data stays on the far side.
  const tunnel = stations.tunnel, wallX = 1.4;
  const tunnelRings = Array.from({ length: 16 }, (_, i) => {
    const x = -5 + i * 0.62, train = x < wallX;
    const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.018, 6, 64), neon(train ? mint : amber, train ? 0.85 : 0.4)); ringMesh.rotation.y = Math.PI / 2; ringMesh.position.x = x; tunnel.add(ringMesh); return ringMesh;
  });
  const wall = edges(new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), additive(new THREE.MeshBasicMaterial({ color: mint, opacity: 0, side: THREE.DoubleSide }))), mint, 0.8);
  wall.rotation.y = Math.PI / 2; wall.position.x = wallX; tunnel.add(wall);
  label('Training · earlier data', null, tunnel, [-3.6, 1.9, 0], ['tunnel'], mint);
  label('Testing · later data', null, tunnel, [3.6, 1.9, 0], ['tunnel'], amber);
  const flow = points(340, 0.12, tunnel);
  const flowSeeds = Array.from({ length: 340 }, (_, i) => { const a = random() * Math.PI * 2, r = Math.sqrt(random()) * 1.1; return { y: Math.cos(a) * r, z: Math.sin(a) * r, phase: random(), future: i >= 260 }; });
  flowSeeds.forEach((s, i) => flow.paint(i, s.future ? amber : mint, s.future ? 0.6 : 1));

  // Analysis: lagged waves, then one point cloud that flattens (PCA) and separates (k-means).
  const analysis = stations.analysis, analysisPivot = new THREE.Group(); analysis.add(analysisPivot);
  const waveColors = [amber, mint, red], waves = waveColors.map(c => line(200, c, 0.9, analysis));
  const waveDots = points(180, 0.14, analysis); for (let i = 0; i < 180; i++) waveDots.paint(i, waveColors[i % 3], 1.2);
  const basis = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.5, 0.6, 0.25));
  const axisLines = ([[3.4, mint], [1.7, blue], [0.8, amber]] as [number, number][]).map(([length, color], i) => {
    const direction = new THREE.Vector3(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0).applyMatrix4(basis).multiplyScalar(length);
    const material = additive(new THREE.LineBasicMaterial({ color, opacity: 0 })); analysisPivot.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([direction.clone().negate(), direction]), material)); return material;
  });
  const clusterColors = [mint, amber, blue, red], centers = ([[-2.5, 1.0], [2.3, 1.3], [-0.7, -1.7], [2.5, -1.3]] as [number, number][]).map(([a, b]) => new THREE.Vector3(a, b, 0).applyMatrix4(basis));
  const cloud = points(1100, 0.12, analysisPivot);
  const cloudSeeds = Array.from({ length: 1100 }, () => {
    const a = gauss() * 1.6, b = gauss() * 0.95, c = gauss() * 0.5;
    const solid = new THREE.Vector3(a, b, c).applyMatrix4(basis), flat = new THREE.Vector3(a, b, 0).applyMatrix4(basis);
    let k = 0; centers.forEach((center, i) => { if (center.distanceToSquared(flat) < centers[k].distanceToSquared(flat)) k = i; });
    return { solid, flat, grouped: centers[k].clone().add(new THREE.Vector3(gauss() * 0.38, gauss() * 0.38, gauss() * 0.2)), k };
  });
  const neutral = new THREE.Color(0xd9fbe6), clusterTint = clusterColors.map(c => new THREE.Color(c));

  // Blueprint-to-real: each station's solids are cut away above a height that rises when the camera arrives, while its edge lines stay lit.
  const seam = { value: new THREE.Color(mint).multiplyScalar(0.9) }, shown = 1000, patched = new Set<THREE.Material>();
  const revealRange = (name: Station): [number, number] => name === 'map' ? [-0.7, 3.6] : [-2.6, 4.4];
  const reveals = {} as Record<Station, { value: number }>;
  for (const [name, group] of Object.entries(stations) as [Station, THREE.Group][]) {
    const reveal = reveals[name] = { value: shown };
    group.traverse(obj => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
        if (patched.has(material) || !(material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial)) continue;
        makeRevealable(material, reveal, seam); patched.add(material);
      }
    });
  }
  const revealing = { station: initial === 'finale' ? 'map' as Station : shots[initial].station, wait: 0, progress: 1 };

  // A stream of data travels with the camera between stations and vanishes on arrival; on the closing shot it becomes the web linking every station.
  const swarmCount = low ? 3000 : 9000, lowSwarm = 3000;
  const swarm = createSwarm(swarmCount, random); world.add(swarm.object); swarm.trail.set(mint).multiplyScalar(0.4);
  scene.updateMatrixWorld(true);
  function formation(fill: (i: number, p: THREE.Vector3, c: THREE.Color) => void): Formation {
    const position = new Float32Array(swarmCount * 3), color = new Float32Array(swarmCount * 3), p = new THREE.Vector3(), c = new THREE.Color();
    for (let i = 0; i < swarmCount; i++) { fill(i, p, c.setRGB(0, 0, 0)); p.toArray(position, i * 3); c.toArray(color, i * 3); }
    return { position, color };
  }
  const clouds = Object.fromEntries((Object.keys(stations) as Station[]).map(name => [name, formation((_, p) => p.set(gauss() * 1.6, 0.6 + gauss() * 0.9, gauss() * 1.6).add(stations[name].position))])) as Record<Station, Formation>;
  const web = formation((i, p, c) => {
    if (i % 10 < 7) { spokeCurves[i % 7].getPoint(random(), p).add(v1.set(gauss(), gauss(), gauss()).multiplyScalar(0.22)); c.set(random() > 0.8 ? amber : mint).multiplyScalar(0.2 + random() * 0.4); }
    else { const a = random() * Math.PI * 2, r = 7.6 + gauss() * 0.3; p.set(Math.cos(a) * r, -0.2 + gauss() * 0.1, Math.sin(a) * r); c.set(teal).multiplyScalar(0.15 + random() * 0.3); }
  });
  swarm.scatter(formation((_, p) => p.set(gauss() * 40, 40 + Math.abs(gauss()) * 30, 120 + gauss() * 50)));
  const swarmTarget = (shot: Shot) => shot === 'finale' ? web : clouds[shots[shot].station];

  // Rendering.
  const renderTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: low ? 0 : 4 });
  const composer = new EffectComposer(renderer, renderTarget);
  composer.addPass(new RenderPass(scene, camera));
  // Shallow focus: the target stays sharp, nearer and farther things soften like a long lens.
  const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: 0.00035, maxblur: 0.0045 }); bokeh.enabled = !low; composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.65, 0.5, 0.9); bloom.enabled = !low; composer.addPass(bloom); composer.addPass(new OutputPass());
  if (low) swarm.setVisible(lowSwarm);

  const anim = Object.fromEntries(animKeys.map(k => [k, 0])) as Record<AnimKey, number>;
  const last: Partial<Record<AnimKey, number>> = {};
  let current: Shot = initial, orbitAngle = 0, bank = 0, started = false, width = 1, height = 1, frame = 0, previous = performance.now(), time = 0, pulsePhase = 0, disposed = false, dirty = true;
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let flight: { from: THREE.Vector3; control: THREE.Vector3; to: THREE.Vector3; lookFrom: THREE.Vector3; lookTo: THREE.Vector3; t: number; duration: number } | null = null;
  const basePos = new THREE.Vector3(0, 80, 96), baseLook = new THREE.Vector3(), pointer = { x: 0, y: 0, tx: 0, ty: 0 }, drift = new THREE.Vector3(), right = new THREE.Vector3(), samples: number[] = [];
  const isNarrow = () => width / height < 1.1;
  function target(shot: Shot) {
    const def = shots[shot], station = stations[def.station]; station.updateWorldMatrix(true, false);
    const look = new THREE.Vector3(...def.look), cam = new THREE.Vector3(...def.cam);
    if (isNarrow() && shot !== 'finale') cam.sub(look).multiplyScalar(1.4).add(look);
    return { pos: station.localToWorld(cam), look: station.localToWorld(look) };
  }
  function setShot(next: Shot) {
    const { pos, look } = target(next);
    if (paused) { flight = null; basePos.copy(pos); baseLook.copy(look); }
    else {
      const from = camera.position.clone().sub(drift), distance = from.distanceTo(pos), control = from.clone().lerp(pos, 0.5);
      control.y += Math.min(distance * 0.3, 18);
      flight = { from, control, to: pos, lookFrom: baseLook.clone(), lookTo: look, t: 0, duration: THREE.MathUtils.clamp(1 + distance * 0.02, 1.2, 2.8) };
      // Bank gently into the turn, like a drone shot: the sign follows which side the destination lies on.
      const travel = pos.clone().sub(from), forward = look.clone().sub(pos);
      bank = Math.sign(forward.x * travel.z - forward.z * travel.x) * 0.08 * THREE.MathUtils.clamp(distance / 30, 0.2, 1);
    }
    const arriving = shots[next].station, leaving = shots[current].station;
    if (!started || arriving !== leaving) {
      reveals[leaving].value = shown;
      reveals[arriving].value = paused ? shown : revealRange(arriving)[0];
      Object.assign(revealing, { station: arriving, wait: (flight?.duration ?? 0) * 0.55, progress: paused ? 1 : 0 });
    }
    const reach = stations[leaving].position.distanceTo(stations[arriving].position);
    swarm.morph(swarmTarget(next), (flight?.duration ?? 1.4) + 0.6, Math.min(Math.max(reach, started ? 12 : 60) * 0.25, 14), 1.3, paused);
    orbitAngle = 0; current = next; started = true; dirty = true;
  }
  function resize() {
    width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
    camera.aspect = width / height; camera.fov = isNarrow() ? 50 : 40;
    camera.setViewOffset(width, height, isNarrow() ? 0 : -width * 0.2, isNarrow() ? height * 0.17 : 0, width, height);
    camera.updateProjectionMatrix(); renderer.setSize(width, height); composer.setSize(width, height);
    if (!flight) { const t = target(current); basePos.copy(t.pos); baseLook.copy(t.look); }
    dirty = true;
  }
  const observer = new ResizeObserver(resize); observer.observe(host);
  const move = (e: PointerEvent) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5; dirty = true; };
  window.addEventListener('pointermove', move);

  function update(dt: number) {
    if (flight) {
      flight.t = Math.min(1, flight.t + dt / flight.duration); const e = easeInOut(flight.t), u = 1 - e;
      basePos.set(0, 0, 0).addScaledVector(flight.from, u * u).addScaledVector(flight.control, 2 * u * e).addScaledVector(flight.to, e * e);
      baseLook.lerpVectors(flight.lookFrom, flight.lookTo, e);
      if (flight.t >= 1) flight = null;
    } else orbitAngle += dt * (shots[current].orbit ?? 0);
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3); pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    drift.set(0, Math.sin(time * 0.17) * 0.15 - pointer.y * 0.35, 0).addScaledVector(right, Math.sin(time * 0.21) * 0.25 + pointer.x * 0.7);
    camera.position.copy(basePos).sub(baseLook).applyAxisAngle(up, orbitAngle).add(baseLook).add(drift);
    camera.lookAt(baseLook);
    if (flight) camera.rotateZ(bank * Math.sin(flight.t * Math.PI));
    camera.updateMatrixWorld();
    fog.density += ((shots[current].fog ?? 0.03) - fog.density) * Math.min(1, dt * 1.6 || 1);
    planet.uniforms.uFog.value = fog.density; planet.uniforms.uCamera.value.copy(camera.position); backdrop.position.copy(camera.position);
    atmosphere.uniforms.uStrength.value = THREE.MathUtils.smoothstep(camera.position.y, 14, 40) * 1.6;
    (bokeh.uniforms as Record<string, THREE.IUniform<number>>).focus.value = camera.position.distanceTo(baseLook);
    swarm.update(dt, time, fog.density, renderer.domElement.height * 0.5);
    arcMaterial.uniforms.uTime.value = time; spokeMaterial.uniforms.uTime.value = time; domeMaterial.uniforms.uTime.value = time;
    if (revealing.progress < 1) {
      if (revealing.wait > 0) revealing.wait -= dt;
      else {
        revealing.progress = paused ? 1 : Math.min(1, revealing.progress + dt / 1.5);
        const [bottom, top] = revealRange(revealing.station);
        reveals[revealing.station].value = revealing.progress >= 1 ? shown : bottom + (top - bottom) * easeInOut(revealing.progress);
      }
    }

    const goal = goals(current);
    for (const k of animKeys) {
      let aim = goal[k];
      if (k === 'flat' && aim === 1 && anim.cloud < 0.95) aim = anim.flat;
      anim[k] = paused ? aim : anim[k] + Math.sign(aim - anim[k]) * Math.min(Math.abs(aim - anim[k]), dt * (speed[k] ?? 0.9));
    }
    const changed = (k: AnimKey) => { const c = last[k] !== anim[k]; last[k] = anim[k]; return c; };
    // The map is the centerpiece; hide it while the camera is parked at another station so it never sits behind their visuals.
    map.visible = !!flight || shots[current].station === 'map';

    pulsePhase += dt * (0.1 + anim.flow * 0.35);
    for (let i = 0; i < 24; i++) { arcs[i % 2].getPoint((pulsePhase + i / 24) % 1, v1); pulses.position.setXYZ(i, v1.x, v1.y, v1.z); }
    pulses.position.needsUpdate = true;
    if (changed('alerts')) {
      pillars.visible = anim.alerts > 0.001;
      pillarData.forEach((p, i) => { const s = easeOut(grow(anim.alerts, p.delay)), h = Math.max(p.h * s, 1e-4); pillars.setMatrixAt(i, m4.compose(v1.set(p.x, 0.2 + h / 2, p.z), q.identity(), v2.set(1, h, 1))); });
      pillars.instanceMatrix.needsUpdate = true;
    }
    balanceGroup.visible = anim.balance > 0.001; balanceGroup.scale.y = Math.max(easeOut(anim.balance), 1e-4);
    heatGlow.visible = sweep.visible = anim.outlook > 0.001;
    (heatGlow.material as THREE.MeshBasicMaterial).opacity = anim.outlook * (0.6 + 0.2 * Math.sin(time * 2.2)); heatGlow.scale.setScalar(0.85 + 0.15 * Math.sin(time * 1.1));
    (sweep.material as THREE.MeshBasicMaterial).opacity = anim.outlook * 0.3; sweep.rotation.z = -time * 1.4;
    horizons.forEach(h => { (h.material as THREE.MeshBasicMaterial).opacity = anim.outlook * 0.45; });
    dome.visible = anim.shield > 0.001; dome.scale.setScalar(Math.max(easeOut(anim.shield), 1e-4)); dome.rotation.y = time * 0.05;
    spokes.visible = anim.finale > 0.001; spokeMaterial.uniforms.uOpacity.value = anim.finale * 0.6; spokePulses.material.opacity = anim.finale;
    if (spokes.visible) { for (let i = 0; i < 28; i++) { spokeCurves[i % 7].getPoint((time * 0.15 + i / 28) % 1, v1); spokePulses.position.setXYZ(i, v1.x, v1.y, v1.z); } spokePulses.position.needsUpdate = true; }

    if (changed('blocks')) {
      cubes.visible = anim.blocks > 0.001;
      cubeData.forEach((c, i) => { const s = grow(anim.blocks, c.delay, 0.3), size = s > 0 ? Math.min(1, s * 3) : 1e-4; cubes.setMatrixAt(i, m4.compose(v1.set(c.x, c.y + (1 - easeOut(s)) * 5, c.z), q.identity(), v2.set(size, size, size))); });
      cubes.instanceMatrix.needsUpdate = true;
    }
    blockPivot.rotation.y += dt * 0.12 * anim.blocks;

    streams.object.visible = anim.signals > 0.001; streams.material.opacity = anim.signals; core.scale.setScalar(Math.max(easeOut(anim.braid), 1e-4));
    if (streams.object.visible) {
      const braid = easeInOut(anim.braid);
      streamSeeds.forEach((s, i) => { const k = Math.floor(i / perStream); streamPoint(k, (s.t + time * 0.06) % 1, braid, v1); streams.position.setXYZ(i, v1.x + s.jitter[0], v1.y + s.jitter[1], v1.z + s.jitter[2]); });
      streams.position.needsUpdate = true;
      streamLines.forEach((l, k) => { for (let i = 0; i < 120; i++) { streamPoint(k, i / 119, braid, v1); l.position.setXYZ(i, v1.x, v1.y, v1.z); } l.position.needsUpdate = true; l.material.opacity = l.base * anim.signals; });
    } else streamLines.forEach(l => { l.material.opacity = 0; });

    const sourcesOn = anim.sources > 0.001;
    feedMeshes.forEach(({ pillar, cap }, i) => { const h = Math.max(feeds[i].h * easeOut(grow(anim.sources, i / 3)), 1e-4); pillar.scale.y = h; pillar.position.y = -2.2 + h / 2; cap.position.y = -2.2 + h; pillar.visible = cap.visible = sourcesOn; });
    clock.visible = beams.object.visible = sourcesOn; clock.scale.setScalar(Math.max(easeOut(anim.sources), 1e-4)); hand.rotation.y = -time * 0.8; beams.material.opacity = anim.sources;
    if (sourcesOn) { for (let i = 0; i < 144; i++) { feedMeshes[i % 4].curve.getPoint((time * 0.22 + Math.floor(i / 4) / 36) % 1, v1); beams.position.setXYZ(i, v1.x, v1.y, v1.z); } beams.position.needsUpdate = true; }

    const layersOn = anim.layers > 0.001;
    shelves.forEach((slab, i) => { slab.visible = layersOn; slab.scale.set(Math.max(easeOut(grow(anim.layers, i / 2)), 1e-4), 1, Math.max(easeOut(grow(anim.layers, i / 2)), 1e-4)); });
    records.object.visible = layersOn; records.material.opacity = anim.layers;
    if (layersOn) {
      recordSeeds.forEach((r, i) => {
        const y = 3.6 - ((r.phase + time * 0.09) % 1) * 6.4, f = y > 2 ? 0 : y > 0 ? 0.6 * (2 - y) / 2 : y > -2 ? 0.6 + 0.4 * -y / 2 : 1, e = easeInOut(f);
        records.position.setXYZ(i, r.rx + (r.gx - r.rx) * e, y, r.rz + (r.gz - r.rz) * e);
        (f < 0.6 ? mixed.copy(colorRaw).lerp(colorClean, f / 0.6) : mixed.copy(colorClean).lerp(colorCurated, (f - 0.6) / 0.4)).multiplyScalar(y < -2.2 ? Math.max(0, 1 + (y + 2.2) * 2.5) : 1);
        records.color.setXYZ(i, mixed.r, mixed.g, mixed.b);
      });
      records.position.needsUpdate = true; records.color.needsUpdate = true;
    }

    const schemaOn = anim.schema > 0.001;
    schemaPivot.visible = schemaOn; schemaPivot.rotation.y = Math.sin(time * 0.2) * 0.3;
    nodeMeshes.forEach((mesh, i) => mesh.scale.setScalar(Math.max(easeOut(grow(anim.schema, i / 6)), 1e-4)));
    linkMaterial.opacity = anim.schema * 0.4; linkPulses.material.opacity = anim.schema;
    if (schemaOn) { for (let i = 0; i < links.length * 3; i++) { const [a, b] = links[i % links.length]; v1.set(...nodes[a].at).lerp(v2.set(...nodes[b].at), (time * 0.3 + Math.floor(i / links.length) / 3) % 1); linkPulses.position.setXYZ(i, v1.x, v1.y, v1.z); } linkPulses.position.needsUpdate = true; }

    const tunnelOn = anim.tunnel > 0.001;
    tunnelRings.forEach((ringMesh, i) => { ringMesh.visible = tunnelOn; ringMesh.scale.setScalar(Math.max(easeOut(grow(anim.tunnel, i / 17)), 1e-4)); });
    wall.visible = flow.object.visible = tunnelOn; (wall.material as THREE.MeshBasicMaterial).opacity = anim.tunnel * 0.1; flow.material.opacity = anim.tunnel;
    if (tunnelOn) { flowSeeds.forEach((s, i) => { const x = s.future ? wallX + 0.4 + ((s.phase + time * 0.02) % 1) * 3 : -5 + ((s.phase + time * 0.12) % 1) * (wallX - 0.12 + 5); flow.position.setXYZ(i, x, s.y, s.z); }); flow.position.needsUpdate = true; }

    const wavesOn = anim.waves > 0.001, waveY = (k: number, x: number) => 0.95 - k * 0.95 + 0.5 * Math.sin(1.25 * x - time * 1.2 - k * 0.9);
    waves.forEach(w => { w.object.visible = wavesOn; w.material.opacity = w.base * anim.waves; });
    waveDots.object.visible = wavesOn; waveDots.material.opacity = anim.waves;
    if (wavesOn) {
      waves.forEach((w, k) => { for (let i = 0; i < 200; i++) { const x = -4.6 + i / 199 * 9.2; w.position.setXYZ(i, x, waveY(k, x), 0); } w.position.needsUpdate = true; });
      for (let i = 0; i < 180; i++) { const k = i % 3, x = -4.6 + ((i / 180 + time * 0.04) % 1) * 9.2; waveDots.position.setXYZ(i, x, waveY(k, x), 0); }
      waveDots.position.needsUpdate = true;
    }
    const cloudOn = anim.cloud > 0.001;
    cloud.object.visible = cloudOn; cloud.material.opacity = anim.cloud;
    axisLines.forEach(m => { m.opacity = anim.cloud * (1 - anim.cluster) * 0.85; });
    analysisPivot.rotation.y += dt * 0.14 * anim.cloud;
    if (cloudOn) {
      const flat = easeInOut(anim.flat), grouped = easeInOut(anim.cluster);
      cloudSeeds.forEach((s, i) => {
        v1.lerpVectors(s.solid, s.flat, flat).lerp(s.grouped, grouped); cloud.position.setXYZ(i, v1.x, v1.y, v1.z);
        mixed.copy(neutral).lerp(clusterTint[s.k], grouped); cloud.color.setXYZ(i, mixed.r, mixed.g, mixed.b);
      });
      cloud.position.needsUpdate = true; cloud.color.needsUpdate = true;
    }

    const settled = !flight || flight.t > 0.85;
    for (const l of labels) {
      let on = settled && l.shots.includes(current);
      if (on) { l.anchor.updateWorldMatrix(true, false); v1.copy(l.offset); l.anchor.localToWorld(v1).project(camera); on = v1.z < 1; if (on) l.element.style.transform = `translate(${((v1.x * 0.5 + 0.5) * width).toFixed(1)}px, ${((-v1.y * 0.5 + 0.5) * height).toFixed(1)}px) translate(-50%, -100%)`; }
      l.element.classList.toggle('on', on);
    }
  }
  function tick(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    if (document.hidden) { previous = now; return; }
    const dt = Math.min((now - previous) / 1000, 0.1); previous = now;
    if (paused && !dirty) return;
    if (!paused && !low && samples.length < 150) {
      samples.push(dt);
      // A slow median frame after warm-up means a weak GPU: drop resolution and glow, keep the motion.
      if (samples.length === 150 && [...samples].sort((a, b) => a - b)[75] > 0.034) { low = true; renderer.setPixelRatio(1); composer.setPixelRatio(1); bloom.enabled = false; bokeh.enabled = false; swarm.setVisible(lowSwarm); resize(); }
    }
    time += paused ? 0 : dt;
    update(paused ? 0 : dt);
    composer.render(); dirty = false;
  }
  function contextLost(event: Event) { event.preventDefault(); host.classList.remove('scene-ready'); paused = true; }
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  // Opening: start high over the planet's glowing rim and dive down to the first shot.
  resize(); basePos.set(30, 100, 250); baseLook.set(0, 6, -60); camera.position.copy(basePos); camera.lookAt(baseLook);
  setShot(initial); host.classList.add('scene-ready'); frame = requestAnimationFrame(tick);
  return {
    setShot(next) { if (next !== current) setShot(next); },
    setSupply(mw) { supply = mw; applySupply(); dirty = true; },
    setPaused(value) { paused = value; if (paused) { swarm.settle(); revealing.progress = 1; reveals[revealing.station].value = shown; } if (paused && flight) { basePos.copy(flight.to); baseLook.copy(flight.lookTo); flight = null; } dirty = true; },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('pointermove', move);
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
      scene.traverse(obj => { const mesh = obj as THREE.Mesh; if (mesh.geometry) geometries.add(mesh.geometry); if (mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m => materials.add(m)); });
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); dot.dispose(); heat.dispose(); environment.dispose(); swarm.dispose(); composer.dispose(); renderer.dispose(); renderer.domElement.remove(); labels.forEach(l => l.element.remove());
    },
  };
}
