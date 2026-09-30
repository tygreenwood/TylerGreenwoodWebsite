import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Container } from "../components/layout";
import { home, projects, site } from "../content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${site.name} — ${site.role}` },
    { name: "description", content: home.intro },
  ];
}

export default function Home() {
  const featured = projects.filter((project) => project.featured).slice(0, 2);

  return (
    <>
      <Container className="pt-16 pb-4 sm:pt-24">
        <div className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:gap-12">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-accent">
              {home.greeting}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {home.headline}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
              {home.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition hover:bg-accent-hover"
              >
                See my work
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                Get in touch
              </a>
            </div>
          </div>

          <img
            src="/images/portrait.jpg"
            alt={`Portrait of ${site.name}`}
            width={320}
            height={400}
            className="aspect-[4/5] w-36 shrink-0 rounded-2xl border border-border object-cover shadow-sm sm:w-48"
          />
        </div>
      </Container>

      <Container className="py-14">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
          What I work with
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {home.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
      </Container>

      {featured.length > 0 && (
        <Container className="py-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
              Selected work
            </h2>
            <Link
              to="/projects"
              className="text-sm text-accent underline-offset-4 hover:underline"
            >
              All projects →
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured.map((project) => (
              <li
                key={project.slug}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-medium">{project.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {project.tagline}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </>
  );
}
