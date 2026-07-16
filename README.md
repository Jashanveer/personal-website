# jashanveer.com

Personal portfolio for Jashanveer Singh, a Java backend and full-stack engineer. Currently at onAir Tech, shipping [Earth Lens](https://earth-lens.netlify.app/) and Rung Backend on the side.

Built with **Next.js 16** (App Router) + **React 19** + **Tailwind CSS v4** + **Framer Motion**. Lenis for smooth scroll, custom Liquid-Glass surfaces, mouse-tracking ambient gradient, and a live GitHub contributions heatmap.

## Local development

```bash
npm install
npm run dev              # http://localhost:3000
```

Other commands:

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (TypeScript + static generation) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
  app/
    layout.tsx           Fonts (Inter, Instrument Serif, Archivo Black), metadata
    page.tsx             Composes the single-page site from section components
    globals.css          Tailwind v4 theme tokens + dark-mode variant
  components/
    Hero.tsx             "Hey, ... there" hover-reveal with portrait
    Projects.tsx         Earth Lens, Rung, Real-Time Chat cards
    Services.tsx         Web / Native / Backend / Cloud / AI
    Stats.tsx            Numeric counters that animate on scroll
    Experience.tsx       Resume timeline
    GitHub.tsx           Featured repos + heatmap section
    GitHubHeatmap.tsx    Custom-rendered SVG heatmap (real contribution data)
    BeyondCode.tsx       Patent + awards + hobbies
    Contact.tsx          Magnetic email + mailto-based contact form
    Nav.tsx              Top nav (transparent)
    ThemeSlider.tsx      Bottom-center light/dark toggle
    ThemeScript.tsx      Inline no-flash theme bootstrap (runs pre-hydration)
    SmoothScroll.tsx     Lenis singleton
    MouseGradient.tsx    Cursor-following ambient gradient (page-wide)
    icons/GitHubIcon.tsx Inline GitHub mark (lucide v1 dropped brand icons)
  lib/
    projects.ts          Project data — see "Customizing" below
    cn.ts                clsx + tailwind-merge helper
public/
  me.webp                Hero portrait (transparent cutout)
  projects/              Project screenshots & app icons
```

## Environment

The site has **no required env vars**. Optional ones are documented in [`.env.example`](./.env.example) — copy to `.env.local` to use them.

## Customizing for your own use

If you fork this for yourself:

| Want to change… | Edit |
|---|---|
| Name in nav | [`src/components/Nav.tsx`](src/components/Nav.tsx) |
| Hero portrait | Replace `public/me.webp` (transparent PNG/WebP, ~3:4 aspect) |
| Domain / SEO metadata | `metadataBase` in [`src/app/layout.tsx`](src/app/layout.tsx) |
| Project list | [`src/lib/projects.ts`](src/lib/projects.ts) |
| Project screenshots | Drop files in [`public/projects/`](public/projects/), then set the `screenshot` field on the matching project |
| Services list | [`src/components/Services.tsx`](src/components/Services.tsx) |
| Resume timeline | [`src/components/Experience.tsx`](src/components/Experience.tsx) |
| GitHub username (heatmap + repo cards) | Hardcoded as `Jashanveer` in [`src/components/GitHub.tsx`](src/components/GitHub.tsx) and [`GitHubHeatmap.tsx`](src/components/GitHubHeatmap.tsx). Change the string or wire it to `NEXT_PUBLIC_GITHUB_USERNAME`. |
| Contact email | Constant `RECIPIENT` in [`src/components/Contact.tsx`](src/components/Contact.tsx) |
| Patent / Zolve award URLs | `href` on items in [`src/components/BeyondCode.tsx`](src/components/BeyondCode.tsx) |

## Contact form

The form currently opens the visitor's mail client via `mailto:`. Zero infrastructure, but it depends on the visitor having a mail app configured.

To send mail directly from the page (no mail-app round-trip), wire up **[Resend](https://resend.com)**:

1. Sign up — the free tier covers a personal site easily.
2. Create an API key.
3. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in `.env.local` (template in `.env.example`).
4. Add an API route at `src/app/api/contact/route.ts` that uses `resend.emails.send(...)`.
5. Replace the `onSubmit` in `Contact.tsx` with a `fetch("/api/contact", { method: "POST", body: JSON.stringify(...) })`.

## Deploying

The recommended target is **[Vercel](https://vercel.com)** — they make Next.js, the deploy is one click, and `next/image` optimization works out of the box.

### One-time setup

```bash
npx vercel login
npx vercel              # follow prompts: link to GitHub repo, accept defaults
```

That gives you a `your-project.vercel.app` URL.

### Wiring `jashanveer.com`

In the Vercel project: **Settings → Domains → Add `jashanveer.com`**.

Vercel will display one of two paths:

**Path A — Easiest (Vercel manages DNS):** change your registrar's nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`. SSL auto-provisions in ~minutes.

**Path B — Keep your registrar's DNS:** add these records:

| Type | Host | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

DNS propagation: typically under 30 minutes, sometimes longer.

### Subsequent deploys

Push to `main` and Vercel auto-deploys. That's it.

```bash
git push
```

## Heads-up on Next.js 16

This project pins **Next.js 16.2.4** and **React 19.2.4**. APIs and conventions differ from Next 14/15 in places — read the relevant guides in `node_modules/next/dist/docs/` before making major changes. See [`AGENTS.md`](./AGENTS.md) and [`CLAUDE.md`](./CLAUDE.md) for guardrails.

## License

All rights reserved. Personal portfolio — feel free to use the structure as inspiration for your own site, but don't ship the content (copy, photos, project list) as your own.
