# Wave Playground (Next.js + TypeScript)

This project has been fully converted from a single-page vanilla JS app into a **Next.js (App Router) + TypeScript** application while preserving the exact look & behavior of the original Wave Playground.

## What's New

- Modern React/Next.js architecture (`app/` directory)
- All original JavaScript modules converted to strongly-typed **TypeScript** (no `.js` sources remain)
- Asset pipeline via Next.js (icons moved to `public/`)
- Global CSS migrated to `app/globals.css`
- Client-only execution guarded using a client component so browser APIs (canvas, localStorage, matchMedia, ResizeObserver) work exactly as before

## Features (unchanged from original)

- Multi-layer animated wave simulation with physics & turbulence
- Interaction modes: push, pull, gravity, swirl, off
- Adaptive auto-detail + performance heuristics
- Preset save/load/export/import (localStorage)
- Full visual customization (color modes, glow, blend, trail, etc.)

## Tech Stack

- Next.js 16 (App Router)
- React 19.2.3
- TypeScript strict mode

## Development

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Then open: http://localhost:3000

## Production Build

```powershell
npm run build
npm run start
```

## File Overview

- `app/layout.tsx` – Root layout & metadata
- `app/page.tsx` – Main client component rendering the full UI & canvas
- `app/globals.css` – Global styles (from original `styles.css`)
- `app/lib/` – Ported & typed logic from original `/js` modules:
  - `config.ts`, `state.ts`, `main.ts`, `draw.ts`, `simulation.ts`, `context.ts`, `ui.ts`, `layers.ts`, `samples.ts`, `turbulence.ts`, `noise.ts`, `presets.ts`, `randomize.ts`, `input.ts`, `utils.ts`
- `public/` – Icons / favicons (moved from root)

## Notes on Conversion

- The DOM id structure is preserved so the logic using `document.getElementById` continues to work.
- Initialization (`boot()`) now runs inside a `useEffect` hook to ensure client-side only execution.
- Module side-effects that rely on `window` (e.g. `matchMedia`) only execute client-side because the page component is marked `'use client'`.
- All numeric & structural settings now have TypeScript interfaces for safer future extension.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Security

✅ **Dependency update (2025-12-29):** Upgraded `react` and `react-dom` to **19.2.3** to mitigate **CVE-2025-55183** and **CVE-2025-55184**. After pulling these changes run `npm install` to refresh your lockfile and then `npm audit` to verify there are no remaining advisories.

## Credits

Originally created by [takeourcarsnow](https://github.com/takeourcarsnow). Converted to Next.js + TypeScript.
