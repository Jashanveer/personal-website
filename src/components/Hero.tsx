"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AvailabilityPill from "./AvailabilityPill";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [hoverable, setHoverable] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // On hover-capable devices (desktop with mouse), Hey/there are strictly
  // hover-driven — they show on pointer-enter and hide on pointer-leave.
  // On touch devices (no hover), they auto-reveal once so the headline is
  // still visible. Reduced-motion users always see them.
  useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }
    const canHover = window.matchMedia("(hover: hover)").matches;
    setHoverable(canHover);
    if (!canHover) {
      const t = setTimeout(() => setRevealed(true), 600);
      return () => clearTimeout(t);
    }
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heyDrift = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const thereDrift = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // First hover over the image is the "introduction" — once Hey/there have
  // arrived they stay; we don't undo on pointer-leave.
  const onEnter = () => {
    if (hoverable) setRevealed(true);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate w-full overflow-hidden pt-24 lg:pt-28"
    >
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative mx-auto max-w-[1600px] px-6 lg:px-10"
      >
        <div
          className="relative flex min-h-[80vh] items-center justify-center lg:min-h-[84vh]"
        >
          {/* "Hey," — fully behind portrait initially, slides left on reveal.
              Anchored slightly inset from the left edge so it ends up close
              to the body, not pinned to the screen edge. */}
          <motion.span
            style={{ x: heyDrift }}
            aria-hidden={!revealed}
            className="pointer-events-none absolute left-[6%] top-[42%] z-0 -translate-y-1/2 select-none whitespace-nowrap font-serif italic leading-[0.85] text-ink text-[clamp(60px,11vw,180px)]"
          >
            <motion.span
              initial={{ x: "150%", opacity: 0 }}
              animate={revealed ? { x: 0, opacity: 1 } : { x: "150%", opacity: 0 }}
              transition={{ duration: 1.2, ease, opacity: { duration: 1.4, ease } }}
              className="inline-block"
            >
              Hey,
            </motion.span>
          </motion.span>

          {/* "there" — fully behind portrait, slides right on reveal */}
          <motion.span
            style={{ x: thereDrift }}
            aria-hidden={!revealed}
            className="pointer-events-none absolute right-[6%] top-[58%] z-0 -translate-y-1/2 select-none whitespace-nowrap font-serif italic leading-[0.85] text-ink text-[clamp(60px,11vw,180px)]"
          >
            <motion.span
              initial={{ x: "-150%", opacity: 0 }}
              animate={revealed ? { x: 0, opacity: 1 } : { x: "-150%", opacity: 0 }}
              transition={{ duration: 1.2, ease, opacity: { duration: 1.4, ease } }}
              className="inline-block"
            >
              there
            </motion.span>
          </motion.span>

          {/* Portrait — transparent cutout, no frame. Flows directly with the
              ambient cream/lilac gradient. z-10 so text sits behind it. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease }}
            style={{ y: portraitY }}
            className="relative z-10 aspect-[3/4] w-[min(72vw,640px)]"
          >
            {/* Hover handlers live on the image wrapper only — pill and callout
                are siblings outside this div so they don't trigger reveal. */}
            <div
              onPointerEnter={onEnter}
              className="relative h-full w-full"
            >
              <Image
                src="/me.webp"
                alt="Jashanveer Singh"
                fill
                priority
                sizes="(max-width: 1024px) 72vw, 640px"
                quality={92}
                className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(20,17,14,0.18)] dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Availability pill — tucked close to the left of the head */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease }}
              className="absolute -left-[8%] top-[16%] z-20 hidden lg:block"
            >
              <AvailabilityPill />
            </motion.div>

            {/* Description callout — to the RIGHT of the turban, safely below
                the nav. A dashed curve runs from the callout to the turban. */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease }}
              className="absolute -right-[16%] top-[6%] z-20 hidden lg:block"
            >
              {/* Dashed curve from the callout's bottom-left, sweeping
                  left and slightly down toward the turban. No arrowhead. */}
              <svg
                aria-hidden
                viewBox="0 0 180 80"
                className="absolute -left-[150px] top-[58px] h-[80px] w-[180px] text-ink/45"
                fill="none"
              >
                <path
                  d="M 175 8 C 120 6, 70 22, 14 64"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="2 5"
                />
              </svg>
              <p className="max-w-[240px] rounded-2xl border border-white/45 bg-white/40 px-4 py-3 text-left text-[13px] leading-relaxed text-ink/85 shadow-[0_10px_28px_-10px_rgba(20,17,14,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
                <span className="block pb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45">
                  here&apos;s what I do
                </span>
                Java backend and full-stack engineer building with{" "}
                <span className="font-semibold">Spring Boot</span>,{" "}
                <span className="font-semibold">REST APIs</span>,{" "}
                <span className="font-semibold">PostgreSQL</span>, and{" "}
                <span className="font-semibold">React</span>.
                <br />
                <span className="text-ink/60">Currently @ onAir Tech.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* BOTTOM ROW — "I AM JASHANVEER" + "SOFTWARE ENGINEER".
            Stacks vertically on mobile so the headline doesn't overflow. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="relative z-30 -mt-[2vw] flex flex-col gap-3 pb-10 lg:flex-row lg:flex-nowrap lg:items-end lg:justify-between lg:gap-x-6 lg:pb-16"
        >
          <h1 className="whitespace-nowrap font-display uppercase leading-[0.86] tracking-[-0.025em] text-ink text-[clamp(36px,9.5vw,140px)]">
            I AM
            <br />
            JASHANVEER
          </h1>
          <h2 className="whitespace-nowrap font-display uppercase leading-[0.95] tracking-tight text-ink text-[clamp(20px,3vw,52px)] lg:text-right lg:mb-[0.4vw]">
            JAVA BACKEND /
            <br />
            FULL-STACK ENGINEER
          </h2>
        </motion.div>

        {/* MOBILE pill + description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease }}
          className="relative z-30 flex flex-col gap-5 pb-12 lg:hidden"
        >
          <AvailabilityPill />
          <p className="max-w-md text-[14px] leading-relaxed text-ink/80">
            Java backend and full-stack engineer building with{" "}
            <span className="font-semibold">Spring Boot</span>,{" "}
            <span className="font-semibold">REST APIs</span>,{" "}
            <span className="font-semibold">PostgreSQL</span>, and{" "}
            <span className="font-semibold">React</span>. Currently @ onAir Tech.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
