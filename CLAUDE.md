@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack versions (read carefully — these are not the defaults you may know)

- **Next.js 16.2.4** with **React 19.2.4** — App Router only. Before writing Next-specific code, consult `node_modules/next/dist/docs/01-app/` for the version actually installed; APIs and conventions have shifted from older majors.
- **Tailwind CSS v4** via `@tailwindcss/postcss`. There is no `tailwind.config.{js,ts}` — design tokens live in `@theme { ... }` inside [src/app/globals.css](src/app/globals.css) and are consumed as utilities (`bg-cream`, `text-ink`, `font-display`, etc.). Custom dark variant is declared with `@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`.
- **TypeScript** strict mode; path alias `@/*` → `./src/*`.

## Commands

```bash
npm run dev      # next dev — local server at http://localhost:3000
npm run build    # next build — full prod build, also runs TS check
npm run start    # next start — serve the prod build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test runner configured. "Verification" in this repo is `npm run build` (TS + route prerender) plus visual QA via the dev server.

## Architecture

Single-page marketing site composed in [src/app/page.tsx](src/app/page.tsx) as a vertical stack of section components. Each section lives in [src/components/](src/components/) and is independently editable.

### Theming (light/dark) — three-part system

1. **[src/app/globals.css](src/app/globals.css)** — `@theme` block defines the light palette as CSS custom properties. Inside `@layer base`, `html[data-theme="dark"] { ... }` redefines the same vars for dark mode. **Critical:** the dark override must stay inside `@layer base` — Tailwind v4 strips loose top-level CSS-var declarations.
2. **[src/components/ThemeScript.tsx](src/components/ThemeScript.tsx)** — inline script injected into `<head>` from [src/app/layout.tsx](src/app/layout.tsx) that reads `localStorage.theme` (or `prefers-color-scheme`) and sets `document.documentElement.dataset.theme` *before* React hydrates, preventing a theme flash. The `<html>` element uses `suppressHydrationWarning` because of this pre-hydration mutation.
3. **[src/components/ThemeSlider.tsx](src/components/ThemeSlider.tsx)** — fixed bottom-center toggle that flips `data-theme` and persists to `localStorage`. Defers reading the actual value until `useEffect` to avoid hydration mismatch.

When adding components: prefer the CSS-var-backed utilities (`bg-cream`, `text-ink`, `bg-peach`, `bg-lilac-mist`) so they auto-swap in dark mode. For overrides only dark mode needs, use the `dark:` variant — it resolves through the `@variant` rule above.

### Fonts

Loaded via `next/font/google` in [src/app/layout.tsx](src/app/layout.tsx): **Inter** (sans), **Instrument Serif** (italic display), **Archivo Black** (huge headlines). Each registers a `--font-*-loaded` CSS var on `<html>`; `globals.css` aliases those to `--font-sans` / `--font-serif` / `--font-display` for the `font-sans|serif|display` Tailwind utilities. Don't import these fonts elsewhere — go through the layout.

### Smooth scroll

[src/components/SmoothScroll.tsx](src/components/SmoothScroll.tsx) mounts **Lenis** once at page root via RAF loop. Don't add a second instance. If you need scroll-driven animation, layer **GSAP/ScrollTrigger** on top — both packages are already installed (`gsap`, `lenis`).

### Animation

**Framer Motion** (`framer-motion@12`) is the default for entrance animations and the theme-slider thumb spring. The shared easing curve used across the hero is `[0.16, 1, 0.3, 1]`.

### Project data

[src/lib/projects.ts](src/lib/projects.ts) exports a typed `projects` array consumed by [src/components/Projects.tsx](src/components/Projects.tsx). Each entry has `accent` / `bgFrom` / `bgTo` colors used to build the abstract device-mockup gradients; the dark mode dimming relies on `dark:brightness-[0.32]` rather than alternate colors.

### Class composition

[src/lib/cn.ts](src/lib/cn.ts) — `clsx` + `tailwind-merge`. Use `cn(...)` for any conditional/merged classNames.

### Images

`public/me.webp` is a transparent cutout used by the hero. It's rendered with `next/image` in `unoptimized` mode because Next's optimizer flattens transparent PNGs/WebPs in the current setup. `public/me-original.png` is the unprocessed source — keep it for re-runs of the cutout pipeline.

## Conventions

- Section components are client components only when they need state/effects/animation (`"use client"`); otherwise keep them server components.
- Compose pages in `src/app/page.tsx`; do **not** add layout chrome to individual section components — Nav and ThemeSlider are mounted once at page root.
- The hero's bottom row ("I AM / JASHANVEER" + "JAVA BACKEND / FULL-STACK ENGINEER") sizes both headlines from one shared row budget via the `.headline-row` / `.headline-name` / `.headline-role` rules in [src/app/globals.css](src/app/globals.css). Both lines are Archivo Black on a single nowrap line, so each line's width is a fixed multiple of its font size; the divisors in that block (`7.4` for "JASHANVEER", `12.7` for "FULL-STACK ENGINEER") are those measured em-widths. **If you change either headline's text, re-measure and update the divisors**, or the pair will overflow and get clipped by the section's `overflow-hidden`. The `0.68` factor is the name's share of the row at `lg` and up — the role line takes whatever is left.
- `.dev-screenshots/` is gitignored and used for QA evidence; don't commit screenshots there.

## Repo notes

- Deployed to **jashanveer.com** via Vercel from the `main` branch — `git push` ships.
- [HANDOFF.md](HANDOFF.md) documents the v1 build session and is mostly historical; the live state is the source of truth.
- See [README.md](README.md) for end-user docs (commands, customization map, deploy instructions).
