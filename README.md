# Xai — Intelligence Workspace

A single-page, animation-driven marketing site built for a frontend engineering challenge. It presents a fictional AI data-intelligence product ("Xai") through an interactive Three.js hero, a scroll-driven insight-flow narrative, a mock product dashboard, and a signature particle-based "wow" interaction.

## Overview

The project is a Next.js (App Router) application rendered as a single static page (`src/app/page.tsx`). It has no backend, no authentication, and no additional routes — every interaction (navigation, tab switching, scroll storytelling) happens client-side within one page. The goal was to demonstrate production-quality frontend engineering: 3D/WebGL integration, scroll choreography, a realistic mock UI, and attention to accessibility and performance, all built to match a provided Figma reference.

## Challenge Objective

The brief required a single-page experience combining:

- An interactive Three.js / React Three Fiber hero visualization illustrating "raw data → structured intelligence."
- A three-stage, scroll-driven "Interactive Insight Flow" using GSAP ScrollTrigger.
- A mock "Intelligence Dashboard" preview (sidebar, KPI cards, charts, tables, tab transitions).
- Exactly one polished "signature" interaction (a scroll-driven geometry/data reorganization).
- Pixel-accurate implementation of the supplied Figma design.
- Full responsiveness, accessibility, and a clean, optimized production build using Next.js, React, Framer Motion, GSAP, and React Three Fiber.

## Core Narrative

Every section reinforces the same story — raw, unstructured data being turned into structured, actionable intelligence:

- **Hero** — a particle cloud, a connected node network, and a data-flow curve visually carrying "Raw Data" toward "Structured Intelligence" and "Actionable Insight."
- **Insight Flow** — the same idea as three concrete steps: *Ingest Data → Analyze with AI → Generate Insight*.
- **Dashboard Preview** — the narrative made tangible as a working product: KPIs, generated insights, and automations.
- **Signature interaction** — a particle field that physically reorganizes through four states: *Raw Data → AI Processing → Structured Intelligence → AI Automation*, driven by scroll position.

## Features

- Sticky header with scroll-spy active-link highlighting and smooth, focus-managed anchor navigation.
- Accessible mobile navigation drawer with focus trap, `Escape`-to-close, and scroll locking.
- Hero section: R3F scene (particle field, glowing node network, animated data-flow curve, camera parallax) that reacts to both scroll position and cursor movement.
- Interactive Insight Flow: three GSAP ScrollTrigger–animated cards with hover/focus micro-interactions.
- Intelligence Dashboard Preview: sidebar with four tabs (Overview, Insights, Sources, Automations), animated tab transitions, KPI cards, a Recharts bar chart, and an activity table — all backed by typed mock data.
- Signature WOW interaction: a 480-particle (200 on mobile) field that morphs between four formations as the section scrolls into view.
- Reduced-motion support applied consistently across Framer Motion, GSAP, and R3F.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion, GSAP + ScrollTrigger (`@gsap/react`) |
| 3D / WebGL | React Three Fiber, Three.js |
| Charts | Recharts |
| UI utilities | class-variance-authority, clsx, tailwind-merge, lucide-react |
| Tooling | ESLint (flat config), Prettier, TypeScript strict mode |

## Project Structure

The app is a single composed page: `layout.tsx` provides fonts and metadata, and `page.tsx` renders `MotionRoot` (the shared Framer Motion context) wrapping the sticky `Header` and four independent, self-contained sections — Hero, Insight Flow, Dashboard, and WOW.

Each section owns its own subcomponents, and heavier logic (canvas scenes, scroll tracking, GSAP setup) is isolated into dedicated files rather than living inline in the section component. Cross-cutting concerns — motion primitives, R3F scene helpers, design tokens, and hooks — live in shared top-level folders (`components/`, `hooks/`, `constants/`) so each section only imports what it needs.

## Folder Structure

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
└── utils/                     # `cn` class-merging helper
```

## Animation Architecture

Three animation systems are layered deliberately by purpose:

- **Framer Motion** handles entrance choreography and UI-state transitions: a shared `Reveal` component (driven by a `MotionRoot` variants context) staggers elements into view, `AnimatePresence` animates dashboard tab content, and `layoutId` powers the sliding active-tab/active-stage indicators. All shared timing uses a single `EASE_OUT` constant (`src/constants/motion.ts`) for a consistent feel.
- **GSAP + ScrollTrigger** drives scroll-position logic that Framer Motion doesn't cover: the staggered reveal of Insight Flow cards, and continuous tracking of which WOW stage is closest to the viewport center. GSAP is fetched lazily on mount via a cached dynamic import (`useLazyGsap`) rather than bundled into the initial page load.
- **React Three Fiber / Three.js** renders the Hero and WOW canvases. Both read a scroll-progress value (tracked via a `ref`, not React state, to avoid re-renders) inside `useFrame` to drive particle positions, node glow intensity, and camera drift.

`prefers-reduced-motion` is checked at every layer: Framer Motion transitions collapse to near-zero duration, GSAP scroll animations are skipped entirely, and R3F scenes stop animating and disable pointer parallax. A CSS rule in `globals.css` also forces revealed content visible immediately, covering the brief window before JavaScript can detect the preference.

## Design Decisions

- **Section-based isolation** — each of the four sections is a self-contained module with its own components and (where needed) hooks, so they can be reasoned about and modified independently.
- **Shared UI primitives** — `Button`, `Card`, and `Badge` are built on `class-variance-authority` for consistent, typed variant handling instead of ad hoc class strings.
- **Centralized design tokens** — colors and spacing live as CSS custom properties in `globals.css`; a small `constants/colors.ts` mirrors the accent/foreground hex values for contexts that can't resolve CSS variables (Three.js materials, Recharts SVG fills).
- **Mock, not real, data** — the dashboard is a UI preview only. All content lives in `data/dashboard-mock.ts`, typed via `types/dashboard.ts`, with no network requests or backend.
- **No scope creep** — no dark mode, search, authentication, backend, additional routes, or marketing sections (testimonials/FAQ/pricing pages) were added; the build matches the challenge brief and Figma reference as closely as possible.

## Performance Optimizations

- The Hero and WOW R3F canvases and the Recharts bar chart are loaded via `next/dynamic` with `ssr: false`, keeping them out of the initial JS bundle.
- Canvases only mount once their container enters the viewport (`useInView`, via `IntersectionObserver`), and each `<Canvas>` switches between `frameloop="always"` and `"demand"` based on visibility to avoid rendering off-screen scenes.
- GSAP and ScrollTrigger are fetched on demand instead of being bundled upfront.
- Scroll progress is tracked in a `ref` and read inside animation frames, avoiding per-scroll-tick React re-renders.
- Particle count in the WOW scene is reduced on mobile viewports (200 vs. 480 particles).
- `next.config.ts` enables `optimizePackageImports` for `lucide-react` and `recharts`, and strips `console.log`/`debug` calls from production builds.

## Accessibility

- Semantic landmarks (`header`, `main`, `section`, `nav`) with `aria-labelledby` on each section and focusable, `scroll-margin`-aware anchor targets for skip-to-section navigation.
- Full keyboard support: visible focus rings throughout, a focus-trapped mobile navigation dialog (`role="dialog"`, `aria-modal`, `Escape` to close), and keyboard-operable dashboard tabs and WOW stage indicators.
- ARIA attributes applied where appropriate: `aria-current`, `aria-expanded`, `aria-controls`, `aria-label` on icon-only buttons, `role="img"` with a descriptive label on the chart, and a screen-reader-only `<caption>` on the activity table.
- `prefers-reduced-motion` is respected across every animation system (see Animation Architecture).
- The primary button's text color was adjusted from the raw accent color to meet WCAG AA contrast (documented in `globals.css`).

## Responsive Design

Layouts adapt across Tailwind's `sm`/`md`/`lg` breakpoints:

- The header's inline nav collapses into the mobile drawer below `md`.
- The dashboard sidebar stacks above the content on mobile/tablet and becomes a fixed left column at `lg`.
- The hero visualization panel shifts from a near-square 4:3 aspect ratio on mobile to a wide 21:9 ratio on larger screens.
- The WOW canvas height and particle density scale down for smaller viewports.

## Installation

Requires Node.js `^18.18.0`, `^19.8.0`, or `>=20.0.0` (see `package.json` → `engines`).

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Starts the Next.js development server (defaults to `http://localhost:3000`).

## Build

```bash
npm run build
```

Produces an optimized production build. The app is fully static/prerendered, so it can also be started locally with:

```bash
npm run start
```

## Deployment

The project has no deployment-specific configuration committed to the repository. As a standard Next.js application, it can be deployed to any platform with Next.js support (e.g. Vercel) or self-hosted by running `npm run build` followed by `npm run start`.

## Screenshots

_Add screenshots here._

![Hero Section](./docs/screenshots/hero.png)
![Interactive Insight Flow](./docs/screenshots/insight-flow.png)
![Intelligence Dashboard Preview](./docs/screenshots/dashboard.png)
![Signature WOW Interaction](./docs/screenshots/wow.png)

## License

No license file is currently included in this repository, and `package.json` is marked `"private": true`. All rights reserved unless a license is added.
