// Each formation returns a Float32Array of the same length (count * 3), with
// particle `i` occupying the same array slot across every formation. That
// stable index-to-particle mapping is what makes lerping between two
// formations read as one field reorganizing itself, rather than particles
// teleporting to mismatched targets.

function randomInSphere(radius: number): [number, number, number] {
  const r = radius * Math.cbrt(Math.random());
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

/** Stage 1 — Raw Data: a loose, chaotic cloud with no order. */
export function createRawDataFormation(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = randomInSphere(radius);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

/** Stage 2 — AI Processing: particles pulled into a swirling multi-arm vortex. */
export function createProcessingFormation(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const arms = 3;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const arm = i % arms;
    const angle = t * Math.PI * 6 + (arm * (Math.PI * 2)) / arms;
    const r = radius * (0.15 + t * 0.85);
    const wobble = (Math.random() - 0.5) * radius * 0.08;
    positions[i * 3] = Math.cos(angle) * r + wobble;
    positions[i * 3 + 1] = (Math.random() - 0.5) * radius * 0.3;
    positions[i * 3 + 2] = Math.sin(angle) * r + wobble;
  }
  return positions;
}

/** Stage 3 — Structured Intelligence: an evenly-spaced sphere lattice. */
export function createStructuredFormation(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    positions[i * 3] = Math.cos(theta) * radiusAtY * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * radius;
  }
  return positions;
}

/** Stage 4 — AI Automation: the lattice resolves into several dispatched clusters. */
export function createAutomationFormation(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const clusterCount = 6;
  for (let i = 0; i < count; i++) {
    const cluster = i % clusterCount;
    const clusterAngle = (cluster / clusterCount) * Math.PI * 2;
    const clusterDistance = radius * 1.15;
    const cx = Math.cos(clusterAngle) * clusterDistance;
    const cz = Math.sin(clusterAngle) * clusterDistance;
    const [lx, ly, lz] = randomInSphere(radius * 0.22);
    positions[i * 3] = cx + lx;
    positions[i * 3 + 1] = ly;
    positions[i * 3 + 2] = cz + lz;
  }
  return positions;
}
