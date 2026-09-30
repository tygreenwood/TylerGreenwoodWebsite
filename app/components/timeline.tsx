import { useEffect, useRef } from "react";
import type { TimelineEntry } from "../content";

const kindLabels: Record<TimelineEntry["kind"], string> = {
  work: "Role",
  contract: "Contract",
  education: "Education",
  research: "Research",
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  // Entries render visible by default so the prerendered HTML is readable
  // without JS; the reveal is opted into here, only when it's wanted.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (!record.isIntersecting) continue;
          record.target.classList.add("reveal-in");
          observer.unobserve(record.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    for (const item of list.querySelectorAll<HTMLElement>("[data-reveal]")) {
      // Anything already on screen is left alone — hiding it now would flash
      // content that the visitor is currently looking at.
      if (item.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      item.classList.add("reveal");
      observer.observe(item);
    }

    return () => observer.disconnect();
  }, [entries]);

  return (
    <ol ref={listRef} className="relative mt-8">
      {/* The spine. Decorative — the <ol> already conveys the sequence. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-[17px] top-[17px] w-px -translate-x-1/2 bg-gradient-to-b from-accent/60 via-border to-transparent"
      />

      {entries.map((entry) => {
        const current = entry.end === null;

        return (
          <li key={entry.id} data-reveal className="relative pb-10 pl-14 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 grid size-[34px] place-items-center rounded-full border bg-bg transition ${
                current
                  ? "border-accent text-accent"
                  : "border-border text-muted"
              }`}
            >
              <KindIcon kind={entry.kind} />
              {current && (
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent" />
              )}
            </span>

            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs uppercase tracking-[0.12em] text-muted">
              <span>
                {entry.start} – {entry.end ?? "Present"}
              </span>
              <span aria-hidden="true" className="text-border-strong">
                ·
              </span>
              <span>{kindLabels[entry.kind]}</span>
            </p>

            <h3 className="mt-2 text-lg font-medium leading-snug tracking-tight">
              {entry.role}
            </h3>
            <p className="mt-0.5 text-sm">
              <span className="text-accent">{entry.org}</span>
              <span className="text-muted"> · {entry.location}</span>
            </p>

            {entry.summary && (
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
                {entry.summary}
              </p>
            )}

            {entry.highlights.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="relative max-w-prose pl-5 text-sm leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.6em] h-px w-2.5 bg-accent/60"
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function KindIcon({ kind }: { kind: TimelineEntry["kind"] }) {
  const common = {
    className: "size-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kind === "education") {
    return (
      <svg {...common}>
        <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
        <path d="M6.5 11.3V16c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.7" />
      </svg>
    );
  }

  if (kind === "research") {
    return (
      <svg {...common}>
        <path d="M9.5 3v5.4L4.8 17a2.2 2.2 0 0 0 1.9 3.3h10.6a2.2 2.2 0 0 0 1.9-3.3L14.5 8.4V3" />
        <path d="M8.5 3h7M7.7 14h8.6" />
      </svg>
    );
  }

  if (kind === "contract") {
    return (
      <svg {...common}>
        <path d="M14.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5L14.5 3Z" />
        <path d="M14 3v5h5M8.5 14.5h7M8.5 17.5h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="2.8" y="7.2" width="18.4" height="13" rx="2" />
      <path d="M8.8 7.2V5.4a1.8 1.8 0 0 1 1.8-1.8h2.8a1.8 1.8 0 0 1 1.8 1.8v1.8M2.8 12.6h18.4" />
    </svg>
  );
}
