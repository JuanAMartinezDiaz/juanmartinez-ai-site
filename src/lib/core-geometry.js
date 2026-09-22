// Real three-dimensional geometry, rendered locally with WebGL.
// The photographed containment chamber remains the backdrop; the energy core
// has perspective, depth shading, independent orbital rotations, and particles.
// No external scripts, assets, or services are required.

export const VERTEX_SHADER = `
  precision highp float;
  attribute vec3 aPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aOrbit;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixels;
  varying vec3 vColor;
  varying float vLight;

  mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }
  mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }
  mat3 rotateZ(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
  }
  void main() {
    float pulse = 1.0 + 0.017 * sin(uTime * 0.75 + aPhase);
    vec3 p = aPosition * pulse;
    p = rotateY(uTime * (0.15 + aOrbit * 0.014) + aOrbit * 0.25) * p;
    p = rotateX(0.48 + uTime * (0.065 + aOrbit * 0.003)) * p;
    p = rotateZ(0.12 * sin(uTime * 0.17)) * p;
    p.y += 0.022 * sin(uTime * 0.55);
    float depth = 3.8 - p.z;
    float perspective = 3.8 / depth;
    gl_Position = vec4(p.xy * 0.72 * perspective, -p.z * 0.1, 1.0);
    gl_PointSize = max(1.0, aSize * uPixels * perspective);
    vColor = aColor;
    vLight = (0.45 + 0.42 * (p.z + 1.0) / 2.0)
      * (0.88 + 0.12 * sin(uTime * 0.6 + aPhase));
  }
`;

export const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float uPoints;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vLight;
  void main() {
    float strength = 1.0;
    if (uPoints > 0.5) {
      vec2 q = gl_PointCoord * 2.0 - 1.0;
      float r2 = dot(q, q);
      if (r2 > 1.0) discard;
      strength = exp(-r2 * 7.0) * 0.73 + exp(-r2 * 2.8) * 0.16;
      strength *= 1.0 - smoothstep(0.65, 1.0, r2);
    }
    float alpha = strength * vLight * uOpacity;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`;

export function buildCoreGeometry() {
  const vertices = [];
  const paths = [];
  const cyan = [0.52, 0.86, 1.0];
  const ice = [0.74, 0.94, 1.0];
  function point(x, y, z, color, size, orbit, phase) {
    vertices.push(x, y, z, ...color, size, orbit, phase);
  }
  // Closed three-dimensional filaments wind around a contained spherical core.
  for (let orbit = 0; orbit < 10; orbit++) {
    const start = vertices.length / 9;
    const tilt = orbit * 0.47 + 0.2;
    for (let i = 0; i <= 240; i++) {
      const angle = i / 240 * Math.PI * 2;
      const radius = 0.79 + 0.065 * Math.sin(angle * 3 + orbit * 1.7);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.sin(angle * 2 + orbit) * 0.12;
      point(x, y * Math.cos(tilt) - z * Math.sin(tilt),
        y * Math.sin(tilt) + z * Math.cos(tilt),
        orbit % 3 === 0 ? ice : cyan, 2.3, orbit, angle * 2 + orbit);
    }
    paths.push({ first: start, count: 241 });
  }
  const particleStart = vertices.length / 9;
  // A deterministic Fibonacci shell gives the energy volume depth without noise.
  for (let i = 0; i < 440; i++) {
    const y = 1 - 2 * (i + 0.5) / 440;
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const radius = 0.64 + 0.18 * (0.5 + 0.5 * Math.sin(i * 13.7));
    const side = Math.sqrt(1 - y * y);
    point(Math.cos(angle) * side * radius, y * radius,
      Math.sin(angle) * side * radius, i % 31 === 0 ? ice : cyan,
      i % 19 === 0 ? 5.5 : 2.6, 2, i * 0.3);
  }
  // Small inner cloud and a luminous nucleus, each in the same 3D projection.
  for (let i = 0; i < 95; i++) {
    const angle = i * 2.39996;
    const y = 1 - 2 * (i + 0.5) / 95;
    const side = Math.sqrt(1 - y * y);
    const radius = 0.12 + 0.08 * Math.sin(i * 4.1) ** 2;
    point(Math.cos(angle) * side * radius, y * radius,
      Math.sin(angle) * side * radius, ice, 4.0, 1, i * 0.2);
  }
  point(0, 0, 0, [0.11, 0.43, 0.68], 144, 0, 0);
  point(0, 0, 0, [0.36, 0.8, 1.0], 53, 0, 0);
  point(0, 0, 0, [0.96, 0.99, 1.0], 15, 0, 0);
  return { vertices: new Float32Array(vertices), paths, particleStart,
    particleCount: vertices.length / 9 - particleStart };
}

