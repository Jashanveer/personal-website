"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import GitHubIcon from "./icons/GitHubIcon";
import { projects, type Project } from "@/lib/projects";

const STATUS_COPY: Record<Project["status"], string> = {
  live: "● Live",
  soon: "● Coming to App Store",
  shipped: "● Shipped",
  current: "● Currently building",
};

export default function Projects() {
  return (
    <section id="work" className="relative w-full px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Selected Work" title="Recent Projects" />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  // Liquid Glass surface: backdrop blur + saturate, inner top highlight,
  // soft outer shadow that deepens on hover.
  const glassClass =
    "group relative block overflow-hidden rounded-3xl border border-white/40 bg-white/30 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_60px_-30px_rgba(20,17,14,0.45),inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:bg-white/40 hover:shadow-[0_40px_90px_-30px_rgba(20,17,14,0.55),inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] dark:hover:bg-white/[0.06]";

  const inner = <ProjectCardInner project={project} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {project.href ? (
        <Link
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={glassClass}
        >
          {inner}
        </Link>
      ) : (
        <div className={glassClass}>{inner}</div>
      )}
    </motion.div>
  );
}

function ProjectCardInner({ project }: { project: Project }) {
  return (
    <>
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={
          project.screenshot
            ? undefined
            : { background: `linear-gradient(135deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)` }
        }
      >
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={`${project.name} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : project.iframe ? (
          <IframePreview src={project.iframe} accent={project.accent} />
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              }}
            />
            <div className="absolute inset-0 dark:brightness-[0.32] dark:saturate-[1.35]">
              <DeviceMockup
                platform={project.platform}
                accent={project.accent}
                projectId={project.id}
              />
            </div>
          </>
        )}

        {/* Liquid-glass status badge */}
        <div className="absolute right-4 top-4 z-10 rounded-full border border-white/40 bg-white/50 px-3 py-1 text-[11px] font-medium tracking-tight text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/15 dark:bg-white/10 dark:text-ink dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          {STATUS_COPY[project.status]}
        </div>
      </div>

      <div className="flex items-start justify-between gap-6 px-6 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl uppercase tracking-tight text-ink lg:text-3xl">
            {project.name}
          </h3>
          <p className="font-serif text-lg italic text-ink/75 lg:text-xl">
            {project.tagline}
          </p>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink/75">
            {project.description}
          </p>
          {project.highlights.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-1.5">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-[13px] leading-relaxed text-ink/70"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] inline-block size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[11px] font-medium text-ink/70"
              >
                {t}
              </li>
            ))}
          </ul>
          {project.github ? (
            // Rendered as a button (not <a>) so we don't nest an anchor inside
            // the outer card <Link>. Opens the GitHub repo in a new tab.
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(project.github, "_blank", "noopener,noreferrer");
              }}
              className="mt-4 inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[12px] font-medium text-ink/75 transition-colors hover:border-ink/40 hover:text-ink"
            >
              <GitHubIcon size={14} className="size-3.5" />
              View source
            </button>
          ) : null}
        </div>
        {project.href ? (
          <ArrowUpRight
            className="mt-1 size-7 shrink-0 text-ink/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            aria-hidden
          />
        ) : null}
      </div>
    </>
  );
}

/** Live preview of a website inside the project card. The iframe renders at
 *  desktop dimensions then is shrunk via CSS scale to fit. */
function IframePreview({ src, accent }: { src: string; accent: string }) {
  const FRAME_W = 1280;
  const FRAME_H = 800;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${accent}22 0%, ${accent}44 100%)` }}
    >
      <div
        className="relative w-[88%] overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)]"
        style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
      >
        {/* macOS window chrome */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 border-b border-ink/10 bg-white/95 px-3 py-2.5 backdrop-blur">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate text-[10px] text-ink/40">
            {src.replace(/^https?:\/\//, "")}
          </span>
        </div>
        <div className="absolute inset-0 pt-[34px]">
          {/* Render iframe at native size, then scale down with transform */}
          <iframe
            src={src}
            title="Live preview"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: `${FRAME_W}px`,
              height: `${FRAME_H}px`,
              border: 0,
              transform: "scale(0.42)",
              transformOrigin: "0 0",
              pointerEvents: "none",
            }}
          />
        </div>
        {/* Click-blocker so the parent Link receives the click instead of the iframe */}
        <div className="absolute inset-0" />
      </div>
    </div>
  );
}

/** Abstract device mockup — fallback when no screenshot/iframe is set. */
function DeviceMockup({
  platform,
  accent,
  projectId,
}: {
  platform: Project["platform"];
  accent: string;
  projectId: string;
}) {
  // Rung gets a special trio mockup showing the app icon on iPhone, iPad, and Mac
  if (projectId === "rung") return <RungTrioMockup accent={accent} />;
  if (platform === "ios") return <PhoneMockup accent={accent} />;
  if (platform === "macos" || platform === "web")
    return <DesktopMockup accent={accent} />;
  return <CrossMockup accent={accent} />;
}

/** Rung-specific mockup: iPhone + iPad + Mac, all running the same app.
 *  Replace RungIcon with a real <Image src="/projects/rung-icon.png"> when
 *  you drop the actual icon file in. */
function RungTrioMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Mac in the back */}
      <div className="absolute top-[18%] left-1/2 w-[60%] -translate-x-1/2">
        <div
          className="rounded-t-xl border border-ink/15 bg-white shadow-2xl"
          style={{ boxShadow: `0 30px 70px -25px ${accent}88` }}
        >
          <div className="flex items-center gap-1 border-b border-ink/10 px-2 py-1.5">
            <span className="size-1.5 rounded-full bg-[#ff5f57]" />
            <span className="size-1.5 rounded-full bg-[#febc2e]" />
            <span className="size-1.5 rounded-full bg-[#28c840]" />
          </div>
          <RungAppUI accent={accent} columns={3} />
        </div>
        {/* MacBook base hint */}
        <div className="mx-auto h-1.5 w-[110%] -translate-x-[5%] rounded-b-md bg-ink/85" />
      </div>

      {/* iPad to the left, slightly tilted */}
      <div
        className="absolute bottom-[8%] left-[6%] w-[28%] -rotate-6"
        style={{ filter: `drop-shadow(0 18px 40px ${accent}aa)` }}
      >
        <div className="rounded-xl border-[3px] border-ink/85 bg-white p-1">
          <RungAppUI accent={accent} columns={2} compact />
        </div>
      </div>

      {/* iPhone to the right, tilted the other way */}
      <div
        className="absolute bottom-[6%] right-[6%] w-[18%] rotate-6"
        style={{ filter: `drop-shadow(0 18px 40px ${accent}aa)` }}
      >
        <div className="rounded-2xl border-[3px] border-ink/85 bg-white p-1">
          <div className="mx-auto h-1 w-6 rounded-full bg-ink/85" />
          <RungAppUI accent={accent} columns={1} compact />
        </div>
      </div>
    </div>
  );
}

/** Tiny Rung UI: app icon + a few "habit" rows. Same on every device.
 *  Real Rung icon: drop public/projects/rung-icon.png and swap RungIcon below. */
function RungAppUI({
  accent,
  columns,
  compact = false,
}: {
  accent: string;
  columns: number;
  compact?: boolean;
}) {
  const rows = compact ? 3 : 4;
  return (
    <div
      className="flex flex-col"
      style={{
        gap: compact ? 4 : 6,
        padding: compact ? 6 : 12,
      }}
    >
      <div className="flex items-center gap-2">
        <RungIcon size={compact ? 14 : 22} />
        <div
          className="h-2 flex-1 rounded-full"
          style={{ backgroundColor: `${accent}33` }}
        />
      </div>
      <div
        className="grid gap-1 pt-1"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * columns }).map((_, i) => (
          <div
            key={i}
            className="rounded"
            style={{
              height: compact ? 12 : 20,
              backgroundColor: i % 3 === 0 ? `${accent}55` : `${accent}22`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Real Rung app icon copied from the macOS app's Assets.xcassets. */
function RungIcon({ size }: { size: number }) {
  return (
    <Image
      src="/projects/rung-icon.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-[22%] shadow-[0_2px_6px_-2px_rgba(0,0,0,0.4)]"
    />
  );
}

function PhoneMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className="h-72 w-36 rounded-[36px] border-4 border-ink/85 bg-white/95 shadow-2xl"
        style={{ boxShadow: `0 24px 60px -20px ${accent}88` }}
      >
        <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-ink/85" />
        <div className="px-2 pt-3">
          <div className="h-2 w-12 rounded-full bg-ink/15" />
          <div className="mt-2 h-1.5 w-20 rounded-full bg-ink/10" />
          <div className="mt-5 space-y-2">
            <div className="h-8 rounded-lg" style={{ backgroundColor: `${accent}22` }} />
            <div className="h-8 rounded-lg" style={{ backgroundColor: `${accent}33` }} />
            <div className="h-8 rounded-lg" style={{ backgroundColor: `${accent}22` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2">
      <div
        className="rounded-2xl border border-ink/10 bg-white/95 shadow-2xl"
        style={{ boxShadow: `0 30px 70px -25px ${accent}99` }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-ink/10">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="grid grid-cols-[80px_1fr] min-h-[180px]">
          <div className="border-r border-ink/10 p-3 space-y-2">
            <div className="h-2 rounded-full bg-ink/15" />
            <div className="h-2 rounded-full bg-ink/10" />
            <div className="h-2 rounded-full bg-ink/10" />
          </div>
          <div className="p-4 space-y-2">
            <div className="h-3 w-1/3 rounded-full bg-ink/15" />
            <div className="h-2 w-2/3 rounded-full bg-ink/10" />
            <div className="mt-3 h-20 rounded-lg" style={{ backgroundColor: `${accent}22` }} />
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-12 rounded" style={{ backgroundColor: `${accent}33` }} />
              <div className="h-12 rounded" style={{ backgroundColor: `${accent}22` }} />
              <div className="h-12 rounded" style={{ backgroundColor: `${accent}33` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrossMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4">
      <div
        className="h-56 w-28 rounded-[28px] border-4 border-ink/85 bg-white/95 -rotate-6"
        style={{ boxShadow: `0 24px 60px -20px ${accent}88` }}
      >
        <div className="mx-auto mt-1.5 h-1 w-12 rounded-full bg-ink/85" />
        <div className="space-y-1.5 px-2 pt-3">
          <div className="h-6 rounded" style={{ backgroundColor: `${accent}22` }} />
          <div className="h-6 rounded" style={{ backgroundColor: `${accent}33` }} />
          <div className="h-6 rounded" style={{ backgroundColor: `${accent}22` }} />
        </div>
      </div>
      <div
        className="h-44 w-64 rounded-xl border-2 border-ink/85 bg-white/95 rotate-3"
        style={{ boxShadow: `0 24px 60px -20px ${accent}88` }}
      >
        <div className="flex gap-1 px-2 py-1.5 border-b border-ink/10">
          <span className="size-1.5 rounded-full bg-ink/40" />
          <span className="size-1.5 rounded-full bg-ink/40" />
          <span className="size-1.5 rounded-full bg-ink/40" />
        </div>
        <div className="p-3 space-y-1.5">
          <div className="h-2 w-1/2 rounded-full bg-ink/20" />
          <div className="h-12 rounded" style={{ backgroundColor: `${accent}22` }} />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 rounded" style={{ backgroundColor: `${accent}33` }} />
            <div className="h-10 rounded" style={{ backgroundColor: `${accent}22` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
