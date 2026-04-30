"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AvailabilityPill from "./AvailabilityPill";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Auto-reveal on touch devices (no hover) and after a brief delay so the
  // animation gets seen even if the user never hovers.
  useEffect(() => {
    if (revealed) return;
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }
    const isTouch = window.matchMedia("(hover: none)").matches;
    const t = setTimeout(() => setRevealed(true), isTouch ? 600 : 2200);
    return () => clearTimeout(t);
  }, [revealed, prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heyDrift = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const thereDrift = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const handleReveal = () => setRevealed(true);

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
          onPointerEnter={handleReveal}
          onPointerDown={handleReveal}
          className="relative flex min-h-[80vh] items-center justify-center lg:min-h-[84vh]"
        >
          {/* "Hey," — fully behind portrait initially, slides left on reveal.
              Sized to fit the left third of the viewport without overflowing. */}
          <motion.span
            style={{ x: heyDrift }}
            aria-hidden={!revealed}
            className="pointer-events-none absolute left-0 top-[42%] z-0 -translate-y-1/2 select-none whitespace-nowrap font-serif italic leading-[0.85] text-ink text-[clamp(50px,8vw,140px)]"
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
            className="pointer-events-none absolute right-0 top-[58%] z-0 -translate-y-1/2 select-none whitespace-nowrap font-serif italic leading-[0.85] text-ink text-[clamp(50px,8vw,140px)]"
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
            <Image
              src="/me.webp"
              alt="Jashanveer Singh"
              fill
              priority
              sizes="(max-width: 1024px) 72vw, 640px"
              quality={92}
              className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(20,17,14,0.18)] dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            />

            {/* Availability pill — tucked close to the left of the head */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease }}
              className="absolute -left-[8%] top-[16%] z-20 hidden lg:block"
            >
              <AvailabilityPill />
            </motion.div>

            {/* Description callout — sits above the turban with a curved arrow
                that comes from the callout and points down at the turban. */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.95, ease }}
              className="absolute -right-[14%] -top-[10%] z-20 hidden lg:block"
            >
              {/* Arrow: starts at the bottom-left of the callout, curves down
                  and to the LEFT, ending with the arrowhead at the turban. */}
              <svg
                aria-hidden
                viewBox="0 0 180 130"
                className="absolute -left-[140px] top-[60px] h-[130px] w-[180px] text-ink/50"
                fill="none"
              >
                <path
                  d="M 175 12 C 130 6, 70 30, 24 100"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="2 4"
                />
                {/* Arrowhead at (24, 100) pointing down-left */}
                <path
                  d="M 36 90 L 22 104 L 38 110"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="max-w-[240px] rounded-2xl border border-white/45 bg-white/40 px-4 py-3 text-left text-[13px] leading-relaxed text-ink/85 shadow-[0_10px_28px_-10px_rgba(20,17,14,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
                <span className="block pb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45">
                  here&apos;s what I do
                </span>
                Specialized in <span className="font-semibold">Web Apps</span>,{" "}
                <span className="font-semibold">iOS &amp; macOS</span>,{" "}
                <span className="font-semibold">Backend</span>, and{" "}
                <span className="font-semibold">Cloud-native</span> systems.
                <br />
                <span className="text-ink/60">Currently @ onAir Tech.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* BOTTOM ROW — "I AM JASHANVEER" + "SOFTWARE ENGINEER" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="relative z-30 -mt-[2vw] flex flex-nowrap items-end justify-between gap-x-6 pb-10 lg:pb-16"
        >
          <h1 className="whitespace-nowrap font-display uppercase leading-[0.86] tracking-[-0.025em] text-ink text-[clamp(40px,9.5vw,140px)]">
            I AM
            <br />
            JASHANVEER
          </h1>
          <h2 className="whitespace-nowrap font-display uppercase leading-[0.95] tracking-tight text-right text-ink text-[clamp(16px,3vw,52px)] mb-[0.4vw]">
            SOFTWARE
            <br />
            ENGINEER
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
            Specialized in <span className="font-semibold">Web Apps</span>,{" "}
            <span className="font-semibold">iOS &amp; macOS</span>,{" "}
            <span className="font-semibold">Backend</span>, and{" "}
            <span className="font-semibold">Cloud-native</span> systems. Currently @ onAir Tech.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
