"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "Experience" },
  { href: "#beyond", label: "Beyond" },
];

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-6 pt-5 lg:px-10 lg:pt-6"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <Link
          href="#top"
          className="font-serif text-2xl italic tracking-tight text-ink lg:text-3xl"
        >
          Jashanveer Singh.
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#contact"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-transform hover:scale-[0.97]"
        >
          Contact
        </Link>
      </div>
    </motion.header>
  );
}
