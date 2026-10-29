import * as THREE from 'three';

/** A target shape for the swarm: one position and one linear RGB color per particle. */
export interface Formation { position: Float32Array; color: Float32Array }

const vertexShader = /* glsl */`
attribute vec3 aFrom;
attribute vec3 aColorFrom;
attribute vec3 aColor;
attribute float aSeed;
uniform float uProgress, uTime, uSize, uScale, uLift, uTurbulence, uFog;
uniform vec3 uTrail;
varying vec3 vColor;
varying float vFade;
vec3 swirl(vec3 p) { return vec3(sin(p.y * 1.7 + p.z * 0.9 + uTime * 0.6), sin(p.z * 1.3 + p.x * 1.1 - uTime * 0.5), sin(p.x * 1.5 + p.y * 0.7 + uTime * 0.4)); }
void main() {
  // Each particle leaves on its own beat (aSeed), arcs over the world, and swirls hardest mid-flight.
  float d = clamp((uProgress - aSeed * 0.4) / 0.6, 0.0, 1.0);
  float e = d * d * (3.0 - 2.0 * d);
  vec3 mid = mix(aFrom, position, 0.5) + vec3(0.0, uLift * (0.6 + aSeed * 0.8), 0.0);
  vec3 p = mix(mix(aFrom, mid, e), mix(mid, position, e), e);
  float travel = sin(e * 3.14159265);
  p += (swirl(p * 0.18) + 0.5 * swirl(p * 0.5 + 3.0)) * travel * uTurbulence;
  p += vec3(sin(uTime * 0.7 + aSeed * 40.0), cos(uTime * 0.6 + aSeed * 31.0), sin(uTime * 0.5 + aSeed * 17.0)) * 0.02;
  // Shapes with black colors are invisible at rest; uTrail lights every particle only while it is travelling.
  vColor = mix(aColorFrom, aColor, e) * (1.0 + travel * 1.4) + uTrail * travel * (0.4 + aSeed);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(-mv.z, 0.1);
  vFade = exp(-uFog * uFog * depth * depth);
  gl_PointSize = uSize * uScale * (0.55 + aSeed * 0.9) * (1.0 + travel * 0.9) / depth;
  gl_Position = projectionMatrix * mv;
}`;
const fragmentShader = /* glsl */`
uniform float uOpacity;
varying vec3 vColor;
varying float vFade;
void main() {
  float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(vColor * a * a * vFade * uOpacity, 1.0);
}`;

export function createSwarm(count: number, seed: () => number) {
  const geometry = new THREE.BufferGeometry();
  const attribute = (size: number) => new THREE.BufferAttribute(new Float32Array(count * size), size);
  const to = attribute(3), color = attribute(3), from = attribute(3), colorFrom = attribute(3), seeds = attribute(1);
  for (let i = 0; i < count; i++) seeds.setX(i, seed());
  geometry.setAttribute('position', to); geometry.setAttribute('aColor', color);
  geometry.setAttribute('aFrom', from); geometry.setAttribute('aColorFrom', colorFrom); geometry.setAttribute('aSeed', seeds);
  const uniforms = { uProgress: { value: 1 }, uTime: { value: 0 }, uSize: { value: 0.07 }, uScale: { value: 400 }, uLift: { value: 0 }, uTurbulence: { value: 0 }, uFog: { value: 0.03 }, uOpacity: { value: 1 }, uTrail: { value: new THREE.Color(0, 0, 0) } };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const object = new THREE.Points(geometry, material); object.frustumCulled = false;
  let duration = 1, current: Formation | null = null, scattered = false;

  /** Freeze where every particle is right now, then head for the new shape. */
  function morph(target: Formation, seconds: number, lift: number, turbulence: number, instant: boolean) {
    if (target === current) return;
    const progress = uniforms.uProgress.value, lastLift = uniforms.uLift.value;
    if (current) for (let i = 0; i < count; i++) {
      const s = seeds.getX(i), d = Math.min(1, Math.max(0, (progress - s * 0.4) / 0.6)), e = d * d * (3 - 2 * d), u = 1 - e, raise = lastLift * (0.6 + s * 0.8);
      for (let k = 0; k < 3; k++) {
        const a = from.array[i * 3 + k], b = to.array[i * 3 + k], mid = (a + b) / 2 + (k === 1 ? raise : 0);
        from.array[i * 3 + k] = u * u * a + 2 * u * e * mid + e * e * b;
        colorFrom.array[i * 3 + k] = colorFrom.array[i * 3 + k] * u + color.array[i * 3 + k] * e;
      }
    }
    else if (!scattered) { from.array.set(target.position); colorFrom.array.set(target.color); }
    to.array.set(target.position); color.array.set(target.color);
    for (const a of [to, color, from, colorFrom]) a.needsUpdate = true;
    current = target; duration = Math.max(0.1, seconds);
    uniforms.uLift.value = lift; uniforms.uTurbulence.value = turbulence; uniforms.uProgress.value = instant ? 1 : 0;
  }
  return {
    object, morph, trail: uniforms.uTrail.value,
    /** Start somewhere other than the first shape, so the opening shot can assemble itself. */
    scatter(start: Formation) { from.array.set(start.position); colorFrom.array.set(start.color); from.needsUpdate = colorFrom.needsUpdate = true; scattered = true; },
    update(dt: number, time: number, fog: number, scale: number) {
      uniforms.uProgress.value = Math.min(1, uniforms.uProgress.value + dt / duration);
      uniforms.uTime.value = time; uniforms.uFog.value = fog; uniforms.uScale.value = scale;
    },
    settle() { uniforms.uProgress.value = 1; },
    setVisible(n: number) { geometry.setDrawRange(0, n); },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
