export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  href?: string;
  /** GitHub source repo (rendered as a "Source" link on the card). */
  github?: string;
  status: "shipped" | "live" | "soon" | "current";
  accent: string;
  bgFrom: string;
  bgTo: string;
  platform: "macos" | "ios" | "cross" | "web";
  /** Optional path under /public to a real screenshot. When present, replaces
   *  the gradient mockup. Drop files at e.g. public/projects/earth-lens.png
   *  and uncomment the matching line below. */
  screenshot?: string;
  /** Optional URL to embed as a live iframe preview inside the card mockup.
   *  Shrinks the live site into the card via CSS scale. Falls back to mockup
   *  if the site blocks iframing. */
  iframe?: string;
};

export const projects: Project[] = [
  {
    id: "earth-lens",
    name: "Earth Lens",
    tagline: "Earth, on your desktop.",
    description:
      "A native macOS menu-bar app that turns Google Earth's satellite imagery into your desktop wallpaper. Built around macOS 26's Liquid Glass material, with on-demand or auto-rotate cadence and a curated collection of stunning regions.",
    highlights: [
      "Liquid Glass UI built natively in SwiftUI",
      "On-demand or auto-rotate scheduling",
      "Lightweight menu-bar footprint with curated regions",
    ],
    tech: ["Swift", "SwiftUI", "macOS 26", "Liquid Glass"],
    href: "https://earth-lens.netlify.app/",
    github: "https://github.com/Jashanveer/earthlens",
    status: "live",
    accent: "#3D5A6C",
    bgFrom: "#dfe8ef",
    bgTo: "#8ea4b8",
    platform: "macos",
    screenshot: "/projects/earth-lens.webp",
  },
  {
    id: "rung",
    name: "Rung",
    tagline: "Form the habits that form you.",
    description:
      "A cross-platform habit tracker for iPhone, iPad, and Mac. HealthKit-verified completions remove the lying-to-yourself loophole, on-device AI greets you with a daily nudge, and a Spring Boot backend keeps everything in sync across devices.",
    highlights: [
      "HealthKit verifies completions — no fudging streaks",
      "On-device AI greetings via Apple FoundationModels",
      "Native SwiftUI + SwiftData on iOS, iPadOS, macOS",
      "Spring Boot backend for cross-device sync",
    ],
    tech: ["Swift", "SwiftData", "HealthKit", "FoundationModels", "Spring Boot"],
    href: "https://testflight.apple.com/join/vPHh4czG",
    github: "https://github.com/Jashanveer/rung-ios",
    status: "soon",
    accent: "#C96442",
    bgFrom: "#f5dcc5",
    bgTo: "#d8b896",
    platform: "cross",
    // screenshot: "/projects/rung.png", // drop file then uncomment
  },
];
