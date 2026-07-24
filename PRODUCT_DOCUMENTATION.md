---
title: "Xai — Intelligence Workspace: Product Documentation"
subtitle: "Frontend Challenge Submission"
date: "2026-07-24"
version: "1.0"
---

# Xai — Intelligence Workspace

## Product Documentation

**Version 1.0 — 2026-07-24**

---

## Table of Contents

1. Project Overview
2. Challenge Goal
3. Product Vision
4. Product Narrative
5. Information Architecture
6. Design Process
7. Design System
8. Motion Strategy
9. Three.js Integration
10. GSAP Usage
11. Framer Motion Architecture
12. Responsive Strategy
13. Accessibility
14. Performance Optimization
15. Engineering Decisions
16. Folder Structure
17. Challenges & Solutions
18. Conclusion

---

## 1. Project Overview

Xai — Intelligence Workspace is a single-page Next.js application built as a submission for a frontend engineering challenge. It presents a fictional AI data-intelligence product through an interactive Three.js hero visualization, a scroll-driven insight-flow narrative, a mock product dashboard, and a signature particle-based interaction, all composed on one static page with no backend, authentication, or additional routes.

The application is built with Next.js 15 (App Router), React 19, and TypeScript, styled with Tailwind CSS v4, and animated using Framer Motion, GSAP with ScrollTrigger, and React Three Fiber.

## 2. Challenge Goal

The brief required a single-page experience combining the following, all of which are implemented:

- An interactive Three.js / React Three Fiber hero visualization communicating "raw data → structured intelligence," responsive to scroll and cursor input.
- A three-stage, scroll-driven "Interactive Insight Flow" using GSAP ScrollTrigger.
- A mock "Intelligence Dashboard" preview with a sidebar, KPI cards, a chart, a table, and animated tab transitions.
- Exactly one polished signature interaction — implemented as a scroll-driven particle "data cluster reorganization."
- Implementation matching a supplied Figma reference for layout, spacing, typography, and color.
- Full responsiveness across desktop, tablet, and mobile.
- Accessibility support, including keyboard navigation and `prefers-reduced-motion`.
- A clean, optimized production build using Next.js, React, Framer Motion, GSAP, and React Three Fiber.

## 3. Product Vision

Xai is positioned as an "Intelligence Workspace" — a product that automatically transforms unstructured data into structured, actionable insight. This is stated directly in the hero copy: *"Xai transforms unstructured data into actionable insights — automatically."* The product surface implied by the dashboard preview (Overview, Insights, Sources, Automations) frames Xai as a workspace for connecting data sources, reviewing AI-generated insights, and triggering automated workflows from them.

## 4. Product Narrative

The same story is told at increasing levels of concreteness as the page is scrolled:

| Section | Narrative beat | Implementation |
|---|---|---|
| Hero | Raw data becomes structured intelligence | Headline copy, plus a 3D scene showing a particle cloud, a connected node network, and a data-flow curve moving between them |
| Interactive Insight Flow | The process, in three steps | *01 Ingest Data → 02 Analyze with AI → 03 Generate Insight* |
| Intelligence Dashboard Preview | The output, as a product | KPIs, generated insights, and automations shown as a working UI |
| Signature interaction | The full loop, visualized | A particle field reorganizing through *01 Raw Data → 02 AI Processing → 03 Structured Intelligence → 04 AI Automation* |

## 5. Information Architecture

The application is a single page (`src/app/page.tsx`) composed of a fixed header and four sections in document order: Hero, Interactive Insight Flow, Intelligence Dashboard Preview, and the signature WOW interaction. There are no client-side routes and no page navigation — all "navigation" is same-page anchor scrolling.

**Header navigation** exposes three anchor links and one CTA:

- `Product` → `#hero`
- `Docs` → `#insight-flow`
- `Pricing` → `#dashboard`
- `Get Started` (CTA) → `#dashboard`

The WOW section has no `id` and no header nav entry — it is reached only by continued scrolling past the dashboard, consistent with its role as the page's closing interaction rather than a navigable destination.

**Within the Dashboard**, a secondary, self-contained information architecture exists: four tabs (Overview, Insights, Sources, Automations) switch the visible KPI/chart/table content via local component state — this is a UI-state change, not a route change.

Scroll-spy logic (`useActiveSection`) highlights the current header nav link based on which section is intersecting the viewport, and all anchor navigation is focus-managed — the target section receives keyboard focus after scrolling so assistive technology and keyboard users land in the right place.

## 6. Design Process

The design source of truth was a set of exported Figma reference screenshots (stored outside the application source, in a git-ignored `/Figma` directory) covering the Hero, Interactive Insight Flow, and Dashboard Overview views. These screenshots specify exact copy, spacing, card composition, typography pairing (a monospace treatment for the hero's second headline line), and color usage.

Implementation translated this reference into reusable design tokens (CSS custom properties) and component structure rather than one-off styling per section. A compliance pass cross-checked the built UI against the Figma screenshots directly; this identified one deviation — an "AI Insight" callout panel present in the dashboard implementation but absent from the Figma reference — which was removed to restore an exact match between the two KPI-to-chart/table layouts.

## 7. Design System

**Color tokens** (`src/app/globals.css`, exposed via Tailwind's `@theme inline`):

`--background`, `--foreground`, `--muted-foreground`, `--accent`, `--button-primary`, `--panel`, `--panel-border`, `--badge`, `--badge-border`, `--secondary`, `--secondary-foreground`.

`--button-primary` is a deliberately deeper shade of `--accent`, used only for solid button fills — white text on `--accent` directly reaches roughly 3.68:1 contrast, failing WCAG AA for normal text, so a documented adjustment keeps `--accent` itself unchanged (headlines, focus rings, badges) while making button text legible.

A small `constants/colors.ts` module mirrors the key hex values (`ACCENT_HEX`, `MUTED_FOREGROUND_HEX`, `PANEL_HEX`) for contexts that cannot resolve CSS custom properties — Three.js materials and Recharts SVG fills — with an explicit comment requiring them to be kept in sync with `globals.css`.

**Typography**: Geist Sans and Geist Mono, loaded via `next/font/google` with `display: "swap"`. The hero's second headline line uses the monospace family as an accent treatment against the sans-serif first line.

**UI primitives** (`src/components/ui/`): `Button`, `Card`, and `Badge`, each built on `class-variance-authority` for typed, consistent variant handling (e.g. `Button` exposes `primary`/`secondary` variants and `default`/`sm` sizes) rather than ad hoc class combinations per usage site.

**Shape language**: consistent corner radii (`rounded-lg` for buttons/nav items, `rounded-2xl` for cards, `rounded-3xl` for the dashboard and WOW canvas containers) and a shared `border-panel-border` treatment for panel edges.

## 8. Motion Strategy

Three animation systems are used, each for a distinct purpose, rather than one library handling everything:

- **Framer Motion** — entrance choreography and UI-state transitions (element reveals, tab crossfades, shared-element indicators).
- **GSAP + ScrollTrigger** — scroll-position-driven logic: staggered reveals tied to scroll position, and continuous "what's centered in the viewport" tracking.
- **React Three Fiber / Three.js** — real-time 3D rendering driven by scroll progress and cursor position inside the render loop.

All three layers share the same governing principle: **`prefers-reduced-motion` is checked at every layer.** Framer Motion transitions collapse to near-zero duration, GSAP scroll effects are skipped outright, and R3F scenes stop animating and disable pointer parallax. A single shared easing constant, `EASE_OUT` (`src/constants/motion.ts`, value `[0.22, 1, 0.36, 1]`), is used across Framer Motion components for a consistent motion feel and to avoid the value being redeclared per file.

## 9. Three.js Integration

Three.js is used via `@react-three/fiber`, wrapped in a shared `SceneCanvas` component (`src/components/three/scene-canvas.tsx`) that configures device-pixel-ratio clamping (`dpr={[1, 2]}`), `alpha`/`antialias` rendering, `powerPreference: "low-power"`, and a configurable `frameloop` mode.

**Reusable primitives** (`src/components/three/`):
- `GlowOrb` — a small emissive sphere with an additive-blended halo mesh, used for network nodes and the hero/WOW "insight" points.
- `ParticleField` — a `Points` cloud that can blend between a randomized "chaotic" layout and a computed grid layout via a 0–1 `organizeProgress` ref.

**Hero scene** (`src/sections/hero/hero-scene.tsx`): an 8-node network connected by 10 edges (`constants/three.ts`), a `ParticleField` representing raw data, a `DataFlow` points stream following a `QuadraticBezierCurve3` from the raw-data cluster through the node network to the "insight" orb, and a `CameraRig` that combines a slow idle drift with damped mouse-parallax and a per-frame camera-distance calculation that keeps the full scene width in frame as the panel's aspect ratio changes across breakpoints (4:3 on mobile, 21:9 on desktop).

**WOW scene** (`src/sections/wow/wow-scene.tsx`): a single particle field that interpolates between four precomputed formations (`wow-particle-formations.ts`) — a chaotic sphere, a multi-arm vortex, a golden-angle sphere lattice, and six dispatched clusters — based on scroll progress, plus a calmer camera parallax than the hero.

**Mounting strategy**: both canvases are loaded via `next/dynamic` with `ssr: false`, and only mount once their container enters the viewport (`useInView`, backed by `IntersectionObserver` with a `200px` root margin). Each `<Canvas>` switches between `frameloop="always"` and `frameloop="demand"` depending on visibility, and animation is disabled entirely when `prefers-reduced-motion` is set.

## 10. GSAP Usage

GSAP and its ScrollTrigger plugin are loaded lazily via `useLazyGsap` (`src/hooks/use-lazy-gsap.ts`), a hook that dynamically imports both modules on mount, registers the plugin once, and caches the result at module scope so multiple consumers share a single fetch instead of racing separate ones.

**Interactive Insight Flow** (`insight-flow-section.tsx`): a `useGSAP` timeline attached to a `ScrollTrigger` (`start: "top 80%"`, `end: "bottom 20%"`, `toggleActions: "play none none reverse"`) animates the section heading and staggers the three step cards into view. Because the Geist font loads with `display: swap`, the timeline recalculates via `ScrollTrigger.refresh()` once `document.fonts.ready` resolves, so trigger positions measured against the fallback font don't stay stale after the real font swaps in.

**WOW stage tracking** (`wow-stages.tsx`): `ScrollTrigger.create` is used purely for scroll-position calculation, not animation — on every scroll update it finds whichever stage list item's vertical midpoint is closest to the viewport center and sets it as the active stage in React state. Clicking a stage indicator scrolls to it directly and suppresses the scroll-tracking calculation for 900ms so the click isn't immediately overridden while the resulting `scrollIntoView` animation is still settling.

## 11. Framer Motion Architecture

A `MotionRoot` component wraps the entire page in a Framer Motion context, generating shared `stagger`/`reveal` variants (`createStaggerContainerVariants`, `createRevealItemVariants` in `components/motion/variants.ts`) based on the resolved `prefers-reduced-motion` state. A generic `Reveal` component consumes these variants to animate any element into view with a single API.

Because `whileInView`'s SSR handling and a fresh client's first `IntersectionObserver` pass don't agree at the exact moment of hydration, the Dashboard and WOW sections use their own local reveal components (`DashboardReveal`, `WowReveal`) built on the framework's `useInView` hook with ref-based state, keeping server and first-client-render output consistent and avoiding hydration mismatches — this is documented directly in the source.

**State-driven transitions**: `AnimatePresence` crossfades dashboard tab content on tab change and animates the mobile navigation drawer's enter/exit. `layoutId` powers two shared-element indicators — the active dashboard sidebar tab and the active WOW stage dot — which animate smoothly between positions using a spring transition (disabled to an instant transition under reduced motion).

## 12. Responsive Strategy

Layouts adapt using Tailwind's `sm`/`md`/`lg` breakpoints:

- The header's inline navigation links are hidden below `md` and replaced by a mobile navigation drawer.
- The dashboard sidebar stacks above the main content on mobile/tablet and becomes a fixed-width left column at `lg`.
- The hero visualization panel's aspect ratio changes from `4/3` on mobile to `21/9` from `sm` upward.
- The WOW canvas height scales across breakpoints (`360px` → `440px` at `sm` → `520px` at `lg`).
- The WOW scene's particle count is reduced on mobile viewports (200 particles, detected via a `(max-width: 639px)` media query hook) versus 480 on larger screens, keeping the effect performant on lower-powered devices.

## 13. Accessibility

- **Semantic structure**: `header`, `main`, and `section` landmarks, each major section labeled via `aria-labelledby` pointing to its own heading.
- **Focus management**: each section is a focusable target (`tabIndex={-1}` with `scroll-margin-top`), and anchor navigation explicitly moves keyboard focus to the target section after scrolling.
- **Mobile navigation** is a fully trapped dialog: `role="dialog"`, `aria-modal="true"`, focus moves into the panel on open and back to the trigger on close, `Tab`/`Shift+Tab` are trapped within it, `Escape` closes it, and body scroll is locked (with scrollbar-width compensation to avoid layout shift) while it's open.
- **ARIA usage**: `aria-current` on active nav links/tabs/stage indicators, `aria-expanded`/`aria-controls` on the mobile menu trigger, `aria-label` on icon-only controls, `role="img"` with a descriptive `aria-label` on the (visually decorative) bar chart, and a screen-reader-only `<caption>` on the activity table.
- **Reduced motion**: `prefers-reduced-motion` is detected via a shared hook and respected by every animation system described in Section 8, with a CSS-level fallback rule in `globals.css` that forces revealed content visible immediately, covering the brief window before JavaScript can detect the preference on first paint.
- **Color contrast**: the primary button's fill color is a deliberately adjusted shade of the accent color to meet WCAG AA contrast for white button text (see Section 7).

## 14. Performance Optimization

- The Hero canvas, WOW canvas, and the Recharts bar chart are code-split via `next/dynamic` with `ssr: false`, keeping them out of the initial JavaScript bundle.
- All three are gated behind `IntersectionObserver`-based visibility checks and only mount once scrolled near the viewport.
- Each R3F `<Canvas>` toggles between `frameloop="always"` and `"demand"` based on current visibility, avoiding continuous rendering of off-screen scenes.
- GSAP and ScrollTrigger are fetched on demand (Section 10) rather than bundled into the initial page load.
- Scroll progress used by the 3D scenes is tracked in a `ref` (`useScrollProgress`), not React state, so per-frame updates don't trigger component re-renders.
- `next.config.ts` enables `experimental.optimizePackageImports` for `lucide-react` and `recharts`, and strips `console.log`/`console.debug` calls from production builds via the Next.js compiler config (`console.error`/`console.warn` are preserved).
- The production build compiles to a single static route with a First Load JS of approximately 192 KB (route-specific JS ≈ 89 KB), verified via `npm run build`.

## 15. Engineering Decisions

- **TypeScript strict mode** is enabled project-wide, with a `@/*` path alias resolving to `src/*`.
- **ESLint** uses the flat-config format, extending `next/core-web-vitals` and `next/typescript`, combined with `eslint-config-prettier` to avoid formatting/linting rule conflicts; **Prettier** is configured with the Tailwind class-sorting plugin.
- **Component-per-file organization**: sections are decomposed into small, single-responsibility components (e.g. the WOW section separates its heading, canvas, stage list, stage item, stage indicator, and outro into distinct files) rather than large monolithic section components.
- **Shared utilities**: a single `cn()` helper (`clsx` + `tailwind-merge`) is used for all conditional class composition, and `class-variance-authority` handles variant-based component APIs (`Button`, `Badge`).
- **Typed mock data layer**: dashboard content is defined once as typed data (`types/dashboard.ts`, `data/dashboard-mock.ts`) and consumed by presentation components, keeping mock content and rendering logic separate.
- **No unnecessary abstraction**: duplicated values (e.g. a repeated easing tuple previously declared independently in five files) were consolidated into single shared constants rather than left duplicated or over-abstracted into a generic system.
- **Scoped dependencies**: only the libraries actually used are declared in `package.json` — verified by cross-checking every dependency against real imports in `src/`.

## 16. Folder Structure

```
src/
├── app/                      # Next.js App Router entry (layout, page, global styles)
├── components/
│   ├── layout/                # Header, mobile navigation drawer
│   ├── motion/                 # MotionRoot context, Reveal wrapper, shared variants
│   ├── three/                  # Reusable R3F primitives (Canvas wrapper, glow orb, particle field)
│   └── ui/                     # Button, Card, Badge (cva-based primitives)
├── constants/                 # Design tokens (colors, motion easing), R3F scene config, static copy
├── data/                      # Typed mock data for the dashboard preview
├── hooks/                     # Scroll progress, in-view, reduced-motion, lazy GSAP, media query, etc.
├── sections/
│   ├── hero/                   # Headline, CTAs, R3F hero scene
│   ├── insight-flow/            # Three-step GSAP ScrollTrigger flow
│   ├── dashboard/               # Sidebar, tabs, KPI cards, chart, table
│   └── wow/                     # Signature particle-morph interaction
├── types/                     # Shared TypeScript interfaces (dashboard data shapes)
└── utils/                     # cn() class-merging helper
```

## 17. Challenges & Solutions

| Challenge | Solution |
|---|---|
| Framer Motion's `whileInView` disagrees with a fresh client's first `IntersectionObserver` pass at the moment of hydration, risking a visible mismatch. | Drive visibility from `useInView`'s ref-based boolean (false on both server and first client render) instead of relying on the built-in SSR handling, keeping server and client output in sync. |
| `prefers-reduced-motion` can't be read during SSR, so an in-flight entrance animation could briefly use normal timing right after hydration. | Ignore the real preference until after mount so the client's first render matches the server's; a CSS rule in `globals.css` forces reduced-motion users to see fully revealed content immediately as a safety net. |
| Geist loads with `display: swap`, so ScrollTrigger initially measures against fallback-font metrics; once the real font swaps in, trigger positions can go stale. | Call `ScrollTrigger.refresh()` once `document.fonts.ready` resolves. |
| Per-item scroll-trigger ranges for the WOW stage list legitimately overlapped (items sit close together), so more than one stage could read "active" at once. | Track whichever item's midpoint is closest to the viewport center on every scroll update — this always yields exactly one winner. |
| The last WOW stage can't always be scrolled to true viewport center (not enough page content below it), so click-to-jump could be immediately re-overridden by the scroll tracker. | Suppress scroll-position tracking for 900ms after a programmatic scroll, giving the click's target time to "win." |
| Recharts renders `fill` as a raw SVG attribute and can't resolve CSS custom properties the way a stylesheet can. | Mirror the relevant hex values in `constants/colors.ts`, explicitly documented as needing to stay in sync with `globals.css`. |
| The hero visualization panel changes aspect ratio across breakpoints (4:3 mobile → 21:9 desktop); a fixed camera position would clip the scene on narrower ratios. | Recalculate camera distance every frame from the canvas's current aspect ratio and fixed field of view, so the full scene width always stays in frame. |
| The WOW "data cluster reorganization" needed to read as one field reorganizing itself, not particles teleporting to new random positions. | Every formation-generator function produces the same particle-index-to-slot mapping, so lerping between two formations moves each particle continuously to its corresponding position in the next formation. |
| A stray `next.config.ts` `distDir` override (`.next-audit-tmp`) wasn't covered by `.gitignore`, `.prettierignore`, or the ESLint ignore list, which only excluded the default `.next` directory. | Reverted to the default output directory; this also resolved roughly 2,400 spurious ESLint findings that were being reported against generated build files instead of source code, and generated trace files that had been accidentally committed were removed. |
| A repeated easing tuple (`[0.22, 1, 0.36, 1]`) was independently declared in five different files. | Consolidated into a single shared `EASE_OUT` constant, imported wherever needed. |
| An "AI Insight" panel existed in the dashboard implementation but was not present in the Figma reference. | Identified by direct comparison against the Figma screenshots and removed, along with its now-unused type and mock data, to restore an exact match with the design. |

## 18. Conclusion

The Xai — Intelligence Workspace submission implements every element specified in the challenge brief within a single Next.js page: an interactive Three.js hero, a GSAP ScrollTrigger–driven three-stage insight flow, a mock intelligence dashboard with animated tab transitions, and one signature particle-based WOW interaction, all matched against a supplied Figma reference. Motion is handled through a deliberate three-layer strategy (Framer Motion, GSAP, React Three Fiber) unified by consistent `prefers-reduced-motion` support, the UI is responsive across desktop, tablet, and mobile, and the codebase passes strict TypeScript checks, a clean ESLint run, and a successful production build with no unused code, files, or dependencies.
