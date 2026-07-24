import { ACCENT_HEX, PANEL_HEX } from "./colors";

export const CAMERA = {
  fov: 42,
  sceneHalfWidth: 5.2,
  minDistance: 7,
} as const;

export const HERO_SCENE = {
  rawData: {
    count: 220,
    spread: [1.8, 1.5, 1.2] as [number, number, number],
    center: [-4.4, 0, 0] as [number, number, number],
    color: "#5b6b8c",
  },
  nodes: {
    center: [-0.2, 0, 0] as [number, number, number],
    color: ACCENT_HEX,
  },
  insight: {
    position: [4.4, 0.1, 0] as [number, number, number],
    color: "#60a5fa",
  },
  flow: {
    count: 14,
    speed: 0.12,
    color: "#93c5fd",
  },
  ambientLight: {
    color: "#8ea2ff",
    intensity: 0.55,
  },
  fog: {
    color: PANEL_HEX,
    density: 0.055,
  },
} as const;

export const NODE_POSITIONS: [number, number, number][] = [
  [-1.1, 0.55, 0.25],
  [-0.35, 0.95, -0.35],
  [0.45, 0.65, 0.45],
  [1.1, 0.3, -0.2],
  [-0.85, -0.5, 0.35],
  [0.05, -0.85, -0.25],
  [0.85, -0.55, 0.2],
  [-0.15, 0.05, -0.55],
];

export const NODE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [1, 7],
  [4, 5],
  [5, 6],
  [6, 3],
  [7, 2],
  [4, 7],
];

export const WOW_SCENE = {
  camera: {
    position: [0, 0, 4.2] as [number, number, number],
    fov: 45,
  },
  ambientLight: {
    color: "#8ea2ff",
    intensity: 0.5,
  },
  pointLight: {
    position: [2, 2, 3] as [number, number, number],
    color: "#60a5fa",
    intensity: 18,
    distance: 10,
    decay: 2,
  },
  fog: {
    color: PANEL_HEX,
    density: 0.12,
  },
  particle: {
    color: ACCENT_HEX,
    radius: 1.6,
  },
  glowOrb: {
    color: ACCENT_HEX,
    radius: 0.1,
    intensity: 1.8,
    haloScale: 2.2,
  },
} as const;
