"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import GitHubIcon from "./icons/GitHubIcon";
import Magnetic from "./Magnetic";
import { projects, type Project } from "@/lib/projects";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** One scroll-synced beat: a short clip plus the line of copy it illustrates. */
type Beat = {
  title: string;
  body: string;
  video: string;
  poster: string;
  frame?: {
    scale: number;
    origin: string;
    mobileScale?: number;
  };
};

/** Per-project beats. The media column crossfades to BEATS[id][active] as the
 *  matching copy scrolls through screen center. Single-beat projects just hold
 *  their one loop while the copy scrolls. */
const BEATS: Record<string, Beat[]> = {
  "earth-lens": [
    {
      title: "Earth as your wallpaper",
      body: "A menu-bar app that pulls Google Earth's satellite imagery straight onto your desktop, rendered in the macOS 26 Liquid Glass material.",
      video: "/projects/earth-lens.mp4",
      poster: "/projects/earth-lens.webp",
    },
    {
      title: "On your cadence",
      body: "Rotate on demand or on a schedule, from a fast 15-minute cycle to a slow ambient drift through a curated set of regions.",
      video: "/projects/earth-lens.mp4",
      poster: "/projects/earth-lens.webp",
    },
  ],
  rung: [
    {
      title: "Real-time habit tracking",
      body: "The Java 17 backend coordinates authentication, habit tracking, mentoring, progress, subscriptions, and data portability through 27 REST controllers.",
      video: "/projects/rung-complete.mp4",
      poster: "/projects/rung.jpg",
      frame: { scale: 1.72, mobileScale: 1.9, origin: "50% 24%" },
    },
    {
      title: "Security and rate limits",
      body: "JWT security, Apple Sign-In and App Attest verification, encrypted PII with key rotation, and Redis with Bucket4j protect production paths.",
      video: "/projects/rung-health.mp4",
      poster: "/projects/rung.jpg",
      frame: { scale: 1.72, mobileScale: 1.9, origin: "50% 24%" },
    },
    {
      title: "Data and synchronization",
      body: "PostgreSQL and Flyway migrations provide the foundation while server-sent events keep clients synchronized in real time.",
      video: "/projects/rung-coach.mp4",
      poster: "/projects/rung.jpg",
      frame: { scale: 1.34, mobileScale: 1.48, origin: "64% 62%" },
    },
    {
      title: "Tested and scanned in CI",
      body: "Testcontainers integration tests, JaCoCo coverage gates, ShedLock scheduling, and Trivy scanning help keep releases reliable.",
      video: "/projects/rung-energy.mp4",
      poster: "/projects/rung.jpg",
      frame: { scale: 1.2, mobileScale: 1.34, origin: "54% 48%" },
    },
  ],
};

const STATUS_COPY: Record<Project["status"], string> = {
  live: "Live",
  soon: "Beta testing",
  shipped: "Shipped",
  current: "Currently building",
};

export default function ProjectShowcase() {
  return (
    <section id="work" className="relative w-full px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Selected Work" title="Recent Projects" />
        <div className="mt-20 flex flex-col gap-28 lg:mt-28 lg:gap-44">
          {projects.map((project, i) => (
            <Chapter key={project.id} project={project} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chapter({ project, flip }: { project: Project; flip: boolean }) {
  const beats = BEATS[project.id] ?? [];
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const chapterRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const chapterInView = useInView(chapterRef, {
    margin: "320px 0px 320px 0px",
  });
  const mediaInView = useInView(mediaRef, {
    margin: "120px 0px 120px 0px",
  });

  // Slow zoom: the media settles from 1.06 to 1 as the chapter scrolls
  // through, so the shot comes to rest while you read.
  const { scrollYProgress } = useScroll({
    target: chapterRef,
    offset: ["start end", "end start"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  // Play only the active, visible desktop clip. Pause the rest so offscreen
  // chapters and hidden responsive variants do not keep decoding in the
  // background.
  useEffect(() => {
    if (reduce) return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      const rendered = v.getClientRects().length > 0;
      if (chapterInView && mediaInView && rendered && i === active) {
        const p = v.play();
        if (p) p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, chapterInView, mediaInView, reduce]);

  const activateBeat = (i: number) => {
    setActive((prev) => {
      if (prev !== i) {
        const nextVideo = videoRefs.current[i];
        if (nextVideo) nextVideo.currentTime = 0;
      }
      return i;
    });
  };

  return (
    <div ref={chapterRef} className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      {/* MEDIA — pins on desktop, crossfades between beats */}
      <div className={cn("hidden lg:block", flip ? "lg:order-2" : "lg:order-1")}>
        <div ref={mediaRef} className="sticky top-28">
          <motion.div
            initial={
              reduce
                ? false
                : { clipPath: "inset(14% 10% 14% 10% round 24px)", scale: 1.06, opacity: 0.6 }
            }
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-white/45 bg-white/35 shadow-[0_34px_90px_-42px_rgba(20,17,14,0.55),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_34px_90px_-42px_rgba(0,0,0,0.9)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-12 bg-gradient-to-b from-white/20 to-transparent dark:from-white/8"
            />
            {/* The beat stack rides inside the clipped card so the slow zoom
                settles as the chapter scrolls through. */}
            <motion.div
              className="absolute inset-0"
              style={{ scale: reduce ? 1 : mediaScale }}
            >
              {reduce ? (
                <Image
                  src={beats[0]?.poster ?? project.screenshot ?? ""}
                  alt={`${project.name} preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                beats.map((beat, i) => (
                  <div
                    key={beat.video + i}
                    aria-hidden={i !== active}
                    className="absolute inset-0 transition-opacity duration-700 ease-out"
                    style={{ opacity: i === active ? 1 : 0 }}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      className="h-full w-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={beat.poster}
                      style={{
                        transform: beat.frame
                          ? `scale(${beat.frame.scale})`
                          : undefined,
                        transformOrigin: beat.frame?.origin,
                        willChange: beat.frame ? "transform" : undefined,
                      }}
                    >
                      <source src={beat.video} type="video/mp4" />
                    </video>
                  </div>
                ))
              )}
            </motion.div>

            {beats.length > 1 ? (
              <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
                {beats.map((b, i) => (
                  <span
                    key={b.title}
                    className="h-1 rounded-full bg-white/85 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-500"
                    style={{ width: i === active ? 26 : 9, opacity: i === active ? 1 : 0.55 }}
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* COPY + BEATS */}
      <div className={cn(flip ? "lg:order-1" : "lg:order-2")}>
        <ChapterHeader project={project} />

        <div className="mt-4 flex flex-col">
          {beats.map((beat, i) => (
            <motion.div
              key={beat.title}
              onViewportEnter={() => activateBeat(i)}
              viewport={{ margin: "-50% 0px -50% 0px" }}
              className="border-t border-ink/10 py-8 lg:flex lg:min-h-[54vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
            >
              {/* Mobile: the clip rides inline above its copy */}
              <div className="mb-5 lg:hidden">
                <MobileBeatMedia beat={beat} reduce={reduce} />
              </div>

              <motion.div
                animate={
                  reduce
                    ? { opacity: 1, y: 0 }
                    : { opacity: i === active ? 1 : 0.35, y: i === active ? 0 : 10 }
                }
                transition={{ duration: 0.5, ease: EASE }}
              >
                <h4 className="font-display text-2xl uppercase tracking-tight text-ink lg:text-[34px]">
                  {beat.title}
                </h4>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/75">
                  {beat.body}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileBeatMedia({
  beat,
  reduce,
}: {
  beat: Beat;
  reduce: boolean | null;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(frameRef, { margin: "-38% 0px -38% 0px" });
  const scale = beat.frame?.mobileScale ?? beat.frame?.scale;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;

    if (inView) {
      const p = video.play();
      if (p) p.catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reduce]);

  const mediaStyle = scale
    ? {
        transform: `scale(${scale})`,
        transformOrigin: beat.frame?.origin,
        willChange: "transform",
      }
    : undefined;

  return (
    <div
      ref={frameRef}
      className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/45 bg-white/30 shadow-[0_18px_54px_-32px_rgba(20,17,14,0.45),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
    >
      {reduce ? (
        <Image
          src={beat.poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={mediaStyle}
        />
      ) : (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload={inView ? "auto" : "metadata"}
          poster={beat.poster}
          style={mediaStyle}
        >
          <source src={beat.video} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function ChapterHeader({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">
          {STATUS_COPY[project.status]}
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>
      <h3 className="mt-4 font-display text-4xl uppercase tracking-tight text-ink lg:text-5xl">
        {project.name}
      </h3>
      <p className="mt-3 font-serif text-xl italic text-ink/75 lg:text-2xl">
        {project.tagline}
      </p>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/75">
        {project.description}
      </p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[11px] font-medium text-ink/70"
          >
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.href ? (
          <Magnetic strength={0.2} className="inline-flex w-fit">
            <Link
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-cream transition-transform duration-300 hover:-translate-y-0.5"
            >
              {project.status === "soon" ? "Join the beta" : "Visit"}
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Magnetic>
        ) : null}
        {project.github ? (
          <Link
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-[13px] font-medium text-ink/75 transition-colors hover:border-ink/40 hover:text-ink"
          >
            <GitHubIcon size={14} className="size-3.5" />
            Source
          </Link>
        ) : null}
      </div>
    </div>
  );
}
