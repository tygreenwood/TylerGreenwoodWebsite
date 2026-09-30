import type { Route } from "./+types/about";
import { Container, PageHeading } from "../components/layout";
import { Timeline } from "../components/timeline";
import { about, site, timeline } from "../content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `About — ${site.name}` },
    {
      name: "description",
      content: `About ${site.name}, a software engineer in ${site.location}.`,
    },
  ];
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </h2>
  );
}

export default function About() {
  return (
    <Container className="py-16 sm:py-20">
      <PageHeading title="About me" lede={`${site.role} · ${site.location}`} />

      <div className="mt-10 space-y-6 text-lg leading-relaxed">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-16">
        <SectionHeading>Where I've been</SectionHeading>
        <Timeline entries={timeline} />
      </section>

      <section className="mt-16">
        <SectionHeading>What I work with</SectionHeading>
        <dl className="mt-6 space-y-6">
          {about.skills.map((group) => (
            <div
              key={group.label}
              className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="text-sm font-medium text-text">{group.label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16">
        <SectionHeading>Outside of work</SectionHeading>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {about.photos.map((photo) => (
            <li key={photo.src} className="sm:first:col-span-2">
              <figure>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="aspect-[3/2] w-full rounded-xl border border-border object-cover"
                />
                <figcaption className="mt-2 text-sm text-muted">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-xl border border-border bg-surface p-8">
        <h2 className="text-xl font-medium tracking-tight">Let's talk</h2>
        <p className="mt-2 max-w-prose leading-relaxed text-muted">
          I'm open to software engineering roles and interesting problems. The
          quickest way to reach me is email.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-5 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
        >
          {site.email}
        </a>
      </section>
    </Container>
  );
}
