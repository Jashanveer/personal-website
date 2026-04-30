"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Send } from "lucide-react";

const RECIPIENT = "mailforjashanveer@gmail.com";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden px-6 pt-24 pb-12 lg:px-10 lg:pt-36"
    >
      <div className="mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8"
        >
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
            Let&apos;s talk
          </span>

          <h2 className="font-serif italic leading-[0.92] text-ink text-[clamp(56px,11vw,200px)]">
            Got something
            <br />
            <span className="font-display not-italic uppercase tracking-[-0.025em] text-[clamp(56px,11vw,200px)]">
              to build?
            </span>
          </h2>

          <MagneticEmail />

          <ContactForm />

          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8">
            <a
              href="https://linkedin.com/in/jashanveer-singh"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 font-sans text-[15px] font-medium text-ink/75 transition-colors hover:text-ink"
            >
              LinkedIn
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
            <a
              href="https://github.com/Jashanveer"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 font-sans text-[15px] font-medium text-ink/75 transition-colors hover:text-ink"
            >
              GitHub
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
            <span className="font-sans text-[15px] text-ink/55">Fairfax, VA · open to remote</span>
          </div>
        </motion.div>

        <div className="mt-24 flex flex-col gap-2 border-t border-ink/15 pt-8 text-[12px] text-ink/55 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Jashanveer Singh. Built with Next.js + Tailwind.</span>
          <span className="font-serif italic">Fairfax, VA</span>
        </div>
      </div>
    </section>
  );
}

function MagneticEmail() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.25);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={`mailto:${RECIPIENT}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="group inline-flex w-fit items-center gap-3 text-ink"
    >
      <span className="font-sans text-[clamp(20px,2.6vw,32px)] font-medium underline decoration-ink/30 decoration-[1.5px] underline-offset-[6px] transition-colors group-hover:decoration-ink">
        {RECIPIENT}
      </span>
      <ArrowUpRight
        className="size-7 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
    </motion.a>
  );
}

/** Quick contact form. On submit, opens the user's mail client with a
 *  pre-filled message via mailto:. No backend needed. To wire this to a real
 *  backend later (Resend, Formspree, an API route), replace the onSubmit
 *  handler with a fetch to that endpoint. */
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio inquiry${name ? ` from ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        name ? `Name: ${name}` : "",
        email ? `Reply-to: ${email}` : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-2 grid w-full max-w-2xl grid-cols-1 gap-3 rounded-3xl border border-white/40 bg-white/35 p-5 shadow-[0_20px_50px_-25px_rgba(20,17,14,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 sm:grid-cols-2 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <Field
        label="Your name"
        type="text"
        value={name}
        onChange={setName}
        autoComplete="name"
      />
      <Field
        label="Your email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        required
      />
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">
          What&apos;s on your mind?
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          placeholder="Tell me about your project, role, or idea…"
          className="resize-none rounded-xl border border-ink/15 bg-white/70 px-3 py-2.5 font-sans text-[14px] text-ink placeholder:text-ink/40 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-ink dark:placeholder:text-ink/40"
        />
      </label>
      <div className="flex items-center justify-between gap-3 pt-1 sm:col-span-2">
        <span className="font-sans text-[12px] text-ink/50">
          Submitting opens your mail app with the message pre-filled.
        </span>
        <button
          type="submit"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-sans text-[13px] font-medium text-cream shadow-[0_10px_25px_-10px_rgba(20,17,14,0.5)] transition-transform hover:scale-[0.97]"
        >
          Send message
          <Send
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  type: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="rounded-xl border border-ink/15 bg-white/70 px-3 py-2.5 font-sans text-[14px] text-ink placeholder:text-ink/40 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/15 dark:border-white/10 dark:bg-white/[0.06] dark:text-ink dark:placeholder:text-ink/40"
      />
    </label>
  );
}
