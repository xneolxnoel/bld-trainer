# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — Next.js dev server at http://localhost:3000 (Turbopack).
- `npm run build` — Static export to `./dist` (Next is configured with `output: "export"` and `distDir: "dist"`).
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`).
- `npx tsc --noEmit` — Type-check only (no separate script).

No test suite exists. There is no `start` workflow worth running; `npm run start` exists but the app is a fully static export.

## Deployment quirk

`next.config.ts` toggles `basePath` based on the deploy target:

- Custom domain (e.g. `bldtrainer.com`) → `basePath = ""` (current setting).
- GitHub Pages project URL (`/<repo>/`) → set `basePath = "/bld-trainer"`.

If a deploy 404s on assets, this is almost always the cause.

## Domain model

The app teaches the **Old Pochmann** method for 3x3 blindfolded solving, using the **Speffz** letter scheme (24 letters per piece type, one per sticker). Three concepts recur throughout the code:

- **Buffers**: edge buffer is UF (Speffz letters C, I); corner buffer is UBL (letters A, R, U). Buffer letters never appear as targets in a trace.
- **Targets**: edge target slot is UR (letters B, F); corner target slot is UFR (C, F, I). Setup moves bring an arbitrary piece into the target slot, the swap alg fires, then the setup is inverted.
- **Setup moves**: per-letter algs to position a piece at the target slot before the swap. The authoritative table lives in `lib/setups.ts`; user edits are persisted via Zustand.

Knowing these three concepts is enough to read 90% of the trainer code.

## Code architecture

### Source of truth for setup data

`lib/setups.ts` is authoritative for setup moves. Each entry has a `status` (`verified | draft | buffer | target | empty`) — defaults marked `draft` are inherited starting points and should be assumed unverified. `lib/algs.ts` only holds the three swap algorithms (T-perm, Y-perm, parity). Do not re-introduce setup tables into `algs.ts`.

User-edited setups override the table per-letter via `progressStore.setupOverrides`, keyed `${type}-${LETTER}` (e.g. `"edge-A"`). Overrides flip the entry's status to `"verified"` in the trainer view.

### Cube simulator (`lib/cube-state.ts`)

Lightweight 24-edge + 24-corner sticker-position simulator over Speffz coordinates. `applyScramble(str)` returns the post-scramble sticker map; `trace(state, side)` returns the Old Pochmann letter sequence and edge-parity flag.

The simulator picks the alphabetically-first sticker at cycle breaks — a valid choice, but not the only one. The full-solve simulator at `/solve` warns the user about this in the UI; do not assume a "wrong" memo is actually wrong without comparing cycle structure.

### State persistence (`stores/progressStore.ts`)

Single Zustand store with `persist` middleware (`localStorage` key `cube-bld-progress`, currently `version: 1`). Holds lesson progress, memo/practice stats, setup overrides, and known-state toggles. The `migrate` function merges any persisted state onto `initialState` so future `version` bumps fill missing fields with defaults instead of dropping them.

**Always read with per-slice selectors**, not destructuring:

```ts
// Yes — narrow re-render scope.
const setupOverrides = useProgressStore((s) => s.setupOverrides);
const toggleKnown = useProgressStore((s) => s.toggleSetupKnown);

// No — re-renders on every store change, anywhere.
const { setupOverrides, toggleSetupKnown } = useProgressStore();
```

### Cube visualization (`components/cube/CubePlayer.tsx`)

Thin React wrapper around the `cubing/twisty` `TwistyPlayer` custom element. Two important constraints:

1. **Must be `dynamic(import, { ssr: false })`** — `TwistyPlayer` defines a custom element on import and breaks under SSR. Every page that uses it imports it this way.
2. **Prop changes are mirrored via setters**, not props passed at construction. The player is created once on mount; prop updates are pushed via the `useEffect` that assigns to `player.alg`, `player.experimentalStickering`, etc. Re-creating the player on every prop change would re-mount and reset playback.

### Routing and pages

App Router only (`app/`), no pages router. Every page is currently a client component (`"use client"`) because they all use Zustand, framer-motion, or both. New routes should follow the existing pattern: one `page.tsx` per route directory, top-level animated container, `Card`/`Badge`/`Button` from `components/ui/`.

### React 19 patterns

This repo uses React 19 idioms. Two specific patterns appear and should be preserved:

- **Derived state during render, not `useEffect` + `setState`** — see `app/trainer/page.tsx` (`draft.key !== selectedKey` check) and `components/layout/Navbar.tsx` (`lastPath !== pathname` check). ESLint enforces `react-hooks/set-state-in-effect`.
- **Reading the auto-detected lint rule for this**: prefer adjusting state during render with a comparison guard over `useEffect(() => setX(...), [dep])`.

### Path alias

`@/*` maps to repo root. Import as `@/lib/setups`, `@/components/ui/Card`, etc.

## What not to do

- Don't add setup-move tables outside `lib/setups.ts`.
- Don't pass `TwistyPlayer` config props expecting them to be reactive without updating the sync effect in `CubePlayer.tsx`.
- Don't bump `progressStore` `version` without writing a `migrate` function.
- Don't add new pages as Server Components if they need framer-motion, Zustand, or the cube player — wrap them with a client island if you need partial SSR.
