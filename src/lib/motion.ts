/** Shared motion vocabulary. One easing family + one intro clock so every
 *  component choreographs against the same beat. */

/** Expo-style ease-out — the curve used across the whole site. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Expo-style in-out — reserved for curtains and wipes (intro overlay). */
export const EASE_IN_OUT = [0.87, 0, 0.13, 1] as const;

/** Seconds the intro overlay owns the screen before underlying content should
 *  begin its own entrance. The curtain lift overlaps this, so content arrives
 *  as the overlay clears, not after a dead beat. Components add this to their
 *  first-paint delays (skip it under prefers-reduced-motion, where the intro
 *  never renders). */
export const INTRO_HANDOFF = 1.4;
