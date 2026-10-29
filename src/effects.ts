import * as THREE from 'three';

const basicVertex = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

/** A dark planet under the world. Its top is flat enough to stand the stations on; its grid is drawn by the shader so it follows the curve. */
export function createPlanet(radius: number, top: number, base: number, line: number) {
  const uniforms = { uBase: { value: new THREE.Color(base) }, uLine: { value: new THREE.Color(line) }, uFog: { value: 0.03 }, uCamera: { value: new THREE.Vector3() } };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */`
      varying vec3 vWorld;
      void main() { vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform vec3 uBase, uLine, uCamera; uniform float uFog;
      varying vec3 vWorld;
      float grid(vec2 p, float step) { vec2 q = p / step; vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q); return 1.0 - min(min(g.x, g.y), 1.0); }
      void main() {
        float r = length(vWorld.xz);
        float lines = (grid(vWorld.xz, 2.0) * 0.5 + grid(vWorld.xz, 10.0) * 0.5) * (1.0 - smoothstep(60.0, 160.0, r));
        float d = distance(uCamera, vWorld);
        float fog = 1.0 - exp(-uFog * uFog * d * d);
        gl_FragColor = vec4(uBase + uLine * lines * (1.0 - fog), 1.0);
      }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 256, 128), material);
  mesh.position.y = top - radius;
  return { mesh, uniforms };
}

/** Background drawn as a shader (not the clear color) so it goes through the same color path as the planet and matches it exactly. */
export function createBackdrop(radius: number, color: number) {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, depthTest: false,
    uniforms: { uColor: { value: new THREE.Color(color) } },
    vertexShader: 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 1.0); }',
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 8), material);
  mesh.frustumCulled = false; mesh.renderOrder = -10;
  return mesh;
}

/** Glowing rim around the planet, seen only from altitude (on the opening and closing shots). */
export function createAtmosphere(radius: number, top: number, color: number) {
  const uniforms = { uColor: { value: new THREE.Color(color) }, uStrength: { value: 0 } };
  const material = new THREE.ShaderMaterial({
    uniforms, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      varying vec3 vNormal; varying vec3 vRay;
      void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vRay = normalize(mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; uniform float uStrength;
      varying vec3 vNormal; varying vec3 vRay;
      void main() { float rim = pow(clamp(dot(normalize(vNormal), normalize(vRay)), 0.0, 1.0), 3.0); gl_FragColor = vec4(uColor * rim * uStrength, 1.0); }`,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.035, 128, 64), material);
  mesh.position.y = top - radius;
  return { mesh, uniforms };
}

/** Additive tube material with bright pulses travelling along the tube (uv.x runs along its length). */
export function createFlowMaterial(color: number, dashes: number, speed: number, base = 0.35) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uOpacity: { value: 1 }, uDashes: { value: dashes }, uSpeed: { value: speed }, uBase: { value: base } },
    vertexShader: basicVertex,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; uniform float uTime, uOpacity, uDashes, uSpeed, uBase;
      varying vec2 vUv;
      void main() {
        float pulse = pow(fract(vUv.x * uDashes - uTime * uSpeed), 8.0);
        gl_FragColor = vec4(uColor * (uBase + pulse * 3.0) * uOpacity, 1.0);
      }`,
  });
}

/** Hologram shell: bright at grazing angles, with slow scan bands rising up the surface. */
export function createHologramMaterial(color: number) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uTime: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */`
      varying vec3 vNormal; varying vec3 vView; varying float vHeight;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal); vView = -mv.xyz; vHeight = position.y;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; uniform float uTime, uOpacity;
      varying vec3 vNormal; varying vec3 vView; varying float vHeight;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.4);
        float scan = smoothstep(0.94, 1.0, 0.5 + 0.5 * sin(vHeight * 9.0 - uTime * 2.2));
        gl_FragColor = vec4(uColor * (fresnel * 1.3 + scan * 0.3 + 0.02) * uOpacity, 1.0);
      }`,
  });
}

/**
 * Blueprint-to-real: surfaces above the world height uReveal are cut away, and a bright seam glows where the cut is.
 * The edge lines stay visible throughout, so a station first reads as a drawing and then fills in from the floor up.
 */
export function makeRevealable(material: THREE.Material, reveal: { value: number }, seam: { value: THREE.Color }) {
  material.onBeforeCompile = shader => {
    shader.uniforms.uReveal = reveal; shader.uniforms.uSeam = seam;
    shader.vertexShader = 'varying float vRevealY;\n' + shader.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
      vec4 revealPosition = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        revealPosition = instanceMatrix * revealPosition;
      #endif
      vRevealY = (modelMatrix * revealPosition).y;`);
    shader.fragmentShader = 'uniform float uReveal;\nuniform vec3 uSeam;\nvarying float vRevealY;\n' + shader.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
      float revealDepth = uReveal - vRevealY;
      if (revealDepth < 0.0) discard;
      gl_FragColor.rgb += uSeam * smoothstep(0.3, 0.0, revealDepth) * 2.5;`);
  };
  material.customProgramCacheKey = () => 'reveal';
}
