import { NavLink } from "react-router";
import { site } from "../content";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-3xl px-5 sm:px-6 ${className}`}>{children}</div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-bg/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="font-semibold tracking-tight">
          {site.name}
        </NavLink>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `rounded-full px-3 py-1.5 text-sm transition ${
                        isActive
                          ? "bg-accent-soft text-text"
                          : "text-muted hover:bg-surface-2 hover:text-text"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  const links = [
    site.github && { href: site.github, label: "GitHub" },
    site.linkedin && { href: site.linkedin, label: "LinkedIn" },
    site.email && { href: `mailto:${site.email}`, label: "Email" },
    site.resume && { href: site.resume, label: "Résumé" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <footer className="mt-24 border-t border-border/70 py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
      </Container>
    </footer>
  );
}

/** Page title + optional lede, shared by the Projects and About pages. */
export function PageHeading({
  title,
  lede,
}: {
  title: string;
  lede?: string;
}) {
  return (
    <div className="border-b border-border/70 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lede && <p className="mt-3 max-w-prose text-muted">{lede}</p>}
    </div>
  );
}
