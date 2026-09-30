import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * The page is prerendered, so the initial HTML can't know the visitor's theme.
 * The inline script in root.tsx sets the class before paint; this component
 * reads that class after mount and takes over from there.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing or blocked storage: the toggle still works for this
      // page view, it just won't be remembered.
    }
    setTheme(next);
  }

  const label =
    theme === null
      ? "Toggle theme"
      : theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full border border-border-strong bg-surface text-muted transition hover:border-accent hover:text-text"
    >
      {/* Both icons are always in the DOM; CSS picks the right one so the
          button looks correct even before hydration. */}
      <SunIcon className="size-[18px] dark:hidden" />
      <MoonIcon className="hidden size-[18px] dark:block" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.2 8.2 0 0 1 9.5 4a8.3 8.3 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
