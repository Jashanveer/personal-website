"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Dumbbell,
  Footprints,
  Lightbulb,
  Mountain,
  Music2,
  Trophy,
  X,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

type Item = {
  icon: typeof Lightbulb;
  year: string;
  title: string;
  body: string;
  /** Optional external link. When set, the card becomes clickable. */
  href?: string;
  /** Optional inline image (e.g., proof/screenshot). When set, the card
   *  becomes clickable and opens a lightbox. Mutually exclusive with `href`. */
  image?: string;
  imageAlt?: string;
};

const items: Item[] = [
  {
    icon: Lightbulb,
    year: "2019",
    title: "Patent · Anti-Theft System for Vehicles",
    body: "Filed at Chitkara CURIN. Arduino + GPS tracking with mobile-app control.",
    href: "https://curin.chitkara.edu.in/patents/antitheft-system-for-a-vehicle/",
  },
  {
    icon: Award,
    year: "2024",
    title: "Zolve Visionary Leader",
    body: "Recognized for academic excellence, leadership, and community service. Featured among the Spring 2024 cohort.",
    image: "/zolve.png",
    imageAlt:
      "Zolve Visionary Leaders Spring 2024 — Jashanveer Singh, George Mason University",
  },
  {
    icon: Trophy,
    year: "2022",
    title: "On the Spot Award · Gemini Solutions",
    body: "Awarded for exceptional project performance.",
  },
];

type Hobby = {
  icon: typeof Lightbulb;
  label: string;
  body: string;
  /** Position on the keyboard before the morph (row index, starting col). */
  row: number;
  col: number;
};

/** Order matters — same order as the aligned row formation. */
const HOBBIES: Hobby[] = [
  {
    icon: Mountain,
    label: "HIKING",
    body: "Weekend trails — the longer the better.",
    row: 1,
    col: 7,
  },
  {
    icon: Dumbbell,
    label: "GYM",
    body: "Lifting four-ish days a week, mostly compounds.",
    row: 2,
    col: 4,
  },
  {
    icon: Music2,
    label: "DANCING",
    body: "Bhangra basics + whatever the song asks for.",
    row: 0,
    col: 5,
  },
  {
    icon: Footprints,
    label: "RUNNING",
    body: "Long, slow miles to think things through.",
    row: 3,
    col: 9,
  },
];

const COLS = 13;
const ROWS = 4;
const HOBBY_SPAN = 3;
/** Extra rows below the keyboard so descriptions have room to render. */
const TOTAL_ROWS = ROWS + 2;

type RegularKey = { row: number; col: number; label: string };

/** The non-hobby keys that fade out as you scroll. Positions are picked so
 *  none collide with a hobby keycap (hobbies occupy 3 cells each). */
const REGULAR_KEYS: RegularKey[] = [
  // Row 0 — DANCING occupies cols 5-7
  ..."`12345".split("").map((label, i) => ({ row: 0, col: i, label })),
  ..."890-=".split("").map((label, i) => ({ row: 0, col: 8 + i, label })),
  // Row 1 — HIKING occupies cols 7-9
  ..."QWERTYU".split("").map((label, i) => ({ row: 1, col: i, label })),
  ..."P[]".split("").map((label, i) => ({ row: 1, col: 10 + i, label })),
  // Row 2 — GYM occupies cols 4-6
  ..."ASDF".split("").map((label, i) => ({ row: 2, col: i, label })),
  ..."JKL;'".split("").map((label, i) => ({ row: 2, col: 7 + i, label })),
  { row: 2, col: 12, label: "↵" },
  // Row 3 — RUNNING occupies cols 9-11
  ..."ZXCVBNM,.".split("").map((label, i) => ({ row: 3, col: i, label })),
  { row: 3, col: 12, label: "/" },
];

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

export default function BeyondCode() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

  return (
    <section id="beyond" className="relative w-full">
      <div className="px-6 pt-24 lg:px-10 lg:pt-32">
        <div className="mx-auto max-w-[1500px]">
          <SectionHeading eyebrow="The other stuff" title="Beyond Code" />

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {items.map((it, i) => (
              <Card
                key={it.title}
                item={it}
                delay={i * 0.08}
                onImageClick={(src, alt) => setLightbox({ src, alt })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hobbies — desktop scroll-driven keyboard model.
          The model arrives, the surrounding keys fade, and the four hobby
          keycaps slide into a centered row. */}
      <HobbyKeyboard />

      {/* Hobbies — mobile fallback. Same data, simple uniform tiles. */}
      <div className="px-6 pb-24 md:hidden">
        <div className="mx-auto mt-16 max-w-[1500px]">
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
            Outside the keyboard
          </span>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {HOBBIES.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 32, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.06,
                    ease: REVEAL_EASE,
                  }}
                  className="flex aspect-[5/4] flex-col gap-3 rounded-2xl border border-white/40 bg-white/30 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <Icon
                    className="size-6 text-ink"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <h4 className="font-display text-base uppercase tracking-tight text-ink">
                    {h.label}
                  </h4>
                  <p className="text-[13px] leading-relaxed text-ink/70">
                    {h.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Lightbox
        open={!!lightbox}
        src={lightbox?.src ?? ""}
        alt={lightbox?.alt ?? ""}
        onClose={() => setLightbox(null)}
      />
    </section>
  );
}

function HobbyKeyboard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Track the entire section. While the inner is sticky-pinned,
  // scrollYProgress runs from 0 to 1 across the section's tail.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Stages, tied to scrollYProgress:
  //  0.00–0.30  keyboard arrives & idles
  //  0.30–0.55  the whole keyboard (frame + surrounding keys + labels)
  //             fades out together; only the hobby keycaps remain
  //  0.55–0.80  hobby keycaps slide into a centered row in empty space
  //  0.85–0.97  descriptions emerge beneath the keycaps
  const regularOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.3, 0.55],
    [1, 0],
  );
  const frameOpacity: MotionValue<number> = regularOpacity;
  const morph: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.55, 0.8],
    [0, 1],
  );
  const descOpacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0.85, 0.97],
    [0, 1],
  );

  return (
    <div ref={sectionRef} className="relative hidden h-[260vh] md:block">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="flex w-full max-w-[1100px] flex-col items-center gap-10">
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
            Outside the keyboard
          </span>

          <div
            className="relative w-full"
            style={{ aspectRatio: `${COLS} / ${TOTAL_ROWS}` }}
          >
            {/* Keychron-style frame — sits behind the keys, vanishes during
                the rearrangement so the keyboard body goes with its keys. */}
            <motion.div
              aria-hidden
              style={{
                opacity: frameOpacity,
                height: `${((ROWS + 0.4) / TOTAL_ROWS) * 100}%`,
                left: "-2%",
                top: "-3%",
                width: "104%",
              }}
              className="pointer-events-none absolute rounded-2xl border border-white/30 bg-white/[0.08] shadow-[0_30px_80px_-30px_rgba(20,17,14,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]"
            />

            {REGULAR_KEYS.map((k) => (
              <RegularKeycap
                key={`${k.row}-${k.col}`}
                row={k.row}
                col={k.col}
                label={k.label}
                opacity={regularOpacity}
              />
            ))}

            {HOBBIES.map((h, i) => (
              <HobbyKeycap
                key={h.label}
                hobby={h}
                index={i}
                morph={morph}
                descOpacity={descOpacity}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegularKeycap({
  row,
  col,
  label,
  opacity,
}: {
  row: number;
  col: number;
  label: string;
  opacity: MotionValue<number>;
}) {
  const left = `${(col / COLS) * 100}%`;
  const top = `${(row / TOTAL_ROWS) * 100}%`;
  const width = `${100 / COLS}%`;
  const height = `${100 / TOTAL_ROWS}%`;

  return (
    <motion.div
      aria-hidden
      style={{ left, top, width, height, opacity }}
      className="absolute p-[3px]"
    >
      <div className="flex h-full w-full items-center justify-center rounded-md border border-white/45 bg-white/45 text-[11px] font-medium text-ink/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_5px_-2px_rgba(20,17,14,0.2)] backdrop-blur-md backdrop-saturate-150 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink/55 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        {label}
      </div>
    </motion.div>
  );
}

function HobbyKeycap({
  hobby,
  index,
  morph,
  descOpacity,
}: {
  hobby: Hobby;
  index: number;
  morph: MotionValue<number>;
  descOpacity: MotionValue<number>;
}) {
  // Start: where this keycap lives on the keyboard (3 cells wide).
  const startLeft = (hobby.col / COLS) * 100;
  const startTop = (hobby.row / TOTAL_ROWS) * 100;
  const startWidth = (HOBBY_SPAN / COLS) * 100;

  // End: centered horizontal row, four uniform tiles.
  // 4 keycaps * 2.5 cells + 3 gaps * 0.5 + 2 margins * 0.75 = 13 cells.
  const endCol = 0.75 + index * 3;
  const endLeft = (endCol / COLS) * 100;
  const endTop = (1.5 / TOTAL_ROWS) * 100;
  const endWidth = (2.5 / COLS) * 100;

  const left = useTransform(
    morph,
    (v) => `${startLeft + (endLeft - startLeft) * v}%`,
  );
  const top = useTransform(
    morph,
    (v) => `${startTop + (endTop - startTop) * v}%`,
  );
  const width = useTransform(
    morph,
    (v) => `${startWidth + (endWidth - startWidth) * v}%`,
  );
  const height = `${100 / TOTAL_ROWS}%`;

  const Icon = hobby.icon;

  return (
    <motion.div
      style={{ left, top, width, height }}
      className="absolute p-[3px]"
    >
      <div className="relative flex h-full w-full items-center justify-center gap-2 rounded-md border border-white/55 bg-white/55 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_-12px_rgba(20,17,14,0.4)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/15 dark:bg-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_24px_-12px_rgba(0,0,0,0.7)]">
        <Icon className="size-4 text-ink/85" strokeWidth={1.6} aria-hidden />
        <span className="font-display text-[clamp(11px,1.2vw,15px)] uppercase tracking-tight">
          {hobby.label}
        </span>
      </div>

      <motion.p
        style={{ opacity: descOpacity }}
        className="absolute left-1/2 top-full mt-4 w-[115%] -translate-x-1/2 text-center text-[12px] leading-relaxed text-ink"
      >
        {hobby.body}
      </motion.p>
    </motion.div>
  );
}

function Card({
  item,
  delay,
  onImageClick,
}: {
  item: Item;
  delay: number;
  onImageClick: (src: string, alt: string) => void;
}) {
  const Icon = item.icon;
  const cardClass =
    "group relative flex h-full flex-col gap-4 rounded-3xl border border-white/40 bg-white/30 p-8 shadow-[0_20px_50px_-25px_rgba(20,17,14,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]";
  const interactiveClass =
    item.href || item.image
      ? " cursor-pointer hover:-translate-y-1 hover:bg-white/40 dark:hover:bg-white/[0.06]"
      : "";

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <Icon className="size-7 text-ink" strokeWidth={1.5} aria-hidden />
        {item.href || item.image ? (
          <ArrowUpRight
            className="size-5 text-ink/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            aria-hidden
          />
        ) : null}
      </div>
      <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
        {item.year}
      </span>
      <h3 className="font-display text-xl uppercase tracking-tight text-ink">
        {item.title}
      </h3>
      <p className="text-[14px] leading-relaxed text-ink/75">{item.body}</p>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.0, delay, ease: REVEAL_EASE }}
      className="h-full"
    >
      {item.href ? (
        <Link
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className={cardClass + interactiveClass}
        >
          {inner}
        </Link>
      ) : item.image ? (
        <button
          type="button"
          onClick={() => onImageClick(item.image!, item.imageAlt ?? item.title)}
          className={cardClass + interactiveClass + " w-full text-left"}
        >
          {inner}
        </button>
      ) : (
        <div className={cardClass}>{inner}</div>
      )}
    </motion.div>
  );
}

/** Click-to-zoom image lightbox. ESC or click outside to close. */
function Lightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xl backdrop-saturate-150"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/30 bg-cream shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/40 bg-white/70 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur transition-colors hover:bg-white/90"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              quality={90}
              className="block max-h-[90vh] w-auto object-contain"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
