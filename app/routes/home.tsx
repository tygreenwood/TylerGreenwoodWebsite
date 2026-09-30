import type { Route } from "./+types/home";
import { Container, Section, SubHeading } from "../components/layout";
import { ProjectCard } from "../components/project-card";
import { Timeline } from "../components/timeline";
import { about, home, projects, site, timeline } from "../content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${site.name} — ${site.role}` },
    { name: "description", content: home.intro },
  ];
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Section id="experience" title="Experience">
        <Timeline entries={timeline} />
      </Section>
      {projects.length > 0 && <Projects />}
      <Contact />
    </>
  );
}

function Hero() {
  return (
    // Portrait screens put the sun in the upper part of the canvas, so the
    // copy sits low; landscape puts it to the right, so the copy centres.
    <section
      id="top"
      className="relative flex min-h-svh pb-24 pt-28 portrait:items-end landscape:items-center"
    >
      <Container>
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
            {home.greeting}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            {home.headline}
          </h1>
          {/* Hidden on phones to leave the upper half of the screen to the
              scene; the About section right below covers the same ground. */}
          <p className="mt-6 text-lg leading-relaxed text-muted max-sm:hidden">{home.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={projects.length > 0 ? "#projects" : "#experience"}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border-strong bg-bg/60 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:border-accent hover:text-accent"
            >
              Get in touch
            </a>
          </div>
        </div>
      </Container>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full text-muted transition hover:text-accent"
      >
        <svg
          className="size-5 motion-safe:animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}

function About() {
  return (
    <Section id="about" title="About">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
        <img
          src="/images/portrait.jpg"
          alt={`Portrait of ${site.name}`}
          width={320}
          height={400}
          loading="lazy"
          className="aspect-[4/5] w-36 shrink-0 rounded-2xl border border-border object-cover shadow-sm sm:w-44"
        />
        <div className="space-y-6 text-lg leading-relaxed">
          {about.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <SubHeading>What I work with</SubHeading>
        <dl className="mt-6 space-y-6">
          {about.skills.map((group) => (
            <div key={group.label} className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
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
      </div>

      <div className="mt-16">
        <SubHeading>Outside of work</SubHeading>
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
                <figcaption className="mt-2 text-sm text-muted">{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Projects() {
  const ordered = [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ];

  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-6">
        {ordered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" title="Contact">
      <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
        <p className="text-xl font-medium tracking-tight">Let's talk</p>
        <p className="mt-2 max-w-prose leading-relaxed text-muted">
          I'm open to software engineering roles and interesting problems. The
          quickest way to reach me is email.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
        >
          {site.email}
        </a>
      </div>
    </Section>
  );
}
