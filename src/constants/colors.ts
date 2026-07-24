// Mirrors select CSS custom properties from globals.css for contexts that
// can't read them directly — SVG/Canvas fill attributes, Recharts, and
// Three.js materials all need a literal color value, not a var() reference.
// Keep these in sync with the corresponding tokens in globals.css.
export const ACCENT_HEX = "#3b82f6"; // --accent
export const MUTED_FOREGROUND_HEX = "#8a8fa3"; // --muted-foreground
export const PANEL_HEX = "#0f131a"; // --panel
