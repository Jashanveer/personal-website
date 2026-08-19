"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import AvailabilityPill from "./AvailabilityPill";
import PortraitMedia from "./PortraitMedia";
import { EASE, INTRO_HANDOFF } from "@/lib/motion";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const headlinePlayed = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [hoverable, setHoverable] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // The intro overlay owns the screen for INTRO_HANDOFF seconds on load, so
  // every first-paint entrance here waits for the handoff. Under reduced
  // motion the intro never renders, so there's nothing to wait for.
  const introDelay = prefersReducedMotion ? 0 : INTRO_HANDOFF;

  // On hover-capable devices (desktop with mouse), Hey/there are strictly
  // hover-driven — they show on pointer-enter and hide on pointer-leave.
  // On touch devices (no hover), they auto-reveal once so the headline is
  // still visible. Reduced-motion users always see them.
  useEffect(() => {
    let frame = 0;
    if (prefersReducedMotion) {
      frame = window.requestAnimationFrame(() => setRevealed(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const canHover = window.matchMedia("(hover: hover)").matches;
    frame = window.requestAnimationFrame(() => setHoverable(canHover));
    if (!canHover) {
      const t = setTimeout(() => setRevealed(true), 600 + introDelay * 1000);
      return () => {
        window.cancelAnimationFrame(frame);
        clearTimeout(t);
      };
    }
    return () => window.cancelAnimationFrame(frame);
  }, [prefersReducedMotion, introDelay]);

  // "I AM / JASHANVEER" rises char-by-char from behind per-line masks once
  // the intro overlay hands off. autoSplit re-runs onSplit after font loads
  // and on resize, so once the entrance has played we pin re-split chars to
  // their final state instead of replaying it.
  useEffect(() => {
    const h1El = h1Ref.current;
    if (!h1El) return;

    gsap.registerPlugin(SplitText);

    // matchMedia gives us free prefers-reduced-motion handling: under
    // "reduce" nothing runs, the headline just renders normally.
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(h1El, {
        type: "lines,chars",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          if (headlinePlayed.current) {
            gsap.set(self.chars, { yPercent: 0 });
            return;
          }
          headlinePlayed.current = true;
          gsap.from(self.chars, {
            yPercent: 115,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.025,
            delay: INTRO_HANDOFF + 0.35,
          });
        },
      });

      return () => split.revert();
    });

    return () => mm.revert();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heyDrift = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const thereDrift = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const commandY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const commandRotate = useTransform(scrollYProgress, [0, 1], [-2, 4]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // Scroll-velocity skew on the headline: a subtle lean while scrolling that
  // settles flat at rest. Clamped so flick-scrolls never overshoot the lean.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const skewTarget = useTransform(scrollVelocity, [-1500, 1500], [4, -4], {
    clamp: true,
  });
  const skewX = useSpring(skewTarget, { stiffness: 300, damping: 40 });

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
              transition={{ duration: 1.2, ease: EASE, opacity: { duration: 1.4, ease: EASE } }}
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
              transition={{ duration: 1.2, ease: EASE, opacity: { duration: 1.4, ease: EASE } }}
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
            transition={{ duration: 1.1, delay: introDelay + 0.1, ease: EASE }}
            style={{ y: portraitY }}
            className="relative z-10 aspect-[3/4] w-[min(72vw,640px)]"
          >
            {/* Hover handlers live on the image wrapper only — pill and callout
                are siblings outside this div so they don't trigger reveal. */}
            <div
              onPointerEnter={onEnter}
              className="relative h-full w-full"
            >
              <PortraitMedia progress={scrollYProgress} />
            </div>

            {/* Availability pill — tucked close to the left of the head */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: introDelay + 0.9, ease: EASE }}
              className="absolute -left-[8%] top-[16%] z-20 hidden lg:block"
            >
              <AvailabilityPill />
            </motion.div>

            {/* Description callout — to the RIGHT of the turban, safely below
                the nav. A dashed curve runs from the callout to the turban. */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: introDelay + 0.95, ease: EASE }}
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

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: introDelay + 1.05, ease: EASE }}
            style={{ y: commandY, rotate: commandRotate }}
            className="absolute bottom-[24%] left-[3%] z-30 hidden w-[min(34vw,400px)] lg:block"
          >
            <div className="overflow-hidden rounded-3xl border border-white/45 bg-white/45 shadow-[0_24px_70px_-34px_rgba(20,17,14,0.6),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/12 dark:bg-white/[0.05] dark:shadow-[0_24px_70px_-34px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)]">
              <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
                <Search className="size-4 text-ink/55" strokeWidth={1.8} />
                <span className="truncate font-sans text-[13px] text-ink/60">
                  Search Java backends, full-stack work, native apps
                </span>
                <span className="ml-auto rounded-md border border-ink/10 px-1.5 py-0.5 text-[10px] font-medium text-ink/45">
                  K
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-ink/10">
                {["Java backends", "Full stack", "Native apps"].map((item, i) => (
                  <motion.a
                    key={item}
                    href={i === 0 ? "#work" : i === 1 ? "#services" : "#contact"}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="group flex items-center justify-between gap-2 px-4 py-3 text-[12px] font-medium text-ink/70 hover:text-ink"
                  >
                    {item}
                    <ArrowUpRight
                      className="size-3.5 opacity-45 transition-transform group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100"
                      strokeWidth={1.8}
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM ROW — "I AM JASHANVEER" + "SOFTWARE ENGINEER".
            Stacks vertically on mobile so the headline doesn't overflow. */}
        <div className="headline-row relative z-30 -mt-[2vw] flex flex-col gap-3 pb-10 lg:flex-row lg:flex-nowrap lg:items-end lg:justify-between lg:gap-x-6 lg:pb-16">
          {/* Skew wrapper leans the headline with scroll velocity; the GSAP
              SplitText entrance above animates the chars inside. */}
          <motion.div style={{ skewX: prefersReducedMotion ? 0 : skewX }}>
            <h1
              ref={h1Ref}
              className="headline-name whitespace-nowrap font-display uppercase leading-[0.86] tracking-[-0.025em] text-ink"
            >
              I AM
              <br />
              JASHANVEER
            </h1>
          </motion.div>
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: introDelay + 0.75, ease: EASE }}
            className="headline-role whitespace-nowrap font-display uppercase leading-[0.95] tracking-tight text-ink lg:text-right lg:mb-[0.4vw]"
          >
            JAVA BACKEND /
            <br />
            FULL-STACK ENGINEER
          </motion.h2>
        </div>

        {/* MOBILE pill + description */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: introDelay + 0.7, ease: EASE }}
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
