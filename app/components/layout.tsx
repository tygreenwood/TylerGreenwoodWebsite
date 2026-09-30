import { useEffect, useState } from "react";
import { projects, site } from "../content";
import { ThemeToggle } from "./theme-toggle";

/**
 * The home page's sections, in scroll order. Projects stays out of the nav
 * (and off the page) until `projects` in content.ts has an entry.
 */
export const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  ...(projects.length > 0 ? [{ id: "projects", label: "Projects" }] : []),
  { id: "contact", label: "Contact" },
];

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
  );
}

/**
 * Tracks whether the page has left the very top (to give the header a
 * backdrop) and which section is under the upper part of the viewport.
 */
function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setScrolled(window.scrollY > 8);

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current: string | null = null;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (atBottom || el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = id;
        }
      }
      setActive(current);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { scrolled, active };
}

export function SiteHeader() {
  const { scrolled, active } = useScrollState();
  const firstName = site.name.split(" ")[0];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 border-b transition-colors duration-300 ${
        scrolled ? "border-border/70 bg-bg/85 backdrop-blur" : "border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-3">
        <a href="/#top" className="shrink-0 font-semibold tracking-tight">
          <span className="sm:hidden">{firstName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </a>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <nav aria-label="Main" className="min-w-0 overflow-x-auto [scrollbar-width:none]">
            <ul className="flex items-center gap-0.5 sm:gap-1">
              {sections.map((section) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id}>
                    <a
                      href={`/#${section.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={`block whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition sm:px-3 ${
                        isActive
                          ? "bg-accent-soft text-text"
                          : "text-muted hover:bg-surface-2 hover:text-text"
                      }`}
                    >
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-bg/80 py-10 backdrop-blur-sm">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {site.name} · {site.location}
          </p>
          <SocialLinks />
        </div>

        {/* Inline links, so they're underlined rather than told apart by
            colour alone. */}
        <p className="mt-6 border-t border-border/70 pt-6 text-xs leading-relaxed text-muted">
          Built with React Router, Tailwind, and a hand-written WebGL shader.
          Hosted on{" "}
          <a
            href={site.host.url}
            className="underline decoration-border-strong underline-offset-4 transition hover:text-accent hover:decoration-accent"
          >
            {site.host.name}
          </a>
          . The code is open —{" "}
          <a
            href={site.source}
            className="underline decoration-border-strong underline-offset-4 transition hover:text-accent hover:decoration-accent"
          >
            view the source on GitHub
          </a>
          .
        </p>
      </Container>
    </footer>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  const links = [
    site.github && { href: site.github, label: "GitHub" },
    site.linkedin && { href: site.linkedin, label: "LinkedIn" },
    site.email && { href: `mailto:${site.email}`, label: "Email" },
    site.resume && { href: site.resume, label: "Résumé" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${className}`}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="text-muted underline-offset-4 transition hover:text-accent hover:underline"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** One band of the home page: an anchor target with a titled heading. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl">
          <h2
            id={`${id}-heading`}
            className="flex items-center gap-5 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {title}
            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-accent/60 to-transparent" />
          </h2>
          <div className="mt-10">{children}</div>
        </div>
      </Container>
    </section>
  );
}

/** Small uppercase label for a sub-part of a section. */
export function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">{children}</h3>
  );
}
