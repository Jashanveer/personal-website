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
  /** Optional path under /public to a short, silent, looping product clip
   *  (e.g. public/projects/rung.mp4). Takes priority over `screenshot`, which
   *  is reused as the poster frame. This is the drop-in slot for the 5-10s
   *  highlight loops. */
  video?: string;
  /** Optional URL to embed as a live iframe preview inside the card mockup.
   *  Shrinks the live site into the card via CSS scale. Falls back to mockup
   *  if the site blocks iframing. */
  iframe?: string;
  /** App icon used by the compact project launcher. */
  icon: string;
};

export const projects: Project[] = [
  {
    id: "earth-lens",
    name: "Earth Lens",
    tagline: "Earth, on your desktop.",
    description:
      "A privacy-first macOS menu-bar wallpaper app with scheduled rotation, local caching, login-item integration, and multi-display support.",
    highlights: [
      "Scheduled wallpaper rotation with local caching",
      "Login-item integration for a native menu-bar workflow",
      "Multi-display support built with SwiftUI and AppKit",
    ],
    tech: ["Swift", "SwiftUI", "AppKit", "SMAppService", "macOS"],
    href: "https://earth-lens.netlify.app/",
    github: "https://github.com/Jashanveer/earthlens",
    status: "live",
    accent: "#3D5A6C",
    bgFrom: "#dfe8ef",
    bgTo: "#8ea4b8",
    platform: "macos",
    screenshot: "/projects/earth-lens.webp",
    video: "/projects/earth-lens.mp4",
    icon: "/projects/earth-lens-icon.png",
  },
  {
    id: "rung",
    name: "Rung",
    tagline: "Build habits together with a community.",
    description:
      "A habit and mentoring platform with a Java 17 Spring Boot backend for authentication, progress, subscriptions, data portability, and real-time synchronization.",
    highlights: [
      "27 REST controllers secured with JWT authentication",
      "PostgreSQL and Flyway migrations with Redis and SSE sync",
      "Apple Sign-In, App Attest, encrypted PII, and rate limiting",
      "Testcontainers, JaCoCo gates, and Trivy CI scanning",
    ],
    tech: ["Java 17", "Spring Boot", "PostgreSQL", "Redis", "SSE"],
    href: "https://rung.club/",
    github: "https://github.com/Jashanveer/rung-ios",
    status: "soon",
    accent: "#C96442",
    bgFrom: "#f5dcc5",
    bgTo: "#d8b896",
    platform: "cross",
    screenshot: "/projects/rung.jpg",
    video: "/projects/rung-complete.mp4",
    icon: "/projects/rung-icon.png",
  },
  {
    id: "roledesk",
    name: "RoleDesk",
    tagline: "Move the search forward.",
    description:
      "A local macOS job-search pipeline that keeps every consequential decision yours.",
    highlights: [],
    tech: ["macOS", "SwiftUI", "Local AI"],
    href: "https://getroledesk.com/",
    status: "current",
    accent: "#C43D1B",
    bgFrom: "#f6e3da",
    bgTo: "#c43d1b",
    platform: "macos",
    icon: "https://getroledesk.com/assets/roledesk-app-icon.png",
  },
];
