"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Buttery smooth scroll (Lenis), wired into GSAP's ticker so every
 *  ScrollTrigger reveal stays perfectly in sync with the smoothed scroll
 *  position. This is the inertia behind every awwwards portfolio. */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Reduced motion: skip Lenis entirely and let the browser scroll natively.
    // ScrollTrigger is already registered above so other components' triggers
    // keep working against the native scroll position.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {};
    }

    // Shared with scrollTo() below so anchor flights decelerate on the same
    // curve as wheel inertia.
    const easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

    const lenis = new Lenis({
      duration: 1.2,
      easing,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Keep ScrollTrigger's notion of scroll position in lockstep with Lenis.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's RAF (one loop for the whole page). gsap.ticker
    // time is in seconds; lenis.raf expects milliseconds.
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Anchor flight: native CSS smooth scrolling fights Lenis inertia, so
    // same-page hash links are intercepted and flown via lenis.scrollTo.
    // Delegated on document so it covers links rendered after mount.
    const onAnchorClick = (e: MouseEvent) => {
      const origin = e.target instanceof Element ? e.target : null;
      const anchor = origin?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor || anchor.target === "_blank") return;

      const hash = anchor.getAttribute("href") ?? "";
      // "#top" flies to the very top; anything else must resolve to a real id.
      const target =
        hash === "#top" ? 0 : document.getElementById(hash.slice(1));
      if (target === null) return;

      e.preventDefault();
      lenis.scrollTo(target, {
        duration: 1.4,
        easing,
        offset: hash === "#top" ? 0 : -24,
      });
      // Keep the URL shareable without triggering the browser's native jump.
      history.pushState(null, "", hash);
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return null;
}
