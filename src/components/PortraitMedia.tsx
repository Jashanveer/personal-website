"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/**
 * Hero portrait. Renders the static transparent cutout today. The moment you
 * drop a 3-5s portrait clip and flip HERO_CLIP on, it becomes a scroll-scrubbed
 * video: scroll progress drives video.currentTime, so you "turn into frame" as
 * the page moves.
 *
 * --- ASSET SLOT ------------------------------------------------------------
 * 1. Export the clip web-optimized with frequent keyframes (smooth seeking):
 *      ffmpeg -i raw.mov -an -vf "scale=-2:1280" -c:v libx264 -pix_fmt yuv420p \
 *        -g 6 -keyint_min 6 -movflags +faststart public/hero/me-scrub.mp4
 *    Optional .webm twin:
 *      ffmpeg -i raw.mov -an -c:v libvpx-vp9 -g 6 public/hero/me-scrub.webm
 * 2. Set HERO_CLIP below. Keep /me.webp as the poster so first paint is instant.
 * ---------------------------------------------------------------------------
 */
const HERO_CLIP: { mp4: string; webm?: string; poster: string } | null = null;
// const HERO_CLIP = {
//   mp4: "/hero/me-scrub.mp4",
//   webm: "/hero/me-scrub.webm",
//   poster: "/me.webp",
// };

const MEDIA_CLASS =
  "object-contain object-bottom drop-shadow-[0_30px_60px_rgba(20,17,14,0.18)] dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]";

export default function PortraitMedia({
  progress,
}: {
  progress?: MotionValue<number>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const fallback = useMotionValue(0);

  // Drive the scrub from scroll progress. Harmless when there is no <video>
  // mounted (the ref is null), so it's safe to always subscribe.
  useMotionValueEvent(progress ?? fallback, "change", (v) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = Math.min(Math.max(v, 0), 0.999) * video.duration;
  });

  if (reduce || !HERO_CLIP) {
    return (
      <Image
        src={HERO_CLIP?.poster ?? "/me.webp"}
        alt="Jashanveer Singh"
        fill
        priority
        sizes="(max-width: 1024px) 72vw, 640px"
        quality={92}
        className={MEDIA_CLASS}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 h-full w-full ${MEDIA_CLASS}`}
      muted
      playsInline
      preload="auto"
      poster={HERO_CLIP.poster}
    >
      {HERO_CLIP.webm ? <source src={HERO_CLIP.webm} type="video/webm" /> : null}
      <source src={HERO_CLIP.mp4} type="video/mp4" />
    </video>
  );
}
