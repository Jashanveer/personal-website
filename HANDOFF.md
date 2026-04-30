# Overnight Handoff — 2026-04-30

Quick reference for what changed while you were asleep.

## What's live

The dev server is running at **http://localhost:3000** (background process).
Open it, click the **slider at the bottom-center** to switch themes.

## Key changes this run

1. **Photo cleanup** — Gemini had baked a checkerboard pattern into the RGB pixels (alpha was fully opaque, not transparent). Detected via pixel sampling, ran `rembg` (U2Net AI) to actually remove the background. Output is `public/me.webp` (168 KB, transparent). Original preserved at `public/me-original.png`.

2. **Hero rebuild** — fixed the "JASHANVEER" overflow by capping the font at `clamp(40px, 9.5vw, 140px)` (10 chars in Archivo Black ≈ 7em wide; needed to fit 70% of container). "SOFTWARE ENGINEER" is now right-aligned with `flex-nowrap` + `whitespace-nowrap` so it never wraps below.

3. **Pill + description anchored to portrait** — they used to be glued to the parent flex container, which made them slip off-screen. Now they're absolutely positioned relative to the portrait div, so they always sit beside the head.

4. **Mobile pill block** — `lg:hidden` block below the headline shows the availability pill and description on small screens (was hidden entirely before).

5. **Dark mode** — full light/dark token system in `src/app/globals.css`. Variables swap via `html[data-theme="dark"]` inside `@layer base` (Tailwind v4 strips them outside the layer). Hero gradient uses CSS variables so it auto-swaps. Cards use `dark:bg-[rgba(245,232,208,0.04)]` and `dark:brightness-[0.32]` to dim/saturate the pastel project gradients into moody tones.

6. **Theme slider** — `src/components/ThemeSlider.tsx`. Bottom-center pill, sun↔moon icons, animated thumb (spring physics). Persists to localStorage, respects `prefers-color-scheme` on first load.

7. **No-flash bootstrap** — `src/components/ThemeScript.tsx` injects an inline script in `<head>` that sets `data-theme` BEFORE React hydrates. No theme flash on page load.

8. **Smooth scroll** — `src/components/SmoothScroll.tsx` mounts Lenis once at the page root. Buttery wheel + touch scrolling like the awwwards reference sites.

9. **Production build passes** — `npm run build` finishes clean: TypeScript check passes, all routes statically prerendered.

## What you'll want to do next

In rough priority:

1. **Real screenshots for project cards.** The abstract device mockups read fine, but a real Earth Lens screenshot, real Rung iPhone+Mac mockup, and a real onAir UI shot will lift the page from "templated" to "shipped." Drop them in `public/projects/` and update `src/lib/projects.ts` to add a `screenshot` field, then swap the `<DeviceMockup />` in `Projects.tsx` for an `<Image src={...}>`.

2. **Domain + Vercel.** When ready: `vercel` from this directory, follow prompts. Update `metadataBase` in `src/app/layout.tsx` to your real domain.

3. **Custom favicon.** Currently the Next.js default. A simple "J." mark would do.

4. **GSAP ScrollTrigger polish.** Lenis handles smooth scroll; GSAP/ScrollTrigger could pin sections or stagger reveals as you scroll into them. Already installed, just not used yet.

## Files added/changed

```
src/
  app/
    globals.css        ← Tailwind v4 + light/dark tokens + dark variant
    layout.tsx         ← fonts + ThemeScript injection
    page.tsx           ← composes everything
  components/
    Nav.tsx            ← (existing, links updated to match section IDs)
    Hero.tsx           ← rewritten with grid-based layout + mobile block
    AvailabilityPill.tsx ← bg switched from white → cream for theme support
    PortraitPlaceholder.tsx ← unused now (kept as fallback)
    Projects.tsx       ← project cards with abstract mockups + dark mode dim
    Services.tsx       ← 4-column I CAN BUILD strip
    Stats.tsx          ← 4 big numbers
    Experience.tsx     ← 5-row timeline
    BeyondCode.tsx     ← 3 cards (patent, awards)
    Contact.tsx        ← "Got something to build?" + mailto
    SectionHeading.tsx ← shared eyebrow + headline
    ThemeScript.tsx    ← no-flash inline bootstrap
    ThemeSlider.tsx    ← bottom-center theme toggle
    SmoothScroll.tsx   ← Lenis
  lib/
    projects.ts        ← project data
    cn.ts              ← clsx + twMerge helper

public/
  me.webp              ← transparent cutout (use this)
  me.png               ← downsized PNG fallback
  me-original.png      ← original Gemini export (keep for re-runs)

.dev-screenshots/      ← QA evidence from this run (gitignore-worthy)
HANDOFF.md             ← this file
```

## Screenshots from the iteration

The `.dev-screenshots/` folder has 30+ screenshots showing each step of the iteration, from the original baseline (broken checkerboard) through the final polished light + dark modes. The `FINAL-*` files are the latest:

- `FINAL-light-fullpage.png` — full desktop in light
- `FINAL-dark-fullpage.png` — full desktop in dark
- `FINAL-mobile-light.png` — iPhone 15 viewport in light
- `FINAL-mobile-dark.png` — iPhone 15 viewport in dark

Plus per-section viewport shots (`23-dark-projects-v2.png`, `30-dark-stats.png`, etc.) for inspecting specific sections.

## What I did NOT commit

I didn't run `git commit` — that's your call. When you're ready:

```bash
git add .
git commit -m "Build portfolio v1: Madison hero, light+dark, theme slider, all sections"
```

The repo had no prior commits, so this'll be the initial commit.

## Known issues / things I left for you

- The Image component has a console warning about `fill` and a height-of-0 in some render passes. Doesn't affect rendering visibly. Likely a Framer Motion + next/image interaction quirk that'll resolve once we wire real screenshots.
- The `next/image` is set to `unoptimized` for `me.webp` because Next's optimizer flattens transparent PNGs. Once you have a settled domain, you may want to revisit (use AVIF/WebP at source and remove `unoptimized`).
- `lucide-react@^1.x` was installed (newer than typical 0.x). Icons used (Sun, Moon, ArrowUpRight, Award, Lightbulb, Trophy) all work — flag if you see weird icon behavior.

That's it. Try it: open the site, click the slider, scroll through the page. Tell me what's still off.
