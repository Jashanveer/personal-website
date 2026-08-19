"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    // matchMedia gives us free prefers-reduced-motion handling: under "reduce"
    // nothing runs, the heading just renders normally.
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (eyebrowRef.current) {
        gsap.from(eyebrowRef.current, {
          autoAlpha: 0,
          y: 14,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 88%", once: true },
        });
      }

      // Split the title into lines and let each rise from behind its own mask.
      // autoSplit re-runs onSplit once fonts are ready and on resize, so the
      // line breaks (and therefore the masks) are always correct.
      const split = SplitText.create(titleEl, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
          }),
      });

      return () => split.revert();
    });

    return () => mm.revert();
  }, [title, eyebrow]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span
          ref={eyebrowRef}
          className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55"
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        ref={titleRef}
        className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-ink text-[clamp(36px,5.5vw,84px)]"
      >
        {title}
      </h2>
    </div>
  );
}
